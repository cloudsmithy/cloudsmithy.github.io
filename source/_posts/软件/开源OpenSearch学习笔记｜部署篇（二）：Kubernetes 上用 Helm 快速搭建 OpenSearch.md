---
title: K8S 部署OpenSearch
abbrlink: 1e02510f
---

OpenSearch 是一个开源的分布式搜索和分析引擎，适用于日志分析、全文检索、应用监控等场景。本文将介绍如何使用 Helm 在 Kubernetes 集群上快速部署 OpenSearch 及 OpenSearch Dashboards，并通过 Secret 管理密码，避免将敏感信息硬编码在配置文件中。本文的 K8S 环境基于 Amazon EKS，部分步骤涉及 EBS CSI Driver 的配置，如果你使用其他 K8S 发行版可以跳过相关内容。

### 添加 Helm 仓库

官方提供了helm包，这使得我们可以很方便的下载OpenSearch的helm chart并且进行更新下载：

```bash
helm repo add opensearch https://opensearch-project.github.io/helm-charts/
helm repo update
```


![](https://fastly.jsdelivr.net/gh/bucketio/img7@main/2026/03/23/1774263162178-743ea55e-8c3a-470c-bc50-cf249e612246.png)


### 创建 Secret 管理密码

安装文档上来说，我们需要在value.yml里添加我们的密码，不过在我看来这不是一个比较优雅的做法，于是我采取了使用secret的方式来管理密码，这样可以把密码和Helm Chart进行解耦。先创建名为opensearch-admin-secret 的secret，然后指定密码：

```bash
kubectl create secret generic opensearch-admin-secret \
  --from-literal=OPENSEARCH_INITIAL_ADMIN_PASSWORD='<your-password>'
```

### 安装 OpenSearch

然后再使用helm install安装opensearch，在这个时候把刚刚创建的secret传进去。

```bash
helm install opensearch opensearch/opensearch \
  --set 'envFrom[0].secretRef.name=opensearch-admin-secret'
```

### EKS 环境配置（非 EKS 用户可跳过）

由于我用的是亚马逊云科技的EKS，实际上还要处理关于CSI driver的问题。包括把gp2设置为默认的storageclass，以及使用 AmazonEBSCSIDriverPolicy这个策略，授权 EBS CSI Driver 操作 EBS 卷所需的 EC2 API 权限。

```bash
kubectl patch storageclass gp2 -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
```

主要包括：

- ec2:CreateVolume / ec2:DeleteVolume — 创建和删除 EBS 卷
- ec2:AttachVolume / ec2:DetachVolume — 挂载和卸载卷到 EC2 实例
- ec2:DescribeVolumes / ec2:DescribeInstances — 查询卷和实例信息
- ec2:CreateSnapshot / ec2:DeleteSnapshot — 快照操作
- ec2:DescribeAvailabilityZones — 查询 AZ 信息

不过需要注意的是，通常来讲，在EKS上需要创建iam-oidc-provider 以及 iamserviceaccount来关联这个策略，以此来获得操作AWS API的权利。不过为了防止文章更加偏向于EKS，我修改了 hop limit，这是让EKS 的pod 可以像普通K8S一样访问host的资源。生产环境推荐使用 IRSA（IAM Roles for Service Accounts）通过 OIDC provider 关联 IAM 策略，这是 EKS 的最佳实践。本文为了简化流程，采用了修改 hop limit 的方式。

```bash
# 获取每个node的 instance ID 然后修改
aws ec2 modify-instance-metadata-options \
  --instance-id <instance-id> \
  --http-put-response-hop-limit 2 \
  --region <region>
```

简单解释下：Pod 在容器网络里，经过 veth pair 到宿主机网络再到 IMDS，比实例本身多了一跳。所以 hop limit 为 1 时，Pod 里的 EBS CSI controller 无法访问 IMDS，拿不到 IAM 凭证，所有 AWS API 调用都失败。改成 2 就是允许多一跳，让 Pod 也能访问 IMDS。当然，如果你用的是其他K8S的发行版那么就可以跳过这个问题。



![](https://fastly.jsdelivr.net/gh/bucketio/img0@main/2026/03/23/1774263093635-519eece7-6810-4f9d-9ae0-9c4256912bf4.png)


### 重建与缩容

修改之后我们删除Helm Chart并且重建：

```bash
helm uninstall opensearch
kubectl delete pvc -l app.kubernetes.io/name=opensearch
helm install opensearch opensearch/opensearch \
  --set 'envFrom[0].secretRef.name=opensearch-admin-secret'
```

如果需要更新，那么可以使用helm upgrade 来修改参数，helm默认启动了3个master节点，而我只有两个node，为了合理的分配一下资源，我决定对pod数量进行缩容。

```bash
helm upgrade opensearch opensearch/opensearch \
  --set replicas=2 \
  --set 'envFrom[0].secretRef.name=opensearch-admin-secret'
```

### 验证与测试

这样我们多节点的OpenSearch Cluster就启动好了，当然服务在pod里，我们如果想本地测试（因为EKS控制平面是托管的，我无法登陆），所以使用kubectl port-forward来进行转发，这样就可以把端口代理到本地。

```bash
kubectl port-forward svc/opensearch-cluster-master 9200:9200 &
curl -sk https://localhost:9200/_cluster/health\?pretty -u 'admin:<your-password>'
```


![](https://fastly.jsdelivr.net/gh/bucketio/img17@main/2026/03/23/1774263112576-fab81fc9-de86-47fc-a65a-0140c8c7e453.png)


### 安装 OpenSearch Dashboards

当然opensearch-dashboards也可以如法炮制进行安装：

```bash
# helm 安装opensearch-dashboards
helm install dashboards opensearch/opensearch-dashboards \
  --set opensearchHosts="https://opensearch-cluster-master:9200"

# 端口转发
kubectl port-forward svc/dashboards-opensearch-dashboards 5601:5601
```

然后通过浏览器打开 http://localhost:5601 登录，能够看到我们刚刚通过helm创建的两个Pod。

![](https://fastly.jsdelivr.net/gh/bucketio/img12@main/2026/03/23/1774263121308-4bd371f7-dc36-46a1-9705-9b158cc16d70.png)


### 总结

到这里，我们已经通过 Helm 在 Kubernetes 上成功部署了 OpenSearch 集群和 Dashboards。整个过程中我们用 Secret 解耦了密码管理，用 Helm upgrade 灵活调整了副本数。如果你想进一步探索，可以尝试配置 Ingress 暴露服务、接入 Fluent Bit 采集日志，或者通过 Index State Management 管理索引生命周期。希望这篇文章对你有帮助。

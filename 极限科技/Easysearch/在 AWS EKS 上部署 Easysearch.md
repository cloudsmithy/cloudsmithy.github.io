---
title: 在 AWS EKS 上部署 Easysearch
date: '2024-08-15 11:36:43'
updated: '2024-08-15 12:48:12'
abbrlink: 628ec63
categories:
- 极限科技
- Easysearch
tags:
- Easysearch
- AWS
- Kubernetes
- 搜索引擎
description: 使用 eksctl 创建 EKS 集群，配置 EBS CSI 驱动与负载均衡控制器，通过 Helm 部署 Easysearch 和 Console 并验证连接。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/141218050
source_title: 使用 AWS EKS 部署 Easysearch
---

[AWS 实战与学习笔记：系列目录](/series/aws/)


随着企业对数据搜索和分析需求的增加，高效的搜索引擎解决方案变得越来越重要。[Easysearch](https://blog.csdn.net/weixin_38781498/article/details/140227001) 作为一款强大的企业级搜索引擎，可以帮助企业快速构建高性能、可扩展的数据检索系统。在云计算的背景下，使用容器化技术来部署和管理这些解决方案已经成为主流选择，而 Amazon Elastic Kubernetes Service (EKS) 则提供了一个强大且易于使用的平台来运行容器化的应用程序。

本文旨在探索如何在 AWS EKS 上部署 Easysearch，并通过实践操作展示从集群配置到服务部署的完整过程。通过本文，读者可以了解如何在云环境中快速搭建高效的搜索服务，最大化利用云资源的弹性和可扩展性。

#### <a id="_5"></a>准备工作

1. 准备一个 AWS Global 账户，本文选择东京区域（ap-northeast-1）进行部署。
2. 部署 EKS 集群版本为 1.30，同时需要在 Linux 环境中安装 AWS CLI、Helm、eksctl 和 kubectl 等命令行工具。本文使用 eksctl 管理 EKS 集群，eksctl 是 AWS 官方推出的高效管理 EKS 集群的命令行工具。
3. 本文将使用 EBS-CSI-Driver 作为存储驱动来部署 Easysearch 服务，并通过 AWS LoadBalancer Controller 将 Easysearch Console 服务以 AWS 负载均衡器的方式对外提供服务，连接集群内部的 Easysearch。

#### <a id="_11"></a>命令行工具的安装

安装 AWS CLI：


```shell
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install -i /usr/local/aws-cli -b /usr/local/bin
aws --version
```


安装 Helm：


```shell
curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 > get_helm.sh
chmod 700 get_helm.sh
./get_helm.sh
```


安装 eksctl：


```shell
# 对于 ARM 系统，设置 ARCH 为：`arm64`、`armv6` 或 `armv7`
ARCH=amd64
PLATFORM=$(uname -s)_$ARCH

curl -sLO "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_$PLATFORM.tar.gz"

# （可选）验证校验和
curl -sL "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_checksums.txt" | grep $PLATFORM | sha256sum --check

tar -xzf eksctl_$PLATFORM.tar.gz -C /tmp && rm eksctl_$PLATFORM.tar.gz

sudo mv /tmp/eksctl /usr/local/bin
```


安装 kubectl：


```shell
curl -O https://s3.us-west-2.amazonaws.com/amazon-eks/1.30.2/2024-07-12/bin/linux/amd64/kubectl
chmod +x ./kubectl
mkdir -p $HOME/bin && cp ./kubectl $HOME/bin/kubectl && export PATH=$HOME/bin:$PATH
```


#### <a id="_EKS__55"></a>配置 EKS 集群环境

我们使用 eksctl 创建一个 1.30 版本的集群，这里通过 YAML 模板定义 EKS 集群的 VPC 网络配置，并根据 eksctl 官方文档调整相关字段。将以下模板保存为 `my-cluster.yaml` 文件：


```yaml
# 创建一个包含 2 个 m5.2xlarge 实例的节点组
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: LAB-1-30
  region: ap-northeast-1

vpc:
  subnets:
    private:
      ap-northeast-1a: { id: subnet-11223344 }
      ap-northeast-1c: { id: subnet-55667788 }
      ap-northeast-1d: { id: subnet-99001122 }

nodeGroups:
  - name: managed-workers-01
    labels: { role: workers }
    instanceType: m5.2xlarge
    minSize: 2
    maxSize: 4
    desiredCapacity: 3
    privateNetworking: true
    volumeSize: 30
```


通过以下命令创建集群：


```shell
eksctl create cluster -f my-cluster.yaml 
```


集群创建完成后，使用以下命令检查集群是否就绪：


```shell
# 更新 kubeconfig 的凭证文件
aws eks update-kubeconfig --name LAB-1-30 --region ap-northeast-1
kubectl get node
[ec2-user@ip-10-0-0-84 ~]$ kubectl get node 
NAME                                              STATUS   ROLES    AGE   VERSION
ip-10-0-100-132.ap-northeast-1.compute.internal   Ready    <none>   16m   v1.30.2-eks-1552ad0
ip-10-0-101-148.ap-northeast-1.compute.internal   Ready    <none>   16m   v1.30.2-eks-1552ad0
```


安装 EBS-CSI-Driver 插件，后续部署时可以指定 StorageClass 来使用亚马逊云的 EBS 块存储服务：


```shell
eksctl utils associate-iam-oidc-provider --region=ap-northeast-1 --cluster=LAB-1-30 --approve
eksctl create iamserviceaccount \
        --name ebs-csi-controller-sa \
        --namespace kube-system \
        --cluster LAB-1-30 \
        --region ap-northeast-1 \
        --role-name AmazonEKS_EBS_CSI_DriverRole \
        --role-only \
        --attach-policy-arn arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy \
        --approve

eksctl create addon --cluster LAB-1-30 --name aws-ebs-csi-driver --version latest --region ap-northeast-1 \
  --service-account-role-arn arn:aws:iam::112233445566:role/AmazonEKS_EBS_CSI_DriverRole --force

[ec2-user@ip-10-0-0-84 ~]$ kubectl get pod -n kube-system | grep -i ebs
ebs-csi-controller-868598b64f-pwmxq   6/6     Running   0          11m
ebs-csi-controller-868598b64f-qn2lz   6/6     Running   0          11m
ebs-csi-node-fplxg                    3/3     Running   0          11m
ebs-csi-node-v6qwj                    3/3     Running   0          11m
```


安装 AWS LoadBalancer Controller 组件：


```shell
eksctl create iamserviceaccount \
  --cluster=LAB-1-30 \
  --region ap-northeast-1 \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --role-name AmazonEKSLoadBalancerControllerRole_130 \
  --attach-policy-arn=arn:aws:iam::112233445566:policy/AWSLoadBalancerControllerIAMPolicy \
  --approve

helm repo add eks https://aws.github.io/eks-charts
helm repo update eks
wget https://raw.githubusercontent.com/aws/eks-charts/master/stable/aws-load-balancer-controller/crds/crds.yaml 
kubectl apply -f crds.yaml

helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=LAB-1-30 \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller  \
  --set region=ap-northeast-1

# 验证安装
kubectl get deployment -n kube-system aws-load-balancer-controller
NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
aws-load-balancer-controller   2/2     2            2           39s
```


至此，我们已经完成了 EKS 集群的配置。

#### <a id="_Easysearch__160"></a>安装 Easysearch 服务

本文中，将通过 AWS LoadBalancer 部署 Console 服务。首先，通过 Helm 将 Console 相关的模板文件拉取到本地，执行以下命令：


```shell
helm pull infinilabs/console
tar -zxvf console-0.2.0.tgz 
cd console
```


目录结构如下：


```shell
[ec2-user@ip-10-0-0-84 console]$ tree
.
├── Chart.yaml
├── templates
│   ├── NOTES.txt
│   ├── _helpers.tpl
│   ├── hpa.yaml
│   ├── ingress.yaml
│   ├── service.yaml
│   ├── serviceaccount.yaml
│   └── statefulset.yaml
└── values.yaml
```


我们需要修改 `service.yaml` 和 `values.yaml` 中的部分配置：


```yaml
# serivce.yaml
# 参考 AWS Load Balancer Controller 的文档，配置负载均衡器面向公网
metadata:
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-scheme: internet-facing
    service.beta.kubernetes.io/aws-load-balancer-nlb-target-type: instance
    service.beta.kubernetes.io/aws-load-balancer-subnets: subnet-11223344, subnet-55667788, subnet-9911223344

# values.yaml
# 使用 GP2 StorageClass，并指定 Service Type 为 LoadBalancer
service:
  type: LoadBalancer
storageClassName: gp2
```


使用 Helm 部署 console 服务：


```shell
kubectl create ns Easysearch
helm upgrade --install console . -f values.yaml -n Easysearch

# 检查是否创建了 Service 并获取负载均衡器的 DNS 地址
kubectl get svc -n Easysearch
NAME         TYPE           CL

USTER-IP       EXTERNAL-IP                                               PORT(S)             AGE
console      LoadBalancer   172.20.237.237   k8s-xxxx.elb.ap-northeast-1.amazonaws.com                 9000:32190/TCP      6h49m
```


接下来是创建 Easysearch 单节点集群服务。创建一个新的 `values.yaml` 文件并定义使用 GP2 类型的 StorageClass，如下：


```shell
cd ~
echo 'storageClassName: gp2' > values.yaml
cat << EOF | kubectl apply -n Easysearch -f -
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: Easysearch-ca-issuer
spec:
  selfSigned: {}
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: Easysearch-ca-certificate
spec:
  commonName: Easysearch-ca-certificate
  duration: 87600h0m0s
  isCA: true
  issuerRef:
    kind: Issuer
    name: Easysearch-ca-issuer
  privateKey:
    algorithm: ECDSA
    size: 256
  renewBefore: 2160h0m0s
  secretName: Easysearch-ca-secret
EOF
helm install Easysearch infinilabs/Easysearch -n Easysearch -f values.yaml
```


至此，我们已在 AWS EKS 平台上完成了 Easysearch 的部署。可以通过 Kubernetes 中的 Service DNS 地址在 Console 中验证连接到内部的 Easysearch 服务。本文中使用的地址为：`Easysearch.Easysearch.svc.cluster.local:9200`。

也可以在 Easysearch 的 Pod 中使用命令进行连接验证：


```shell
kubectl exec -n Easysearch Easysearch-0 -it -- curl -ku 'admin:admin' https://Easysearch.Easysearch.svc.cluster.local:9200
{
  "name" : "Easysearch-0",
  "cluster_name" : "infinilabs",
  "cluster_uuid" : "fq3r_ZaHSFuZDjDtKyJY_w",
  "version" : {
    "distribution" : "Easysearch",
    "number" : "1.6.0",
    "distributor" : "INFINI Labs",
    "build_hash" : "e5d1ff9067b3dd696d52c61fbca1f8daed931fb7",
    "build_date" : "2023-09-22T00:55:32.292580Z",
    "build_snapshot" : false,
    "lucene_version" : "8.11.2",
    "minimum_wire_lucene_version" : "7.7.0",
    "minimum_lucene_index_compatibility_version" : "7.7.0"
  },
  "tagline" : "You Know, For Easy Search!"
}
```


#### <a id="_277"></a>总结

通过本文的实践操作，我们成功地在 AWS EKS 平台上部署了 Easysearch 服务，验证了其在云环境中的高效运行能力。从 EKS 集群的配置、存储和网络资源的准备，到最终的 Easysearch 部署与测试，整个过程展示了如何利用 AWS 提供的工具和服务，快速构建企业级搜索引擎解决方案。

通过这次部署，我们不仅了解了 Easysearch 在 Kubernetes 环境中的部署方法，还深入体验了 AWS EKS 平台的强大功能。未来，随着企业数据量的不断增长，结合云计算的弹性和容器化技术的优势，将会为企业的数据管理和搜索提供更加高效的解决方案。

#### <a id="_283"></a>参考文档

1. [AWS 命令行界面](https://aws.amazon.com/cn/cli/)
2. [Helm](https://helm.sh/)
3. [eksctl](https://eksctl.io/)
4. [Helm Chart 部署 Easysearch](https://infinilabs.cn/docs/latest/easysearch/getting-started/install/helm/)

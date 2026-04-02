---
title: 在 Kubernetes 上用 Fluent Bit 收集 Nginx 日志到 OpenSearch
description: 在 Kubernetes 上用 Fluent Bit 收集 Nginx 日志到 OpenSearch - Kubernetes - OpenSearch
toc: true
categories: OpenSearch
abbrlink: 3c76c368
date: 2026-03-24 00:00:00
---
上一篇我们用 Helm 部署了 OpenSearch 集群和 Dashboards，这篇接着讲怎么用 Fluent Bit 把 Kubernetes 中 Nginx 的日志采集到 OpenSearch，并在 Dashboards 里查看和过滤。

本文假设你已经有一个运行中的 OpenSearch 集群，如果没有可以参考上一篇文章。

### 部署一个 Nginx 用于测试

先部署一个简单的 Nginx 作为日志来源：

```bash
kubectl create deployment nginx --image=nginx
kubectl expose deployment nginx --port=80
```

### 安装 Fluent Bit

添加 Helm 仓库：

```bash
helm repo add fluent https://fluent.github.io/helm-charts
helm repo update
```
<!-- more -->
Fluent Bit 的配置比较长，建议用 values 文件管理。创建 `fluent-bit-values.yaml`：

```yaml
config:
  inputs: |
    [INPUT]
        Name tail
        Path /var/log/containers/*.log
        Exclude_Path /var/log/containers/fluent-bit*.log,/var/log/containers/opensearch*.log,/var/log/containers/dashboards*.log,/var/log/containers/*_kube-system_*.log
        multiline.parser docker, cri
        Tag kube.*
        Mem_Buf_Limit 5MB
        Skip_Long_Lines On

    [INPUT]
        Name systemd
        Tag host.*
        Systemd_Filter _SYSTEMD_UNIT=kubelet.service
        Read_From_Tail On

  filters: |
    [FILTER]
        Name kubernetes
        Match kube.*
        Merge_Log On
        Keep_Log Off
        K8S-Logging.Parser On
        K8S-Logging.Exclude On

  outputs: |
    [OUTPUT]
        Name            opensearch
        Match           *
        Host            opensearch-cluster-master
        Port            9200
        HTTP_User       admin
        HTTP_Passwd     <your-password>
        Index           nginx-logs
        Logstash_Format On
        Logstash_Prefix nginx-logs
        tls             On
        tls.verify      Off
        Suppress_Type_Name On
```

安装：

```bash
helm install fluent-bit fluent/fluent-bit -f fluent-bit-values.yaml
```

### 配置详解

这里解释几个关键配置项：

#### Exclude_Path — 排除不需要的日志

```
Exclude_Path /var/log/containers/fluent-bit*.log,/var/log/containers/opensearch*.log,/var/log/containers/dashboards*.log,/var/log/containers/*_kube-system_*.log
```

这是我们踩过的一个坑。Fluent Bit 作为 DaemonSet 运行在每个节点上，默认会采集 `/var/log/containers/` 下所有容器的日志。如果节点上跑了 OpenSearch、Dashboards 这些日志量很大的服务，Fluent Bit 的内存缓冲区（`Mem_Buf_Limit 5MB`）会很快被填满，导致其他日志（比如 Nginx）发送失败，表现为不断报 `failed to flush chunk` 错误。

另外特别要注意排除 Fluent Bit 自己的日志。如果开了 debug 模式，Fluent Bit 会疯狂输出日志，而这些日志又会被自己的 tail input 读取，形成死循环，直接把缓冲区撑爆。

#### Logstash_Format — 按日期轮换索引

```
Logstash_Format On
Logstash_Prefix nginx-logs
```

开启后索引名会变成 `nginx-logs-2026.03.23` 这样按天轮换，方便后续做索引生命周期管理。在 Dashboards 里创建 index pattern 时用 `nginx-logs-*` 即可匹配所有日期的索引。

#### kubernetes filter — 添加 Pod 元数据

```
[FILTER]
    Name kubernetes
    Match kube.*
    Merge_Log On
```

这个 filter 会自动给每条日志加上 `kubernetes.pod_name`、`kubernetes.namespace_name`、`kubernetes.container_name` 等字段，这样在 Dashboards 里就可以按 Pod 名称过滤日志了。

### 产生测试日志

Nginx 在没有请求的时候不会输出 access log，需要手动访问一下：

```bash
kubectl port-forward svc/nginx 8080:80 &
for i in $(seq 1 100); do curl -s http://localhost:8080 > /dev/null; done
```


### 查看日志索引

我们能够看到已经馋看了nginx-log这个索引，并且按照时间轮换。

![](https://fastly.jsdelivr.net/gh/bucketio/img11@main/2026/03/25/1774436171914-37ffc32f-482d-4750-b5a4-3033fbb020bc.png)


### 在 Dashboards 中查看

1. 打开 OpenSearch Dashboards（`kubectl port-forward svc/dashboards-opensearch-dashboards 5601:5601`）

![](https://fastly.jsdelivr.net/gh/bucketio/img14@main/2026/03/25/1774436232934-0f243cf1-4364-4bc6-92ea-3df298390142.png)


3. 进入 Stack Management → Index Patterns，创建 `nginx-logs-*` 的 index pattern。


![](https://fastly.jsdelivr.net/gh/bucketio/img7@main/2026/03/25/1774436247235-960af1a7-aac0-402c-980a-7d8cab813816.png)


时间字段选 `@timestamp`

![](https://fastly.jsdelivr.net/gh/bucketio/img17@main/2026/03/25/1774436214805-08d2901b-efa5-4f2d-bc19-f630bdc8df38.png)

3. 进入 Discover，选择刚创建的 index pattern


![](https://fastly.jsdelivr.net/gh/bucketio/img3@main/2026/03/25/1774436370240-1529b228-6430-4c70-b981-af821a74b078.png)

4. 在左侧 Available fields 找到 `kubernetes.pod_name`或者其他字段（我这里用的imaeg的名字），点击过滤即可按 Pod 查看日志

![](https://fastly.jsdelivr.net/gh/bucketio/img18@main/2026/03/25/1774436409525-cf3a6870-23fa-43a3-97ce-3cc45d395a91.png)






如果在 Available fields 里看不到 kubernetes 相关字段，去 Index Patterns 里点刷新按钮（🔄）刷新字段列表。

### 常见问题

#### Fluent Bit 一直报 failed to flush chunk

大概率是缓冲区被其他 Pod 的日志挤满了。用 `Exclude_Path` 排除不需要的日志，或者加大 `Mem_Buf_Limit`。

#### Dashboards 里看不到 Nginx 日志但能看到其他 Pod

检查 Nginx Pod 所在节点的 Fluent Bit 是否正常。可能是那个节点的 Fluent Bit 启动时 OpenSearch 还没 ready，导致一直 flush 失败。删掉那个 Fluent Bit Pod 让 DaemonSet 重建即可。

#### 手动 curl OpenSearch 能写入但 Fluent Bit 写不进去

确认 Fluent Bit output 配置里的 `Host`、`Port`、`HTTP_User`、`HTTP_Passwd`、`tls` 是否正确。可以用以下命令从集群内部测试连通性：

```bash
kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -- curl -sk https://opensearch-cluster-master:9200 -u 'admin:<your-password>'
```

### 总结

Fluent Bit + OpenSearch 是 Kubernetes 上轻量级日志方案的经典组合。核心要点是合理配置 `Exclude_Path` 控制采集范围，避免无关日志挤占缓冲区。配合 `Logstash_Format` 做索引轮换，再加上 kubernetes filter 提供的 Pod 元数据，就能在 Dashboards 里方便地按 Pod、Namespace 等维度过滤和分析日志了。

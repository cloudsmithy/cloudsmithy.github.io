---
title: 在 Kubernetes 上用 Fluent Bit 收集 Nginx 日志到 Easysearch
description: 基于 k3s + Easysearch 2.0.3 实测，从零搭建 Fluent Bit 日志收集方案，将 Nginx 日志转发到 Easysearch。
tags:
  - 搜索引擎（ES）
  - 极限科技
toc: true
categories:
  - 极限科技
  - Easysearch
date: 2026-03-11 00:00:00
---

> 本文基于 k3s + Easysearch 2.0.3 实测验证，从零开始搭建一套完整的日志收集方案。

### 什么是 Fluent Bit

[Fluent Bit](https://fluentbit.io/) 是一个轻量级的日志收集和转发工具，用 C 语言写的，内存占用极低（通常只需要几十 MB）。它的工作很简单：从某个地方读日志（INPUT），可选地处理一下（FILTER），然后发到某个地方（OUTPUT）。

```
INPUT → FILTER → OUTPUT
读日志    处理     发送
```

常见用法：
- 从文件读日志（`tail` 插件，类似 `tail -f`）
- 从容器 stdout 读日志
- 发送到 Elasticsearch / Easysearch / Kafka / S3 等

和 Fluentd 的区别：Fluent Bit 更轻量（C 语言 vs Ruby），适合作为 Agent 部署在每个节点或 Pod 里。Fluentd 功能更丰富，适合做日志聚合层。在 Kubernetes 场景下，Fluent Bit 是更常见的选择。

### 什么是 Easysearch

[INFINI Easysearch](https://infinilabs.com/products/easysearch/) 是兼容 Elasticsearch API 的搜索引擎。Fluent Bit 的 `es`（Elasticsearch）输出插件可以直接对接，不需要改配置。简单理解：Easysearch 是 Elasticsearch 的国产替代品。

### 为什么用 Sidecar 模式

本文用 Sidecar 模式部署 Fluent Bit：把它和 Nginx 放在同一个 Pod 里，共享日志目录。

另一种常见方式是 DaemonSet 模式：在每个节点上跑一个 Fluent Bit，收集该节点上所有 Pod 的 stdout 日志。DaemonSet 适合收集所有 Pod 的日志，Sidecar 适合收集特定应用的日志文件。
<!-- more -->

```
Nginx Pod
├── nginx 容器        → 产生访问日志 → /var/log/nginx/access.log
└── fluent-bit 容器   → tail 日志文件 → 写入 Easysearch
                                              ↓
                                    curl 查询 nginx-logs-* 索引
```

### 环境准备

- k3s 单节点（Ubuntu 24.04，30G 内存）
- Helm 3
- cert-manager（Easysearch 依赖）

#### 安装 k3s

```bash
curl -sfL https://get.k3s.io | sh -

# 配置 kubectl
mkdir -p ~/.kube
sudo chmod 644 /etc/rancher/k3s/k3s.yaml
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $(id -u):$(id -g) ~/.kube/config
kubectl get nodes
```

#### 安装 Helm

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

#### 设置内核参数

Easysearch（基于 Lucene）需要较高的 mmap 限制：

```bash
sudo sysctl -w vm.max_map_count=262144
echo "vm.max_map_count=262144" | sudo tee -a /etc/sysctl.conf
```



### 第一步：部署 Easysearch

#### 1.1 准备工具

更新helm仓库并且初始化cert-manager。

```bash
helm repo add infinilabs https://helm.infinilabs.com
helm repo update
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.3/cert-manager.yaml


# 等所有 Pod Ready（约 30-60 秒）
kubectl get pods -n cert-manager -w
```

### 1.2 创建命名空间和证书

```bash
kubectl create namespace es

# 创建自签名 CA
cat << EOF | kubectl -n es apply -f -
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: easysearch-ca-issuer
spec:
  selfSigned: {}

apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: easysearch-ca-certificate
spec:
  commonName: easysearch-ca-certificate
  duration: 87600h0m0s
  isCA: true
  issuerRef:
    kind: Issuer
    name: easysearch-ca-issuer
  privateKey:
    algorithm: ECDSA
    size: 256
  renewBefore: 2160h0m0s
  secretName: easysearch-ca-secret
EOF
```

### 1.3 创建密码 Secret

> ⚠️ 密码必须包含至少 2 类字符（大写/小写/数字/特殊字符），否则初始化会失败，Pod 直接 Exit Code 1 崩溃。

```bash
kubectl create secret generic easysearch-secrets \
  -n es --from-literal=ezs_password='Admin123'
```

### 1.4 Helm 安装 Easysearch

使用厂家提供了helm Chart安装Easysearch，并且通过变量设置image的版本，截止目前，最新版本是2.0.3-2534。

```bash
helm repo add infinilabs https://helm.infinilabs.com --force-update
helm repo update


helm install easysearch infinilabs/easysearch -n es \
  --set image.tag=2.0.3-2534
```

然后就是等 Pod Running：

```bash
kubectl get pods -n es -w
# NAME           READY   STATUS    RESTARTS   AGE
# easysearch-0   1/1     Running   0          60s
```

### 1.5 验证 Easysearch

```bash
kubectl port-forward -n es pod/easysearch-0 9200:9200 &
sleep 3
curl -s http://localhost:9200 -u admin:Admin123
```

返回 JSON 集群信息即成功：

```json
{
  "name" : "easysearch-0",
  "cluster_name" : "infinilabs",
  "cluster_uuid" : "_eqbd5PbQ5WNpNVJFccNDA",
  "version" : {
    "distribution" : "easysearch",
    "number" : "2.0.3",
    "distributor" : "INFINI Labs",
    "build_hash" : "e6180819aedb3d4759cdbcd2c1b856a9635d4aff",
    "build_date" : "2026-01-16T09:44:14.477332385Z",
    "build_snapshot" : false,
    "lucene_version" : "9.12.2",
    "minimum_wire_lucene_version" : "8.7.0",
    "minimum_lucene_index_compatibility_version" : "8.7.0"
  },
  "tagline" : "You Know, For Easy Search!"
}
```

如果你的机器内存比较小（< 4G）或者使用其他 storageClassName 需要修改配置：

```bash
helm install easysearch infinilabs/easysearch -n es \
  --set storageClassName=gp2 \
  --set resources.requests.memory=512Mi \
  --set resources.limits.memory=1536Mi \
  --set "javaOpts=-Xms256m -Xmx256m"
```


### 第二步：部署 Nginx + Fluent Bit Sidecar

这个 YAML 包含三个 Kubernetes 资源（用 `---` 分隔）：

1. ConfigMap：存放 Fluent Bit 的配置文件 `fluent-bit.conf`
2. Deployment：定义一个 Pod，里面跑两个容器（nginx + fluent-bit sidecar）
3. Service：让集群内其他 Pod 可以通过 `http://nginx:80` 访问 Nginx

#### 创建 nginx-fluentbit.yaml

```bash
cat << 'EOF' > nginx-fluentbit.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluent-bit-config
  namespace: default
data:
  fluent-bit.conf: |
    [SERVICE]
        Flush         3
        Log_Level     info
        Daemon        off
    [INPUT]
        Name              tail
        Tag               nginx.access
        Path              /var/log/nginx/access.log
        DB                /var/log/flb_nginx.db
        Mem_Buf_Limit     5MB
        Refresh_Interval  5
    [OUTPUT]
        Name            es
        Match           *
        Host            easysearch.es.svc.cluster.local
        Port            9200
        HTTP_User       admin
        HTTP_Passwd     Admin123
        tls             Off
        Logstash_Format On
        Logstash_Prefix nginx-logs
        Retry_Limit     False
        Suppress_Type_Name On
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:alpine
        ports:
        - containerPort: 80
        volumeMounts:
        - name: nginx-logs
          mountPath: /var/log/nginx
      - name: fluent-bit
        image: fluent/fluent-bit:2.2
        volumeMounts:
        - name: nginx-logs
          mountPath: /var/log/nginx
          readOnly: true
        - name: config
          mountPath: /fluent-bit/etc/
      volumes:
      - name: nginx-logs
        emptyDir: {}
      - name: config
        configMap:
          name: fluent-bit-config
---
apiVersion: v1
kind: Service
metadata:
  name: nginx
  namespace: default
spec:
  selector:
    app: nginx
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
EOF
```

#### 部署和删除

```bash
# 部署
kubectl apply -f nginx-fluentbit.yaml

# 删除
kubectl delete -f nginx-fluentbit.yaml
```

确认 Pod 里两个容器都 Running（READY 2/2）：

```bash
kubectl get pods
# NAME                     READY   STATUS    RESTARTS   AGE
# nginx-699c4dd7ff-ntzfg   2/2     Running   0          30s
```

### YAML 逐字段解释

ConfigMap 部分（Fluent Bit 配置）：

| 字段 | 值 | 说明 |
|------|-----|------|
| `[SERVICE] Flush` | `3` | 每 3 秒把缓冲区的日志刷到 OUTPUT |
| `Log_Level` | `info` | Fluent Bit 自身的日志级别 |
| `Daemon` | `off` | 前台运行，容器里必须前台否则容器会退出 |
| `[INPUT] Name` | `tail` | 类似 `tail -f`，实时跟踪文件新增内容 |
| `Tag` | `nginx.access` | 给输入打标签，OUTPUT 用 Match 匹配 |
| `Path` | `/var/log/nginx/access.log` | 要读的日志文件路径 |
| `DB` | `/var/log/flb_nginx.db` | SQLite 文件，记录读到哪一行了，重启不重复读 |
| `Mem_Buf_Limit` | `5MB` | 内存缓冲区上限，防止日志太多撑爆内存 |
| `Refresh_Interval` | `5` | 每 5 秒检查文件是否有新内容 |
| `[OUTPUT] Name` | `es` | Elasticsearch 兼容输出插件，Easysearch 直接可用 |
| `Match` | `*` | 匹配所有 Tag 的日志 |
| `Host` | `easysearch.es.svc.cluster.local` | Easysearch 的 Service DNS（集群内访问） |
| `HTTP_User/Passwd` | `admin/Admin123` | Easysearch 认证信息 |
| `tls` | `Off` | 不用 HTTPS（本版本默认 HTTP） |
| `Logstash_Format` | `On` | 按日期创建索引，格式：`nginx-logs-2026.03.11` |
| `Logstash_Prefix` | `nginx-logs` | 索引名前缀 |
| `Retry_Limit` | `False` | 发送失败无限重试 |
| `Suppress_Type_Name` | `On` | 兼容 ES 7.x+，不发送 `_type` |

> ⚠️ Fluent Bit 的 ini 格式不支持行内注释！`Flush 3 # 注释` 会把 `3 # 注释` 整个当成值，导致解析失败。

Deployment 部分（两个容器 + 共享卷）：

| 字段 | 说明 |
|------|------|
| `containers[0]: nginx` | Nginx 容器，处理 HTTP 请求，日志写到 `/var/log/nginx/access.log` |
| `containers[1]: fluent-bit` | Sidecar 容器，读取 nginx 的日志文件发送到 Easysearch |
| `volumeMounts: nginx-logs` | 两个容器都挂载这个卷，共享 `/var/log/nginx` 目录 |
| `readOnly: true` | Fluent Bit 只读挂载，最小权限原则 |
| `volumeMounts: config` | 把 ConfigMap 挂载为 Fluent Bit 的配置文件目录 |
| `volumes: nginx-logs (emptyDir)` | 临时卷，Pod 内容器共享，Pod 删除后数据丢失 |
| `volumes: config (configMap)` | 引用上面的 ConfigMap |

```
                    同一个 Pod
┌─────────────────────────────────────────────────┐
│                                                 │
│  nginx 容器                fluent-bit 容器       │
│  ┌──────────┐              ┌──────────────┐     │
│  │ 处理请求  │    写入       │ tail 插件     │     │
│  │          │ ────────→    │ 读取日志文件  │     │
│  │ access   │  emptyDir    │              │     │
│  │ .log     │  共享卷       │ es 插件      │     │
│  └──────────┘              │ 发送到       │     │
│                            │ Easysearch   │     │
│                            └──────┬───────┘     │
│                                   │             │
└───────────────────────────────────┼─────────────┘
                                    │
                                    ↓
                          ┌──────────────────┐
                          │  Easysearch      │
                          │  nginx-logs-*    │
                          │  索引            │
                          └──────────────────┘
```

#### 关键概念

为什么用 `emptyDir`？

`emptyDir` 是一个临时卷，在 Pod 创建时自动创建，Pod 删除时自动清理。它的作用是让同一个 Pod 里的多个容器共享文件。nginx 写日志到这个目录，fluent-bit 从这个目录读日志。

为什么 fluent-bit 挂载时加 `readOnly: true`？

Fluent Bit 只需要读日志文件，不需要写。加 readOnly 是最小权限原则，防止 Fluent Bit 意外修改日志文件。

`Logstash_Format On` 是什么意思？

开启后 Fluent Bit 会按日期自动创建索引，格式为 `{Logstash_Prefix}-{日期}`，比如 `nginx-logs-2026.03.11`。这样每天的日志在不同索引里，方便按时间范围查询和清理旧数据。

`DB /var/log/flb_nginx.db` 是什么？

Fluent Bit 用这个 SQLite 数据库文件记录"读到文件的哪一行了"。如果 Fluent Bit 重启，它会从上次的位置继续读，不会重复发送已经处理过的日志。



### 第三步：产生日志并查询

#### 3.1 产生访问日志

```bash
kubectl run curl-test --rm -it --restart=Never --image=curlimages/curl -- \
  sh -c 'for i in $(seq 1 20); do curl -s http://nginx > /dev/null; sleep 0.5; done'
```

#### 3.2 查询 Easysearch

```bash
kubectl port-forward -n es pod/easysearch-0 9200:9200 &
sleep 2

curl -s 'http://localhost:9200/nginx-logs-*/_search?size=3' \
  -u admin:Admin123 | python3 -m json.tool
```

返回结果：

```json
{
    "hits": {
        "total": { "value": 31 },
        "hits": [
            {
                "_index": "nginx-logs-2026.03.11",
                "_source": {
                    "@timestamp": "2026-03-11T07:16:55.881Z",
                    "log": "10.42.0.22 - - [11/Mar/2026:07:16:55 +0000] \"GET / HTTP/1.1\" 200 896 \"-\" \"curl/8.18.0\" \"-\""
                }
            }
        ]
    }
}
```


![](https://fastly.jsdelivr.net/gh/bucketio/img15@main/2026/03/11/1773217650148-29b92831-1984-4a8c-b242-7d301c9dcef3.png)


#### 3.3 从本地电脑访问（SSH 隧道）

Easysearch 自带了一个UI，但是跑在远程POD里，部署的Service也是Headless，所以没办法直接访问，我们的办法是先用kubectl port-forward把pod端口映射到服务器宿主机，然后再用 SSH 隧道把 9200 端口映射到本地：

```bash
# 远程服务器上先跑 port-forward
kubectl port-forward -n es pod/easysearch-0 9200:9200 &

# 本地电脑 SSH 隧道
ssh -L 9200:localhost:9200 ubuntu@<server-ip> -i key.pem

# 然后本地直接访问
curl -s http://localhost:9200/nginx-logs-*/_search?size=3 -u admin:Admin123
```

这样转发之后，我们也可以使用本机浏览器直接访问Easysearch自带的UI了。
![](https://fastly.jsdelivr.net/gh/bucketio/img9@main/2026/03/11/1773217638361-947d31bd-246d-4918-9b55-ad25967062c3.png)


### 踩坑记录

#### 1. 密码复杂度（最常见的坑）

Easysearch 最新版本要求密码至少包含 2 类字符，不满足时 Pod 直接崩溃（Exit Code 1），日志来不及写，非常难排查。

```bash
# ❌ 纯小写
ezs_password='easysearchpaswd'

# ✅ 大写 + 小写 + 数字
ezs_password='Admin123'
```

#### 2. vm.max_map_count

不设置的话 Easysearch 启动失败：

```bash
sudo sysctl -w vm.max_map_count=262144
```

#### 3. 小内存环境 OOMKilled

默认 JVM 堆 1G + 堆外内存，总共需要 2G+。小集群用：

```bash
--set "javaOpts=-Xms256m -Xmx256m"
--set resources.requests.memory=512Mi
--set resources.limits.memory=1536Mi
```

#### 4. StorageClass 不匹配（AWS 环境）

我的自建集群没有默认 StorageClass 是 `gp2`，需要指定：

```bash
--set storageClassName=gp2
```

如果环境自带 `local-path-provisioner`，不需要指定。

#### 5. Fluent Bit 配置不支持行内注释

Fluent Bit 的 ini 格式不支持行内注释，`#` 后面的内容会被当成值的一部分：

```ini
# ❌ 错误：行内注释会被当成值
Logstash_Format On   # 按日期创建索引

# ✅ 正确：注释单独一行
# 按日期创建索引
Logstash_Format On
```


### 排查命令

```bash
# Pod 状态
kubectl get pods -n es -w
kubectl describe pod easysearch-0 -n es

# 容器日志
kubectl logs easysearch-0 -n es
kubectl logs easysearch-0 -n es --previous
kubectl logs easysearch-0 -n es -c init-config

# Fluent Bit sidecar 日志
kubectl logs <nginx-pod-name> -c fluent-bit

# 退出原因
kubectl describe pod easysearch-0 -n es | grep -A5 "Last State"
# Exit Code 1   = 应用错误（密码/配置）
# Exit Code 137 = OOMKilled（内存不足）

# 资源使用
kubectl top nodes
kubectl top pods -n es
free -h

# 确认 TLS 模式
kubectl logs easysearch-0 -n es | grep "TLS HTTP Provider"
# null = HTTP，JDK = HTTPS

# 确认密码
kubectl get secret easysearch-secrets -n es \
  -o jsonpath='{.data.ezs_password}' | base64 -d

# 确认镜像版本
kubectl get pod easysearch-0 -n es -o jsonpath='{.spec.containers[0].image}'
```

### 清理

```bash
# 删除 Nginx + Fluent Bit
kubectl delete -f nginx-fluentbit.yaml

# 删除 Easysearch
helm uninstall easysearch -n es
kubectl delete pvc --all -n es
kubectl delete secret easysearch-secrets -n es
kubectl delete namespace es
```

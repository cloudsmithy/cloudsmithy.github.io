
---
title: k8s yml小抄.md
tags: K8S
categories: 软件
date: 2026-03-02 00:00:00
---


> 源码来自 [cloudacademy/intro-to-k8s](https://github.com/cloudacademy/intro-to-k8s/tree/master/src)，用作学习笔记



![](https://fastly.jsdelivr.net/gh/bucketio/img15@main/2026/03/09/1773059681103-5f9751bb-be0f-4e82-bcf1-1395556b634e.png)


### 1. Pod 基础

###### 1.1 最简 Pod（1.1-basic_pod.yaml）

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mycontainer
    image: nginx:latest
```

这是最小化的 Pod 定义。只需要四个顶级字段：
- `apiVersion: v1` — 核心 API 版本
- `kind: Pod` — 资源类型
- `metadata.name` — Pod 名称，命名空间内唯一
- `spec.containers` — 至少一个容器，必须指定 `name` 和 `image`

注意：使用 `nginx:latest` 时，Kubernetes 默认 `imagePullPolicy: Always`，每次启动都会拉取镜像。

---

###### 1.2 声明端口（1.2-port_pod.yaml）

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mycontainer
    image: nginx:latest
    ports:
      - containerPort: 80
```

相比 1.1 新增了 `ports.containerPort: 80`。如果不声明端口，`kubectl describe` 中端口显示为 none，外部无法知道容器监听哪个端口。声明端口是让 Kubernetes 知道容器对外提供服务的方式。

注意：即使声明了端口，从集群外部仍然无法直接访问 Pod IP（Pod IP 在容器网络内），需要通过 Service 暴露。

---

###### 1.3 添加标签（1.3-labeled_pod.yaml）

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
  labels:
    app: webserver
spec:
  containers:
  - name: mycontainer
    image: nginx:latest
    ports:
      - containerPort: 80
```

新增 `labels.app: webserver`。标签是键值对，用途：
- 标识资源属性（应用类型、层级、区域等）
- 被 Service 的 `selector` 用来匹配目标 Pod
- 被 `kubectl get` 的 `-l` 选项用来过滤资源

标签是 Kubernetes 中资源关联的核心机制。

---

###### 1.4 资源请求与限制（1.4-resources_pod.yaml）

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
  labels:
    app: webserver
spec:
  containers:
  - name: mycontainer
    image: nginx:latest
    resources:
      requests:
        memory: "128Mi"  # 128 MiB
        cpu: "500m"      # 0.5 CPU
      limits:
        memory: "128Mi"
        cpu: "500m"
    ports:
      - containerPort: 80
```

新增 `resources` 字段：
- `requests`：调度器据此选择节点，节点必须有足够的可分配资源
- `limits`：容器运行时的资源上限，超过内存限制会被 OOMKilled

这里 requests = limits，QoS 等级为 Guaranteed（最不容易被驱逐）。不设置任何资源则为 BestEffort（最先被驱逐）。生产环境应始终设置资源请求。

---

### 2. Service

###### 2.1 NodePort Service（2.1-web_service.yaml）

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: webserver
  name: webserver
spec:
  ports:
  - port: 80
  selector:
    app: webserver
  type: NodePort
```

- `selector.app: webserver` — 匹配带有 `app=webserver` 标签的 Pod
- `ports.port: 80` — Service 端口，对应 Pod 的 containerPort
- `type: NodePort` — 在每个节点上分配一个端口（30000–32767），集群外部可通过 `节点IP:NodePort` 访问

Service 解决的核心问题：Pod IP 不固定，Service 提供稳定入口并自动负载均衡。

---

### 3. 多容器 Pod 与命名空间

###### 3.1 命名空间（3.1-namespace.yaml）

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: microservice
  labels:
    app: counter
```

命名空间用于隔离资源。不需要 spec，只需 name。使用 `-n microservice` 指定命名空间。

---

###### 3.2 多容器 Pod（3.2-multi_container.yaml）

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app
spec:
  containers:
    - name: redis
      image: redis:latest
      imagePullPolicy: IfNotPresent  # 防止每次拉取 latest
      ports:
        - containerPort: 6379

    - name: server
      image: lrakai/microservices:server-v1
      ports:
        - containerPort: 8080
      env:
        - name: REDIS_URL
          value: redis://localhost:6379  # 同 Pod 内用 localhost

    - name: counter
      image: lrakai/microservices:counter-v1
      env:
        - name: API_URL
          value: http://localhost:8080

    - name: poller
      image: lrakai/microservices:poller-v1
      env:
        - name: API_URL
          value: http://localhost:8080
```

4 个容器在同一个 Pod 中，共享网络栈：
- Redis（数据层）监听 6379
- Server（应用层）监听 8080，通过 `localhost:6379` 连接 Redis
- Counter 和 Poller（支持层）通过 `localhost:8080` 连接 Server

`imagePullPolicy: IfNotPresent` 用于 `latest` 标签时防止每次都拉取。使用具体标签时默认就是 IfNotPresent。

局限性：Kubernetes 以 Pod 为最小扩缩单位，无法单独扩缩某个容器。如果需要独立扩缩，应拆分为多个 Pod + Service。

---


![](https://fastly.jsdelivr.net/gh/bucketio/img15@main/2026/03/09/1773059617005-24dc90a1-8781-4e18-86d9-00fbda097882.png)

### 4. 服务发现（Service Discovery）

###### 4.1 命名空间（4.1-namespace.yaml）

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: service-discovery
  labels:
    app: counter
```

为服务发现课程创建独立的命名空间 `service-discovery`，隔离本课资源。后续所有命令需要加 `-n service-discovery`。

---

###### 4.2 数据层 — Pod + ClusterIP Service（4.2-data_tier.yaml）

```yaml
# Service
apiVersion: v1
kind: Service
metadata:
  name: data-tier
  labels:
    app: microservices
spec:
  ports:
  - port: 6379
    protocol: TCP
    name: redis
  selector:
    tier: data
  type: ClusterIP    # 默认类型，仅集群内可访问
---
# Pod
apiVersion: v1
kind: Pod
metadata:
  name: data-tier
  labels:
    app: microservices
    tier: data        # 被 Service selector 匹配
spec:
  containers:
    - name: redis
      image: redis:latest
      imagePullPolicy: IfNotPresent
      ports:
        - containerPort: 6379
```

将 Redis 拆分为独立 Pod + ClusterIP Service。`type: ClusterIP` 是默认值，仅集群内部可访问。`name: redis` 为端口命名，后续可通过环境变量引用。

---

###### 4.3 应用层 — 环境变量服务发现（4.3-app_tier.yaml）

```yaml
apiVersion: v1
kind: Service
metadata:
  name: app-tier
  labels:
    app: microservices
spec:
  ports:
  - port: 8080
  selector:
    tier: app
---
apiVersion: v1
kind: Pod
metadata:
  name: app-tier
  labels:
    app: microservices
    tier: app
spec:
  containers:
    - name: server
      image: lrakai/microservices:server-v1
      ports:
        - containerPort: 8080
      env:
        - name: REDIS_URL
          # Environment variable service discovery
          # Naming pattern:
          #   IP address: <all_caps_service_name>_SERVICE_HOST
          #   Port: <all_caps_service_name>_SERVICE_PORT
          #   Named Port: <all_caps_service_name>_SERVICE_PORT_<all_caps_port_name>
          value: redis://$(DATA_TIER_SERVICE_HOST):$(DATA_TIER_SERVICE_PORT_REDIS)
          # In multi-container example value was
          # value: redis://localhost:6379
```

Kubernetes 自动为同命名空间的每个 Service 注入环境变量：
- `<SERVICE_NAME>_SERVICE_HOST` → Service 的 ClusterIP
- `<SERVICE_NAME>_SERVICE_PORT` → Service 的端口
- `<SERVICE_NAME>_SERVICE_PORT_<PORT_NAME>` → 命名端口

这里 `DATA_TIER_SERVICE_HOST` 和 `DATA_TIER_SERVICE_PORT_REDIS` 由 Kubernetes 自动注入，无需硬编码 IP。对比多容器 Pod 中的 `redis://localhost:6379`，现在通过 Service 跨 Pod 通信。

---

###### 4.4 支持层 — DNS 服务发现（4.4-support_tier.yaml）

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: support-tier
  labels:
    app: microservices
    tier: support
spec:
  containers:

    - name: counter
      image: lrakai/microservices:counter-v1
      env:
        - name: API_URL
          # DNS for service discovery
          # Naming pattern:
          #   IP address: <service_name>.<service_namespace>
          #   Port: needs to be extracted from SRV DNS record
          value: http://app-tier.service-discovery:8080

    - name: poller
      image: lrakai/microservices:poller-v1
      env:
        - name: API_URL
          # omit namespace to only search in the same namespace
          value: http://app-tier:$(APP_TIER_SERVICE_PORT)
```

两种服务发现方式对比：
- DNS：`<service-name>.<namespace>` 或同命名空间内直接用 `<service-name>`
- 环境变量：`$(<SERVICE_NAME>_SERVICE_PORT)` 等

counter 用了完整 DNS（`app-tier.service-discovery:8080`），poller 省略了命名空间并混合使用了环境变量。DNS 方式更灵活，推荐使用。

---

### 5. Deployment

###### 5.2 数据层 Deployment（5.2-data_tier.yaml）

```yaml
apiVersion: apps/v1          # Deployment 使用 apps API 组
kind: Deployment
metadata:
  name: data-tier
  labels:
    app: microservices
    tier: data
spec:
  replicas: 1                # 副本数
  selector:
    matchLabels:
      tier: data             # 必须与 template.metadata.labels 匹配
  template:                  # Pod 模板
    metadata:
      labels:
        app: microservices
        tier: data
    spec:                    # Pod spec
      containers:
      - name: redis
        image: redis:latest
        imagePullPolicy: IfNotPresent
        ports:
          - containerPort: 6379
```

从裸 Pod 升级为 Deployment：
- `replicas`：期望的 Pod 副本数
- `selector.matchLabels`：Deployment 用来管理 Pod 的标签选择器
- `template`：Pod 模板，Deployment 据此创建和管理 Pod
- Deployment 提供滚动更新、回滚、自愈（Pod 挂了自动重建）

---

![](https://fastly.jsdelivr.net/gh/bucketio/img2@main/2026/03/09/1773059647273-a15f4913-1e2c-4948-9b4b-082d85b4cff5.png)

###### 5.3 应用层 Deployment（5.3-app_tier.yaml）

```yaml
apiVersion: v1
kind: Service
metadata:
  name: app-tier
  labels:
    app: microservices
spec:
  ports:
  - port: 8080
  selector:
    tier: app
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-tier
  labels:
    app: microservices
    tier: app
spec:
  replicas: 1
  selector:
    matchLabels:
      tier: app
  template:
    metadata:
      labels:
        app: microservices
        tier: app
    spec:
      containers:
      - name: server
        image: lrakai/microservices:server-v1
        ports:
          - containerPort: 8080
        env:
          - name: REDIS_URL
            value: redis://$(DATA_TIER_SERVICE_HOST):$(DATA_TIER_SERVICE_PORT_REDIS)
```

与 4.3 相同的 Service + 环境变量服务发现，但 Pod 改为 Deployment 管理。

---

###### 5.4 支持层 Deployment（5.4-support_tier.yaml）

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: support-tier
  labels:
    app: microservices
    tier: support
spec:
  replicas: 1
  selector:
    matchLabels:
      tier: support
  template:
    metadata:
      labels:
        app: microservices
        tier: support
    spec:
        containers:

        - name: counter
          image: lrakai/microservices:counter-v1
          env:
            - name: API_URL
              value: http://app-tier.deployments:8080

        - name: poller
          image: lrakai/microservices:poller-v1
          env:
            - name: API_URL
              value: http://app-tier:$(APP_TIER_SERVICE_PORT)
```

与 4.4 相同的 DNS 服务发现，但 Pod 改为 Deployment 管理。注意支持层没有 Service（不需要被其他组件访问）。DNS 中的命名空间从 `service-discovery` 变成了 `deployments`。


![](https://fastly.jsdelivr.net/gh/bucketio/img7@main/2026/03/09/1773059667590-ddd7389c-7d97-42b8-889d-5da1e3bbc731.png)

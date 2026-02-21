---
title: 记一次硬盘满了导致 Coco Server 无法启动的排查
tags: Coco-AI
toc: true
categories: 极限科技
date: 2026-02-21 00:00:00
---

这次排查非常典型：容器日志看起来像“卡在某一行”，Easysearch 甚至已经启动，但 Coco Server 的进程并没有真正跑起来。

最后发现根因是：**磁盘剩余空间不足（< 5GB）触发 coco 自检阈值，直接 panic 退出**，造成了“日志一直卡住、服务一直起不来”的假象，差不多排查了半个多小时。

### 背景：目标与现象

目标是在 RK3566 / Armbian 上把 `cocoai-arm:test` 跑起来，并通过宿主机端口访问服务：

- 宿主机映射：`-p 9000:9000`
- 容器挂载 volume：
  - `coco_data_vol:/app/easysearch/data`
  - `coco_config_vol:/app/easysearch/config`
  - `coco_logs_vol:/app/easysearch/logs`
    <!-- more -->
    一开始看到的现象是：

- `docker logs -f` 输出大量初始化日志
- Easysearch 选主、集群状态、模板 / 索引迁移都能看到
- 但实际访问服务不通，或者看上去“卡在某一行不动”

### Step 1：先处理内核参数（vm.max_map_count）

Easysearch / ES 系产品常见依赖 `vm.max_map_count`，先按推荐值设置：

```bash
sysctl -w vm.max_map_count=262144
echo "vm.max_map_count=262144" >/etc/sysctl.d/99-easysearch.conf
sysctl --system | grep vm.max_map_count
```

确认 `vm.max_map_count = 262144` 已生效。

日志里还会看到一条：

```text
sysctl: setting key "net.ipv4.conf.all.promote_secondaries": Invalid argument
```

这是系统 / 内核不支持该 sysctl 键导致的“噪音”，不影响 `vm.max_map_count` 是否生效。只要 grep 结果正确，就可以继续下一步。

### Step 2：确认 entrypoint / 进程结构（关键转折）

这一步是整个排查的关键转折点：
**不要只盯日志，要看容器里到底跑了哪些进程。**

先看镜像入口：

```bash
docker inspect --format 'Entrypoint={{json .Config.Entrypoint}} Cmd={{json .Config.Cmd}}' cocoai-arm:test
```

输出类似：

- Entrypoint：`["/sbin/tini","--","/sbin/entrypoint.sh"]`
- Cmd：`["easysearch"]`

接着进容器看进程结构：

```bash
docker exec -it cocoserver sh -lc 'ps -ef'
```

可以看到非常关键的进程关系：

- PID 1：tini → entrypoint.sh easysearch
- PID 7：java（Easysearch）
- PID 147：python supervisord
- PID 581：/bin/bash /app/easysearch/data/coco/start-coco.sh

这一步直接改变了排查方向：

> 容器里不仅跑了 Easysearch，还跑了 supervisord，它负责拉起 coco。
> 所以“服务用不了”，问题很可能根本不在 Easysearch，而在 coco。

---

### Step 3：端口检查发现 Easysearch 只监听 127.0.0.1:9200

继续验证服务监听情况：

```bash
docker exec -it cocoserver sh -lc \
"ss -lntp | grep -E ':9000|:9200' || netstat -lntp | grep -E ':9000|:9200' || true"
```

容器里没有 `ss`，回退到 `netstat`，看到类似：

```text
tcp6  0 0 127.0.0.1:9200 :::* LISTEN -
```

解读：

- Easysearch 在容器内监听 `127.0.0.1:9200`（loopback）
- 容器内部组件访问 `127.0.0.1:9200` 是没问题的
- 但如果你想从宿主机直接访问 9200，那一定不行（而且你也没映射 9200）
- coco server 在9000 端口到底有没有起来？外部访问返回RST。

### Step 4：抓到致命错误：磁盘空间不足导致 coco panic 退出

把视角切到 coco 的 supervisor 日志（**这是最关键的一步**）：

```bash
docker exec -it cocoserver sh -lc \
"tail -n 120 /app/easysearch/data/coco/supervisor.out.log; echo '----'; tail -n 120 /app/easysearch/data/coco/supervisor.err.log || true"
```

日志里可以看到两条定性信息：

```text
api server listen at: http://0.0.0.0:2900
```

以及真正的致命错误：

```text
[app.go:407] panic: disk free space [3.7G] < threshold [5G]
[app.go:429] coco now terminated.
```

到这里就完全对上了：

1）coco 确实尝试启动
2）启动后立即做磁盘空间自检
3）可用空间 3.7G < 5G 阈值
4）直接 panic 退出
5）日志不再输出，看起来像“卡住”

这次排查最后可以一句话总结为：

> Easysearch 启动正常、集群 Green；真正导致 Coco Server 不可用的原因是：
> coco 因为磁盘可用空间不足（< 5GB）触发保护阈值直接 panic 退出，造成“像卡住”的假象。

删除了一堆Docker images 释放了磁盘空间，Coco Server就能顺利启动了～

##### 下次直接照抄的「快速定位清单」

```bash
# 1) 容器状态
docker ps -a | grep coco

# 2) 镜像入口：确认是否存在 supervisord / 多进程
docker inspect --format 'Entrypoint={{json .Config.Entrypoint}} Cmd={{json .Config.Cmd}}' cocoai-arm:test

# 3) 进程树：确认 coco 是否被 supervisor 拉起
docker exec -it cocoserver sh -lc 'ps -ef'

# 4) 监听端口：没 ss 就用 netstat
docker exec -it cocoserver sh -lc "netstat -lntp | grep -E ':9200|:2900|:9000' || true"

# 5) coco 的失败原因：优先看 supervisor.out.log
docker exec -it cocoserver sh -lc "tail -n 120 /app/easysearch/data/coco/supervisor.out.log"

# 6) 如果看到 disk threshold，立即在宿主机查空间
df -h
```

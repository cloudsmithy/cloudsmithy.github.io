---
title: Easysearch 集群监控实战（上）：CPU、内存、磁盘、网络核心指标详解
date: '2026-01-01 20:35:50'
updated: '2026-01-01 20:35:50'
abbrlink: 354bc2ce
description: Easysearch 集群基础设施监控笔记，涵盖 CPU、系统负载、内存、JVM、磁盘与网络指标。
categories:
- 极限科技
- Easysearch
tags:
- Easysearch
- 搜索引擎
toc: true
source_platform: csdn
source_url: https://blog.csdn.net/weixin_38781498/article/details/156491022
source_title: Easysearch 集群监控实战（上）：CPU、内存、磁盘、网络核心指标详解
---

> 运维搜索集群，最怕半夜收到告警。本文带你掌握 Easysearch 集群的基础设施监控——CPU、内存、JVM、磁盘、网络，让你对集群资源状态了如指掌。

### <a id="t0"></a><a id="_2"></a>为什么要监控基础设施指标？

搜索引擎是资源密集型应用，基础设施任何一个环节出问题都可能导致：

- CPU 过载 → 查询变慢，响应超时
- 内存不足 → 频繁 GC，服务卡顿
- 磁盘空间不足 → 写入失败，数据丢失
- 网络异常 → 节点失联，集群分裂

好消息是，Easysearch 提供了丰富的 API 来获取这些指标，而且完全兼容 Elasticsearch/OpenSearch 的接口，上手零成本。

### <a id="t1"></a><a id="_12"></a>一行命令，快速掌握集群状态

先来个最实用的，一行命令看全貌：



```bash
GET _cat/nodes?v&h=name,ip,cpu,load_1m,heap.percent,ram.percent,disk.total,disk.used,disk.avail
```




```
name   ip            cpu load_1m heap.percent ram.percent disk.total disk.used disk.avail
node-1 192.168.215.2   1    0.16           62          11    244.7gb    10.1gb    234.5gb
```



**当前集群解读：**

| 指标 | 当前值 | 状态 |
| --- | --- | --- |
| CPU 使用率 | 1% | ✅ 很空闲 |
| 系统负载 | 0.16 | ✅ 远低于核心数 |
| 堆内存 | 62% | ✅ 健康 |
| 系统内存 | 11% | ✅ 充足 |
| 磁盘已用 | 10.1GB / 244.7GB | ✅ 仅用 4% |

这是一个负载很轻的单节点集群，各项资源都很充裕。

这就是 Easysearch 的 CAT API，简洁直观，运维必备。

### <a id="t2"></a><a id="CPU__39"></a>CPU 和系统负载

想看更详细的数据？用 `_nodes/stats` API：



```bash
GET _nodes/stats/os
```




```json
{
  "os": {
    "cpu": {
      "percent": 1,
      "load_average": {
        "1m": 0.16,
        "5m": 0.03,
        "15m": 0.01
      }
    },
    "mem": {
      "total_in_bytes": 16809500672,
      "free_in_bytes": 14935203840,
      "used_in_bytes": 1874296832,
      "free_percent": 89,
      "used_percent": 11
    },
    "swap": {
      "total_in_bytes": 17883234304,
      "free_in_bytes": 17883234304,
      "used_in_bytes": 0
    }
  }
}
```



**指标详解：**

| 指标 | 说明 |
| --- | --- |
| cpu.percent | 系统 CPU 使用率（所有进程） |
| cpu.load_average.1m/5m/15m | 系统负载（1/5/15 分钟平均值），反映等待 CPU 的进程数 |
| mem.total_in_bytes | 系统物理内存总量 |
| mem.free_in_bytes | 完全空闲的内存（不含缓存） |
| mem.used_in_bytes | 已使用的内存 |
| mem.used_percent | 内存使用率 |
| swap.total_in_bytes | 交换分区总量 |
| swap.used_in_bytes | 已使用的交换分区 |

> 💡 `load_average` 的健康标准：数值应小于 CPU 核心数。比如 4 核机器，负载持续超过 4 就说明 CPU 资源紧张。

**当前集群解读：**

| 指标 | 当前值 | 健康阈值 | 状态 |
| --- | --- | --- | --- |
| CPU 使用率 | 1% | < 80% | ✅ 健康 |
| 1 分钟负载 | 0.16 | < CPU 核心数 | ✅ 健康 |
| 内存使用率 | 11% | < 90% | ✅ 健康 |
| Swap 使用 | 0 | 应为 0 | ✅ 健康 |

系统资源非常充裕：

- 16GB 物理内存，仅使用 1.7GB（11%）
- CPU 几乎空闲，负载远低于核心数
- Swap 完全未使用，说明内存充足，不存在内存压力

> 💡 **小贴士**：Swap 使用量应该始终为 0。如果 Easysearch 开始使用 Swap，说明内存不足，性能会急剧下降。

### <a id="t3"></a><a id="JVM__105"></a>JVM 堆内存：搜索引擎的命脉

堆内存管理对搜索引擎至关重要，Easysearch 提供了完整的 JVM 监控指标：



```bash
GET _nodes/stats/jvm
```




```json
{
  "jvm": {
    "timestamp": 1767269694169,
    "uptime_in_millis": 5482037,
    "mem": {
      "heap_used_in_bytes": 675581400,
      "heap_used_percent": 62,
      "heap_committed_in_bytes": 1073741824,
      "heap_max_in_bytes": 1073741824,
      "non_heap_used_in_bytes": 196723376,
      "non_heap_committed_in_bytes": 202768384,
      "pools": {
        "young": {
          "used_in_bytes": 426770432,
          "max_in_bytes": 0,
          "peak_used_in_bytes": 635437056
        },
        "old": {
          "used_in_bytes": 244318208,
          "max_in_bytes": 1073741824,
          "peak_used_in_bytes": 245366784
        },
        "survivor": {
          "used_in_bytes": 4492760,
          "max_in_bytes": 0,
          "peak_used_in_bytes": 54525952
        }
      }
    },
    "threads": {
      "count": 75,
      "peak_count": 75
    },
    "gc": {
      "collectors": {
        "young": {
          "collection_count": 11,
          "collection_time_in_millis": 181
        },
        "old": {
          "collection_count": 0,
          "collection_time_in_millis": 0
        }
      }
    },
    "buffer_pools": {
      "mapped": {
        "count": 15,
        "used_in_bytes": 64564,
        "total_capacity_in_bytes": 64564
      },
      "direct": {
        "count": 56,
        "used_in_bytes": 24337594,
        "total_capacity_in_bytes": 24337593
      }
    }
  }
}
```



**指标详解：**

| 指标 | 说明 |
| --- | --- |
| uptime_in_millis | JVM 运行时长（毫秒） |
| mem.heap_used_in_bytes | 当前堆内存使用量（字节） |
| mem.heap_used_percent | 堆内存使用率 |
| mem.heap_committed_in_bytes | 已提交的堆内存（JVM 已向操作系统申请的内存） |
| mem.heap_max_in_bytes | 堆内存最大值（-Xmx 配置） |
| mem.non_heap_used_in_bytes | 非堆内存使用量（元空间、代码缓存等） |
| mem.pools.young | 年轻代内存池，存放新创建的对象 |
| mem.pools.old | 老年代内存池，存放长期存活的对象 |
| mem.pools.survivor | Survivor 区，Young GC 后存活对象的中转区 |
| threads.count | 当前线程数 |
| threads.peak_count | 历史峰值线程数 |
| gc.collectors.young | Young GC 统计（回收年轻代） |
| gc.collectors.old | Old GC 统计（Full GC，回收整个堆） |
| buffer_pools.mapped | 内存映射文件缓冲区（用于索引文件） |
| buffer_pools.direct | 直接内存缓冲区（堆外内存，用于网络 I/O） |

> 💡 Young GC 频繁是正常的，通常每次只需几十毫秒。但 Old GC 应该尽量少，每次可能耗时数百毫秒甚至数秒，会导致服务暂停。

**当前集群解读：**

| 指标 | 当前值 | 状态 |
| --- | --- | --- |
| 堆内存使用率 | 62% | ✅ 健康（< 75%） |
| Old GC 次数 | 0 | ✅ 完美 |
| Young GC | 11 次，共 181ms | ✅ 正常（平均 16ms/次） |
| 线程数 | 75 | ✅ 正常 |
| JVM 运行时长 | ~1.5 小时 | 刚启动不久 |

**内存分布分析：**

- 堆内存配置：1GB，已用 644MB（62%）
- 年轻代：407MB（对象创建活跃）
- 老年代：233MB（长期对象不多）
- Survivor 区：4.3MB（正常）
- 直接内存：23MB（网络 I/O 缓冲）

这是一个刚启动约 1.5 小时的节点，没有触发过 Old GC，说明内存压力很小，堆内存还有 38% 余量。

> ⚠️ **注意**：如果 `heap_used_percent` 持续超过 75%，或者 Old GC 频繁发生，说明需要增加堆内存或优化查询了。

### <a id="t4"></a><a id="_218"></a>磁盘空间：别让它成为瓶颈

搜索引擎的数据都存在磁盘上，空间不足会直接导致写入失败：



```bash
GET _nodes/stats/fs
```




```json
{
  "fs": {
    "timestamp": 1767270240085,
    "total": {
      "total_in_bytes": 262617776128,
      "free_in_bytes": 251701411840,
      "available_in_bytes": 251701411840,
      "cache_reserved_in_bytes": 0
    },
    "data": [
      {
        "path": "/app/easysearch/data/nodes/0",
        "mount": "/ (overlay)",
        "type": "overlay",
        "total_in_bytes": 262617776128,
        "free_in_bytes": 251701411840,
        "available_in_bytes": 251701411840,
        "cache_reserved_in_bytes": 0
      }
    ],
    "io_stats": {}
  }
}
```



**指标详解：**

| 指标 | 说明 |
| --- | --- |
| total.total_in_bytes | 磁盘总容量（字节） |
| total.free_in_bytes | 磁盘剩余空间（未被任何进程使用） |
| total.available_in_bytes | 当前用户可用空间（考虑了系统预留） |
| total.cache_reserved_in_bytes | 为缓存预留的空间 |
| data[].path | 数据存储路径 |
| data[].mount | 挂载点信息 |
| data[].type | 文件系统类型（如 ext4、xfs、overlay） |
| io_stats | 磁盘 I/O 统计（部分系统可能为空） |

> 💡 `free_in_bytes` 和 `available_in_bytes` 的区别：Linux 系统通常会预留 5% 空间给 root 用户，`available` 是普通用户实际可用的空间，监控时应以 `available` 为准。

> 💡 **关于磁盘容量显示**：API 返回的是字节数（如 262,617,776,128），CAT API 会自动转换为 GB 显示（如 244.7gb）。两者使用不同的换算方式：字节数按 1GB = 10^9 换算约 262GB，而 CAT API 按 1GB = 2^30（即 GiB）换算约 244.7GB。这是正常现象，不影响监控准确性。

**磁盘使用率计算：**



```
使用率 = (total - available) / total
       = (262617776128 - 251701411840) / 262617776128
       = 4.2%
```



**当前集群解读：**

| 指标 | 当前值 | 状态 |
| --- | --- | --- |
| 磁盘总容量 | 262GB（244.6GiB） | - |
| 已使用 | 10.9GB | ✅ 仅 4.2% |
| 可用空间 | 251GB（234.4GiB） | ✅ 非常充足 |
| 数据路径 | /app/easysearch/data/nodes/0 | - |
| 文件系统 | overlay | Docker 容器环境 |

磁盘空间非常充裕，距离 75% 警告线还有很大余量。按当前数据量增长，短期内无需扩容。

> 💡 **重要提醒**：当磁盘使用率超过 85% 时，Easysearch 会触发 watermark 机制，限制新数据写入。建议在 75% 时就开始扩容规划。

### <a id="t5"></a><a id="_291"></a>网络连接：集群通信的桥梁

多节点集群中，节点间的网络通信很重要：



```bash
GET _nodes/stats/transport,http
```




```json
{
  "transport": {
    "server_open": 0,
    "total_outbound_connections": 2,
    "rx_count": 8,
    "rx_size_in_bytes": 1030,
    "tx_count": 8,
    "tx_size_in_bytes": 1030
  },
  "http": {
    "current_open": 5,
    "total_opened": 513
  }
}
```



**指标详解：**

| 指标 | 说明 |
| --- | --- |
| transport.server_open | 当前打开的传输层连接数（节点间通信） |
| transport.total_outbound_connections | 到其他节点的出站连接总数 |
| transport.rx_count | 接收的数据包数量 |
| transport.rx_size_in_bytes | 接收的数据总量（字节） |
| transport.tx_count | 发送的数据包数量 |
| transport.tx_size_in_bytes | 发送的数据总量（字节） |
| http.current_open | 当前打开的 HTTP 连接数（客户端连接） |
| http.total_opened | 累计打开过的 HTTP 连接数 |

**当前集群解读：**

| 指标 | 当前值 | 状态 |
| --- | --- | --- |
| 节点间连接 | 2 个出站连接 | ✅ 正常（单节点） |
| 客户端连接 | 5 个当前 / 513 个累计 | ✅ 正常 |
| 收发数据包 | 各 8 个，约 1KB | ✅ 流量很小 |

这是单节点集群，节点间通信量很小。HTTP 连接数正常，没有连接泄漏迹象。

### <a id="t6"></a><a id="_339"></a>集群健康一览

最后，别忘了检查集群整体健康状态：



```bash
GET _cluster/health
```




```json
{
  "cluster_name": "infinilabs",
  "status": "green",
  "number_of_nodes": 1,
  "number_of_data_nodes": 1,
  "active_primary_shards": 10,
  "active_shards": 10,
  "unassigned_shards": 0
}
```



**状态说明：**

- 🟢 **green**：所有分片正常，集群健康
- 🟡 **yellow**：主分片正常，但有副本未分配（单节点常见）
- 🔴 **red**：有主分片不可用，需要立即处理

**当前集群解读：**

| 指标 | 当前值 | 状态 |
| --- | --- | --- |
| 集群名称 | infinilabs | - |
| 集群状态 | green | ✅ 健康 |
| 节点数 | 1 | ⚠️ 单节点无高可用 |
| 数据节点数 | 1 | - |
| 主分片数 | 10 | - |
| 总分片数 | 10 | - |
| 未分配分片 | 0 | ✅ 无异常 |

集群状态为 green，所有分片正常。但这是单节点部署，没有副本分片，生产环境建议至少 3 节点以保证高可用。

### <a id="t7"></a><a id="_378"></a>监控告警建议

根据实践经验，建议设置以下告警阈值：

| 指标 | ⚠️ 警告 | 🔴 严重 |
| --- | --- | --- |
| CPU 使用率 | > 70% | > 90% |
| 堆内存使用率 | > 70% | > 85% |
| 磁盘使用率 | > 75% | > 85% |
| Old GC 频率 | > 5次/分钟 | > 10次/分钟 |
| 集群状态 | yellow | red |

### <a id="t8"></a><a id="_390"></a>常用命令速查表



```bash
# 🏥 快速健康检查
GET _cluster/health

# 📊 节点资源概览
GET _cat/nodes?v&h=name,cpu,heap.percent,ram.percent,disk.used_percent

# 📈 完整节点统计
GET _nodes/stats/os,jvm,fs,transport,http

# 💾 磁盘分配详情
GET _cat/allocation?v
```



### <a id="t9"></a><a id="_406"></a>总结

监控 Easysearch 集群的基础设施并不复杂，掌握这几个核心 API 就够了：

- `_cat/nodes` - 快速概览
- `_nodes/stats/os` - CPU 和内存
- `_nodes/stats/jvm` - JVM 堆内存
- `_nodes/stats/fs` - 磁盘空间
- `_nodes/stats/transport,http` - 网络连接
- `_cluster/health` - 集群状态

Easysearch 完全兼容 Elasticsearch/OpenSearch API，如果你之前用过这些产品，可以无缝迁移。

下一篇我们将介绍索引和查询性能监控，敬请期待。

---

**参考文档：**

- [Easysearch 官方文档](https://docs.infinilabs.com/easysearch/)
- [Nodes Stats API](https://docs.infinilabs.com/easysearch/references/api/nodes-stats/)

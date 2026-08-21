---
title: 连接 Easysearch 的新方式：使用 DBX 把索引当成表来浏览
description: DBX 已原生支持 Easysearch，可以通过图形界面连接集群、浏览索引，并使用 DSL 和 SQL 查询数据。
tags:
  - Easysearch
  - DBX
  - Elasticsearch
toc: true
categories:
  - 极限科技
  - Easysearch
date: 2026-08-21 00:00:00
---

这几天刷到一个消息：**DBX 已经支持 Easysearch 了。**

看到消息后，我第一时间决定试一试。毕竟按照项目介绍，DBX 是社区中首个将 Easysearch 作为独立数据源类型进行原生适配的可视化工具。

![](https://fastly.jsdelivr.net/gh/bucketio/img17@main/2026/08/21/1787279787520-12b528cc-86e9-46f2-9f20-381c7b282465.png)

Easysearch 是面向国产化场景的搜索引擎，同时兼容 Elasticsearch 生态中的许多接口和使用习惯。

过去使用通用客户端连接 Easysearch 时，通常只能选择 Elasticsearch 数据源。为了兼容 Easysearch，一般建议选择 Elasticsearch 7.10 驱动。基础的索引浏览和数据查询通常没有问题，但由于客户端并不真正认识 Easysearch，一些版本信息和新增能力可能无法正确识别或展示。

原生支持的意义就在这里：DBX 不再只是把 Easysearch 当成一个“兼容 Elasticsearch 的服务”，而是把它作为单独的数据源类型来处理。

## 创建 Easysearch 连接

打开 DBX 的新建连接页面，可以直接选择 Easysearch，然后填写以下信息：

- Easysearch 地址；
- HTTP 或 HTTPS 端口；
- 用户名；
- 密码；
- TLS 连接选项。

![](https://fastly.jsdelivr.net/gh/bucketio/img9@main/2026/08/21/1787279849425-03d69387-e6ec-4de0-8b09-7a374ff1c414.png)

整体连接方式和普通数据库客户端比较接近，不需要再手动选择一个 Elasticsearch 版本进行兼容。

如果忘记了 Easysearch 管理员密码，可以进入 Easysearch 容器执行密码重置脚本：

```bash
docker exec -it easysearch bash -c "/app/easysearch/bin/reset_admin_password.sh"
```

这里的 `easysearch` 是容器名称。如果部署时使用了其他容器名，需要替换成实际名称。

## 开启 TLS 连接

Easysearch 默认启用了 TLS 传输，因此在 DBX 中创建连接时，也需要打开对应的 SSL/TLS 选项。

![](https://fastly.jsdelivr.net/gh/bucketio/img7@main/2026/08/21/1787279873026-4e6c28fc-d3d5-4226-b946-82fd4bb1b36d.png)

我的 Easysearch 使用的是自签名证书。在这次测试中，DBX 可以通过连接页面提供的 TLS 兼容选项正常完成连接，不需要为了使用客户端而关闭 Easysearch 端的 TLS。

这里不建议简单地把它理解为“从 HTTPS 自动降级到 HTTP”。更准确地说，DBX 对自签名证书场景提供了相应的连接处理能力，数据传输仍然可以通过 TLS 完成。

![](https://fastly.jsdelivr.net/gh/bucketio/img6@main/2026/08/21/1787279879779-aa4e66b2-248f-41a2-86a3-34bcd7ddbbbf.png)

这比为了图省事直接关闭 Easysearch 的 SSL 验证更加合理，尤其是需要跨设备或者跨网络访问集群时。

## 查看 Easysearch 集群信息

连接成功后，DBX 可以识别并展示 Easysearch 的基本信息。

![](https://fastly.jsdelivr.net/gh/bucketio/img12@main/2026/08/21/1787279898976-eb9f128e-866f-4792-9c3d-0109196f5985.png)

从连接体验来看，整个过程已经比较接近连接 MySQL、PostgreSQL 等传统数据库：创建连接、填写认证信息、测试连接，然后进入数据浏览页面。

如果后续还能在这里加入 CPU、内存、磁盘使用量、节点状态、分片分布和集群健康状态等监控信息，体验会更加完整。

当然，DBX 的主要定位还是数据管理工具，专业的集群监控仍然可以交给 INFINI Console、Prometheus 或其他可观测性平台。

## 把 Easysearch 索引当成“表”来浏览

连接完成后，DBX 最有意思的地方出现了：它可以用传统数据库管理工具的方式展示 Easysearch 索引。

在左侧资源树中，Easysearch 的索引会以类似数据库表的形式出现。打开索引后，又可以像查看表数据一样浏览其中的文档。

![](https://fastly.jsdelivr.net/gh/bucketio/img12@main/2026/08/21/1787279910270-d22c7666-9551-4249-9968-043e3ce53305.png)

对于习惯 MySQL、PostgreSQL 等关系型数据库的用户，这种界面非常容易理解：

| 关系型数据库 | Easysearch |
| --- | --- |
| Database | Cluster 或逻辑数据集合 |
| Table | Index |
| Row | Document |
| Column | Field |
| Schema | Mapping |

MySQL 用户狂喜，以后终于不用每次都先在脑子里完成一次“索引约等于表、文档约等于行、字段约等于列”的转换了。

当然，这只是为了方便理解和操作的界面抽象，并不意味着 Easysearch 索引真的等同于关系型数据库表。

Easysearch 还有倒排索引、Mapping、分片、副本、动态字段、对象字段和 Nested 类型等概念。它的数据模型和查询执行方式，与传统关系型数据库仍然存在本质区别。

DBX 做得比较聪明的地方，是在不改变 Easysearch 数据模型的前提下，提供了一套数据库用户熟悉的操作界面。

## 同时支持 DSL 和 SQL

在查询方式上，DBX 并没有因为采用了数据库风格的界面，就只保留 SQL。

实际使用时，可以根据需求选择 DSL 或 SQL。

![](https://fastly.jsdelivr.net/gh/bucketio/img2@main/2026/08/21/1787279940737-e3a2fa71-2d46-4e57-b801-ee7644452b42.png)

熟悉 Easysearch 或 Elasticsearch 的用户，可以继续使用 Query DSL 完成全文检索、布尔查询、聚合分析和复杂过滤。

习惯关系型数据库的用户，则可以先从 SQL 入手。例如执行一个简单的 `SELECT` 查询，快速查看索引中的数据。

![](https://fastly.jsdelivr.net/gh/bucketio/img3@main/2026/08/21/1787279926488-b15249a8-a5af-492e-bf14-2f37edac3a03.png)

这两种方式各有适合的场景：

- **SQL**：适合快速查看数据、筛选字段、添加条件和进行简单聚合；
- **DSL**：适合全文检索、相关性查询、复杂布尔逻辑和搜索引擎特有能力。

对于第一次接触 Easysearch 的数据库用户，可以先通过表格界面和 SQL 建立直觉，再逐步学习 DSL。对于已经熟悉 DSL 的用户，DBX 则提供了索引浏览、连接管理和查询结果展示等图形化能力。

## 使用体验

整体体验下来，DBX 原生支持 Easysearch 的价值，并不只是“又多了一个可以发送查询的客户端”。

它真正降低的是数据库用户理解和使用搜索引擎的门槛：

1. 创建 Easysearch 专用连接，不需要伪装成 Elasticsearch；
2. 支持用户名、密码和 TLS 连接；
3. 用类似数据库表的方式浏览索引和文档；
4. 同时保留 SQL 与 DSL 两种查询方式；
5. 一个客户端可以统一管理数据库和 Easysearch。

对于数据库开发人员来说，可以沿用熟悉的表格和 SQL 操作习惯；对于 Easysearch 用户来说，也多了一个轻量、直观的日常查询工具。

当然，DBX 并不能替代所有专业工具。复杂的集群运维、节点监控、分片诊断、索引生命周期管理和性能分析，仍然需要使用对应的 Easysearch API、INFINI Console 或其他运维平台。

但如果只是浏览索引、检查文档、验证查询，或者让习惯 MySQL 的同事快速查看 Easysearch 数据，DBX 已经非常合适。

以前我们要向数据库用户解释：

> 你可以先把 Easysearch 的索引理解成数据库里的表。

现在不用类比了。

DBX 直接把它展示成“表”给你看。

## 参考资料

- [参考资料一：DBX 与 Easysearch 相关介绍](https://mp.weixin.qq.com/s/Cz09ikQznmYVGJ8D9TjXLw?from=groupmessage&isappinstalled=0&scene=1&clicktime=1787280629&enterid=1787280629)
- [参考资料二：Easysearch 相关介绍](https://mp.weixin.qq.com/s/YCiJ98jxAzQbuCVqoCHeRQ)

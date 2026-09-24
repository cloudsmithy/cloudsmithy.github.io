---
title: INFINI Labs 产品全览：搜索引擎、网关、管理台与 AI 搜索
description: 梳理 Easysearch、Gateway、Console、Coco AI 与 Loadgen 的分工，说明搜索、运维和知识库场景下如何组合，以及上线前需要验证的边界。
date: 2025-12-22 19:30:59
updated: '2026-09-23'
categories: 极限科技
tags:
  - 极限科技
  - Easysearch
  - Coco AI
  - 搜索引擎
abbrlink: 'f21e6be4'
source_platform: csdn
source_url: https://blog.csdn.net/weixin_38781498/article/details/156161940
source_urls:
  - https://blog.csdn.net/weixin_38781498/article/details/156161940
  - https://blog.csdn.net/weixin_38781498/article/details/156201536
source_title: 企业搜索基础设施的一站式方案：极限科技 INFINI Labs 产品全览
---

接触极限科技的产品时，容易先记住 Easysearch，随后又看到 Gateway、Console、Coco AI、Loadgen，一下多出几个名字。它们各自负责哪一段？做一个搜索服务，是不是都要装？

先把分工摆出来。Easysearch 负责存储和检索，Gateway 放在请求经过的路上，Console 用来查看和管理集群，Coco AI 面向搜索与 AI 应用，Loadgen 则用于测试。下面这张图是一种组合方式，具体部署可以按需求取舍。

{% mermaid %}
flowchart LR
    App["业务应用"] --> Gateway["INFINI Gateway"]
    Gateway --> Easysearch["Easysearch"]
    Coco["Coco AI Server"] --> Easysearch
    Console["INFINI Console"] -. "监控与管理" .-> Easysearch
    Loadgen["Loadgen"] -. "压测" .-> Gateway
{% endmermaid %}

## Easysearch：数据存在哪里、怎么查

Easysearch 是基于 Lucene 的分布式搜索引擎，提供全文检索、聚合分析、向量检索等能力。文档、索引、分片、副本这些概念，熟悉 Elasticsearch 的人上手不会陌生。

它可以作为业务搜索的后端，也可以为日志分析、语义检索等应用提供存储和查询能力。至于中文分词、向量模型、字段映射怎么配置，要跟着实际数据设计，不能只把数据灌进去就指望结果合适。

官方文档给出的 Elasticsearch API 兼容范围是 7.10。客户端、插件和快照仍需分别核对，我在 [Elasticsearch、OpenSearch 与 Easysearch 的关系和兼容边界](/ca6d4c60/) 里做了更详细的整理。

## Gateway：把请求管起来

INFINI Gateway 是放在搜索引擎前面的网关。应用先访问 Gateway，再由它把请求交给后端集群。

当入口增多、后端不止一套集群时，这一层可以承接路由、限流、缓存、请求与响应改写、访问审计等工作。官方文档用入口、路由、处理流程和过滤器来组织这些能力。

比如，某类请求突然增多，可以按配置控制流量；有些热点查询允许缓存，可以减少后端重复处理；迁移期间需要调整流量去向，也可以在网关层安排。

但流量转到另一套集群，不等于数据已经同步过去。读写分流、双写、故障转移这类方案，还要考虑数据新旧、失败重试和一致性。

## Console：日常从哪里看集群

INFINI Console 提供可视化的多集群管理界面。官方文档列出了 Easysearch、OpenSearch 和 Elasticsearch 的多个版本支持范围，接入前应核对自己正在运行的版本。

日常比较直接的用途，是在同一处查看集群、节点和索引指标，配置阈值告警，管理索引，使用开发者工具执行请求。元数据变更历史也有助于追踪集群变化。

我之前写过 [INFINI Console 的使用介绍](/bde1966f/)，可以接着看具体界面和操作。Console 能纳管哪些对象、执行哪些操作，仍以所装版本的功能为准；不能把“统一管控”理解成所有组件已经自动完成配置和同步。

## Coco AI：把资料接进搜索与问答

Coco AI 面向统一搜索和 AI 辅助使用资料的场景。Coco Server 的官方介绍列出了 Google Workspace、Dropbox、Confluence、GitHub 等数据源，实际接入时还需要配置相应连接器与访问权限。

在采用 Easysearch 作为后端的部署中，Coco Server 负责连接和处理资料，搜索引擎承担存储与检索，再按配置接入模型能力。对使用者来说，入口从“去哪个系统找”变成了统一搜索，或者结合检索结果提问。

这里最容易被省略的工作，是资料权限、更新频率和答案核对。连接器能读到资料，不代表每个用户都应该看到全部内容；检索出了相关片段，也不代表模型生成的每句话都准确。做企业知识库时，这些都需要验证。

## Loadgen：用请求验证容量

Loadgen 是 HTTP 压测工具，可以配置请求模板、变量、并发和流量，并检查响应。它既可以直接请求 Easysearch，也可以经过 Gateway，测试整个访问路径。

如果想比较两套配置，先固定数据、查询分布、并发和运行时间。一次只改一个主要条件，留下吞吐量、延迟和错误情况，才能知道变化来自哪里。

压测通过也有范围：测试时没有覆盖到的查询、数据增长、故障恢复和突发流量，仍可能在上线后暴露问题。因此测试记录里需要有环境和请求说明，而不只是一个 QPS 数字。

## 按场景组合

| 场景 | 可以从哪些组件开始 | 还需要做什么 |
| --- | --- | --- |
| 全文检索、商品或内容搜索 | Easysearch；有流量治理需求再加 Gateway | 设计映射和分词，评估召回、排序与查询延迟 |
| 日志分析 | 采集工具 + Easysearch + Console | 核对采集器版本，安排保留周期、权限、容量与告警 |
| 企业知识库与 AI 搜索 | Coco AI + Easysearch + 模型服务 | 配置数据源，核对权限、更新与回答质量 |
| 容量评估 | Loadgen + 待测服务 | 固定测试条件，记录错误、资源占用和性能变化 |
| 多集群接入 | Gateway + 后端集群，配合 Console 观察 | 单独设计数据同步、切换与回退流程 |

跨数据中心容灾尤其不能只看组件列表。数据如何复制、可接受丢多少数据、多久恢复、故障后怎样切回，都需要单独设计和演练。装上 Gateway 和 Console，并不会自动得到一套完整的容灾方案。

这些产品覆盖了搜索系统里不同的工作。小规模应用可以先把数据和查询跑通；遇到多集群管理、入口控制或知识库需求，再补相应组件。选型时把自己的问题逐项对应到功能，比一次装齐更容易判断每个组件是否有用。

## 参考资料

- [Easysearch 产品文档](https://docs.infinilabs.com/easysearch/main/docs/overview/)
- [INFINI Gateway 架构与特性](https://docs.infinilabs.com/gateway/main/docs/overview/)
- [INFINI Console 功能与支持范围](https://docs.infinilabs.com/console/main/zh/)
- [Coco Server 项目与文档入口](https://github.com/infinilabs/coco-server)
- [Loadgen 使用说明](https://github.com/infinilabs/loadgen)

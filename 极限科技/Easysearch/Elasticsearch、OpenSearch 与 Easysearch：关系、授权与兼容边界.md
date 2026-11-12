---
title: Elasticsearch、OpenSearch 与 Easysearch：关系、授权与兼容边界
description: 从 Lucene、Elasticsearch 7.10.2 和授权变化讲起，梳理 Elasticsearch、OpenSearch 与 Easysearch 的关系，以及 API、客户端、插件和快照的兼容边界。
date: 2025-10-07 15:22:23
updated: '2026-09-23'
categories:
  - 极限科技
  - Easysearch
tags:
  - Elasticsearch
  - OpenSearch
  - Easysearch
  - 搜索引擎
abbrlink: 'ca6d4c60'
source_platform: csdn
source_url: https://blog.csdn.net/weixin_38781498/article/details/152662876
source_urls:
  - https://blog.csdn.net/weixin_38781498/article/details/152662876
  - https://blog.csdn.net/weixin_38781498/article/details/162809962
source_title: Elasticsearch、OpenSearch 与 Easysearch：三代搜索引擎的演化与抉择
---

写 Easysearch 系列写到现在，评论区总有人问同一个问题：这仨长得这么像，到底谁是谁？是不是换个皮的同一个东西？

名字不同，查询语句却很眼熟；同样有索引、分片、副本，客户端有时候还能接着用。可真到升级和迁移的时候，又会发现“兼容”两个字没说完所有事情。这篇把关系捋一遍，再说选型时该看什么。

## 先看共同的底子

Elasticsearch、OpenSearch 和 Easysearch 都基于 Apache Lucene。倒排索引、分词、相关性评分这些概念，学过之后可以带着走。至于分布式协调、安全功能、客户端和运维工具，各家有自己的实现与演进。

**OpenSearch 与 Elasticsearch 的分支关系是明确的。** 2021 年，AWS 和社区基于 Elasticsearch 7.10.2、Kibana 7.10.2 创建 OpenSearch 与 OpenSearch Dashboards，继续采用 Apache 2.0 授权。此后 OpenSearch 独立发布版本，现在属于 Linux 基金会旗下的项目。

Easysearch 则是 INFINI Labs 的搜索引擎产品。官方文档写明它基于 Lucene，并兼容 Elasticsearch 7.10 API。这里能确认的是产品定位和接口兼容范围，不能据此把它简单说成“OpenSearch 的国产轻量版”，也不能把三家的后续版本画成完全等价的分支。

理解关系时，可以记住 7.10.2 这个版本；判断今天能不能互换时，还要继续往下查。

## 授权不能只写“开源”两个字

这部分按 2026 年 9 月核对的官方资料整理。源码的授权方式和下载安装包的授权方式，需要分别看。

| 产品 | 授权情况 | 使用时要核对什么 |
| --- | --- | --- |
| Elasticsearch | 2021 年从 7.11 开始调整源码授权；2024 年又为免费部分源码加入 AGPLv3 选项。默认发行包仍采用 Elastic License 2.0 | 具体版本、使用的发行包、功能订阅，以及适用的条款 |
| OpenSearch | 项目采用 Apache 2.0 | 所用组件和依赖的许可证；自建软件与云上托管服务的收费、服务条款也要分开 |
| Easysearch | 官方 FAQ 明确它是商业软件，目前不开源；官网称其采用“商用友好协议” | 使用的版本、授权范围与支持服务，以对应条款为准 |

所以，“Elasticsearch 8.x 都能选 AGPL”不够准确，AGPL 选项是在 2024 年才加入免费部分源码的。“Easysearch 是 Apache 2.0”也不对。至于 OpenSearch，Apache 2.0 并不意味着可以省掉许可证审查，更不意味着 AWS 上的托管服务免费。

安全能力也不适合一句“ES 收费，另外两家免费”带过。具体到认证、字段权限、审计、告警等功能，要看版本和订阅表，不能拿早年的印象替代今天的功能清单。

## “兼容”至少要分四层

第一层是 **REST API 和查询 DSL**。已有的索引、写入、查询请求能不能执行，需要用业务实际请求验证。一个简单的 `match` 查询成功，不代表聚合、脚本、向量检索和管理 API 都一样。

第二层是 **客户端版本**。OpenSearch 官方客户端文档指出，Elasticsearch OSS 7.10.2 客户端应能配合 OpenSearch 1.x 使用；到了 OpenSearch 2.0 及之后，没有 Elasticsearch 客户端能够与它完全兼容，应改用对应的 OpenSearch 客户端并查版本矩阵。

Easysearch 官方 FAQ 给出了 Elasticsearch 7.10.2 OSS 客户端的兼容路径，并要求按文档启用 API 兼容设置。它也已经有自己的客户端，我整理过 [Easysearch 官方 Python 客户端的连接、写入与查询用法](/d4422b76/)。新项目可以先看这条路线，不必默认背着旧客户端走到底。

第三层是 **插件和周边工具**。Kibana、Dashboards、Logstash、采集器、分词插件，都有各自的版本要求。接口长得像，不代表插件二进制能直接装，也不代表工具不会检查服务端版本。

第四层是 **索引和快照**。客户端能连上，跟旧快照能不能恢复是两件事。我在 [Elasticsearch、Easysearch 与 Amazon OpenSearch 的快照兼容实测](/80e06f4b/) 里记录过仓库配置、恢复结果和报错；那些结果只对应文中测试的版本，不能直接外推到所有新版本。

迁移前，我会先列这张清单：

| 要核对的东西 | 留下的证据 |
| --- | --- |
| 服务端、客户端及插件版本 | 明确的版本组合和官方兼容说明 |
| 写入、查询、聚合、脚本 | 业务请求样本、返回结果和差异 |
| 分词与相关性 | 一组固定查询的召回、排序结果 |
| 数据迁移与恢复 | 数据量、失败记录、校验结果和恢复步骤 |
| 权限与运维 | 账号角色、证书、告警及备份是否仍然有效 |

## 选型从手里的系统开始

如果已经深度使用 Elastic 的工具和功能，先算继续升级的成本，再比较换平台后要补哪些能力。为了换名字而迁移，通常没有必要。

如果关注 Apache 2.0 的项目生态，或者需要结合 Amazon OpenSearch Service，OpenSearch 值得评估。但“在 AWS 上”只是一项条件，还要看需要的版本、插件、运行方式和运维成本。

如果需要国内厂商支持，准备从 Elasticsearch 7.x 迁移，或有明确的国产软硬件环境要求，可以把 Easysearch 放进验证名单。支持哪些平台、迁移要改多少、资源能省多少，都应落到自己的环境里验证。

原先那种“镜像不到 500 MB、几秒启动、资源占用更低”的表格，没有版本、硬件、数据量和测试条件，拿来选型帮不上忙。更有用的是给三套候选配置相同的数据、查询和并发，再看延迟、资源占用、恢复能力，以及自己能否长期维护。

搜索引擎确定之后，前面的流量怎么管、集群怎么看、知识库怎么接，才是下一步。我把 INFINI Labs 这部分工具关系放在了 [产品全览](/f21e6be4/) 里。

## 参考资料

- [Elastic：Elasticsearch 与 Kibana 授权 FAQ](https://www.elastic.co/pricing/faq/licensing)
- [OpenSearch：项目介绍](https://opensearch.org/about/)
- [OpenSearch：客户端兼容说明](https://docs.opensearch.org/latest/clients/)
- [Easysearch：产品介绍](https://docs.infinilabs.com/easysearch/main/docs/overview/)
- [Easysearch：授权与兼容性 FAQ](https://docs.infinilabs.com/easysearch/main/docs/faq/)

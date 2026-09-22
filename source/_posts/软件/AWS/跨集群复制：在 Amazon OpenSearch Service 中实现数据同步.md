---
title: 跨集群复制：在 Amazon OpenSearch Service 中实现数据同步
date: '2024-10-11 16:51:40'
updated: '2024-10-11 16:51:40'
abbrlink: aae56ced
description: Amazon OpenSearch Service 跨集群复制的配置笔记，涵盖前提条件、权限、单索引复制和自动跟随规则。
categories:
- 软件
- AWS
tags:
- AWS
- OpenSearch
toc: true
source_platform: csdn
source_url: https://blog.csdn.net/weixin_38781498/article/details/142856935
source_title: 跨集群复制：在Amazon OpenSearch服务中实现数据同步
---

在当今的数据驱动世界中，跨地域的数据同步和灾难恢复变得尤为重要。Amazon OpenSearch服务通过其跨集群复制功能，提供了一种高效的方法来同步不同服务域之间的用户索引、映射和元数据。这一功能不仅有助于确保业务连续性，还能减少因地理位置分散而产生的延迟。然而，在使用这一功能时，我们需要注意一些限制和先决条件。

### <a id="t0"></a><a id="_2"></a>跨集群复制的限制

在使用Amazon OpenSearch服务的跨集群复制时，以下几点限制需要特别注意：

1. **服务域限制**：无法在Amazon OpenSearch服务域与自管的OpenSearch或Elasticsearch集群之间复制数据。
2. **索引复制方向**：不能将索引从一个关注者域复制到另一个关注者域。所有复制必须源自单个领导者域。
3. **连接限制**：一个域最多可以与20个其他域建立入站和出站连接。
4. **版本兼容性**：在建立跨集群连接时，领导者域的版本必须等于或高于关注者域。
5. **CloudFormation限制**：不能使用Amazon CloudFormation来建立域间的连接。
6. **实例限制**：在M3和可突增（T2和T3）实例上不能使用跨集群复制。
7. **索引存储限制**：不能在UltraWarm或冷索引之间复制数据；所有索引必须位于热存储中。
8. **索引删除**：删除领导者域中的索引不会自动删除关注者域中的对应索引。

在设置跨集群复制之前，请确保域满足以下要求：

Elasticsearch 7.10 或 1.1 或 OpenSearch 更高版本

已启用精细访问控制

N 已启用ode-to-node 加密  
![在这里插入图片描述](/images/migrated/48f164ff564aaf19dfe4.png)

![在这里插入图片描述](/images/migrated/6708a564694777a30caf.png)

### <a id="t1"></a><a id="_26"></a>复制单个索引

要开始复制过程，首先需要确保拥有对远程领导者域的`es:ESCrossClusterGet`权限。以下是一个推荐的IAM策略，它不仅允许执行复制操作，还能进行文档索引编制和标准搜索：



```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "*"
      },
      "Action": [
        "es:ESHttp*"
      ],
      "Resource": "arn:aws:es:region:account:domain/leader-domain/*"
    },
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "*"
      },
      "Action": "es:ESCrossClusterGet",
      "Resource": "arn:aws:es:region:account:domain/leader-domain"
    }
  ]
}
```



一旦满足了权限要求，就可以通过发送特定的API请求来启动复制过程。例如，以下命令可以在关注者域中启动对领导者域中名为`my_index`的索引的复制：



```json
PUT _plugins/_replication/follower-01/_start
{
   "leader_alias": "ccr",
   "leader_index": "my_index",
   "use_roles":{
      "leader_cluster_role": "all_access",
      "follower_cluster_role": "all_access"
   }
}
```



### <a id="t2"></a><a id="_70"></a>监控复制状态

复制开始后，可以通过以下命令监控复制状态，确保数据同步按预期进行：



```json
GET _plugins/_replication/follower-01/_status
```



如果需要，还可以暂停和恢复复制过程，或者完全停止复制。需要注意的是，一旦停止复制，关注者索引将变为标准索引，且无法重新启动复制。

### <a id="t3"></a><a id="_80"></a>自动复制索引

Amazon OpenSearch服务还支持自动复制索引的功能。通过定义复制规则，可以自动复制匹配特定模式的索引。例如，以下命令创建了一个自动复制以`a`开头的所有索引的规则：



```json
POST _plugins/_replication/_autofollow
{
   "leader_alias" : "ccr",
   "name": "ccr-name",
   "pattern": "a*",
   "use_roles":{
      "leader_cluster_role": "all_access",
      "follower_cluster_role": "all_access"
   }
}
```



自动复制规则的统计信息可以通过以下命令检索：



```json
GET _plugins/_replication/autofollow_stats
```



如果需要停止自动复制，可以删除相应的复制规则：



```json
DELETE _plugins/_replication/_autofollow
{
   "leader_alias" : "ccr",
   "name": "ccr-name"
}
```



通过这些功能，Amazon OpenSearch服务为用户提供了强大的工具来实现跨集群的数据同步和灾难恢复，确保数据的高可用性和一致性。

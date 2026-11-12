---
title: Elasticsearch 数据迁移方法笔记
date: '2025-05-04 12:07:47'
updated: '2025-05-04 12:14:39'
abbrlink: 4a698a49
categories:
- 软件
tags:
- Elasticsearch
- 搜索引擎
description: 整理 Elasticsearch 的快照恢复、远程 reindex、Logstash、elasticdump 和跨集群复制方法，以及迁移时的版本、网络和数据核对事项。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/147693334
source_title: ES类迁移方法
---

1. 快照(s3 file FS)
2. 跨集群迁移
3. es-dump
4. remote-reindex
5. Logstash

## <a id="Elasticsearch__6"></a>Elasticsearch 迁移方法

Elasticsearch 迁移是将数据、索引和配置从一个 Elasticsearch 集群转移到另一个集群的过程。以下是几种常见的迁移方法：

### <a id="1__Snapshot_and_Restore_10"></a>1. 快照和恢复 (Snapshot and Restore)

这是最推荐的迁移方法，适用于大型数据集。

**步骤：**

1. 在源集群上创建共享文件系统仓库

   
```json
PUT /_snapshot/my_backup
{
  "type": "fs",
  "settings": {
    "location": "/mnt/backups/my_backup"
  }
}
```

2. 创建快照

   
```json
PUT /_snapshot/my_backup/snapshot_1?wait_for_completion=true
{
  "indices": "*",
  "ignore_unavailable": true,
  "include_global_state": false
}
```

3. 将备份文件复制到目标集群可访问的位置
4. 在目标集群上注册相同的仓库
5. 从快照恢复

   
```json
POST /_snapshot/my_backup/snapshot_1/_restore
```


### <a id="2__Elasticsearch_Reindex_API_45"></a>2. 使用 Elasticsearch Reindex API

适用于小规模数据或需要转换数据的迁移。

**步骤：**

1. 在目标集群创建索引（可选，可定义新映射）
2. 使用 reindex 从远程集群拉取数据

   
```json
POST _reindex
{
  "source": {
    "remote": {
      "host": "http://source-cluster:9200"
    },
    "index": "source_index"
  },
  "dest": {
    "index": "dest_index"
  }
}
```


### <a id="3_Logstash__67"></a>3. Logstash 迁移

使用 Logstash 作为数据管道进行迁移。

**示例配置：**


```
input {
  elasticsearch {
    hosts => ["http://source-cluster:9200"]
    index => "source_index"
  }
}
output {
  elasticsearch {
    hosts => ["http://target-cluster:9200"]
    index => "target_index"
  }
}
```


### <a id="4__Elasticsearchdump__87"></a>4. 使用 Elasticsearch-dump 工具

适用于小型索引的迁移。

**安装：**


```bash
npm install elasticdump -g
```


**使用：**


```bash
# 导出映射
elasticdump \
  --input=http://source:9200/my_index \
  --output=my_index_mapping.json \
  --type=mapping

# 导出数据
elasticdump \
  --input=http://source:9200/my_index \
  --output=my_index_data.json \
  --type=data

# 导入到目标集群
elasticdump \
  --input=my_index_mapping.json \
  --output=http://target:9200/my_index \
  --type=mapping

elasticdump \
  --input=my_index_data.json \
  --output=http://target:9200/my_index \
  --type=data
```


### <a id="_122"></a>迁移注意事项

1. **版本兼容性**：确保目标集群版本兼容源集群版本
2. **网络带宽**：大数据量迁移需要考虑网络带宽
3. **停机时间**：根据业务需求规划可能的停机窗口
4. **验证数据**：迁移后务必验证数据完整性和一致性
5. **安全性**：确保迁移过程中的数据传输安全

选择哪种方法取决于您的具体需求、数据量、Elasticsearch 版本和可用资源。

## <a id="_Elasticsearch__134"></a>更多 Elasticsearch 迁移方法

除了之前提到的方法，这里还有几种额外的 Elasticsearch 迁移方案，适用于不同场景：

### <a id="5__CCR__Cross_Cluster_Replication_138"></a>5. 跨集群复制 (CCR - Cross Cluster Replication)

**适用场景**：需要持续同步的迁移或零停机时间迁移

**要求**：

- 需要 Elasticsearch 7.0+ 商业版(白金许可)
- 两个集群必须能够相互通信

**步骤**：

1. 在源集群(leader)上启用 CCR：

   
```json
PUT /_cluster/settings
{
  "persistent": {
    "cluster.remote.remote_cluster.seeds": ["<target_cluster_transport_address>:9300"]
  }
}
```

2. 在目标集群(follower)上创建跟随索引：

   
```json
POST /<index_name>/_ccr/follow
{
  "remote_cluster": "remote_cluster",
  "leader_index": "<index_name>"
}
```

3. 当数据同步完成后，可以停止复制关系

### <a id="10__170"></a>10. 自定义工具迁移

对于特殊需求，可以开发自定义迁移工具：

- **基于Scroll API的批量导出**：

  
```python
from elasticsearch import Elasticsearch, helpers

es_source = Elasticsearch(['source_host'])
es_target = Elasticsearch(['target_host'])

query = {"query": {"match_all": {}}}
scroll_size = 1000

docs = helpers.scan(es_source, index="source_index", query=query, size=scroll_size)
helpers.bulk(es_target, docs, index="target_index")
```

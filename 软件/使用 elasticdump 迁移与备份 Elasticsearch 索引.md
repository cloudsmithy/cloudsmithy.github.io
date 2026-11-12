---
title: 使用 elasticdump 迁移与备份 Elasticsearch 索引
date: '2024-10-12 07:50:54'
updated: '2024-10-12 07:50:54'
abbrlink: 9034aa6e
categories:
- 软件
tags:
- Elasticsearch
- 搜索引擎
description: 使用 elasticdump 复制分析器、映射和数据，导出 JSON 或 gzip 备份，并记录查询过滤、文件拆分和 S3 导入导出方法。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/142867756
source_title: 使用 Elasticsearch Dump 工具进行生产环境到测试环境的数据迁移与备份
---

`es-dump` 是 Elasticsearch 的一个实用工具，专门用于从 Elasticsearch 集群中导出或导入数据，支持数据、映射、别名、模板等多种类型的数据操作。它在数据迁移、备份、恢复等场景中非常实用。本文将展示如何使用 `es-dump` 工具执行生产到测试环境的索引复制，以及备份数据到本地文件或云存储服务中。

#### <a id="1__2"></a>1. 复制索引从生产到测试环境

在某些情况下，我们需要将生产环境中的 Elasticsearch 索引迁移到测试环境。可以通过以下步骤将生产环境中的分析器、映射和数据导出并导入到测试环境中。

##### <a id="_6"></a>导出并导入分析器：


```bash
elasticdump \
  --input=http://production.es.com:9200/my_index \
  --output=http://staging.es.com:9200/my_index \
  --type=analyzer
```


##### <a id="_15"></a>导出并导入映射：


```bash
elasticdump \
  --input=http://production.es.com:9200/my_index \
  --output=http://staging.es.com:9200/my_index \
  --type=mapping
```


##### <a id="_24"></a>导出并导入数据：


```bash
elasticdump \
  --input=http://production.es.com:9200/my_index \
  --output=http://staging.es.com:9200/my_index \
  --type=data
```


通过上述命令，你可以完整地将生产环境的 `my_index` 复制到测试环境的 `my_index` 中，包含索引的分析器、映射和数据。

#### <a id="2__35"></a>2. 备份索引到文件

在进行索引备份时，可以将索引的映射和数据导出到本地文件中，以便稍后进行恢复。

##### <a id="_JSON__39"></a>备份索引映射到 JSON 文件：


```bash
elasticdump \
  --input=http://production.es.com:9200/my_index \
  --output=/data/my_index_mapping.json \
  --type=mapping
```


##### <a id="_JSON__48"></a>备份索引数据到 JSON 文件：


```bash
elasticdump \
  --input=http://production.es.com:9200/my_index \
  --output=/data/my_index.json \
  --type=data
```


#### <a id="3__gzip__57"></a>3. 使用 `gzip` 压缩备份

如果索引数据量较大，建议通过压缩方式来备份数据。以下命令将数据备份到 `gzip` 压缩文件中：


```bash
elasticdump \
  --input=http://production.es.com:9200/my_index \
  --output=$ \
  | gzip > /data/my_index.json.gz
```


#### <a id="4__68"></a>4. 查询数据备份

在某些情况下，你可能只需要备份符合特定查询条件的数据。可以使用 `searchBody` 参数来指定查询条件：

##### <a id="_72"></a>备份查询结果到文件：


```bash
elasticdump \
  --input=http://production.es.com:9200/my_index \
  --output=query.json \
  --searchBody='{"query":{"term":{"username": "admin"}}}'
```


#### <a id="5__81"></a>5. 拆分备份文件

对于大规模索引，可以将数据拆分成多个部分进行备份。使用 `fileSize` 参数来限制每个文件的大小：


```bash
elasticdump \
  --input=http://production.es.com:9200/my_index \
  --output=/data/my_index.json \
  --fileSize=10mb
```


#### <a id="6__92"></a>6. 云存储上的导入导出

有时你可能需要将数据导入或导出到云存储（如 S3 或 Minio）中。`elasticdump` 也支持这种操作。

##### <a id="_S3__Elasticsearch_96"></a>从 S3 导入数据到 Elasticsearch：


```bash
elasticdump \
  --s3AccessKeyId "${access_key_id}" \
  --s3SecretAccessKey "${access_key_secret}" \
  --input "s3://${bucket_name}/${file_name}.json" \
  --output=http://production.es.com:9200/my_index
```


##### <a id="_Elasticsearch__S3_106"></a>将数据从 Elasticsearch 导出到 S3：


```bash
elasticdump \
  --s3AccessKeyId "${access_key_id}" \
  --s3SecretAccessKey "${access_key_secret}" \
  --input=http://production.es.com:9200/my_index \
  --output "s3://${bucket_name}/${file_name}.json"
```


#### <a id="7__CSV__Elasticsearch_116"></a>7. 使用 CSV 数据导入 Elasticsearch

你也可以将 CSV 文件中的数据导入到 Elasticsearch 中。以下命令展示了如何处理 CSV 文件的导入：


```bash
elasticdump \
  --input "csv:///data/cars.csv" \
  --output=http://production.es.com:9200/my_index \
  --csvSkipRows 1 \
  --csvDelimiter ";"
```


这里的 `--csvSkipRows` 参数用于跳过 CSV 文件中的指定行，`--csvDelimiter` 用于定义 CSV 文件的列分隔符。

`elasticdump` 提供了强大的导入导出功能，帮助用户轻松地进行数据备份、恢复、索引迁移等操作。无论是将索引从生产环境迁移到测试环境，还是将数据备份到本地文件或云存储中，`elasticdump` 都能为你提供灵活的解决方案。

通过合理使用这些功能，你可以显著提高 Elasticsearch 集群的维护和管理效率，确保数据的安全性与可用性。

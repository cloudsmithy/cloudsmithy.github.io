# OpenSearch ISM 索引轮换策略笔记

- URL: https://blog.no-claw.com/4ea76b9/
- 日期: 2025-05-04
- 分类: 软件 / AWS
- 标签: AWS, 搜索引擎, OpenSearch

[AWS 实战与学习笔记：系列目录](/series/aws/)

通过以下请求方法创建一个名为 “tiered-storage-policy” 的 ISM policy：

PUT _plugins/_ism/policies/tiered-storage-policy

```json
{
  "policy": {
    "description": "Changes replica count and deletes.",
    "schema_version": 1,
    "default_state": "current",
    "states": [{
        "name": "current",
        "actions": [],
        "transitions": [{
          "state_name": "old",
          "conditions": {
            "min_index_age": "7d"
          }
        }]
      },
      {
        "name": "old",
        "actions": [{
          "replica_count": {
            "number_of_replicas": 0
          }
        }],
        "transitions": [{
          "state_name": "delete",
          "conditions": {
            "min_index_age": "21d"
          }
        }]
      },
      {
        "name": "delete",
        "actions": [{
          "delete": {}
        }],
        "transitions": []
      }
    ]
  }
}
```

创建策略后，请将它附加到一个或多个索引：

```json
POST _plugins/_ism/add/my-index
{
  "policy_id": "my-policy-id"
}
``
```

# Easysearch 索引关闭与重开全攻略：open close 操作、批量处理及防误操作配置

- URL: https://blog.no-claw.com/af48f3e/
- 日期: 2025-06-24
- 分类: 极限科技 / Easysearch
- 标签: 极限科技, Easysearch, 搜索引擎

在 Easysearch（兼容 Elasticsearch 的搜索引擎）中，索引是存储和查询的基本单元。默认情况下，索引是处于 `open` 状态的，可以正常写入和搜索。当你暂时不使用某些索引，但又不想删除它们时，可以通过 `close` 操作来关闭索引，从而释放部分内存资源。

---

## 📊 查看索引状态

使用以下命令可以查看当前集群中所有索引的状态：

```bash
GET _cat/indices?v
```

创建一个索引并插入数据：

```bash
POST abc/_doc
{
  "a": 1
}
```

此时你会看到索引 `abc` 已创建，并处于 `open` 状态：

[图：索引 open 状态]

默认每个索引有 1 个主分片、1 个副本分片，且为可读写状态。

---

## 🔒 关闭索引

如果你暂时不需要某个索引，又不希望删除它，可以将其关闭：

```bash
POST abc/_close
```

返回结果：

```json
{
  "acknowledged": true,
  "shards_acknowledged": true,
  "indices": {
    "abc": {
      "closed": true
    }
  }
}
```

---

## 🚫 关闭后的行为限制

关闭索引后，不仅不能写入，**连搜索都无法进行**。

### 🔍 搜索已关闭索引（403 错误）

```bash
GET abc/_search
```

返回：

```json
{
  "error": {
    "type": "cluster_block_exception",
    "reason": "index [abc] blocked by: [FORBIDDEN/4/index closed];"
  },
  "status": 403
}
```

[图：关闭后搜索报错]

---

### 📝 写入已关闭索引（400 错误）

```bash
POST abc/_doc
{
  "a": 2
}
```

返回：

```json
{
  "error": {
    "type": "index_closed_exception",
    "reason": "closed",
    "index": "abc"
  },
  "status": 400
}
```

[图：关闭后写入报错]

---

## ✳️ 批量关闭索引（支持通配符）

```bash
POST ab*,test/_close
```

返回结果：

```json
{
  "acknowledged": true,
  "shards_acknowledged": true,
  "indices": {
    "test": { "closed": true },
    "abd": { "closed": true },
    "abc": { "closed": true }
  }
}
```

[图：批量关闭成功]

确认索引状态：

```bash
GET _cat/indices?v
```

[图：索引已关闭]

---

## 🔓 重新打开索引

当需要重新启用这些索引时：

```bash
POST */_open
```

返回：

```json
{
  "acknowledged": true,
  "shards_acknowledged": true
}
```

[图：打开索引成功]

---

## ⚙️ 禁止关闭索引的集群配置

有些场景中（如运营平台防止误操作），管理员可能会**禁止索引关闭操作**。设置如下：

```json
PUT _cluster/settings
{
  "persistent": {
    "cluster.indices.close.enable": false
  }
}
```

返回结果表示设置已生效：

```json
{
  "acknowledged": true,
  "persistent": {
    "cluster": {
      "indices": {
        "close": {
          "enable": "false"
        }
      }
    }
  },
  "transient": {}
}
```

[图：设置禁止关闭索引]

---

## 🧯 禁止后关闭索引会报错

再次尝试关闭索引时，将返回如下错误信息：

```json
{
  "error": {
    "root_cause": [
      {
        "type": "illegal_state_exception",
        "reason": "closing indices is disabled - set [cluster.indices.close.enable: true] to enable it. NOTE: closed indices still consume a significant amount of diskspace"
      }
    ],
    "type": "illegal_state_exception",
    "reason": "closing indices is disabled - set [cluster.indices.close.enable: true] to enable it. NOTE: closed indices still consume a significant amount of diskspace"
  },
  "status": 500
}
```

---

## 🔍 如何确认关闭被禁用？

执行：

```bash
GET _cluster/settings
```

结果会包含：

```json
{
  "persistent": {
    "cluster": {
      "indices": {
        "close": {
          "enable": "false"
        }
      }
    },
    "index_state_management": {
      "template_migration": {
        "control": "-1"
      }
    },
    "rollup": {
      "search": {
        "enabled": "true"
      },
      "hours_before": "24"
    }
  },
  "transient": {}
}
```

---

## ✅ 总结

| 操作                   | 是否支持                                      | 条件                                           |
| ---------------------- | --------------------------------------------- | ---------------------------------------------- |
| `POST /<index>/_close` | ✅ 默认支持                                   | 除非设置 `cluster.indices.close.enable: false` |
| `POST /<index>/_open`  | ✅ 总是支持                                   | 无需额外开启                                   |
| `POST ab*/_close`      | ✅ 支持批量关闭                               | 同上                                           |
| 查看关闭限制配置       | `GET _cluster/settings?include_defaults=true` |                                                |

关闭索引适用于资源控制、调试排查等场景，但要注意：**关闭索引仍会占用磁盘空间，不会释放存储**，仅仅是节省内存和 CPU 资源。

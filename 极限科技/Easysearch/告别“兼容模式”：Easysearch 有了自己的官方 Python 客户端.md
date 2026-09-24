---
title: 告别“兼容模式”：Easysearch 有了自己的官方 Python 客户端
date: '2026-05-06 21:00:27'
updated: '2026-05-06 21:00:27'
abbrlink: d4422b76
description: 介绍 Easysearch 官方 Python 客户端的安装、连接、证书配置、批量写入、查询与聚合用法。
categories:
- 极限科技
- Easysearch
tags:
- Easysearch
- 搜索引擎
- Python
toc: true
source_platform: csdn
source_url: https://blog.csdn.net/weixin_38781498/article/details/160832916
source_title: 告别“兼容模式“：Easysearch 有了自己的官方 Python 客户端
---

用过 Easysearch 的 Python 开发者大概都经历过同一个小尴尬：明明用的是 Easysearch，requirements.txt 里却得写着 `elasticsearch==7.10.1`。兼容是兼容，但心里总觉得有点别扭——版本锁死、包名错位、新特性跟不上。

现在，这个问题被官方解决了。INFINI Labs 上线了官方 Python 客户端 [easysearch-py](https://github.com/infinilabs/easysearch-py)，包名就叫 `easysearch`，Apache 2.0 协议开源。**不用再靠 `elasticsearch-py` 的兼容模式连 Easysearch 了**。

### <a id="t0"></a><a id="_5"></a>它是什么

easysearch-py 基于 `elasticsearch-py 7.10.1` 衍生，由 INFINI Labs 开发。换句话说：**API 你已经会用了**，迁移成本几乎为零，只是导入路径和维护方变了。

官方建议：

- **新项目**：直接用 `easysearch`
- **老项目**：继续用 `elasticsearch==7.10.1` 兼容连接也没问题，两者 API 调用方式完全一致

### <a id="t1"></a><a id="3__14"></a>3 分钟上手

#### <a id="t2"></a><a id="_16"></a>安装



```bash
pip install easysearch
```



需要 async/await 支持的：



```bash
pip install "easysearch[async]"
```



#### <a id="t3"></a><a id="_28"></a>建立连接



```python
from easysearch import Easysearch

es = Easysearch(
    ["https://localhost:9200"],
    http_auth=("admin", "your_password"),
    verify_certs=False,      # 开发环境；生产请配置 CA 证书
    timeout=30,
    max_retries=3,
    retry_on_timeout=True,
)

print(es.info())
```



生产环境推荐用 CA 证书：



```python
from ssl import create_default_context

context = create_default_context(cafile="/path/to/root-ca.pem")
es = Easysearch(
    ["https://easysearch-host:9200"],
    ssl_context=context,
    http_auth=("admin", "your_password"),
    timeout=30,
)
```



#### <a id="t4"></a><a id="_59"></a>写入与搜索



```python
# 单条写入
es.index(index="articles", id=1, body={
    "title": "Easysearch 入门",
    "content": "分布式搜索引擎快速上手",
    "tags": ["搜索", "教程"],
    "views": 100,
})

# 全文搜索
resp = es.search(index="articles", body={
    "query": {"match": {"title": "Easysearch"}}
})
for hit in resp["hits"]["hits"]:
    print(f'{hit["_score"]:.2f}  {hit["_source"]["title"]}')
```



#### <a id="t5"></a><a id="_78"></a>批量写入



```python
from easysearch.helpers import bulk

actions = [
    {"_index": "articles", "_id": i, "_source": {"title": f"文章 {i}", "views": i * 10}}
    for i in range(2, 102)
]
success, errors = bulk(es, actions)
print(f"成功写入 {success} 条")
```



#### <a id="t6"></a><a id="Bool__91"></a>Bool 组合查询与聚合



```python
# 组合查询
es.search(index="articles", body={
    "query": {
        "bool": {
            "must":   [{"match": {"title": "文章"}}],
            "filter": [{"range": {"views": {"gte": 500}}}],
        }
    },
    "sort": [{"views": "desc"}],
    "size": 5,
})

# 聚合
es.search(index="articles", body={
    "size": 0,
    "aggs": {
        "tag_count": {"terms": {"field": "tags.keyword"}},
        "avg_views": {"avg": {"field": "views"}},
    },
})
```



### <a id="t7"></a><a id="_116"></a>用了它有什么好处

对从 `elasticsearch-py` 过来的同学，感知最明显的是这几点：

1. **包名对得上。** 用的是 Easysearch，`import` 自然应该是 `easysearch`，语义清晰，读代码的人一眼就懂。
2. **不用再锁死 `7.10.1`。** Elastic 官方客户端在新版本里加入了严格的服务端版本校验，连非 Elastic 发行版会告警甚至拒连；官方客户端彻底绕过这个问题。
3. **特性同步及时。** Easysearch 有自己的增强（压缩、审计、国密、跨集群复制等），官方客户端能第一时间跟进，不用等上游项目。
4. **自主可控。** 由 INFINI Labs 维护，中文社区响应快，合规场景下也更踏实。

其他继承自上游的能力也一个不少：自动节点发现、持久连接、负载均衡、失败惩罚、SSL、HTTP 认证、线程安全、插件化架构。

### <a id="t8"></a><a id="_127"></a>什么场景该用

- **从 Elasticsearch 迁移到 Easysearch 的项目**：换个 `import`、调一下连接串就能跑，业务代码几乎不动。
- **金融、政企等合规敏感环境**：Easysearch 默认安全模式 + 国密支持，Python 侧只管调用。
- **AI / RAG 应用的检索层**：关键词检索 + 向量检索混合方案下，有一个顺手的 Python 客户端能省掉不少胶水代码。
- **日志、商品、站内搜索等常规场景**：资源占用比原生 ES 更友好，Python 开发体验一致。

### <a id="t9"></a><a id="_134"></a>一点小建议

- 生产环境别偷懒开 `verify_certs=False`，老老实实配 CA。
- `Easysearch` 实例线程安全，进程里复用一个就行。
- 高吞吐写入走 `bulk`，别一条条 `index`。
- 写完立刻查的场景记得 `refresh="wait_for"`，避开近实时的"坑"。

### <a id="t10"></a><a id="_141"></a>结语

一个生态成熟不成熟，看它有没有自己的一等公民客户端就能感受出来。easysearch-py 的发布，对 Python 生态里用 Easysearch 的人来说是一个迟到但重要的信号：**你不用再把自己伪装成 Elasticsearch 的用户了**。

项目地址：<https://github.com/infinilabs/easysearch-py>，欢迎 Star、提 Issue、贡献 PR。

---

*相关链接：*

- *官方仓库：https://github.com/infinilabs/easysearch-py*
- *Easysearch 产品页：https://infinilabs.cn/products/easysearch/*

---
title: Milvus Workshop Web 版上线：4 万 Star 项目的官方实战教程，在手机上也能直接学了.md
tags: 向量数据库
toc: true
categories: Milvus
date: 2025-12-12 00:00:00
---
Milvus 作为全球最受欢迎的开源向量数据库，GitHub Star 数已突破 **4 万**。

向量数据库已经成为 AI 应用的核心基础设施。RAG 需要它存储知识库，Agent 需要它实现记忆，推荐系统需要它计算相似度，多模态搜索需要它做特征检索。从实验室到生产环境，向量检索已经是 AI 应用的标配能力。

但从入门到真正用好 Milvus，这条路并不短。

分布式架构需要理解——Proxy、Coord、Node 各司其职，一条查询请求在系统内部如何流转？Schema 怎么设计、Chunk 策略怎么选、混合搜索怎么配？与 LangChain、LangGraph 怎么集成？生产环境更是另一个战场——内存优化、写入调优、慢查询排查，每一个都是实打实的工程问题。

为了系统性地解决这些问题，我们整理了这份 **《Milvus Workshop：从入门到应用》**。

这份教程已经在多场线下 Workshop 中经过验证，帮助数百位开发者快速上手 Milvus。现在，我们上线了网页版——打开浏览器就能学，手机、平板、电脑无缝切换。
<!-- more -->
### 这份教程适合谁？

- **向量数据库新手**：想系统入门，建立完整的知识体系
- **RAG/Agent 开发者**：需要将 Milvus 集成到项目中，希望少走弯路
- **准备上生产的团队**：开发环境已经跑通，需要了解生产环境的注意事项
- **想深入理解 Milvus 底层的工程师**：不满足于会用 API，想搞清楚底层原理

### Web 版上线：降低学习门槛

之前这份教程只有 GitHub 仓库版本，需要 clone 下来用 Jupyter 打开。代码能跑，但阅读体验受限，尤其在移动端几乎无法使用。

现在我们用 GitHub Actions 自动构建了 Web 版本：

- **零配置访问**：无需 clone 仓库，无需配置 Python/Jupyter 环境，浏览器直接阅读
- **移动端适配**：响应式设计，手机、平板、电脑无缝切换
- **自动同步更新**：仓库更新后网站自动重新构建

通勤时间看架构原理，工作时间跑代码实操，学习效率显著提升。

### 教程结构

整个 Workshop 分为四大模块，每章都以 Jupyter Notebook 格式呈现，所有代码可直接运行。同时也有对应的 Web 版本。

👉 **想直接开始？** [点击这里打开教程](https://airag.click/milvus-workshop/)

### Part 1：核心概念与架构原理

#### 1.1 向量数据库的本质

传统数据库擅长精确匹配：给定 ID 查记录，给定条件筛数据。但面对"哪些数据与这个最相似"这类问题，传统方案力不从心。

向量嵌入（Vector Embedding）将语义转化为数学表示。通过 Embedding 模型（如 BGE、E5、OpenAI text-embedding-3 等），文本、图片、音频等非结构化数据被映射为高维向量。语义相近的内容，向量空间中的距离也相近。

向量数据库的核心任务：**在海量向量中高效检索最相似的 Top-K 结果**。

精确的最近邻搜索需要遍历所有向量，数据量越大查询越慢，无法满足大规模数据的性能要求。ANN（Approximate Nearest Neighbor）通过构建索引结构，以可接受的精度损失换取数量级的性能提升。

#### 1.2 索引类型对比

| 索引类型 | 技术特点 | 适用场景 |
|---------|---------|---------|
| FLAT（暴力搜索） | 精度 100%，无近似误差 | 小数据量、精度要求极高 |
| IVF 系列（IVF_FLAT / IVF_SQ8 / IVF_PQ） | 聚类分桶，量化压缩 | 中等精度、中等吞吐 |
| HNSW | 多层图结构，低延迟 | 高吞吐 + 高召回场景，适合推荐、搜索 |
| DiskANN | 基于图的磁盘索引 | 大数据量，有限内存场景，牺牲部分延迟 |
| GPU_IVF 系列 | GPU 加速版 IVF | 高吞吐、高并发场景，极致性能优化 |
| BIN_FLAT / BIN_IVF_FLAT | 二进制向量支持 | 文本、音频哈希类场景 |

IVF 系列是经典的聚类索引，通过将向量分桶实现快速检索，配合量化压缩可显著降低内存占用。HNSW 基于 Hierarchical Navigable Small World 图结构，查询性能优异，是当前最流行的索引类型之一。DiskANN 则适合内存受限但数据量大的场景，是性价比之选。

#### 1.3 Milvus 分布式架构

Milvus 采用存储计算分离的云原生架构，分为四层：

**Access Layer**：Proxy 节点负责接收请求、参数校验、路由分发。无状态设计，支持水平扩展。

**Coordinator Layer**：集群协调中心，包含四个组件：
- Root Coord：管理集群拓扑、DDL 操作、时间戳分配
- Data Coord：协调数据写入流程，管理 Segment 分配
- Query Coord：管理查询负载均衡，决定数据加载策略
- Index Coord：调度索引构建任务

**Worker Layer**：执行层节点：
- Data Node：处理数据写入和持久化
- Query Node：加载数据和索引，执行搜索查询
- Index Node：执行索引构建任务

**Storage Layer**：
- Meta Storage：etcd 存储元数据
- Log Broker：Pulsar/Kafka 作为 WAL
- Object Storage：MinIO/S3 存储数据文件

Milvus 2.6 引入了 Streaming Node，专门处理实时数据流，进一步优化写入性能。

理解这套架构，对后续的问题排查和性能调优至关重要。

### Part 2：Python SDK 实战

#### 2.1 Schema 设计要点

创建 Collection 时的关键决策：

- **主键类型**：Int64 或 VarChar，是否启用 auto_id
- **向量维度**：取决于 Embedding 模型（BGE-M3 1024，OpenAI text-embedding-3-small 1536，E5-large 1024）
- **标量字段**：确定哪些属性需要用于过滤查询

Schema 设计直接影响后续的查询效率和灵活性，建议在编码前充分规划。

#### 2.2 HNSW 索引参数

三个关键参数：

- **M**：每个节点的最大连接数，通常取 8-64，越大召回率越高但内存占用也越大
- **efConstruction**：构建时的搜索宽度，通常取 100-500，越大索引质量越好但构建时间越长
- **ef**：查询时的候选集大小，越大召回率越高但查询越慢

参数配置对性能影响显著，建议通过基准测试确定最优值。

#### 2.3 搜索方式

**向量搜索**：

```python
results = collection.search(
    data=[query_vector],
    anns_field="embedding",
    search_params={"metric_type": "COSINE", "params": {"ef": 64}},
    limit=10,
    output_fields=["title", "content"]
)
```

**带标量过滤的搜索**：

```python
results = collection.search(
    data=[query_vector],
    anns_field="embedding",
    search_params={"metric_type": "COSINE", "params": {"ef": 64}},
    limit=10,
    filter="category == 'tech' and publish_date > '2024-01-01'",
    output_fields=["title", "content"]
)
```

**混合搜索**：Milvus 2.4+ 支持同时使用稠密向量和稀疏向量（BM25），结合语义相似性和关键词匹配，通常能获得更好的检索效果。

### Part 3：应用场景实战

#### 3.1 跨模态图片搜索

CLIP 模型能够将图片和文本映射到同一向量空间，实现跨模态检索。

实现流程：
1. 离线阶段：使用 CLIP 图像编码器将图片库转换为向量，存入 Milvus
2. 在线阶段：用户输入文本描述，使用 CLIP 文本编码器生成向量，检索最相似的图片

教程提供完整代码，涵盖模型加载、批量处理、检索实现。

#### 3.2 RAG 检索增强生成

RAG 是当前最主流的 LLM 应用模式，核心思路：**先检索相关知识，再基于检索结果生成回答**。

完整流程：

1. **文档分块**：将长文档切分为 500-1000 字符的片段
2. **向量化**：使用 Embedding 模型将每个片段转换为向量
3. **存储**：将向量和原文存入 Milvus
4. **检索**：用户提问时，将问题向量化，检索最相关的片段
5. **生成**：将检索结果作为上下文，由 LLM 生成回答

以下是 LangChain 集成示例：

```python
# 检索相关文档
docs = vectorstore.similarity_search(query, k=5)

# 构建上下文
context = "\n".join([doc.page_content for doc in docs])
prompt = f"基于以下内容回答问题：\n{context}\n\n问题：{query}"

# 生成回答
response = llm.invoke(prompt)
```

关键优化点：

- **Chunk 策略**：片段过小会丢失上下文，过大会引入噪音
- **Embedding 模型选择**：BGE、E5、OpenAI text-embedding-3 各有特点，需根据场景选择
- **混合搜索**：结合稠密向量和 BM25 稀疏向量，提升专有名词和关键词的检索效果
- **Rerank**：使用 Cross-Encoder 对初筛结果重排序，进一步提升相关性

教程使用 LangChain 实现完整流程，并详细讨论这些优化策略。

#### 3.3 AI Agent 记忆系统

Agent 的三大核心能力：规划（Planning）、记忆（Memory）、工具（Tools）。Milvus 在记忆系统中发挥关键作用。

**短期记忆**：当前会话的上下文信息，支持对话过程中的信息检索。

**长期记忆**：历史对话、执行经验、学习成果的持久化存储。遇到相似场景时，Agent 可以检索相关记忆，做出更优决策。

```python
# 存储对话记忆
memory_vector = embedding_model.encode(conversation_summary)
collection.insert({
    "vector": memory_vector,
    "content": conversation_summary,
    "timestamp": datetime.now().isoformat(),
    "type": "conversation"
})

# 检索相关记忆
relevant_memories = collection.search(
    data=[current_query_vector],
    anns_field="vector",
    limit=5,
    filter="type == 'conversation'"
)
```

教程使用 LangGraph 实现带记忆功能的 Agent，演示记忆的存储、检索和应用。

### Part 4：生产环境运维

#### 4.1 可观测性方案

Milvus 原生支持 Prometheus 指标暴露。教程提供完整的可观测性方案：

- Prometheus：采集各组件指标
- Loki：日志收集
- Jaeger：分布式链路追踪
- Grafana：可视化仪表盘

提供开箱即用的 Dashboard JSON，涵盖 QPS、延迟、内存使用、Segment 状态等关键指标。

#### 4.2 性能基准测试

VectorDBBench 是 Zilliz 开源的向量数据库基准测试工具。上线前建议进行完整的性能测试，了解系统的 QPS 上限和延迟分布。

#### 4.3 性能调优指南

**内存优化**：
- 调整 `dataNode.segment.maxSize` 控制 Segment 大小
- 使用 IVF_PQ 等压缩索引减少内存占用
- 按需 Load Partition，避免加载不必要的数据

**写入优化**：
- 批量插入，每批 1000-10000 条
- 大数据量场景使用 Bulk Import
- 合理配置 `dataNode.flush.insertBufSize`

**查询优化**：
- 根据数据规模选择合适的索引类型和参数
- 优化标量过滤条件，避免全表扫描
- 合理使用 Partition 缩小查询范围

#### 4.4 版本升级

教程包含 Milvus 2.5 到 2.6 的升级指南，涵盖升级步骤和注意事项。

### 获取方式

| | 传统方式 | Web 版 |
|---|---|---|
| 环境要求 | Git + Python + Jupyter | 浏览器 |
| 移动端体验 | 受限 | 完整支持 |
| 内容更新 | 手动 pull | 自动同步 |

📖 **在线阅读**：[https://airag.click/milvus-workshop/](https://airag.click/milvus-workshop/)

💻 **GitHub 仓库**：[https://github.com/richzw/milvus-workshop](https://github.com/richzw/milvus-workshop)

教程提供中英双语版本，欢迎 Star ⭐ 支持。我们将持续更新更多实战案例和最佳实践。

向量数据库的时代已经到来。无论是入门学习还是生产实践，这份教程都能提供有价值的参考。

Happy hacking 🚀

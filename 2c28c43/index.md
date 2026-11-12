# 从零到用：RSS 接入 Coco-AI 实战指南

- URL: https://blog.no-claw.com/2c28c43/
- 日期: 2025-08-10
- 分类: 极限科技 / Coco AI
- 标签: 极限科技, Coco AI, AI

最近 Coco-AI 上线了几个新功能：**S3 连接器、本地文件连接器、RSS 连接器**。我会逐一介绍，本篇先重点讲 RSS 连接器的接入方法。

### 一、安装 Coco Server

使用 Docker 部署是最省心的方式。

#### 方式 1：映射数据目录（推荐）

```bash
docker run -d \
  --name cocoserver \
  -p 9000:9000 \
  -v data:/app/easysearch/data \
  -v config:/app/easysearch/config \
  -v logs:/app/easysearch/logs \
  infinilabs/coco:0.7.1-2426
```

#### 方式 2：快速测试（不映射目录）

```bash
docker run -d \
  --name cocoserver \
  -p 9000:9000 \
  infinilabs/coco:0.7.1-2426
```

> 测试环境可以用方式 2，生产环境建议使用方式 1，避免数据丢失。

### 二、模型配置

创建完用户后，我直接设置了 **Ollama** 作为模型提供商：

- 地址：`http://localhost:11434`
- 模型：`deepseek-r1:7b`

[图：设置模型]

在「模型提供商」界面可以看到默认开启的 **Coco AI**，它会直接调用我配置的 Ollama，也支持其他兼容 OpenAI API 的 LLM。

[图：模型提供商]

[图：Coco AI 设置]

---

### 三、数据源概览

Coco-AI 默认植入了官方文档和 Hacker News 数据源，这次新增了三类连接器：

[图：8cab32aeab3b966b11d0370372982415]

- S3 连接器
- 本地文件连接器
- RSS 连接器（本篇重点）

[图：数据源连接器]

---

### 四、添加 RSS 连接器

1. 选择 **RSS 连接器**
2. 输入 RSS 地址（这里我用的是我的博客）：

   ```
   https://airag.click/atom.xml
   ```

3. 刷新时间设为 **1 分钟**（默认即可）

[图：7f43ba7ea73c6285c040f62ddf8e1359]
添加完成后可以看到我同时接入了 S3、本地文件和 RSS：

[图：连接器列表]

### 五、小插曲：RSS 条目数量限制

一开始我发现 Coco-AI 只能显示 **最近 20 条**，以为是 Coco Server 的限制，后来群友提醒才发现是 **RSS 服务端设置**的问题。

在博客服务端调整配置后，RSS 就能显示 **全部文章** 了。虽然很多 RSS 只显示最近内容，但其实可以通过配置让它输出完整数据。

[图：RSS 配置]

---

### 六、在 Coco App 中查看数据源

登录 Coco App 后，可以看到刚才添加的 S3、本地文件和 RSS 数据源：

[图：Coco App 数据源]

---

### 七、搜索效果

使用 Coco-AI 搜索时，能快速检索到 RSS 中的内容，效果比博客自带的好很多：

[图：搜索结果]

点击搜索结果可直接跳转到博客文章。我用的是 **Hexo 主题**，其他 RSS 源也一样适用。

[图：文章跳转]

### 总结

通过 RSS 连接器，Coco-AI 可以实时抓取和索引博客内容，并与本地文件、S3 数据等统一搜索，非常适合做多源聚合知识库。

如果 RSS 输出有限，可以调整博客端的 RSS 配置，让它输出更多历史内容，发挥 Coco-AI 检索的最大价值。

---
title: Amazon Bedrock 基础模型初体验
date: '2024-08-18 16:11:33'
updated: '2024-08-19 10:20:29'
abbrlink: fd6e8ce3
categories:
- 软件
- AWS
tags:
- AWS
- Bedrock
- AI
- LLM
description: 记录在 Amazon Bedrock 中尝试文本生成、图片生成、模型评估和 Guardrails 的过程，保留当时的模型选择与界面。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/141299651
source_title: 多模一站通 —— Amazon Bedrock 上的基础模型初体验
---

[AWS 实战与学习笔记：系列目录](/series/aws/)


Amazon Bedrock 是一项完全托管的服务，通过统一的 API 提供来自 AI21 Labs、Anthropic、Cohere、Meta、Mistral AI、Stability AI 和 Amazon 等领先 AI 公司的高性能基础模型（FMs），同时提供广泛的功能，让您能够在确保安全、隐私和负责任 AI 的前提下构建生成式 AI 应用。

#### <a id="_1"></a>模型探索与应用

![Amazon Bedrock 基础模型初体验配图](/images/migrated/cfa31b0eb670ea570bc1.png)

为了确保模型的高效使用，建议优先选择美国区域，这样可以获取更多的模型选项，并且在请求模型时，可以方便地查看其访问状态。

![模型访问状态](/images/migrated/00ca015ec990fb8d0f99.png)

##### <a id="Amazon_Bedrock__8"></a>Amazon Bedrock 概览

Amazon Bedrock 提供了丰富的功能，助力开发者和企业在构建智能应用时更加高效。通过使用 Bedrock，您可以：

1. **轻松测试与评估**：快速了解您的用例在不同基础模型下的表现；
2. **定制化开发**：利用微调和检索增强生成（RAG）等技术，打造符合需求的应用程序；
3. **智能代理构建**：开发可以与企业系统和数据源无缝集成的智能代理，自动执行各种任务；
4. **模型评估**：通过自动或手动评估功能，对比不同模型，选择最适合您需求的基础模型。评估指标涵盖准确性、稳健性以及有害内容筛查等；
5. **安全防护**：利用 Guardrails，根据应用需求和负责任的人工智能政策，定制安全保障措施，确保输入和输出内容的安全。

![Bedrock 模型](/images/migrated/5a8efc93e72e41145b53.png)

目前，Bedrock 已经托管了最新的 Llama 3.1 模型，包含 8B 和 70B 版本，同时也支持最新的 Mistral Large 模型。

##### <a id="_22"></a>文本生成

考虑到 Meta 的模型在中文处理上的表现不佳，因此本文选择了 Mistral AI 的 Large 模型来进行文本生成。该模型在中文生成方面表现出色，能够大幅提升生成效果。

![文本生成](/images/migrated/ce749d5faea337ef9514.png)

此外，使用大模型进行代码生成也是一大优势，它可以帮助我们节省大量的调试时间。

![代码生成](/images/migrated/b5268d3cb777b4d3e718.png)

##### <a id="_32"></a>图片生成

在图片生成方面，您可以使用 Stable Diffusion XL - SDXL 1.0 或 Titan Image Generator G1。我选择了 Titan Image Generator G1 来生成一些示例图片，默认生成的是横向的 1024x1024 分辨率图像。

![图片生成](/images/migrated/febe7611fe0d81d73648.png)  
生成图片需要一些时间，但结果展示了 AI 帮助我们实现的“鸟语花香”美景。

##### <a id="_39"></a>模型评估

如前所述，您可以选择自动评估或手动评估模型的表现，以确保其符合项目需求。

![模型评估](/images/migrated/0fc55dcef1d441de864c.png)

##### <a id="_45"></a>安全防护机制

在安全防护方面，您可以手动设置模型拒绝特定回答的关键词。例如，我在此处设置了“彩票”、“中奖”和“恭喜”作为屏蔽词，并阻止模型回答涉及 PII（个人身份信息）的请求，如姓名等。

![关键词屏蔽](/images/migrated/139285f0e2882ebf6457.png)

在另一个评估规则中，我将“Name”规则设置为“Mask”，因此，模型在回答涉及特定姓名时会用替代词替换。例如，马斯克的名字已被遮盖。

![名字遮蔽](/images/migrated/a9a7a293cf71c70d1fae.png)

对于检测到的屏蔽关键词，模型还会给出拒绝回答的提示，如“就不告诉你~”。

![拒绝回答](/images/migrated/7a6ab86043df481035bf.png)  
![Amazon Bedrock 基础模型初体验配图](/images/migrated/6f336fdc5ae1698d80ec.png)

#### <a id="_61"></a>结语

通过合理选择模型并进行安全性设置，Amazon Bedrock 为我们提供了强大的工具，助力开发智能、安全、负责任的 AI 应用。无论是文本生成、图片生成，还是模型评估和安全防护，Bedrock 都能为您的项目提供全面支持。

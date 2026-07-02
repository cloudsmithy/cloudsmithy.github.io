---
title: CodeX 使用Bedrock 模型
description: CodeX 使用Bedrock 模型
tags:
  - AWS
  - Bedrock
toc: true
categories:
  - AWS
abbrlink: e7117226
date: 2026-06-03 08:00:00
---

昨天开始 Bedrock 可以使用，而mantle API终于支持了开源LLM以外的模型。这次的Model 是 no-streaming，在Bedrock的 playground 也看不到。

小伙伴提供了一些测试脚本：

```python
from aws_bedrock_token_generator import provide_token
from openai import OpenAI

client = OpenAI(
    base_url="https://bedrock-mantle.us-east-2.api.aws/openai/v1",
    api_key=provide_token(region="us-east-2"),
)

response = client.responses.create(
    model="openai.gpt-5.5",
    input="你是什么模型啊？",
)

print(response.output_text)

```

如果你是其他区域可能会有这个报错：

openai.NotFoundError: Error code: 404 - {'error': {'code': 'not_found_error', 'message': "The model 'openai.gpt-5.5' does not exist", 'param': None, 'type': 'invalid_request_error'}}
```
vim ~/.codex/config.toml

model_provider = "amazon-bedrock"
model = "openai.gpt-5.5"
model_reasoning_effort = "xhigh"
[model_providers.amazon-bedrock.aws]
# profile = "default"
region = "us-east-2"
```
参考之后：https://developers.openai.com/codex/config-sample

设置之后CodeX APP也能使用了。

![](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/b21401ba6489e2da8eebe1a6bcaa2e57a264e369/image%20(8).png)

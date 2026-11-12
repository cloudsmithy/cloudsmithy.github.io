---
title: Bedrock Converse 调用笔记：DeepSeek R1 与 Claude
date: '2025-05-04 11:59:02'
updated: '2026-09-23'
abbrlink: '6384163b'
categories:
  - 软件
  - AWS
tags:
  - AWS
  - Bedrock
  - LLM
  - Python
description: 用 Boto3 的 Converse API 调用 Bedrock 上的 DeepSeek R1 和 Claude，说明模型 ID、文本响应读取，以及与 InvokeModel 和多轮上下文的关系。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/147693276
source_title: deepseek运行LLM
---

这篇记两段通过 Amazon Bedrock 调用模型的 Python 代码：一个是 DeepSeek R1，一个是 Claude 3 Haiku。它们都使用 `bedrock-runtime` 客户端的 `converse()`，请求里的消息结构相同，模型 ID 和区域不同。

下面保留 2025 年笔记中的模型 ID 和区域。运行前需要安装支持 Converse 的 Boto3、配置 AWS 凭证，并确认账户有对应模型的调用权限。模型是否仍在目标区域提供服务，要以实际可用列表为准。

## 调用 DeepSeek R1

这里的 `us.deepseek.r1-v1:0` 是推理配置文件 ID。把 `user_message` 换成自己的问题。

```python
import boto3
from botocore.exceptions import ClientError

client = boto3.client("bedrock-runtime", region_name="us-west-2")
model_id = "us.deepseek.r1-v1:0"

user_message = "Type_Your_Prompt_Here"
conversation = [
    {
        "role": "user",
        "content": [{"text": user_message}],
    }
]

try:
    response = client.converse(
        modelId=model_id,
        messages=conversation,
        inferenceConfig={"maxTokens": 512, "temperature": 0.5, "topP": 0.9},
    )
    for block in response["output"]["message"]["content"]:
        if "text" in block:
            print(block["text"])
except ClientError as e:
    print(f"ERROR: Can't invoke '{model_id}'. Reason: {e}")
    raise SystemExit(1)
```

原代码中，`response = client.converse(...)` 前多了一层缩进，直接运行会报语法错误。整理时已经修正。返回内容也改成逐块读取 `text`，避免把第一个内容块一定当作文本。

## 调用 Claude

下面是原笔记使用的 Claude 3 Haiku 示例：

```python
import boto3
from botocore.exceptions import ClientError

client = boto3.client("bedrock-runtime", region_name="us-east-1")
model_id = "anthropic.claude-3-haiku-20240307-v1:0"

user_message = "Describe the purpose of a 'hello world' program in one line."
conversation = [
    {
        "role": "user",
        "content": [{"text": user_message}],
    }
]

try:
    response = client.converse(
        modelId=model_id,
        messages=conversation,
        inferenceConfig={"maxTokens": 512, "temperature": 0.5, "topP": 0.9},
    )
    for block in response["output"]["message"]["content"]:
        if "text" in block:
            print(block["text"])
except ClientError as e:
    print(f"ERROR: Can't invoke '{model_id}'. Reason: {e}")
    raise SystemExit(1)
```

两段代码的基本用法一样，但不能据此认为所有模型都接受相同参数。换模型时，需要一起检查模型 ID、区域、支持的推理参数和消息类型。

## Converse 和 InvokeModel 的区别

原笔记把它们简单分成了“单轮请求”和“自动管理多轮上下文”，这个说法不准确。

`InvokeModel` 需要按具体模型要求组织请求体。`Converse` 为支持消息接口的模型提供统一的 `messages`、`system`、`inferenceConfig` 等字段，切换模型时可以复用更多代码。两者都可以用于单轮请求，也都能在模型支持的范围内传入对话历史。

**Converse 不会替应用自动保存前几轮消息。** 要接着问，应用需要保存上一轮的用户消息和模型回复，并在下一次调用时重新传入。例如，在上面的请求成功后：

```python
conversation.append(response["output"]["message"])
conversation.append({
    "role": "user",
    "content": [{"text": "请再举一个简单例子。"}],
})

response = client.converse(
    modelId=model_id,
    messages=conversation,
    inferenceConfig={"maxTokens": 512},
)
```

两种接口也都有流式版本：`InvokeModelWithResponseStream` 和 `ConverseStream`。字段与模型支持范围可以对照 [Converse API 文档](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html) 和 [多轮消息调用说明](https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference-call.html)。

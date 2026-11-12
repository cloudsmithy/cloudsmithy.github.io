---
title: Claude Code 额度不够用？走 Bedrock 账单
description: 记录让 Claude Code 通过 Amazon Bedrock 调用模型的环境变量配置，以及后续使用本地 AWS 凭证的更新。
tags:
  - AWS
  - Bedrock
  - AI
  - LLM
  - AI 编程
toc: true
categories:
  - 软件
  - AWS
abbrlink: 4dbc8277
date: 2026-04-17 00:00:00
---

Claude Code 的限制越来越多了，Amazon Bedrock 提供 Claude 模型，Claude Code 官方支持走 Bedrock 调用，所以我们能够让claude接入Amazon Bedrock，然后从Amazon Web Services走账单。


```
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=us-east-1  # or your preferred region
export AWS_BEARER_TOKEN_BEDROCK=<token>
```

然后重启终端，载入环境变量之后，claude code cli就会根据这个ENV把配置写到配置文件

```
{
  "env": {
    "CLAUDE_CODE_USE_BEDROCK": "1",
    "AWS_REGION": "us-east-1",
    "AWS_BEARER_TOKEN_BEDROCK": <token>
  },
  ....
}
```


然后就可以了，VS Code和Kiro也能安装Claude的插件使用Chat。


6月更新，终于可以读到本地AWS凭证了。

![](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/b21401ba6489e2da8eebe1a6bcaa2e57a264e369/Snipaste_2026-06-03_15-17-27.png)
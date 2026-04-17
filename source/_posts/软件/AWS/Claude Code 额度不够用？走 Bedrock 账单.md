---
title: Claude Code 额度不够用？走 Bedrock 账单
description: Claude Code 额度不够用？走 Bedrock 账单
tags: AWS
toc: true
categories:
  - Bedrock
  - AWS
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

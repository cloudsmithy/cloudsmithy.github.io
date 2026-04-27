---
title: Quick Suite 链接 Oauth 认证的 AgentCore runtime 部署的  MCP
description: Quick Suite 链接 Oauth 认证的 AgentCore runtime 部署的  MCP
tags:
  - AWS
toc: true
categories:
  - MCP
  - AWS
abbrlink: 57053bb7
date: 2026-04-17 00:00:00
---

在 Quick Suite 的集成过程中，需要选择 HTTPS 链路而非 ARN 直接调用，需要处理好 URL 编码问题。目前的痛点在于： Quick Suite Console 没有清晰的报错，且 AgentCore 控制台默认只能看到资源ARN ；所以将该 ARN 转义并拼接到 HTTPS 路径中，做URL 编码/转义，以满足 Request 请求的规范要求。

```python
region='us-east-1'
agent_arn="arn:aws:bedrock-agentcore:us-east-1:xxxx:runtime/xxxx"
encoded_arn = agent_arn.replace(':', '%3A').replace('/', '%2F')
mcp_url = f"https://bedrock-agentcore.{region}.amazonaws.com/runtimes/{encoded_arn}/invocations?qualifier=DEFAULT"

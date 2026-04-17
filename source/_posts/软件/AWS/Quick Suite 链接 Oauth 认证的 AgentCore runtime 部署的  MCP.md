---
title: Quick Suite 链接 Oauth 认证的 AgentCore runtime 部署的  MCP
description: Quick Suite 链接 Oauth 认证的 AgentCore runtime 部署的  MCP
tags:
  - AWS
toc: true
categories:
  - MCP
  - AWS
date: 2026-04-17 00:00:00
---

Quick Suite 可以链接，不用ARN调用API的话，需要HTTPS进行转译。

```python
region='us-east-1'
agent_arn="arn:aws:bedrock-agentcore:us-east-1:xxxx:runtime/xxxx"
encoded_arn = agent_arn.replace(':', '%3A').replace('/', '%2F')
mcp_url = f"https://bedrock-agentcore.{region}.amazonaws.com/runtimes/{encoded_arn}/invocations?qualifier=DEFAULT"

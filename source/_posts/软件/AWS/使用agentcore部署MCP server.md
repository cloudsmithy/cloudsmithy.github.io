---
title: 使用agentcore部署MCP server
description: 使用agentcore部署MCP server
tags: AWS
toc: true
categories:
  - MCP
  - AWS
abbrlink: 56feb9d1
date: 2025-12-15 00:00:00
---

agentcore除了可以部署agentcore应用程序之外，还可以部署MCP server。
换句话说，只要提供了容器镜像，ping和，那么就可以部署任意的应用程序，上面两个是比较典型的例子。

常规的MCP server 长这样，
```

```

如果要部署到云端的话，
```

```

默认会使用Agentcore runtime来启动，和sagemaker一样，需要有 /ping 和 /invokation的路由，并且容器host在8080端口，启动之后服务就会自动加一个网关来转发到这个应用的8080端口。



你可能还听见过Agentcore Gateway，这个是给一些其他的MCP server，Rest api或者。
甚至是apigateway和lambda。


启动之后，我们就会得到一个URL。

agentcore runtime的是

由于在url有arn，所以需要做一个http的转译，否则有些MCP的客户端可能无法处理识别这个。

agentcore gateway的是。


然后就是认证，Agentcore runtime接受JWT和IAM两种认证方式


而gateway除了这几种之外还可以接受无认证的方式。


这里我们重点介绍JWT的认证，一般是用于和SSO的集成，而这里的JWT通常指的是access token。

对于登陆系统而言，一开始使用用户名和密码登录之后，后端会返回一个JWT来代替用户的身份，然后我们把这个加在请求头里


请求头通常会这样写：

`Authorization: Bearer <token>`

- `Authorization` 是 HTTP 标头中的一个字段。
    
- `Bearer` 表示这是一个 Bearer token 类型。
    
- `<token>` 是实际的访问令牌。
    

例如，假设你获得了一个 `access token`，它可能长成这个样子：

`Authorization: Bearer abcdefghijklmnopqrstuvwxyz1234567890`


### 具体流程：

1. **登录**：用户通过用户名和密码登录后，身份提供者（如身份认证服务器）生成一个 `access token`，并将其返回给客户端（例如，浏览器、移动应用）。
    
2. **访问资源**：客户端在需要访问受保护资源时（例如，API），会在请求中添加 `Authorization: Bearer <token>` 头部。这样，服务器就能知道这个请求背后是一个已经认证并授权的用户。
    
3. **服务器验证**：服务器接收到请求后，验证 `Bearer token` 是否有效。如果有效，服务器根据 token 中的权限信息返回相应的资源；如果无效或已过期，则拒绝访问。








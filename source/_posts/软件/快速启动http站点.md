---
title: 快速启动 http 站点.md
tags: 开发
toc: true
categories: 开发
date: 2025-03-02 00:00:00
---

以下是 Python 内置 HTTP 服务器的几种常用启动方式：

1. 默认端口启动（8000）：

```bash
python -m http.server
```

<!-- more -->

2. 指定端口启动（示例使用 1378 端口）：

```bash
python -m http.server 1378
```

3. 支持 IPv6 的启动方式：

```bash
python -m http.server 1378 --bind ::
```

这些命令会在当前目录启动一个简单的 HTTP 文件服务器，方便快速共享文件或测试网页。

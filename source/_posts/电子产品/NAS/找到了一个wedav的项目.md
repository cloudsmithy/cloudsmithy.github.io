---
title: 找到了一个wedav的项目
tags: NAS
toc: true
categories: 电脑外设
date: 2025-07-30 00:00:00
---

win10 连接 Mac 共享的 SMB 有问题，所以想挂载 webdav，于是发现了这个项目：

可以不话心思解决 mac 个 windows 关于 Sambda 的兼容问题。

https://github.com/mar10/wsgidav

`WsgiDAV` 是一个支持 SSL 的独立 WebDAV 服务器，可以在 Linux、OSX 和 Windows 上作为 Python 命令行脚本运行。它的主要功能包括：

 <!--more-->

### 主要功能：

1. **WebDAV 支持**：它提供完整的 WebDAV 协议实现，用于通过 HTTP 协议远程访问、管理和编辑文件。
2. **SSL 支持**：你可以为 `WsgiDAV` 启用 SSL 加密，确保文件传输的安全性。
3. **文件系统提供程序**：通过文件系统提供程序，允许你将文件夹暴露为 WebDAV 共享。
4. **基本认证和 PAM 登录认证**：支持基本认证，并且支持在 Linux 或 OSX 上使用 PAM 认证。
5. **Docker 支持**：`WsgiDAV` 提供了一个实验性的 Docker 镜像，可以在 Docker 容器中运行 WebDAV 服务。
6. **多线程支持**：支持高性能的多线程 Web 服务器功能。

### 安装：

1. 安装 `wsgidav` 和 `cheroot`：

   ```bash
   pip install wsgidav cheroot
   ```

2. 启动 `WsgiDAV` 服务器并启用匿名访问：

   ```bash
   wsgidav --host=0.0.0.0 --port=80 --root=/tmp --auth=anonymous
   ```

![image-20250730090658313](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250730090658313.png)

### 配置选项：

- `--auth=anonymous` 启用匿名认证，允许没有身份验证的访问。
- `--auth=pam-login` 启用基于 PAM 的认证（在 Linux 或 OSX 上使用）。
- 启用 SSL（推荐使用）：

  ```bash
  wsgidav --host=0.0.0.0 --port=8080 --root=/tmp --auth=anonymous --ssl-adapter pyopenssl
  ```

### 用 Docker 启动 WebDAV 服务器：

1. 拉取 Docker 镜像：

   ```bash
   docker pull mar10/wsgidav
   ```

2. 运行 Docker 容器：

   ```bash
   docker run --rm -it -p 8080:8080 -v /tmp:/var/wsgidav-root mar10/wsgidav
   ```

### 扩展功能：

- **虚拟文件系统**：通过 WebDAV 使数据结构呈现为可编辑的文件系统。
- **文档编辑**：支持在线编辑 MS Office 文档。
- **集成 WSGI**：`WsgiDAV` 可以作为 WSGI 应用程序在其他 WSGI 兼容的 Web 服务器上运行。

### 结论：

`WsgiDAV` 是一个灵活、强大的 WebDAV 解决方案，适合用于文件共享、在线文档编辑等应用场景。如果你需要在 Python 环境中快速部署 WebDAV 服务，它提供了简单的命令行启动选项以及 Docker 支持。如果需要更多自定义功能，还可以通过配置文件和 WSGI 中间件进行扩展。

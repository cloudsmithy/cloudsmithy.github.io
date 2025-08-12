---
title: 使用 OpenList 将 S3 转换为 WebDAV
tags: AWS
toc: true
categories: AWS
abbrlink: 21efda6
date: 2025-07-29 00:00:00
---

Amazon S3 是一种高可扩展、低延迟的对象存储服务，广泛用于存储和管理数据。尽管目前有多个工具来将 S3 与其他存储解决方案（如 Storage Gateway，EMRFS 或者 S3FS 等）集成，但今天我们介绍一个新的方法，通过使用 OpenList，将 S3 存储转换为 WebDAV，简化文件管理和访问。

本文将引导你通过 Docker Compose 启动 OpenList，并将其与 Amazon S3 配置，以便通过 WebDAV 协议进行访问。

<!-- more -->

### 步骤 1：使用 Docker Compose 启动 OpenList

首先，我们需要通过 Docker Compose 来启动 OpenList 服务。以下是一个示例 `docker-compose.yml` 配置文件：

```yml
services:
  openlist:
    image: "openlistteam/openlist:latest"
    container_name: openlist
    volumes:
      - "./data:/opt/openlist/data"
    ports:
      - "5244:5244"
    environment:
      - PUID=0
      - PGID=0
      - UMASK=022
    restart: unless-stopped
```

保存该配置后，使用以下命令启动 OpenList 容器：

```bash
docker-compose up -d
```

启动成功后，OpenList 的 Web 界面将在端口 5244 上可用。你可以通过浏览器访问 `http://localhost:5244` 进入管理界面。默认用户名为 `admin`，初始密码可以通过环境变量设置，或者在容器日志中查看。

![f06557eb12f1646385c081bfa863fec0](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/f06557eb12f1646385c081bfa863fec0.png)

我用的是 Orbstack，可以很方便的查看容器日志。如果你使用的是 Docker cli，也可以使用 docker logs 进行查看。

![ff036c9af184b24239b0729beccad6c8](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/ff036c9af184b24239b0729beccad6c8.png)

### 步骤 2：配置 S3 存储

一开始，OpenList 容器没有绑定任何存储，所以页面将显示为空白。此时需要点击右下角的“管理”按钮，进入存储配置界面。

![671adf2b04ec081b09073583b0a67307](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/671adf2b04ec081b09073583b0a67307.png)

1. 在“存储”选项卡下，选择“对象存储”作为存储类型。
2. 配置挂载路径（例如 `/s3`），这相当于 Linux 系统中的挂载目录。
   ![ad1ec0280dbbb949229bb1098f5452fc](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/ad1ec0280dbbb949229bb1098f5452fc.png)
3. 输入你的 S3 存储桶的名称、区域和访问密钥。确保使用正确的 S3 endpoint。
   我的存储桶位于东京，因此我在配置中使用了 `s3.ap-northeast-1.amazonaws.com` 作为 endpoint。如果你的存储桶位于其他区域，记得修改为相应区域的 endpoint。

![image-20250729184150981](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250729184150981.png)
为了方便获取你的 AWS 凭证，可以使用以下命令获取当前机器绑定的凭证：

```bash
pip install awsx
```

如果你使用 `uv` 管理 Python 环境，可以运行以下命令打印当前用户名和使用的 Access Key 以及 Secret Key：

```bash
uvx awsx
```

![image-20250729185603905](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250729185603905.png)

### 步骤 3：配置重定向

与许多 SDK 的重定向机制不同，如果你在配置中错误地设置了美东区的 endpoint，OpenList 客户端将不会自动在收到 `301` 重定向响应后转发请求到正确的区域，而是会报错。

例如，如果你将 endpoint 设置为 `s3.us-east-1.amazonaws.com`，但存储桶位于 `ap-northeast-1` 区域，你将遇到以下错误：

```
BucketRegionError: incorrect region, the bucket is not in 'ap-northeast-1' region at endpoint 's3.us-east-1.amazonaws.com'
```

![19fe3ef40d5397199b06e22d0c1a9131](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/19fe3ef40d5397199b06e22d0c1a9131.png)

解决方法是确保在配置中使用正确的区域，避免跨区域错误。

### 步骤 4：启用 MFA（可选）

为了提高安全性，尤其是在将 OpenList 部署到公网环境时，建议启用多重身份验证（MFA）。启用 MFA 可以增加 AWS 账户的安全性，避免潜在的安全风险。

在 AWS 控制台中启用 MFA 后，记得更新 OpenList 中的凭证配置，确保启用了双重认证。

![d55c835493702d0c535ee2c03b275899](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/d55c835493702d0c535ee2c03b275899.png)

### 步骤 5：配置用户权限

OpenList 默认情况下将用户权限设置为只读。要赋予 `admin` 用户 WebDAV 的管理权限，请进入“用户 - 编辑”界面，修改相应的权限设置。

![1163f857b7f54d79f578d0efccc3ea10](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/1163f857b7f54d79f578d0efccc3ea10.png)

### 步骤 6：访问 S3 文件

完成配置后，OpenList 将自动同步 S3 存储桶的数据。你可以在 Web 界面上方便地进行文件下载、解压、上传文件等操作。

![image-20250729190608521](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250729190608521-20250729191041135.png)

这个是 S3 上页面，可以看到 s3 的数据都被同步到 Openlist 上了。

![image-20250729191033044](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250729191033044.png)

同时也能够在 Openlist 上在线观看 S3 上的存的视频教程。

![image-20250729190938564](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250729190938564.png)

同时所有操作都可以通过 WebDAV 协议进行，访问路径为：

```
http(s)://<ip>/dav
```

例如，在 MacOS 上，可以通过 Finder 进行 WebDAV 访问：

1. 在 Finder 中选择“前往”>“连接服务器”。
2. 输入 WebDAV 路径，例如：`http://localhost:5244/dav`。
3. 输入 OpenList 的用户名和密码进行身份验证。

![image.png](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/330ca92c-9cec-4366-ae66-2f6b25db8fe2.png)

在 Finder 中使用 WebDAV 进行访问：

![bfe32cbb82f531b34fbf803b96c9c71a](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/bfe32cbb82f531b34fbf803b96c9c71a.png)

你还可以使用 Linux 命令行来操作 WebDAV，减少了学习 S3 命令行的成本。

![image-20250729184439882](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250729184439882.png)

### 总结

通过使用 OpenList，我们可以轻松地将 Amazon S3 转换为 WebDAV，简化了文件访问和管理。通过本文的步骤，你可以快速启动 OpenList、配置 S3 存储桶，并通过 WebDAV 协议访问存储在 S3 上的文件。希望这篇文章能帮助你更高效地管理 S3 数据，并为你提供更加便捷的文件访问方式。

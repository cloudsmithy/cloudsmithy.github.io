---
title: 使用 Docker 部署 Wiki.js 与 PostgreSQL
date: '2024-07-13 22:48:00'
updated: '2024-07-13 22:51:01'
abbrlink: 7c39692e
categories:
- 软件
tags:
- Docker
description: 使用 Docker 启动 PostgreSQL 和 Wiki.js，配置数据库连接及端口映射，并记录安装向导和使用体验。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/140408129
source_title: Wikijs 部署教程
---

[Docker 容器小书：系列目录](/series/docker/)


这篇记录使用 Docker 部署 Wiki.js 和 PostgreSQL 的步骤。

**方法一： 使用 Docker (推荐)**

Docker 是一个方便快捷的方式来部署 Wikijs，它可以避免许多手动配置步骤。

1. **安装 Docker:**

   - 按照 <https://docs.docker.com/get-docker/> 的指示安装 Docker。
2. **部署PG:**

为了让外部应用程序可以连接到 PostgreSQL 数据库，我们需要将容器内部的默认数据库端口 (5432) 映射到主机上的一个端口。

**添加端口映射的命令:**


```bash
docker run -d \
  -p 5432:5432 \  # 将容器内部的 5432 端口映射到主机上的 5432 端口
  -e POSTGRES_USER=your_username \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=your_database_name \
  --name postgres \
  postgres:latest
```


3. **运行 Docker 镜像:** 在终端中进入 `wikijs` 目录并执行以下命令：


```bash
sudo docker run -d -p 8080:3000 --name wiki --restart unless-stopped -e "DB_TYPE=postgres" -e "DB_HOST=172.31.42.182" -e "DB_PORT=5432" -e "DB_USER=postgres" -e "DB_PASS=mysecretpassword" -e "DB_NAME=postgres" ghcr.io/requarks/wiki:2
```


4. **访问 Wikijs:** 打开浏览器并访问 `http://ip:8080`，你将看到 Wikijs 的安装向导。

**其他注意事项:**

- Wikijs 支持目前不支持主题
- 可以配置SSO和数据存储，
- 2.X可以使用常用数据库。3.X版本仅仅支持PG
- 没有目录结构，全靠前缀

界面看起来还不错  
 ![使用 Docker 部署 Wiki.js 与 PostgreSQL配图](/images/migrated/24286c42c2f5a5ace433.png)

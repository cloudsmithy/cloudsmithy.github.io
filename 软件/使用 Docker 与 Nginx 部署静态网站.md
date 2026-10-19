---
title: 使用 Docker 与 Nginx 部署静态网站
date: '2024-03-31 22:41:24'
updated: '2024-03-31 22:41:24'
abbrlink: 478f80e7
categories:
- 软件
tags:
- Docker
- Blog
description: 为 HTML、CSS 和 JavaScript 文件编写 Dockerfile，构建 Nginx 镜像并映射端口，完成静态网站部署。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/137211634
source_title: Nginx 部署静态文件
---

[Docker 容器小书：系列目录](/series/docker/)


部署静态文件（如HTML、CSS和JavaScript文件）到一个Docker容器中，并使用Nginx作为web服务器是一个常见的做法。这种方式可以提高应用的性能和可靠性。下面是如何使用Docker和Nginx部署静态文件的一个基本步骤：

#### <a id="_2"></a>第一步：准备你的静态文件

确保你的静态文件（HTML、CSS、JavaScript等）是准备好的。将这些文件放在一个目录中，例如名为`/path/to/your/static/files`的目录。

#### <a id="Dockerfile_6"></a>第二步：创建Dockerfile

在你的静态文件目录中创建一个名为`Dockerfile`的文件。这个文件将指导Docker如何构建你的镜像。一个基本的Dockerfile示例如下：


```
# 使用官方的Nginx镜像作为基础镜像
FROM nginx:alpine

# 将静态文件复制到容器中的Nginx服务器目录
COPY /path/to/your/static/files /usr/share/nginx/html

# 暴露80端口
EXPOSE 80

# 使用Nginx默认的启动命令
CMD ["nginx", "-g", "daemon off;"]
```


确保将`/path/to/your/static/files`替换为你的静态文件目录的实际路径。

#### <a id="Docker_26"></a>第三步：构建Docker镜像

在包含Dockerfile的目录中打开命令行，并运行以下命令来构建你的Docker镜像。请将`<your-image-name>`替换为你想要的镜像名称。


```bash
docker build -t <your-image-name> .
```


#### <a id="_34"></a>第四步：运行你的容器

使用以下命令运行你的Docker容器：


```bash
docker run -d -p 80:80 <your-image-name>
```


这条命令会将容器内的80端口映射到宿主机的80端口。这样你就可以通过访问宿主机的IP地址或者`localhost`（如果你是在本地运行）来访问你的静态网站了。

完成这些步骤后，你的静态文件将通过Nginx服务器在Docker容器内被成功部署，你可以通过浏览器访问这些文件了。这是一个简单快速部署静态网站的方法。

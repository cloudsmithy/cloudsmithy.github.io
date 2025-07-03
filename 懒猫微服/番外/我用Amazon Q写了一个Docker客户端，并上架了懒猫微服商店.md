---
title: 我用Amazon Q写了一个Docker客户端，并上架了懒猫微服商店
tags: Docker
toc: true
categories: 懒猫微服
date: 2025-06-08 00:00:00
---

https://appstore.lazycat.cloud/#/shop/detail/xu.deploy.containly

自从被种草了 Amazon Q，我陆陆续续写了不少小软件，其中这个 Docker 客户端是一个典型的例子，比较符合自己平时使用的习惯，也分享给一些朋友和 NAS 爱好者来用。

![image-20250606190108571](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250606190108571.png)

故事还要用上次折腾黑群晖说起，本意想把 NAS 和打印机共享二合一的，所以把闲着的软路由做了改装。顺便使用 Docker 跑一些服务，有老本行的 ES 集群，也有自己写的一些工具类型的服务。

<!-- more -->

随着时间增长，部署的服务多了，时间长了就会忘记服务的端口，甚至还要登录群晖 Web 端进行查看，群晖的 Container Manager 很好用，就是登录的密码策略比较复杂，每次登录都比较麻烦，所以后来使用了一个 HomePage 来保存这些服务。但是每次调试 Docker 都非常麻烦。与 Portainer 相比，我需要的只是一个简洁的面板来查看容器的 URI、状态，并进行启停操作，因此我决定自己开发一个。

![image-20250606164850382](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250606164850382.png)

这个是群晖的 Container Manager，后面还有很多容器。记住这么多端口然后随时维护绝对不是一个容易的事。

![image-20250606164632836](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250606164632836.png)

我开发容器面板叫做 Containly， 是一个 Container 的管理工具。最早的时候用我是用 GPT 写的。但是随着项目越来越大，GPT 每次都会丢一些东西，而且还没办法操作本地目录，后来才转向了 Amazon Q，这个版本还是用 Q CLI 来做的。

于是写好之后我把这个 APP 上架了懒猫微服的商店，这个是一款国产化的 NAS，可玩性非常高，对开发者也十分友好。上线当日就有很多开发者安装使用了。

![c970b2f8c3fea3a9246510fd1e20d9aa](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/c970b2f8c3fea3a9246510fd1e20d9aa.png)

Containly 的核心功能是通过目录映射的 Docker 引擎读取所有容器信息，包括容器的启动、退出、停止及其他状态。例如，当容器处于“Create”状态时，它会被标记为“Other”状态，便于管理。

![image-20250520104141112](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250520104141112.png)

默认情况下，每个容器卡片会显示容器的网桥信息、端口映射和 URL。默认使用 HTTP 协议，鼠标悬停时，会在右侧显示操作按钮。通过点击这些按钮，操作会被保留，再次点击会隐藏，这样子就整个比较美观。

按钮功能包括：

- 停止/启动
- 重启
- 查看日志
- SSH 进入容器
- 切换 HTTP/HTTPS
- 黑名单管理

![image-20250606190151980](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250606190151980.png)

此外，Containly 还提供了一个输入框，用户可以输入需要监控的 NAS 域名，面板会自动根据域名和端口拼接成 URI，并存储在 localStorage 中。更进一步，Containly 还支持暗黑模式，提升了用户体验。

![image-20250606185740253](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250606185740253.png)

另外如果多节点部署服务的话，还可以把从节点放入黑名单，这样子就只显示主节点的信息，面板就比较清爽。如果需要从节点的信息再从黑名单移除。

![image-20250606190231618](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250606190231618.png)

利用面板的 SSH 功能， 能够直接从面板进去访问容器的 SHELL，不用执行再 docker exec 的命令。

![image-20250606192901984](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250606192901984.png)

看日志也很方便，也无需再使用 docker logs，这样调试容器的时候就很方便了。
![image-20250606192939172](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250606192939172.png)

我已经打包好了 Docker 镜像并配置了 GitHub Actions，便于自动化部署。你可以通过以下方式部署 Containly：

#### **Docker 部署命令**

```bash
docker run -d \
  --name containly \
  -p 5000:5000 \  # 映射容器端口到主机
  -v /var/run/docker.sock:/var/run/docker.sock \  # 挂载Docker socket，允许访问宿主机Docker
  cloudsmithy/containly:latest  # 使用最新版本的Containly镜像
```

#### **Compose 配置**

```yaml
version: "3.8"
services:
  containly:
    image: cloudsmithy/containly:latest
    ports:
      - "5000:5000"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    restart: unless-stopped
```

这个是使用 Q 修改的部分代码截图：

![2a4ea3b79c3998ba0742e79cee8f1672](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/2a4ea3b79c3998ba0742e79cee8f1672.png)

后来机缘巧合之下用了 Q pro，看来也不能优化再多。

![image-20250606184151764](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250606184151764.png)

除了使用 Q CLI，我们还可以通过安装 VSCode 和 JetBrains 插件来使用 Q，安装插件后，免费版本可以使用 Builder ID 登录，Pro 版本则支持使用 IAM Identity Center 登录。

![image-20250606190814362](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250606190814362.png)

在 VSCode 中，你可以通过 Q 聊天面板与 Q 进行交互，并且支持中文聊天。

![image-20250606191035548](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250606191035548.png)

与 GPT 相比，Q 的优势在于它可以直接操作本地文件，用户可以直接在文件夹中生成工程文件，极大提升了开发效率。

![image-20250606191616025](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250606191616025.png)

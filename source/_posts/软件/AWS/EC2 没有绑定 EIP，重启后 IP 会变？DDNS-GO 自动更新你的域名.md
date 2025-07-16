---
title: EC2 没有绑定 EIP，重启后 IP 会变？DDNS-GO 自动更新你的域名
tags: AWS
toc: true
categories: AWS
abbrlink: 369cde6d
date: 2025-07-15 00:00:00
---

在 IPV4 即将枯竭的年代，云服务商的 EIP 也开始收费了。对于没有弹性公网 IP（EIP）的云服务器，我们可以通过 DDNS-GO 实现动态域名解析。本文介绍了如何使用 Docker 快速部署 DDNS-GO，并借助 DDNS 实现动态域名绑定，从而让服务器即使公网 IP 变化，也能够实时更新域名解析记录，这样只需要使用域名访问，不再需要在控制台查看。

---

## 安装 Docker

使用官方安装脚本快速安装 Docker：

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

<!-- more -->

设置 Docker 开机自启并立即启动：

```bash
sudo systemctl enable --now docker
```

---

## 添加当前用户到 `docker` 用户组（避免每次用 sudo）

```bash
sudo usermod -aG docker $USER
```

### 生效方式：

- 推荐：**重新登录终端会话**
- 或使用临时方式立即生效：

```bash
newgrp docker
```

验证是否配置成功：

```bash
docker info
```

若无权限报错，则配置已生效。

---

## Docker 中部署 DDNS-GO

我们将使用 Docker 的 `host` 网络模式挂载主机目录，确保 DDNS 能正常检测本地 IP：

```bash
docker run -d --name ddns-go --restart=always --net=host -v /opt/ddns-go:/root jeessy/ddns-go
```

- `/opt/ddns-go` 是主机目录，你可以替换为任意路径，用于持久化配置。

- 启动后，DDNS-GO 的配置文件为 `.ddns-go.yaml`，位于挂载目录中。

## 初始化配置

部署完成后，打开浏览器访问：

```
http://<Docker主机IP>:9876
```

你会看到 DDNS-GO 的初始化页面，如图所示：

![初始化配置页面](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250715114247261.png)

DDNS-GO 是一个开源的动态域名更新工具，支持多个域名服务商，我的域名托管在 cloudflare 上，所以需要在 cloudflare 上申请一个 API-KEY 来做这个更新。

- **TTL 建议设置为“自动”**
- **IP 获取方式推荐使用外网 API（如 ipip.net）**

![成功绑定 DDNS 地址](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250715115315906-20250715122303544.png)

前往 Cloudflare 的 [API Token 页面](https://dash.cloudflare.com/profile/api-tokens)，为 DDNS-GO 创建一个具备修改 DNS 权限的 Token。

建议选择 **“Edit zone DNS”** 模板，只赋予必要权限，并可以限制在特定域名范围内使用。

![Cloudflare API Token 创建](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/ceb3433ce7976c7c3199fc54402af084-20250715122245169.png)

此外，DDNS-GO 支持 webhook 通知，可选用如 Slack、Server 酱等方式实时通知 IP 变动情况。

![image-20250715121816313](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250715121816313.png)

---

## 验证 DDNS 的效果

我们尝试停止云主机后再重新开启，公网 IP 会发生变化：

![公网 IP 变化](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250715120531839.png)

重启后 DDNS-GO 会自动检测 IP 变动并更新域名解析：

![DDNS 更新成功](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250715120827569.png)

通过域名访问服务仍然保持不变，无需手动更新 IP。

---

同时 Server 也会把这个消息推送到手机上：

![image-20250715121937366](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250715121937366.png)

## 总结

即使云服务器没有绑定弹性公网 IP，借助 DDNS-GO 和 Docker，我们依然可以实现动态域名解析：

- **低成本**：无需购买 EIP，节省开销；
- **自动化**：IP 改变后自动更新域名解析；
- **易部署**：Docker 一键运行，配置简单直观。

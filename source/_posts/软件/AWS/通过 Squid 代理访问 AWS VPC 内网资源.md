---
title: 通过 Squid 代理访问 AWS VPC 内网资源
date: '2024-03-13 10:15:13'
updated: '2024-03-13 10:15:13'
abbrlink: d143e1fe
categories:
- 软件
- AWS
tags:
- AWS
- 代理
- Linux
description: 在公有子网部署 Squid 代理，通过安全组白名单控制访问，配置客户端代理并验证 VPC 内网资源的连通性。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/136672410
source_title: 通过代理服务器在亚马逊云科技中访问VPC资源
---

[AWS 实战与学习笔记：系列目录](/series/aws/)


在某些场景下，我们可能需要访问亚马逊云科技中的VPC资源，但又不希望直接建立VPC或配置专线连接。此时，一种有效的解决方案是在公有子网中部署一台代理服务器，通过对该代理服务器的安全组设置适当的白名单，我们便可以安全地通过这台代理机器访问VPC中私有子网后面的实例。

由于此类代理服务器配置不会验证连接的身份凭证，因此强烈推荐仅用于内网访问。若有公网访问需求，务必严格设置白名单，以保障安全。

与经常出现断线和配置较为复杂的SSH端口转发相比，使用代理服务器提供了一个相对简单便捷的解决方案。

下面是在亚马逊云科技环境下设置Squid代理服务器的基本步骤：


```bash
## 安装Squid
sudo yum install squid -y

## 编辑Squid配置文件以允许访问
sudo vim /etc/squid/squid.conf
# 在文件最底部添加以下行来允许所有HTTP访问
http_access allow all
# 然后找到并注释掉以下行，以防止默认拒绝所有访问
#http_access deny all
```


完成配置后，重启Squid服务以应用更改：


```bash
# 重启并且设置开机启动
sudo systemctl restart squid
sudo systemctl enable squid
```


#### <a id="_29"></a>设置环境变量以使用代理

在客户端机器上，设置环境变量以通过代理服务器进行HTTP和HTTPS访问：


```bash
export http_proxy=http://your_proxy_ip:3128
export https_proxy=http://your_proxy_ip:3128
```


设置好代理之后，使用telnet测试端口连通性，或使用curl测试代理IP是否生效（例如，`curl ip.sb`查看返回的IP地址是否为代理服务器的IP）。注意，使用ping命令可能无法验证代理是否生效，因为ICMP协议不通过HTTP代理。

现在，您就可以通过代理服务器直接访问VPC内网URL了。

此方法提供了一种相对简单的方式来访问亚马逊云科技中的VPC资源，无需搭建复杂的网络基础设施，既节省时间又降低成本。然而，重视网络安全和正确配置安全组至关重要，以防止未授权访问。

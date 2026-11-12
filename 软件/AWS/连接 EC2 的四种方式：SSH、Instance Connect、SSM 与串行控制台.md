---
title: 连接 EC2 的四种方式：SSH、Instance Connect、SSM 与串行控制台
date: '2024-06-13 20:58:27'
updated: '2024-06-13 20:59:41'
abbrlink: a851db
categories:
- 软件
- AWS
tags:
- AWS
- SSH
description: 对照 EC2 Instance Connect、SSH、会话管理器与串行控制台，记录连接设置、常见 SSH 错误及排查思路。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/139664086
source_title: 连接亚马逊云EC2的几种方式
---

[AWS 实战与学习笔记：系列目录](/series/aws/)


一般来说，我们会用SSH 来连接EC2，在亚马逊云上还有其他的几种办法（ Instance Connect/SSM/Serial Console），我们来一个一个说明。

#### <a id="EC2_Instance_Connect_2"></a>EC2 Instance Connect

这个方式使用基于浏览器的 EC2 Instance Connect 客户端来连接实例的 IPv4 地址，从而达到远程访问的目的，需要注意的是，这个办法不支持IPV6连接。

在Amazon Linux和ubuntu的一些版本安装了EC2 Instance Connect ，所以在控制台直接连接即可,当然如果你是想连接内外IPV4的话，还要再创建一个Instance Connect 的终端节点。

![连接 EC2 的四种方式：SSH、Instance Connect、SSM 与串行控制台配图](/images/migrated/8951f0826c0ec7ff03be.png)

SSH客户端

和其他的服务器一样，只是这里的私钥是采取的pem格式的文件，由于我们现在的操作已经已经内置SSH客户端，大多数情况不用我们手动安装。实测windows用户也不需要转换成ppk文件（如果不使用Putty），使用CMD一样可以连接。

如果是Linux/MacOS用户，还需要更改下权限：

chmod 400 xx.pem

然后使用命令连接即可：

ssh -i “11.pem” ec2-user@ec2.cn-north-1.compute.amazonaws.com.cn

如果出现问题，我们可以加上-vvv来查看debug信息

ssh -i “11.pem” ec2-user@ec2.cn-north-1.compute.amazonaws.com.cn -vvv

常见SSH 连接不上问题如下：

Connection timeout：网络不通，尝试使用telnet 查看22端口是否联通

Permission denied: pem文件权限不对，在Linux/MacOS上，需要400的权限

Identity file .pem not accessible: 找不到key，需要使用ssh -i 指定正确的路径‘

Connection refuse: 服务端sshd 未启动

#### <a id="_41"></a>会话管理器

这个方式的好处就是不用在管理私钥文件，如果你刚好喜欢使用浏览器远程访问的话，那么这个方式会很方便，不过相对来说会话会容易断开，如果需要的话，也可以在SSM配置里调整过期时间。

![连接 EC2 的四种方式：SSH、Instance Connect、SSM 与串行控制台配图](/images/migrated/7cc774f09e9e89e8b422.png)

在Amazon Linux系列的产品上预置了SSM的agent，所以大多数情况无需任何配置即可轻松连接，只要我们EC2上绑定的IAM Role有SSM相关权限即可，我在相关的role上绑定了AmazonSSMManagedInstanceCore这个策略，这样就又了SSM相关的权限。如果是ubuntu，centos等系统，那么还需要ssh进入实例内部额外安装SSM的agent来开启这个配置。

#### <a id="EC2__50"></a>EC2 串行控制台

这个是通过串口来连接EC2，界面和SSH类似，因为EC2默认使用Key登陆，那么就需要提前设置好密码，这个方法类似于把键盘直接接到EC2上一样，在无法进入SSH连接的情况，可以使用该方法来排查问题。

![连接 EC2 的四种方式：SSH、Instance Connect、SSM 与串行控制台配图](/images/migrated/7365080d0b2e68829aef.png)

这个办法也有一些限制：

仅仅支持NItro实例

两次回话要间隔30秒

每个实例同时只有开一个串口连接

串行会有更大的开销，可能会影响机器性能

以上就是四种在亚马逊云上连接EC2的方式，相信总会有一种适合你。

参考文档

EC2 Instance Connect 连接到 Linux 实例:https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/connect-linux-inst-eic.html

Session Manager 登录和管理 EC2 主机：https://aws.amazon.com/cn/blogs/china/session-manager-register-ec2/

交互式EC2 串行控制台简介: https://aws.amazon.com/cn/about-aws/whats-new/2021/03/introducing-ec2-serial-console/

哪些方法连接我的 EC2 Linux 实例？ https://repost.aws/zh-Hans/knowledge-center/ec2-linux-connection-options

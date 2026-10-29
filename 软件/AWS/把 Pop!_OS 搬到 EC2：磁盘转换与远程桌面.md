---
title: 把 Pop!_OS 搬到 EC2：磁盘转换与远程桌面
date: '2024-03-13 09:14:12'
updated: '2024-03-13 09:16:15'
abbrlink: dd1a54e9
categories:
- 软件
- AWS
tags:
- AWS
- Linux
description: 记录将 Pop!_OS 虚拟机磁盘转换为 RAW、写入 EBS 并替换 EC2 根卷的过程，以及 BIOS 引导和 RDP 桌面体验。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/136669743
source_title: 在亚马逊云EC2上启动PopOS
---

[AWS 实战与学习笔记：系列目录](/series/aws/)


#### <a id="CloudEndure_0"></a>CloudEndure遇到的挑战

自从使用CloudEndure导入win11后就一发不可收拾,然后就可以尝试新的操作系统,比如system76的Pop!_OS,虽然上是基于ubuntu进行开发的,但是在使用安装CloudEndure 的时候还是遇到的了问题,可能是因为内核很新,也可能其他的一些原因.

![把 Pop!_OS 搬到 EC2：磁盘转换与远程桌面配图](/images/migrated/9b018f03915307e93772.png)

如果说严格按照兼容性列表来看的话,那可以直接跳过vmimport了,毕竟在过去的认知里,vmimport不能做的事情需要求助于CloudEndure.

#### <a id="vmware_11"></a>vmware

因为Pop!_OS没有提供RAW这种的原盘格式, 所以需要先使用虚拟机安装该系统然后导出磁盘文件,然后把对应的vmdk转换成RAW,需要注意的是popos默认没有安装sshd的服务端,在导入上云之前需要安装这个服务而且设置为开机启动.如果有防火墙的话还需要使用ufw进行放行端口


```bash
sudo apt install openssh-server
sudo systemctl enable ssh
sudo ufw allow ssh
```


![把 Pop!_OS 搬到 EC2：磁盘转换与远程桌面配图](/images/migrated/137f0b5cae8d0238149a.png)

很多虚拟机软件没有Pop!_OS的选项,所以在vmware里选择了ubuntu,除了磁盘名字是ubuntu以外,其他的没有什么影响

![image.png](/images/migrated/739f4b32db9ea7cbe6c2.png)

#### <a id="Amazon_linux_2023_29"></a>不要轻易尝试Amazon linux 2023

第一次使用Amazon Linux2023更换更卷, 遇到了如下问题,没有找到grub而进入了uefishell,印象里大多数虚拟化对UEFI的支持都不是很好,所以更换了Amazon Linux2之后就成功了,控制台可以看到是legacy-bios的引导.起码到现在的时间,Amazon linux 2023的bug还仍然被人们亲切的称为feature  
![把 Pop!_OS 搬到 EC2：磁盘转换与远程桌面配图](/images/migrated/a6c7ac417a7d690f487a.png)

具体的部署是把vmdk转换成raw,然后把raw 传输到机器A上,然后使用dd命令把数据打到第二个空盘上,然后再把这个空盘作为另外实例的根卷

具体步骤如下:

1. 下载ISO文件,安装虚拟机,提取VMDK转换成RAW,如过目标OS有RAW格式提供那么可以忽略此步骤(除了popos的大多数系统应该都是有提供RAW的)
2. 把RAW传输到机器A(这里机器A什么特殊要求,支持dd就好),然后给机器A挂载一个空的EBS卷,不用格式化分区和拓展文件系统,然后使用DD把raw直接写到新的EBS上,然后摘除这个EBS卷
3. 启动一台另外的EC2 B(最好是legacy引导),停止后摘除根卷,挂载上一步DD的卷
4. 启动EC2 B,等待健康检查通过就好了


```bash
dd if=./ubuntu.raw of=/dev/nvme1n1 bs=4M
```


#### <a id="_48"></a>成功登陆

![把 Pop!_OS 搬到 EC2：磁盘转换与远程桌面配图](/images/migrated/a5c8862640148caf76ab.png)

#### <a id="RDP_52"></a>配置远程RDP访问


```bash
sudo apt-get update
sudo apt-get -y install xrdp
sudo systemctl enable xrdp
sudo systemctl start xrdp
```


然后就可以使用RDP软件登陆了,由于这个系统本来就是为了桌面端而设计,在服务端使GNOME,响应速度还是有点差强人意.而为了客户端自动锁屏之类的功能反而在服务端反而变成了会使RDP端掉的负优化.

![把 Pop!_OS 搬到 EC2：磁盘转换与远程桌面配图](/images/migrated/d4d5f3387715a8cd5b11.png)

#### <a id="_64"></a>使用体验

综合体验下来,速度上只是桌面环境卡.软件则不卡,甚至还可以在IDE中流畅的编写代码,总归还是了却了一桩心愿.

![把 Pop!_OS 搬到 EC2：磁盘转换与远程桌面配图](/images/migrated/2b9e0573562045b9627b.png)

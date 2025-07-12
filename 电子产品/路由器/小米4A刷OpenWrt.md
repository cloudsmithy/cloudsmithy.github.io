---
title: 小米4A刷OpenWrt
tags: 路由器
categories: 电脑外设
toc: true
abbrlink: 63a7a8fe
date: 2023-06-22 00:00:00
---

最近由于 ipad 随航经常卡断，导致体验直线下降，有如下几个怀疑：

![](https://raw.githubusercontent.com/Xu-Hardy/image-host/7796030c5adad4e258b8a5c644fc048b17f87ff1/202307221242310.png)

1. 小米路由器偷工减料无线功能不行
2. 电脑带不动
3. 升级了 MacOS13

就说咱对于国产的偏见，以及小米路由器频繁抽风挂后台，还有小米的生态做的稀烂，在和客服人员沟通后得到了模棱两可十分不专业的回答之后下定决心把手边的小米 4A 刷成 OpenWrt，毕竟对于爱好者而言，客服就是半路出家的半吊子，毕竟解决不了问题咱就迁走嘛。本身是资深软路由用户，刷机也没啥成本。

<!--more-->

### 刷前提醒

1. 不要偷懒不刷 breed，否则刷崩了就只能救砖
2. 救砖只能用小米自己的软件，毕竟封装的太多了，能用开源就用开源，尽量屏蔽厂家这一层
3. 可以找下国内魔改的 Rom，虽然官方有小米的适配，但是刷完默认 Wi-Fi，还有过几十分钟 5G Wi-Fi 变成公开的问题。
4. 还是建议使用有线刷机，无线的话无法刷入 Breed

官方的地址，看看就好

![image.png](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/1687398595329-b000d4a6-9e2f-4009-af80-a4b7a3ba9358.png)

![](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/1687398645873-c8085af8-9502-4f8d-a722-bee12bb6e886.png)

### 救砖

刷机之前还是很有必要先说下救砖，只能用到小米的官方工具，而且只有 Windows 版本，所有这里需要准备一台 windows 带网口的设备。

[MIWIFIRepairTool.x86.zip(980 kB)](https://github.com/Xu-Hardy/object-storage/blob/master/mi4A/MIWIFIRepairTool.x86.zip)

用网线把电脑网口和路由器的 Lan 口连在一起，这样在刷机工具中会看到电脑有一张网卡被路由器 DHCP 分配了 IP，192.168.31.X, 此时无法登陆 web 后台。这里建议在打开软件之前先执行这个刷机步骤：

1 断开电源，按住 Rest 键，再接通电源，直到橙灯闪烁再松开  
2 打开刷机软件，这里回识别一会网卡  
3 等待路由器恢复，完成之后指示灯会变成蓝色  
4 然后就可以通过 192.168.31.1 进入后台界面了

![](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/1687396836642-b7c73690-1764-4448-9f9b-a40200965113.png)

这个有个小插曲：我一开始在刷机最后一步断电重启的路由器，试了两三次均不能刷入，论坛上也建议不成功的话多刷几次。没有出现需要降级路由器固件的情况。

### 解锁 SSH

网上提供了一个 Python 脚本来解锁路由器的 telnet 和 SSH，然后会预制一个 Buybox 的环境，其实就是一个 Linux 的工具箱环境，我们可以执行 curl，wget 等命令。telnet 的用户名和密码都是 root。

![](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/1687398788572-5d8abf15-3fca-4755-8572-c6a19f2b83b5.png)

SSH 会遇到这个错误，所以用 telnet 了：

![](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/1687398779870-89ff20b4-f71e-4734-9383-77af19f6881b.png)

本地可以用 Python 启动一个文件服务器方便路由器下载文件，用 SCP，FTP 啥的也行

可以用浏览器访问 IP:8000 来访问文件服务器，然后 wget 提取文件链接。

![](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/1687399002714-ed5649b9-0d25-451a-a028-2e404d8dbba2.png)

### 刷入 Breed

Breed 更像是 BIOS 一类的东西，每次 Reset 路由器之后，就会进入到 breed 后台，IP 地址是 192.168.1.1，如果进不去后台可以把 IP 改为 C 类 IP 地址的网段，然后就可以进到 Breed 后台来输入 OpenWrt 固件了。

[breed-mt7621-pbr-m1.bin.zip(95 kB)](https://github.com/Xu-Hardy/object-storage/blob/master/mi4A/breed-mt7621-pbr-m1.bin.zip)

路由器没啥空间了，所以都要放在/tmp 文件夹下，把链接换成自己文件服务器的链接。

1. 进入到临时目录:cd /tmp.
2. 下载"breed":curl [https://breed.hackpascal.net/breed-mt7621-pbr-m1.bin](https://breed.hackpascal.net/breed-mt7621-pbr-m1.bin) --output firmware.bin
3. 执行命令:mtd -r write /tmp/firmware.bin Bootloader
4. 重启后浏览器进入"Breed Web 恢复控制台":192.168.1.1

[v2.5.29 小米 4A 千兆版 OpenWrt 固件.zip(39.8 MB)](https://github.com/Xu-Hardy/object-storage/blob/master/mi4A/v2.5.29%20%E5%B0%8F%E7%B1%B34A%E5%8D%83%E5%85%86%E7%89%88OpenWrt%E5%9B%BA%E4%BB%B6.zip)

Breed 的下载页面：[https://breed.hackpascal.net/](https://breed.hackpascal.net/)

![](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/1687398443827-03bc7ce7-64b4-4b50-bf36-578511a97050.png)

备份分区

![](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/1687399872176-e43aa92f-9b52-46f2-8cfb-38c6c1eb7ec7.png)

![](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/1687399891497-b7c2cdee-66ec-452b-a1b1-cda4a48ac2e8.png)

我这里先刷的 openwrt-ramips-mt7621-xiaomi_mi-router-4a-gigabit-initramfs-kernel.bin，其实已经可以进入路由器后台使用了，然后刷到 sysupgrade 镜像，其实应该在 OP 后台刷这个 sysupgrade 镜像。

![](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/1687400148704-316d570e-18d2-4a0d-8abe-037d8b4b951c.png)

### 刷入 openwrt

刷完之后，路由器会自动重启，此时 telnet 会断开。  
把 IP 地址改成自动获取，这个时候可以进入到路由器后台了。

![](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/1687397739475-03de7ad1-31ab-40bb-94c3-ce9ab6ac47b2.png)

设置完无线的用户名密码之后有个很奇怪的问题，WI-FI 一直没有网，但是有线正常，后来在 Network 中删除掉 Wan6 的 DHCP Set 就好了。

![](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/1687397990787-de16dd97-0416-41b6-baa1-3e9f2bbdc87c.png)

![](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/1687398060605-5b0905a5-b4ee-47a6-abcc-06e36753587a.png)

![](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/1687398216746-31cf48bf-e37c-4fa5-b837-417dc3ce7e36.png)

![](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/1687398712888-c3963fc7-9ea7-4db7-9554-0de75c2547c9.png)

### 参考

[https://www.right.com.cn/forum/thread-4317222-1-1.html](https://www.right.com.cn/forum/thread-4317222-1-1.html)  
[https://blog.51cto.com/xfxuezhang/5866060](https://blog.51cto.com/xfxuezhang/5866060)

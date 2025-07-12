---
title: Cudy TR3000 刷 Openwrt
toc: true
tags: 路由器
categories: 电脑外设
abbrlink: 3e1838df
date: 2025-04-02 00:00:00
---

想了好久，还是有必要把软路由从 All in one 中分离开，基于性价比的原因，看上了这款 Cudy RT3000，相对于 400 价位的 MT3000 而言，内存只有 128M，而且没有风扇，不过也已经足够了。![image-20250310223410001](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250310223410001.png)

据说是出口转内销，不过我的这个是纯中文版本。成品长这样，和 MT3000 很像 。

 <!--more-->

![image-20250310224500782](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250310224500782.png)

一下是刷了论坛上大分区的版本，如果想刷原版的 Openwrt，可以找客服要。

### 1. 接入路由器 WIFI 进入后台，

地址是 192.168.1.1，这个是原厂固件，几乎没什么用

![](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/refs/heads/master/image-20250309201702683.png)

在这里刷入过渡包

![](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/refs/heads/master/image-20250309201735162.png)

重启之后，连接电脑和路由器 LAN 口，手动配置为静态 IP 地址, 路由器默认 IP 是 192.168.1.1.

![](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/refs/heads/master/image-20250309204150368.png)

然后回出现登录页面，密码为空，直接登录

![](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/refs/heads/master/image-20250309201806360.png)

### 2. 升级过渡固件

![](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/refs/heads/master/image-20250309201750765.png)

不保留当前配置

![](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/refs/heads/master/image-20250309201852610.png)

然后继续刷写

![](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/refs/heads/master/image-20250309201857968.png)

刷新之后自动跳转到这个页面, 登录进入到 openwrt 页面，密码 password

![](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/refs/heads/master/image-20250309201928869.png)

### 3. 刷写 uboot 不死后台

![](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/refs/heads/master/image-20250309202113910.png)

网页上传 uboot，打开 ttyd 刷入执行 mtd write /tmp/upload/mt7981_cudy_tr3000-mod-u-boot.fip FIP

![](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/refs/heads/master/image-20250309202122545.png)

电脑依旧更改静态 IP，长按 reset 按键，红灯闪烁即可松手进入 uboot 后台

![](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/refs/heads/master/image-20250309202326061.png)

### 4. 选择固件进行更新，上传最后的固件之后，点击更新就可以了

![](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/refs/heads/master/image-20250309202338993.png)

这个是刷写之后的效果，可以看到 uboot mod

![](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/refs/heads/master/image-20250309202259037.png)

100 多元的小玩意，拿来做旁路由还可以，刷完之后发热也比原厂低了不少。

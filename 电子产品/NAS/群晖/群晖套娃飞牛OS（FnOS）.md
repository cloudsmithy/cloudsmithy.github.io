---
title: 群晖套娃飞牛OS（FnOS）
tags: 家庭网络
toc: true
categories: 群晖
abbrlink: 1eb7a4c5
date: 2025-02-02 00:00:00
---

头段实在飞牛实在炒的有有点多，也安装尝试了下，同时也做了虚拟机的测评。

不过飞牛使用下来还是影音刮削的功能还是不错的，所以觉得把飞牛装在虚拟机里只使用影音的功能。

于是这个是一个使用群晖虚拟机安装飞牛 OS 的的过程。

 <!--more-->

在某个时间点的更新之后，群晖安装 debian 类虚拟机遇到问题，尽管看报错是正在加载，但是一直都没有响应。

![image-20250328205942850](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250328205942850.png)

在多次尝试之后，发现如下组合可以不卡代码，视频卡使用 vga，机器类型使用 Q35

![image-20250328210137030](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250328210137030.png)

查了下 GPT 的说法如下：

> | 选项     | 说明                                                                                |
> | -------- | ----------------------------------------------------------------------------------- |
> | `cirrus` | 非常基础的显卡，兼容性强，但仅支持 800x600 或 1024x768 的低分辨率，性能差。         |
> | `vga`    | 模拟标准 VGA，支持更多分辨率，但也比较基础。                                        |
> | `vmvga`  | 模拟 VMware 的显卡，适用于装有 VMware Tools 的系统，和 Chromium/FnOS 相对兼容较好。 |
>
> | 类型  | 说明                                                                                     |
> | ----- | ---------------------------------------------------------------------------------------- |
> | `PC`  | 传统的 Intel i440FX 芯片组，兼容性强但比较老旧（类似 90 年代主板结构）                   |
> | `Q35` | 模拟 Intel Q35 芯片组，支持 PCIe、AHCI、现代硬件，推荐给新系统（如 Win10+、FnOS、Linux） |

飞牛要直通两个盘，一个是系统盘，一个是数据盘。当然如果你只使用 SMB 做数据盘那也没问题，只是一直会提示你要加一个盘。

![image-20250328210704523](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250328210704523.png)

我主要使用影视，就只能安装在数据盘了，

![image-20250328210956758](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250328210956758.png)

![](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250328210956758.png)

![image-20250328210843980](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250328210843980.png)

创建媒体库，选择 SMB 文件夹：

![image-20250328210908955](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250328210908955.png)

缺点是这套不能直通核显给 FnOS，所以用浏览器看的时候 CPU 是满的，但是不耽误客户端解码。

当贝桌面下载飞牛 TV，然后使用手机飞牛账户绑定。

![image-20250328211025340](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250328211025340.png)

放了一个 4K 版本的哪吒，不卡顿～

![image-20250328211151213](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250328211151213.png)

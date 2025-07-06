---
title: intel 12代CPU折腾记
tags: 外设
abbrlink: 5821c3b8
date: 2023-02-06 00:00:00
---

最近小米新出了迷你主机，甚至连 nuc 贴纸都没摘，所以还不如直接买 intel 的 nuc 华尔街峡谷，毕竟从 nuc8 的黑苹果一路走过来的。什么都不用改，直接用豆子峡谷的 vesa 壁挂。但是也有一些问题。

## 大小核的问题

12 核 16 线程其实是 4 大核 8 小盒，所谓大小核问题，就是在以 vmware 为首的很软件，经常出现小核跑满大核限制的情况，然而在任务管理器中还显示 CPU 占用 100%。 <!--more-->

![大核围观](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/226d7d36d7d81004813969549ca17af.jpg)

需要在电源模式中开启性能模式，然后才能解开大小核的显示，后续的时候没有发现特别不适应的地方。

![开启性能模式](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/20230206090754.png)

<!-- more -->

![修复之后的大小核](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/image-20230206090907348.png)

## 显示器延迟问题

因为主机是双 HDMI 和双 typec 的接口，所以必须要接一台 typec 的的显示器，但是 Philip 网红显示器接上有很长的延时点亮问题，有时候甚至比开机时间还要长，同时也咨询过 intel 和 Philip 的售后支持人员，答复如下：

- intel：从 Xe 显卡开始就有这种兼容问题，存在和 philip，aoc 部分型号的兼容问题
- philip：客服说显示器 10s 点亮正常，到了售后说是更长的时间，最后到厂家说 32s 才正常（东西不错，售后真的太差。。。

另外显示器有时候不能 4K60@刷新，客服说要把显示器的 hub 改成 2.0，但是这样就只能接一些键鼠摄像头一类的东西了。

![](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/17fd7fcd64712dd242b6c3db3144daa.jpg)

## 2.5g 网口驱动问题

2.5G 驱动目前好像只能离线安装。目前 win10 和 win11 系统内部没有集成 2.5G 网口的驱动，所以需要手动去官网下载驱动，然后手动安装。这里不太推荐驱动精灵一类的第三方软件。但是其他驱动只能联网之后安装，所以还是先准备个 U 盘吧。

## Win11 强制登陆 MS 账户

win11 虽然很丑，但是据说只有这个对大小核兼容好一点，现在只有企业版核教育版可以不用强制登陆 MS，其他的都绕不过去，有的输入神秘代码亲自测无效，估计是 MS 家修复了这个问题。

## 系统缓存的问题

装好系统之后，遇到了 C 盘占用特别高的问题，网上查询之后是因为内存太大，导致 OS 自动做了休眠文件，为了把内存都压到磁盘里。

![](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/7525dec0f39e5c5c9644a569cb09733.jpg)

## PCLE4

唯一值得安慰的是 PCLE4 的 NVME，顺序读取有 6600MB/S，总之还算不错。但是总归是 TLC 的，毕竟我连 MLC 都能写坏...

![PCLE4](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/image-20230206100743367.png)

![aida64](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/image-20230206101325494.png)

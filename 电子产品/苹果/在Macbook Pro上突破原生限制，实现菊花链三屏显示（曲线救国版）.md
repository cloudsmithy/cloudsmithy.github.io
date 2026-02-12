---
title: 在Macbook Pro上突破原生限制，实现菊花链三屏显示（曲线救国版）
categories: Apple
tags:
  - Apple
abbrlink: cb0bcf1b
date: 2026-02-09 00:00:00
---

Macbook Pro 原生只支持外接两个4K显示器，接第三个显示器就黑屏，意外在网上看到了display link的方案。于是买回来突破了原生的MacOS的限制。


![](https://fastly.jsdelivr.net/gh/bucketio/img9@main/2026/02/09/1770635368544-93b0e056-1749-4693-9b45-8c88258c7930.png)
<!-- more -->
我买的：display link 是这个配置：

- 输入可以切换Typec + USB
- 输出是俩HDMI
- 还有几个USB2.0: 没啥用 hhhh，也就接个耳机和键鼠

需要下载驱动Displaylink manager，然后系统里就能看到你在共享屏幕，
不管你在哪家买的硬件，应该用的都是这个软件。

![](https://fastly.jsdelivr.net/gh/bucketio/img16@main/2026/02/09/1770634898066-7197f9eb-170a-4478-8ac2-7e4ea889b7c0.png)


Macbook Pro有三个Typec口，打算预留一个TypeC给其他设备，所以一开始用2个TypeC + 一个HDMI，而Display link也是实现的Typec转HDMI，所以整体的线就很乱。

```
Macbook
1. -> TypeC - 显示器1
2. -> HDMI - 显示器2
3. -> TypeC(Display link) - HDMI - 显示器3
```

如果用Typec普通拓展坞接出来的HDMI是4K@30， 直接TypeC就是 4k@60。

突发奇想如果直接把USB接到显示器2上呢，好消息是能亮，还能4k@60，这不就是变相的菊花链～ MacOS不支持，但是Display link可以啊！！

虽然性能不如PCLE直连，不过CPU额外的算力对M芯片也不算啥，线都扔在后面了，桌面也比以前干净了。

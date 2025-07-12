---
title: 高版本的MacOS如何降级？
categories: Apple
tags:
  - Apple
abbrlink: 5b6f9bd
date: 2025-07-08 00:00:00
---

很早问过Apple客服MacOS的降级机制，半天也没说明白。但是M芯片的Macbook经常崩溃，如果说windows的蓝屏时，那我这个MacBook就能崩溃出彩虹色。

寻找过Apple支持，答案就是升级系统。Apple的行政关系团队给我找了一个非常不靠谱的人，一问三不知，问她什么就是再转问工程团队，然后所有的事情都推第三方软件。然后行政关系团队陈某说对技术不做评价，然后一再坚持他们的人都是专业培训上岗的，然后坚持不换人，坚持不解决电脑问题来给客户扣不配合的帽子。
<!-- more -->
然后一直拖到过保。以前iphone接不到电话是这样，现在Macbook还是这样。

言归正传。Mac刷机一般几种办法。

1. U盘刷机，这个是传统了，玩过PE的都懂。
2. 系统内格式化：就跟手机差不多的那种。个人感觉不彻底。
3. DFU刷机：需要你有另外一个MacOS的电脑。类似于安卓线刷。



MacOS降级我采用的是U盘装机。参考这个帖子

https://support.apple.com/zh-cn/101578

从Apple Store下载OS，然后把U盘的label改成/Volumes/MyVolume，最后做随身碟

![image-20250708203135382](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250708203135382.png)



可以选择各个MacOS大版本的最后的release。

![image-20250708203344815](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250708203344815.png)

烧录命令是：

```bash
sudo /Applications/Install\ macOS\ Ventura.app/Contents/Resources/createinstallmedia --volume /Volumes/MyVolume
```

如果需要其他的系统，那么换一个版本号即可。

我的23年的M2 Pro，当时出长的时候是MacOS13 Ventura，所以当我想换回MacOS12的时候下载都报错。

![image-20250708203409606](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250708203409606.png)

如果直接安装还会报错：这个卷无法降级。（不理解这个操作，windows的话随便格式化）

![de83700ed1e47e0386ebf756f594c4d3](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/de83700ed1e47e0386ebf756f594c4d3.jpg)

需要进入磁盘工具降级：

![img](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/v2-674c2048221fed20e5536c5aa67ff964_1440w.webp)



然后安装就可可以了，剩下就是漫长的等待。

![image-20250708203801861](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250708203801861.png)



从Intel黑苹果时代走过来的，结果白的还没黑的好用。。。。


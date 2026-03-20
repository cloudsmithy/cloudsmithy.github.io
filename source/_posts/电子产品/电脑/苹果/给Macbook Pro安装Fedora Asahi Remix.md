---
title: 给Macbook Pro安装Fedora Asahi Remix
description: 16G MacBook Pro 内存不够用，安装 Fedora Asahi Remix 做双系统的完整过程。
categories:
  - 电子产品
  - 电脑
  - 苹果
tags:
  - Apple
date: 2026-02-23 00:00:00
---

16G的Macbook 经常出问题，应该是内存太小吧，所以安装一个Linux做双系统吧，Asahi搞定UEFI这层，本质上还是Fedora。

![655cadefb7a4b564f74c0f5e98948e51](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/655cadefb7a4b564f74c0f5e98948e51.png)

起码目前阶段对我的M2 Macbook 兼容还不错，打算尝尝鲜。

<!-- more -->

![image-20260222132234359](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260222132234359.png)

没找到图形化安装或者ISO，只找到这个命令来做安装。

```
curl https://alx.sh | sh
```

纯CLI的安装方式其实没那么太友好，一开始显示还有200多G的空间但是

![image-20260222132037311](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260222132037311.png)

##### 查看本地快照

在终端中运行：

```bash
tmutil listlocalsnapshots /
```

##### 删除所有本地快照

**方法 A（推荐）：** 批量删除所有快照

```bash
tmutil listlocalsnapshotdates | grep "-" | xargs -n1 sudo tmutil deletelocalsnapshots
```

**方法 B：** 逐个删除（如果方法 A 无效）

```bash
sudo tmutil deletelocalsnapshots 2024-01-15-123456
```

##### 验证清理结果

```bash
tmutil listlocalsnapshots /
```

应该显示为空或 "No local snapshots on this date"。

![c4c30e27c6856d125a4d11124b0e4787](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/c4c30e27c6856d125a4d11124b0e4787.png)

然后就是压缩MacOS磁盘给一个部分到这个Fedora，压缩磁盘的时候MacOS页面会卡死一阵子。

![image-20260222131857852](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260222131857852.png)

然后就是选容量和系统类型。剩下就是漫长的等待。

![image-20260222134309125](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260222134309125.png)

然后会把第一引导项改成Fedora。

- 第一次安装：中间断网了，重装
- 第二次安装：无限重启重启（因为手贱按了两次开机键，实际长按看见引导就行）
- 第三次成功（要安装之后关机25秒后再开）

剩下就是无脑跟着提示走，安全模式设置，然后就是初始化了。

嗯，Retina屏幕看啥都好看，在MacOS越做越烂的这些年，换个Linux玩玩吧。

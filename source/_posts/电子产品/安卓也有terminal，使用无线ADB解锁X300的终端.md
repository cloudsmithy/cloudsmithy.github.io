---
title: 安卓也有terminal，使用无线ADB解锁X300的终端
tags: 外设
toc: true
categories: 外设
date: 2026-02-20 00:00:00
---

刷视频的时候看见有人说X300自带了一个终端，所以打算复现一下。

我的手机上安装甲壳虫ADB一直闪退，所以使用无线ADB，开启之后效果大概这样子。

![image-20260220225346095](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260220225346095.png)

### 无线ADB

需要先打开开发者模式，然后在Mac上安装ADB。

```
brew install android-platform-tools
adb version
```

 <!--more-->

X300的ADB用的不是常用的5555端口，所以需要在这里找到配对码和配对端口（port1）。

![image-20260220230044192](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260220230044192.png)

大改就是先 adb pair 然后再 adb connect ，需要注意的是port1和port2是俩不同的端口。

Port1: 配对端口

Port2: 连接端口

```
(base) ➜  ~ adb pair ip:port1
Enter pairing code: xxxxx
Successfully paired to ip:port [guid=adb-10AG1G06C9005PH-m5M0Ww]
(base) ➜  ~ adb connect ip:port2
connected to 192.168.5.25:40779
(base) ➜  ~ adb devices
List of devices attached
ip:port2 	device


```

然后adb查看手机软件：

```
adb -s ip:port shell pm list packages | grep terminal

package:com.android.virtualization.terminal

```

### 解锁终端

然后使用这个命令解锁终端，看到enabled之后就可以使用手机查看了。

```
adb -s ip:port shell pm enable com.android.virtualization.terminal
Package com.android.virtualization.terminal new state: enabled
```

![image-20260220225332746](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260220225332746.png)

在手机里看操作系统信息，竟然是debian，不过看起来是纯内网使用。

![272987be9a4409949276b5c42bb0c5f8](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/272987be9a4409949276b5c42bb0c5f8.jpg)

可以调整磁盘大小。

![image-20260220225251412](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260220225251412.png)

还可以调整端口。

![image-20260220225242353](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260220225242353.png)

从这里看好像是一个没有不联网的Linux虚拟机，不过崩溃的频率还是有点高，有条件还是自己弄VPS尝鲜吧。

![image-20260220230710644](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260220230710644.png)

---
title: 使用 MacOS 给泰山派烧录镜像
tags: 硬件
toc: true
categories: 硬件
date: 2025-08-09 00:00:00
---

MacOS 单系统单系统一直用了这么多年，最近捡起来硬件，也顺便记录下 MacOS 烧录泰山派 RK3568 的过程。官方教程写得比较简略，踩了几次坑后，整理一下记录，也算是给同样习惯用 Mac 的朋友一个参考。

官方文档参考链接：
[泰山派烧录镜像说明（官方 Wiki）](https://wiki.lckfb.com/zh-hans/tspi-rk3566/system-usage/img-download.html)

 <!--more-->

### 准备工具

嘉立创网盘提供了烧录工具 `upgrade_tool`，Mac 上直接下载即可。
下载后，记得先给执行权限：

```bash
chmod +x upgrade_tool
```

主要参考了这个文章，提供了有效的 Mac 烧录方法：
[知乎参考文章](https://zhuanlan.zhihu.com/p/684922505)

### 硬件连接

1. 泰山派上电开机，用 Type-C 接口接到 Mac。
   ⚠️ 一定要用**高速数据线**，很多 Type-C 线只支持充电，没数据功能，用这种线是可能识别不了设备，就算能够识别只有几兆的速度。烧录镜像通常几个 GB 大小，速度差的线也容易出错。

2. 按住开发板上的 **REC 按键**（不松手）。

![image-20250921200130465](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250921200130465.png)

3. 轻按一下 **RST 按键**（复位），立即松开，但仍然保持 REC 键按下。

此时设备进入 Loader 模式，可以在 Mac 端确认：

```bash
./upgrade_tool ld
```

正常输出会显示类似：

```
Program Log will save in the /Users/xu/upgrade_tool/log/
List of rockusb connected(1)
DevNo=1 Vid=0x2207,Pid=0x350a,LocationID=1 Mode=Loader SerialNo=86b2acaf11e3305
```

![识别设备](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250921195537592.png)

如果能看到 `Mode=Loader`，就说明设备被正确识别了。

### 烧录镜像

官方镜像是 `update.img`，把它放到与工具同一目录下，执行：

```bash
./upgrade_tool uf update.img
```

正常会输出烧录进度，比如：

```
Program Log will save in the /Users/xu/upgrade_tool/log/
ftruncate: Invalid argument
Loading firmware...
Support Type:RK3568 FW Ver:1.0.00 FW Time:2024-09-19 08:50:15
Loader ver:1.01 Loader Time:2024-09-18 17:38:28
Download Image Total(4957941K),Current(2925601K)
Download Image Total(4957941K),Current(4066337K)
Upgrade firmware ok.
```

最后出现 `Upgrade firmware ok.` 就表示烧录完成，可以松开 REC 键了。

### 总结

整体流程下来，其实在 MacOS 上烧录泰山派并不复杂：

- 核心是 `upgrade_tool` 工具 + 正确的键位操作；
- 数据线质量很关键；
- 日志里的部分报错不用慌，只要最后有 `Upgrade firmware ok.` 就算成功。

![成功识别](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250921195305486.png)

---
title: 安卓ADB提取APK安装包
description: 通过无线 ADB 连接安卓设备，使用命令行提取已安装应用的 APK 安装包。
tags:
  - 手机
date: 2026-02-22
categories:
  - 电子产品
  - 软件技巧
---

之前的文章写了如何使用无线调试ADB，那么我们就可以用adb提取安装包了。

```
adb shell pm list packages
```

这里会列出很多app的包名，如果你知道叫啥名字页可以grep过滤一下。

然后，可以用这个命令看包名的地址。会给一个地址

```bash
adb shell pm path <包名>
```

然后使用adb pull这个地址，就可以在当前路径得到apk。

```bash
adb pull <地址>
```

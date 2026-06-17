---
title: MacOS的LWScreenShot，锁屏以后还能截图
description: MacOS的LWScreenShot，锁屏以后还能截图
categories: MacOS
date: 2026-04-17 00:00:00
---

早上起来，发现自己的屏幕多出来了LWScreenShot页面，甚至一度以为电脑被别人黑了， 后来查询发现是MacOS自己的机制。

 ### LW = Login Window

谜底很简单：**LW 就是 Login Window（登录窗口）的缩写**。

macOS 的截图功能在锁屏界面也是生效的。你在锁屏状态下按了 `Command + Shift + 3`，系统照样老老实实截了一张图，只不过文件名前缀从 `Screenshot` 变成了 `LWScreenShot`。

就这么回事，不是被黑了。

`Command + Shift + 3`可以在锁屏下截屏，`Command + Shift + 4`可以在OS内部截图。

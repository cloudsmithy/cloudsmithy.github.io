---
title: 早上起来，Chrome 白屏了……
tags: 外设
categories: 外设
abbrlink: a3db028b
date: 2025-09-07 14:43:24
---

今天一早打开电脑，习惯性点开 Chrome，结果迎面而来的是一片空白。
不是网络卡顿的那种，而是整个浏览器彻底“黑化”：

- 网页打不开
- 设置页一片白
- 就连 F12 的开发者工具也完全空白

![c207a233d51a7dc81f1a54c15230b678](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/c207a233d51a7dc81f1a54c15230b678.png)

 <!--more-->

当时整个人都愣住了，Chrome 好像一夜之间“失魂落魄”。

### 怀疑的方向

重启浏览器、重启电脑都没用。只好先切到 Safari 搜了下，结合我前几天的操作，很快锁定了问题。

几天前为了玩《植物大战僵尸 2》网页版，我调整过 **Chrome 的 ANGLE 渲染引擎**。没想到新版 Chrome 对这个配置并不兼容，直接导致渲染器初始化失败，从而整机白屏。

![ee3e914b38cd4dbe36d1acee7f7dd4ab](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/ee3e914b38cd4dbe36d1acee7f7dd4ab.png)

### 临时解救办法

既然问题出在 GPU 渲染，那就先让 Chrome 绕开 GPU，加速器禁用掉再说。
在 macOS 上，可以用命令行启动：

常规方式：

```bash
open -a "Google Chrome" --args --disable-gpu
```

绝对路径方式：

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --disable-gpu
```

这样 Chrome 会强制禁用 GPU，页面就能正常显示了。

### 根治步骤

进入浏览器后，把图形渲染器改回默认模式，再重启 Chrome，一切恢复正常。

![image-20250913105536049](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250913105536049.png)

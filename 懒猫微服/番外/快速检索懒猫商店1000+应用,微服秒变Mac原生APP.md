---
title: "把懒猫 Web 应用放进 Mac 程序坞：Chrome 与 Safari 的设置方法"
description: 用 Chrome 或 Safari 把常用的懒猫 Web 应用添加到 Mac 程序坞，直接打开网盘、清单和 ONLYOFFICE，减少反复查找。
original_title: "快速检索懒猫商店1000+应用,微服秒变Mac原生APP"
categories:
  - 懒猫微服
  - 番外
tags:
  - 懒猫微服
toc: true
abbrlink: ce3905e3
date: 2025-05-07 00:00:00
updated: '2026-09-23'
---

写这篇时，懒猫商店已经有 1000 多款应用。日常使用清单、网盘时，总要重新查找入口，有些不便。我把常用网页添加到了 Mac 的程序坞，点击图标就能打开。

下面分别记录 Chrome 和 Safari 的设置方法。

### 用 PWA 打开常用应用

不少现代网站都支持 **PWA（Progressive Web App）**，简单来说，就是让网页像 App 一样运行：

- 可以像应用一样安装在本地
- 点击图标就能打开独立的应用窗口
- 界面简洁，没有多余的地址栏和标签页

下面是懒猫清单的安装效果：

![懒猫清单 PWA 效果图](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250506145822013.png)

**在 Chrome 中，满足安装条件的网站可以通过地址栏右侧的“安装应用”按钮添加。**

![添加应用](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250506144310554.png)

只需点击它，就能轻松将网页保存为应用。

> 添加后的入口更方便，但离线能用哪些功能取决于应用本身。需要连接微服的网盘和在线文档，不会因为安装了 PWA 就自动变成离线应用。

添加完成后，Finder 会打开 Chrome 应用目录。我这里添加了懒猫网盘，之后就可以从这个入口直接打开。

![Chrome应用](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250506144413958.png)

添加完桌面应用后，浏览器里会出现“在应用中打开”的提示，点击后就会进入前面懒猫清单那样的独立窗口。

![](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250506193028087.png)

### 在 Chrome 中安装懒猫 Web 应用

1. 在 Chrome 浏览器中打开你要保存的网站（如懒猫微服务）。
2. 点击右上角“更多”按钮，依次选择**投放、保存和分享 → 将网页安装为应用...**。
3. 有些网站也会直接在地址栏右侧显示“安装”图标，点一下即可快速安装。

![Chrome 安装应用步骤](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250506145022908.png)

安装时你可以自定义应用名称，这里以 OnlyOffice 为例。

没有安装桌面 Office 时，也可以从这个入口使用 ONLYOFFICE 网页版编辑文档。

![OnlyOffice 安装为应用](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250506145157209.png)

完成后，应用会存放在：

```
/Users/你的用户名/Applications/Chrome Apps.localized/
```

它们会以 `.app` 的形式出现在目录中，但运行的内容仍然是网页应用。

```bash
❰~/Applications/Chrome Apps.localized❱✔≻ ls
Icon?                懒猫清单.app/
ONLYOFFICE Docs.app/ 懒猫网盘.app/
```

![应用存放目录](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250506145210451.png)

### 如何通过 Safari 中把懒猫应用添加为 APP

对于不支持 PWA 的网站，Safari 也提供了一个类似的解决方案。

1. 在 Safari 中打开要保存的网页。
2. 选择**“文件 → 添加到程序坞”**，或者点击**“共享”按钮 → 添加到程序坞**。

![Safari 添加应用操作](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250506202105954.png)

输入自定义的应用名称，点击**“添加”**。这个应用会自动放在应用程序里面。

![输入应用名称](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250506202120973.png)

应用将会被保存到“应用程序”文件夹中，支持从程序坞、启动台或 Spotlight 快速启动。

### 直接拖拽到 Dock，一键启动

无论是通过 Chrome 还是 Safari 安装的网页 App，安装完成后都可以像普通应用一样拖到 Dock。

保持懒猫微服客户端连接后，点击 Dock 图标即可打开对应网页，省去了再去商店里查找入口的步骤。

![拖到 Dock 后效果](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250506202828139.png)

### 进阶玩法：自定义网页启动器

当然，你也可以用 Python 快速实现一个简单的网页启动器：

```python
import webbrowser

webbrowser.open("https://www.apple.com")  # 打开网页
```

支持新窗口、新标签等操作，适合简单自定义。

### 日常使用

清单、网盘和文档编辑器这些经常用的应用，放进 Dock 就够了。它们仍然依赖原来的网页服务，只是入口变得顺手了一些。

![image.png](https://lzc-playground-1301583638.cos.ap-chengdu.myqcloud.com/guidelines/459/b551e149-48d5-4b6c-b570-65f295961d4b.png "image.png")

---

<!-- wangjishanren-qrcode:start -->
<p align="center">
  <a href="https://developer.lazycat.cloud/assets/wangjishanren-qrcode.Bx4A1xuG.jpg">
    <img src="https://developer.lazycat.cloud/assets/wangjishanren-qrcode.Bx4A1xuG.jpg" alt="忘机山人二维码" width="240">
  </a>
</p>
<p align="center">扫码关注「忘机山人」</p>
<!-- wangjishanren-qrcode:end -->

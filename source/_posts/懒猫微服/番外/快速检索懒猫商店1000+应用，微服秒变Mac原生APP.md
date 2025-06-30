---
titile: 快速检索懒猫商店1000+应用，微服秒变Mac原生APP
tags: PWA
toc: true
categories: 懒猫微服
date: 2025-07-02 00:00:00
---

懒猫商店如今已有 1000+ 应用，日常使用中经常要在搜索栏反复查找，着实有些不便。有没有更简单的方法呢？答案是：**可以直接把网页保存成 Mac 应用，像手机 App 一样快捷打开！**

下面就手把手教大家几种实用的方法。

### 优雅方案——PWA

在 Mac 上，我们有更高级的玩法。
不少现代网站都支持 **PWA（Progressive Web App）**，简单来说，就是让网页像 App 一样运行：

- 可以像应用一样安装在本地
- 点击图标就能直接启动，无需打开浏览器
- 界面简洁，没有多余的地址栏和标签页

下面是懒猫清单的安装效果：

![懒猫清单 PWA 效果图](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250506145822013.png)

**支持 PWA 的网站，在地址栏右侧会自动弹出“安装应用”按钮。**

![添加应用](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250506144310554.png)

只需点击它，就能轻松将网页保存为应用。

> PWA 的优点：速度快、体验好、支持离线，真正做到了网页与 App 的无缝结合。

通过 PWA 添加之后，会在 Finder 里弹出 Chrome 应用，我这里添加了懒猫网盘，懒猫原生的 APP 基本都是带 PWA 的，所以这一点体验很好。

![Chrome应用](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250506144413958.png)

添加完桌面应用之后，浏览器会有“在应用中打开”的提示，点击就可以像 APP 一下打开，就是前面第二张懒猫清单的图片。

![](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250506193028087.png)

### 如何通过 Chrome 中安装懒猫 Web 应用

1. 在 Chrome 浏览器中打开你要保存的网站（如懒猫微服务）。
2. 点击右上角“更多”按钮，依次选择**投放、保存和分享 → 将网页安装为应用...**。
3. 有些网站也会直接在地址栏右侧显示“安装”图标，点一下即可快速安装。

![Chrome 安装应用步骤](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250506145022908.png)

安装时你可以自定义应用名称，这里以 OnlyOffice 为例。

这样做还可以解决 Mac 没有 Office 订阅的痛点，直接通过网页版弥补。

![OnlyOffice 安装为应用](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250506145157209.png)

完成后，应用会存放在：

```
/Users/你的用户名/Applications/Chrome Apps.localized/
```

它们会以`.app`格式存在，完全就像普通 Mac 应用一样。

```bash
❰~/Applications/Chrome Apps.localized❱✔≻ ls
Icon?                懒猫清单.app/
ONLYOFFICE Docs.app/ 懒猫网盘.app/
```

![应用存放目录](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250506145210451.png)

---

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

只需保持懒猫微服务后台连接，点击 Dock 图标，就能立即打开应用，体验和原生 App 无异！

![拖到 Dock 后效果](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250506202828139.png)

### 进阶玩法：自定义网页启动器

当然，你也可以用 Python 快速实现一个简单的网页启动器：

```python
import webbrowser

webbrowser.open("https://www.apple.com")  # 打开网页
```

支持新窗口、新标签等操作，适合简单自定义。

# 结语

通过以上方法，我们就可以把常用的懒猫 APP 变成 Mac 的桌面应用，随时一键直达，告别繁琐的搜索过程，体验飞跃式提升！

![image.png](https://lzc-playground-1301583638.cos.ap-chengdu.myqcloud.com/guidelines/459/b551e149-48d5-4b6c-b570-65f295961d4b.png "image.png")

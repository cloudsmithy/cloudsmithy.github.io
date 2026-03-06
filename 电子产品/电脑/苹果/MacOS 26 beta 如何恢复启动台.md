---
title: MacOS 26 beta 如何恢复启动台
tags: Apple
toc: true
categories:
  - 电子产品
  - 电脑
  - 苹果
abbrlink: 83eb1399
date: 2025-06-22 00:00:00
---

苹果最新版的系统使用了年份命名，主要是毛玻璃风格，虽然毛玻璃用了几天慢慢习惯了。

另一个槽点是 apple 把启动台去掉了，改成了 apps，用搜索栏统一搜索。

![afe4c7a5c5be827826a5052bef99b15d](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/afe4c7a5c5be827826a5052bef99b15d.png)

除了检索应用，也能检索邮件和文件什么的，属于是一键搜索了。

<!-- more -->

![f2ffc0aca969718696707c309990f94a](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/f2ffc0aca969718696707c309990f94a.png)

那么我们怎么改原来的启动台呢？执行这两个命令然后重启：

```bash
sudo mkdir -p /Library/Preferences/FeatureFlags/Domain

sudo defaults write /Library/Preferences/FeatureFlags/Domain/SpotlightUI.plist SpotlightPlus -dict Enabled -bool false
```

GPT 解释如下：

````
#### 第 1 行：

```bash
sudo mkdir -p /Library/Preferences/FeatureFlags/Domain
```

* 创建一个目录用于配置 **macOS 内部功能标志（FeatureFlags）**。
* `-p` 参数确保中间目录不存在时也一并创建。

#### 第 2 行：

```bash
sudo defaults write /Library/Preferences/FeatureFlags/Domain/SpotlightUI.plist SpotlightPlus -dict Enabled -bool false
```

* 使用 macOS `defaults` 命令写入系统级别的配置文件。
* `SpotlightUI.plist` 是控制 Spotlight（聚焦搜索）的功能标志文件。
* `SpotlightPlus` 是 macOS 14 Sonoma 起的一个实验性 Spotlight 增强功能。
* `Enabled -bool false` 意思是**禁用 Spotlight Plus（新版搜索界面）**。

---

### 🧩 背景用途：

这个配置被用来：

| 场景                 | 描述                                       |
| ------------------ | ---------------------------------------- |
| 💻 macOS Sonoma 用户 | 禁用默认启用的“Spotlight Plus”功能，恢复旧版 Spotlight |
| 🧪 实验功能控制          | macOS 通过隐藏的 feature flag 启用或禁用某些 GUI 功能  |
| ⚙️ 解决兼容问题          | 有些用户觉得新版 Spotlight 太慢或不兼容快捷键脚本，想禁用       |

---

### 🚨 注意事项：

1. 更改后可能需要 **重启系统或注销登录** 才能生效。
2. 如果系统升级，Apple 可能会重置该设置。
3. 这种方法是“非公开支持”的隐藏设置，未来 macOS 可能废弃此路径。

---

如果你想恢复 Spotlight Plus，只需执行：

```bash
sudo defaults delete /Library/Preferences/FeatureFlags/Domain/SpotlightUI.plist SpotlightPlus
```

或者将 `-bool true` 写回去。

---

如你还有其他想隐藏或禁用的 macOS 功能（比如 Siri、Stage Manager、控制中心某模块），我可以帮你查找对应的 `defaults write` 配置。需要吗？

````

重启之后我们的启动台就回来了：

![dbd2d68cadcb6d80d8df9cbfe240dace](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/dbd2d68cadcb6d80d8df9cbfe240dace.png)

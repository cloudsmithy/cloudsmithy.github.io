---
title: macOS HiDPI 配置笔记：BetterDisplay 与 M2 脚本调整
date: '2024-05-23 18:27:49'
updated: '2024-05-31 00:12:17'
abbrlink: '53738e12'
categories:
- 电子产品
- 外设
tags:
- Apple
- 外设
description: 记录使用 BetterDisplay 调整 macOS 显示设置，以及修改 one-key-hidpi 的设备识别函数来适配 M2 的过程。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/139154882
source_title: MacOS开启HIDPI的几种方案
---

这篇保留 2024 年整理的显示设置与脚本修改记录，涉及 BetterDisplay 和 one-key-hidpi。下面的函数调整针对当时的 M2 环境，使用时需要对照自己的系统和脚本版本。

BetterDisplay 是一个功能丰富的显示管理工具，可以为 macOS 提供自定义分辨率、XDR/HDR 额外亮度、虚拟屏幕、画中画、显示断开、显示和 EDID 覆盖等功能。以下是安装和使用 BetterDisplay 的指南：

1. **下载和安装**：

   - 访问 [BetterDisplay GitHub 页面](https://github.com/waydabber/BetterDisplay)。
   - 下载与系统兼容的发布版本。
   - 打开下载的 `.dmg` 文件并将 BetterDisplay 拖到应用程序文件夹中。
   - 启动 BetterDisplay 应用程序。
2. **配置和使用**：

   - **自定义分辨率**：

     - 启动 BetterDisplay 后，在菜单栏中点击其图标。
     - 选择 “Display Settings”。
     - 在 “Resolution” 选项卡中，可以添加和选择自定义分辨率。
   - **XDR/HDR 额外亮度**：

     - 在菜单中选择 “XDR/HDR Settings”。
     - 调整亮度滑块以获得额外的亮度。
   - **虚拟屏幕**：

     - 在菜单中选择 “Virtual Displays”。
     - 点击 “Create New Virtual Display” 创建新的虚拟屏幕。
     - 可以在虚拟屏幕上进行各种操作，例如扩展桌面等。
   - **画中画 (Picture in Picture)**：

     - 选择 “Picture in Picture” 选项，可以将一个窗口固定在其他窗口之上，方便进行多任务处理。
   - **显示断开**：

     - 在菜单中选择 “Display Disconnect” 可以断开不需要的显示器连接。
   - **显示和 EDID 覆盖**：

     - 选择 “EDID Overrides”。
     - 可以手动输入或导入 EDID 数据来覆盖显示器的默认设置。

BetterDisplay 提供了丰富的功能来增强 macOS 显示设置的灵活性和控制能力，适合需要自定义和高级显示管理的用户。

对于更详细的功能使用说明，可以查看 [BetterDisplay 的 GitHub 页面](https://github.com/waydabber/BetterDisplay)上的文档。

针对M2芯片进行HiDPI修改，以下是具体步骤：

1. **下载并解压项目包**：

   - 访问并下载开源项目：[one-key-hidpi](https://github.com/xzhih/one-key-hidpi)
   - 解压下载的项目包。
2. **修改`hidpi.sh`文件**：

   - 打开项目包中的`hidpi.sh`文件，找到`get_vidpid_applesilicon`函数。
   - 根据以下内容进行修改：

   **修改前**：

   ```sh
   function get_vidpid_applesilicon() {
       ...
       # Get VIDs, PIDs, Prodnames

       local vends=($(ioreg -arw0 -d1 -c $appleDisplClass | xpath -q -n -e "$vendIDQuery"))
       local prods=($(ioreg -arw0 -d1 -c $appleDisplClass | xpath -q -n -e "$prodIDQuery"))

       set -o noglob
       IFS=$'\n' prodnames=($(ioreg -arw0 -d1 -c $appleDisplClass | xpath -q -n -e "$prodNameQuery"))
       set +o noglob
   ```

   **修改后**：

   ```sh
   function get_vidpid_applesilicon() {
       # Get VIDs, PIDs, Prodnames

       # local vends=($(ioreg -arw0 -d1 -c $appleDisplClass | xpath -q -n -e "$vendIDQuery"))
       # local prods=($(ioreg -arw0 -d1 -c $appleDisplClass | xpath -q -n -e "$prodIDQuery"))

       local vends=($(ioreg -l | grep "DisplayAttributes" | tail -n +2 | sed -n 's/.*"LegacyManufacturerID"=\([0-9]*\).*/\1/p'))
       local prods=($(ioreg -l | grep "DisplayAttributes" | tail -n +2 | sed -n 's/.*"ProductID"=\([0-9]*\).*/\1/p'))

       set -o noglob
       # IFS=$'\n' prodnames=($(ioreg -arw0 -d1 -c $appleDisplClass | xpath -q -n -e "$prodNameQuery"))
       IFS=$'\n' prodnames=($(ioreg -l | grep "DisplayAttributes" | tail -n +2 | sed -n 's/.*"ProductName"="\([^"]*\)".*/\1/p'))
       set +o noglob
   ```
3. **保存并运行脚本**：

   - 保存修改后的`hidpi.sh`文件。
   - 按照项目提供的使用说明，运行脚本以启用HiDPI设置。

更多详细步骤和信息可以参考知乎上的文章：[链接](https://zhuanlan.zhihu.com/p/697043685)。

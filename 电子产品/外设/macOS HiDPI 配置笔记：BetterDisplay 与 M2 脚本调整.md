---
title: macOS HiDPI 配置笔记：BetterDisplay 与 M2 脚本调整
date: '2024-05-23 18:27:49'
updated: '2026-09-23'
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

我把 BetterDisplay 的安装和显示设置入口记在下面，包括分辨率、亮度、虚拟屏幕和 EDID。菜单名称对应当时的版本：

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

对于更详细的功能使用说明，可以查看 [BetterDisplay 的 GitHub 页面](https://github.com/waydabber/BetterDisplay)上的文档。

另一部分是针对 M2 环境调整 one-key-hidpi 的显示器识别函数。下面只列出需要替换的片段，省略了函数的其他部分：

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

   - 保存修改后的 `hidpi.sh` 文件。
   - 按照项目提供的使用说明运行脚本，不要把上面的函数片段单独当成完整脚本执行。

这部分调整还参考了[原笔记保存的知乎文章](https://zhuanlan.zhihu.com/p/697043685)。

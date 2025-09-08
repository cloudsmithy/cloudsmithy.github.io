---
title: 硬件探索记 Tuya 篇（一）：初识 T5 AI 开发板，先配置个环境吧
tags: 外设
toc: true
categories: 外设
date: 2024-01-02 00:00:00
---

之前因为 AI 小智才玩过 ESP32S3，摸索了一遍 ESP-IDF 的开发流程。最近又被朋友种草了 Tuya，正好申请到了一块开发板，就顺便来玩玩。板子第二天就寄到了，还额外附送了一块屏幕。因为出门只带了 联想口红电源，所以我直接用它给开发板供电（当然，直连电脑也可以完成烧录和调试）。

image-20250827231911572
玩硬件，其实也是在找回一些失去的记忆。

TuyaOpen SDK 简介
这次用到的 SDK 叫 TuyaOpen，它的定位类似 ESP-IDF CLI：

• 一样是从 GitHub 拉取开发工具链
• 支持编译、烧录、串口调试
• 提供了官方示例（apps/tuya_cloud 下有很多 demo）
这套工具链对习惯了 ESP-IDF 的人来说几乎是“无缝迁移”。

开发环境配置（macOS 示例）
我这边使用的是 macOS 环境，常用命令如下：

# 1. 克隆源码

git clone https://github.com/tuya/TuyaOpen.git

# 2. 加载环境变量（类似 ESP-IDF 的 export.sh）

. ./export.sh

# 3. 进入示例工程

cd apps/tuya_cloud/switch_demo

# 4. 配置工程（类似 idf.py set-target xxx）

tos.py config choice

# 5. 编译工程

tos.py build

# 6. 烧录到开发板

tos.py flash

# 7. 打开串口监控

tos.py monitor
注释说明
• tos.py config choice：配置芯片型号或项目参数，和 idf.py set-target 类似
• tos.py build：编译整个工程，输出 bin 文件
• tos.py flash：将编译好的程序写入开发板
• tos.py monitor：打开串口调试，实时查看日志
这个过程第一次会拉一堆开发工具链。

✅ 小贴士：tos.py 本质上和 idf.py 是同一个思路，习惯了 IDF 的命令行，就能很快上手。

不过需要注意的是，这三个命令并不能连在一起使用，这个是和 ESP IDF 不同的地方。

image-20250827234004157
在 Linux 下大家习惯用 lsusb，而在 macOS 上则需要借助系统自带命令。

方式一：system_profiler
system_profiler SPUSBDataType
能看到所有 USB 总线和设备的详细信息。

方式二：ioreg
ioreg -p IOUSB
会以树状结构列出 USB 设备。

方式三：安装 usbutils（提供 lsusb 命令）
我自己装了 usbutils，所以也能直接跑：

➜ ~ watch -n 1 lsusb
➜ ~ lsusb
Bus 000 Device 001: ID 1a86:55d2 1a86 USB Dual_Serial Serial: 5AAE169301
Bus 000 Device 000: ID 1a86:55d2 1a86 USB 3.1 Bus
✅ 小贴士：串口设备在 macOS 下一般表现为 /dev/cu.usbserial-xxxx 或 /dev/cu.usbmodemxxxx，后面烧录和 monitor 要用到。

编译与运行
在 M2 MacbookPro 上编译速度还不错，只是偶尔 CPU 会满载：

ede5b62aca1c8531f3782372d587758a
等终端出现 编译成功 (Build done) 的提示，就说明一切正常，可以进入下一步。

12891067cd795bee9559cd034766c993
串口通信
最后就是进入串口调试：

image-20250827231201445
此时如果开发板正常启动，就能在日志里看到打印输出。后续无论是控制外设还是调试联网，串口监控都是必不可少的。

谁说只有 windows 才能玩单片机的。。。

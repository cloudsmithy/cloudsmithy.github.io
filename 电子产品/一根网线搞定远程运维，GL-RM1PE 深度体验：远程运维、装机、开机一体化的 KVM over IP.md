---
title: 一根网线搞定远程运维，GL-RM1PE 深度体验：远程运维、装机、开机一体化的 KVM over IP
tags: 外设
toc: true
categories: 外设
date: 2025-09-16 00:00:00
---

一直以来，我都很喜欢 Gl.iNet 的产品。它们通常设计简洁、功能实用，既能满足极客和开发者的需求，又能兼顾家庭用户的体验。无论是路由器还是 KVM 远程管理器，Gl.iNet 在“小而美”的产品线上一直有稳定发挥。

这并不是一台路由器或者 NAS，而是一款 **KVM over IP 设备**。在传统企业机房里，这类设备往往被用来实现服务器的远程管理：即便服务器关机、系统崩溃，管理员依然可以通过远程方式查看屏幕、控制键鼠，甚至重装系统。过去，这样的功能往往属于 **Dell iDRAC、HP iLO、Supermicro IPMI** 等服务器管理模块的专属领域。但现在，Gl.iNet 把它做成了一台独立设备，价格和使用门槛也被大大降低，让普通运维人员和 Homelab 爱好者也能体验到“企业级远程管理”的能力。

 <!--more-->

换句话说，如果你想远程操作一台服务器，哪怕它彻底关机、哪怕系统崩溃，甚至你要给它重装系统，这个小小的设备都能帮你完成。这类设备过去通常是企业机房里的“高端选配”，但现在，Gl.iNet 把它带到了大众可用的价位。

### 背景与定位：KVM over IP 为什么重要？

在进入具体体验之前，我们先谈一谈 **为什么 KVM over IP 设备重要**。

传统的远程管理方式，大体可以分为两类：

- **软件级远程控制**：比如 VNC、XRDP、TeamViewer、AnyDesk。这类方案依赖目标系统正常启动、网络正常可用，才能实现远程桌面。如果系统崩溃或者驱动异常，远程就失效了。
- **硬件级远程管理**：比如服务器厂商自带的 iDRAC、iLO，或者独立的 KVM over IP。它们直接劫持视频信号和输入设备，不依赖系统和驱动，即便设备黑屏、关机，也能操作。

这就好比一台电脑出故障，软件方案只能“看得到桌面才管用”，而硬件方案则能“从按电源键那一刻就开始管理”。对于机房里的运维人员，这几乎是救命的功能。

过去个人用户或者中小企业要实现这种能力，往往需要购买昂贵的服务器管理卡。但如今，Gl.iNet 通过 GL-RM1PE 让这种能力变得可负担，也让 Homelab 用户有机会体验到企业级的远程管理。

### 产品简介：KVM + PoE = 极简方案

**GL-RM1PE** 的设计理念用一句话概括就是：**一根网线，搞定一切**。

它把三件事情整合到了一根网线上：

1. **供电**：支持 PoE（Power over Ethernet），无需额外电源适配器。
2. **网络**：千兆网口即插即用，自动联网。
3. **远程控制**：完整的 KVM 功能，覆盖键盘、视频、鼠标。

这种“单线极简”的设计，在机房和家庭实验室环境中非常有价值。机房里本来布线就复杂，减少一根电源线就意味着更高的整洁度和更低的维护成本。在家里，少一根插座电源适配器，也能让桌面和机柜更干净。

接口布局方面，设备正面依次是：

- **USB 2.0 接口**：用于连接手指机器人或其他外设
- **HDMI 接口**：采集被控设备的输出
- **USB 控制接口**：模拟键盘鼠标输入
- **RJ45 网口**：千兆接口，支持 PoE

侧面还有一个 **Type-C 供电口**，在没有 PoE 交换机的情况下，可以用外接电源。整体来看，它就像是在任何 PC/服务器上外挂了一个“远程管理模块”。

![bbf8ece3f1310f19028b2bd8c9ae700d](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/bbf8ece3f1310f19028b2bd8c9ae700d.jpg)

### 手指机器人：物理开机的最后一环

KVM 能解决大部分远程管理问题，但仍有一个关键问题：**如果设备彻底关机怎么办？**
这就是官方配套的 **手指机器人** 登场的地方。

顾名思义，它就是一个能模拟“手指按电源键”的小机械装置。

它的设计要点是：

- **模拟物理按键**：通过小机械臂实际按下电源键
- **粘贴式安装**：无需拆机或改造，直接贴在电源键上方
- **CR2 电池供电**：续航超过一年，电池可更换
- **USB 蓝牙接收器**：插在 KVM 设备上，与手指机器人配对

这样，即便远程主机彻底关机，你依然可以通过 KVM 下达指令，让手指机器人去“按电源键”。

我亲测的体验是：在管理后台端点击按钮，机柜里的手指机器人立刻按下动作，把服务器开机了。这种感觉很神奇，就像你拥有了一只可以随时帮你“按开机键”的远程手。对于远程运维人员来说，这意味着再也不用担心“系统挂掉后没人帮忙按电源键”的尴尬。

![image-20250916205357846](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250916205357846.png)

从外观来看，产品正面有 GL.iNet 的 logo 和 LED 指示灯，铝制外壳配合银灰色表面处理，质感相当不错，放在机柜里也很协调。

![2b0fb87cb199bc2d550a151ed6723597](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/2b0fb87cb199bc2d550a151ed6723597.jpg)

在机柜里的实际使用效果如下：

接口从左到右依次是：

- **USB 2.0 接口**：连接手指机器人
- **HDMI 接口**：采集被控设备输出
- **USB 控制接口**：模拟键盘和鼠标
- **RJ45 网口**：支持 POE

侧面还预留了 Type-C 供电口，如果你没有 POE 交换机，可以用外接电源。

![temp_image_for_default_share 2](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/temp_image_for_default_share%202.png)

拆开手指机器人的外壳，可以看到一个 USB 接收器和一颗 CR2 电池。电池可替换，维护成本不高。

![image-20250916140910102](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250916140910102.png)

### 网络与接入：mDNS + HTTPS 的细节优化

我家里的网络架构是中兴晴天的 **AC+AP，完全使用 POE 供电**，因此 GL-RM1PE 可以直接插在 AC 上使用（装修时预留了网口）。

接上 POE 之后，设备自动上线，可以通过路由器后台查看 IP。更方便的是，它支持 mDNS，直接访问：

```
https://glkvm.local/#/
```

就能进入后台管理页面。即使你访问的是 80 端口，那么也会被重定向到 https 的 443 端口，所以这样访问也可以。

```
glkvm.local
```

还可以通过 `ping` 查找设备 IP：

```
ping glkvm.local
PING glkvm.local (192.168.x.x): 56 data bytes
64 bytes from 192.168.x.x: icmp_seq=0 ttl=64 time=4.539 ms
64 bytes from 192.168.x.x: icmp_seq=1 ttl=64 time=4.180 ms
64 bytes from 192.168.x.x: icmp_seq=2 ttl=64 time=4.200 ms
```

![image-20250916135528389](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250916135528389.png)

### 内网体验：比 VNC 更流畅的 WebRTC

Web 管理界面是它的主要入口。

- 初次访问需设置管理员密码
- 后续输入密码即可直连，无需复杂认证流程

![image-20250916134522564](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250916134522564.png)

在内网环境下，即便是 KDE 桌面这种对图形要求比较高的环境，WebRTC 的画面流畅度和延迟表现也明显优于 VNC 和 XRDP。以前用 VNC，常常有卡顿和延迟，键盘输入延时明显；而在 GL-RM1PE 上，鼠标和键盘几乎是“秒响应”，就像本地操作一样。

![image-20250916142937202](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250916142937202.png)

它不仅解决了延迟问题，还提供了专业的视频设置：

- 支持 **H.264 编解码**
- 最高可达 **4K 输出**
- 支持分辨率 EDID 设置和画面旋转

无论是普通显示器还是特殊比例的屏幕，都能轻松适配。

声音和输入设备也做得很细致：

- **扬声器和麦克风**：可远程传输音频，延迟很低
- **键盘**：支持虚拟键盘输入，触控友好
- **鼠标**：支持光标显示、防休眠抖动、滚轮速率调整、正反滚动切换

此外，它还内置了 **剪切板共享、快捷键模拟（如 Ctrl+Alt+Del）、Wake-on-LAN、内置终端** 等功能。这些都大幅提升了远程操作的便利性，让体验接近“本地化”。

特别的是，KVM 直接采集 HDMI 输出，即便设备锁屏或休眠，也能远程操作。

![03f14c2276db4a510881219f2045963a](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/03f14c2276db4a510881219f2045963a.png)

### 虚拟媒体与 ISO 挂载：远程装机神器

远程运维里，最棘手的情况之一是 **系统需要重装**。如果没有人现场插入 U 盘或者光盘，基本无法操作。而 GL-RM1PE 提供的 **虚拟媒体挂载** 功能，几乎完美解决了这一问题。

这个非常实用的功能是 **虚拟媒体挂载**。GL-RM1PE 提供的 **虚拟媒体挂载** 功能简直是神器。GL-RM1PE 内置 **32G eMMC**，可以存放主流操作系统的 ISO 镜像。在 Web 界面即可上传 ISO，然后将其作为虚拟光驱挂载。重装系统、文件传输都非常方便。

对于远程运维人员来说，这个功能意味着：**你可以在千里之外，帮一台死机的服务器重装系统，而不需要有人在现场插 U 盘**。

![4d917cd84f2db3ea31052ed51adceef5](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/4d917cd84f2db3ea31052ed51adceef5.png)

我在 EndeavourOS x86_64 上成功挂载后，能够看到 PopOS 镜像已经挂载。

![image-20250916165613721](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250916165613721.png)

设备提供了两种方式：

1. **文件挂载**：将 eMMC 当作光驱，从系统内部传输文件。
2. **镜像挂载**：把 ISO 当作系统盘引导，用于安装新系统。

![49241b8bd223f8ac8cbf6e3465b2e3fa](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/49241b8bd223f8ac8cbf6e3465b2e3fa.png)

这个是在 BIOS 中读到的引导项，Gl.iNet Flash Drive 就是这个 GL-RM1PE 的镜像引导，和使用 CD 或者刻录的 U 旁随身碟完全一致。选择 Gl.iNet 的引导之后就进入了我们熟悉的装机环节。

![517a26f8a31ddf99ee9cd9e5f5b41480](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/517a26f8a31ddf99ee9cd9e5f5b41480.png)

### 云服务集成与公网访问：在哪里都能访问

本地用得好，但公网场景怎么办？

Gl.iNet 直接在产品里送了一个 **终身免费的内网穿透服务**。

- 电脑端可用 PC 客户端

- 手机/iPad 可直接访问 https://www.glkvm.cn

这个网址来访问。即使在公网环境下，也能远程访问设备。

因为官方提供终身了内网穿透的功能，所以这是一个买硬件送穿透服务的。

这等于硬件买了之后，官方帮你免去了搭建反向代理、DDNS 的折腾，性价比更高。

![image-20250916134157405](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250916134157405.png)

使用云服务的话，需要注册账户，然后每次需要登录这个账号。如果你有特殊的安全需要，还可以设置二次验证的 MFA。

![image-20250916135134242](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250916135134242.png)

设备绑定完成后会显示在列表中，点击远程控制时需重新输入密码，以确保远程管理过程中的安全可靠。

![image-20250916135325485](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250916135325485.png)

更强的是，它还能接入 **Tailscale**，加入私有组网，这样能够更加方便的进行异地组网。

![7d9f4078e64547fde1c274a859702cea](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/7d9f4078e64547fde1c274a859702cea.png)

如果你之前使用过 Tailscale 的话，那么只需要点点鼠标就能轻松加入之前的组里面。

![5c9ac0d91f81abfb714f415423f16ac4](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/5c9ac0d91f81abfb714f415423f16ac4.png)

我把 Macbook，群晖和 GL-RM1PE 放在了一个虚拟局域网里面，这样即使没有公网 IP 也能直接互联。

![image-20250916180627672](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250916180627672.png)

### 隐藏玩法：小型 Linux 主机

体验过程中我发现，GL-RM1PE 本身就是一台小型 Linux 机器：

- **CPU**：4 核
- **内存**：1G
- **存储**：32G eMMC
- **环境**：BusyBox

GLKVM 同时还支持终端访问，甚至可以看到是 BusyBox 的环境，这个对于开发者十分友好，甚至还可以 ssh 到内网的 Linux 机器。而且我们也能够看到，有线网卡的协商速率是 1000Mbps。

![c227c496b0e532f4bcb62cc399b81a3d](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/c227c496b0e532f4bcb62cc399b81a3d.png)

在 `htop` 里能看到完整的 4C1G 配置，用来跑 WebRTC 推流完全足够。

![image-20250916150048453](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250916150048453.png)

机器提供了 32G 的 eMMC,挂载在 `/userdata/media`，能存放系统 ISO 或作为文件服务器使用。

也就是说可以把这个硬件当作一台小型 Linux 服务器来使用，比如执行`python -m http.server`可以开启一个文件服务器，当然，BusyBox 环境不支持包管理和 Docker，但作为应急环境、调试环境，已经非常有价值。

![image-20250916164804135](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250916164804135.png)

### 竞品与行业对比：和 iDRAC、iLO、TeamViewer 的区别

如果把 GL-RM1PE 放到整个远程管理市场中，它的定位非常独特。

- **相比软件远程（VNC、XRDP、TeamViewer、AnyDesk）**：
  - 优点：不依赖操作系统，哪怕系统崩溃也能操作；延迟更低。
  - 缺点：需要额外硬件。
- **相比服务器管理卡（Dell iDRAC、HP iLO、Supermicro IPMI）**：
  - 优点：价格低得多，不绑定服务器厂商，通用性强。
  - 缺点：功能上略简单，比如缺少企业级的监控和批量管理功能。

对于个人和中小企业来说，GL-RM1PE 正好填补了中间空白：比软件方案更可靠，比企业级方案更便宜。

### 总结：远程运维的“全能工具箱”

体验下来，我认为 **GL-RM1PE + 手指机器人** 是一套完整的远程管理解决方案。它把过去属于企业级服务器的功能，带到了个人和中小企业可用的价位。

优势总结：

- 一根网线搞定供电 + 网络
- WebRTC 推流低延迟，优于 VNC/XRDP
- 内置 32G eMMC，支持虚拟媒体挂载，远程装机更轻松
- 手指机器人解决远程物理开机痛点
- 内网直连 + 官方云服务双保险
- 支持 Tailscale，扩展性强
- 自身就是一台小型 Linux 主机，调试灵活

无论是 **IT 运维工程师**，还是喜欢折腾的 **开发者与 Homelab 爱好者**，这套组合都非常值得一试。它不是冰冷的“机房专属”设备，而是把远程管理做到了极客友好、开箱即用。同时也期待 WIFI 版本的 KVM 远程控制器早日上市，这样就更加方便了。

---
title: 车机锁 Wi‑Fi 奸商跑路，高楼组 Mesh 极客破局
tags: 车载
toc: true
categories: 硬件
date: 2025-05-11 00:00:00
---

五一假期的时候家里人打算自驾游，才发现车载地图已经很多年没更新了，找不到要去的地方，于是打算重新弄下，来一个全新的体验。

车载的导航是安卓，虽然已经很久没更新过了。从早些年折腾刷机的经验来看，就算不能连接 wifi，也应该是能够用 USB 转接的。尝试一圈，基本是这个情况，流量卡失效，wifi 功能被禁用掉，USB 转接有线网卡也无法识别。

于是打电话到 4S 店询问是否能够提供些许的支持，他们转到技术，然后告诉只能把车开到他们那里去看，不提供上门的支持。而作为这个年代的资深消费者，已经有千万遍劳心费力的折腾最后被售后三两句打发走的经历。 好说歹说发一张图片过去，尽管对方语气中透着些许的不耐烦。“你这个是赠送的，我们不了解情况，不是我们原厂的东西，而且很多车机是无法升级的”。于是又开始推销了自己的产品，问到是否还会遇到上述情况，还得 case by case 来看。“你这个车已经买了很多年了，早就没有保修了。”

<!-- more -->

我的需求无外服这三种：

1. 更新高德地图数据，不管是更新版本还是导入离线包。
2. 升级 carplay，需要买一个盒子，还需要做安装 Autokit 硬件检测，最快也要明天到。
3. 刷一个有 wifi 功能的正常版本，让我正常更新数据。（最后也没实现，不过估计新版本更卡）

![image-20250511232048071](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250511232048071.png)

朋友帮我查了下这个版本的卡槽，需要把整个导航拆下来，不过弄不好还耽误用倒车影像，遂放弃。

在这个论坛：http://www.allmost.org/2019/11/android-head-unit-root-device-model.html

![image-20250511231907917](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250511231907917.png)

### 糟糕的高德地图

无法联网更新，首先想到的是离线数据包，于是致电**400-810-0080**，这次都是机器人接听，无法转人工。

然后根据提示给了我这样的一条信息。

```
【高德地图】尊敬的高德用户您好，您咨询的地图数据升级问题，操作方法：请您点击链接 https://auto.amap.com/download/map_data#public  ，选择对应版本下载即可；同时您可在下载界面点击我不会安装查看说明， 感谢您对高德的关注与支持！
```

在年初的时候还针对 Mac 端的高德地图无法更新的问题咨询客服，却被告知没有这样的产品进而“建议”使用网页版。，而我一直是在 App Store 下载的。当时几乎想到距离我两三公里的高德总部去要个说法，而这次的离线数据包更是提示升级中，无法下载。

![image-20250511221605339](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250511221605339.png)

于是退而求其次，我下载一个最新的机车版是不是会更好一些？安装之前还担心数据丢失问题，于是看到下面这个话就“放心”了。

![image-20250511222322222](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250511222322222.png)

但是安装之后，之前的离线地图全部消失，甚至很”贴心“的把之前旧数据的磁盘空间都释放了出来。原来马上爆满的磁盘空间，突然瘦身了。但，实时导航，手机同步，问题反馈都共用报错无法联网，这次而且无法回滚。不能上网的车机，不能联网的地图，被清空的旧版数据。第二次想杀到高德总部。

### ADB 的奇迹

大学同学在嵌入式行业，经验比我丰富些，于是去求助。他告诉我可以尝试通过 ADB 进入调试系统，然后使用命令行拉起来 wifi 的进程 ，看看是否能够改善。

分析之后查看到，车机的版本是 Android6.0，基于 Linux3.18 的内核，连包管理工具也没有，甚至连 top 都会把上位机卡死。于是开始分析思路，能够开启热点说明有 wifi 模块，然后依次排查进程是否启动，驱动是否安装，内核在启动时是否正常加载该驱动。那一刹那，感觉自己从调侃的修电脑，修家电，修水电，最后到了修车侠。

还好支持开发者模式，adb 调试的时候使用了甲壳虫助手，比用 USB 连接安卓 ADB 方便的多，把软件安装在车机上，不用再像以前刷机一样一遍又一遍的执行 adb device -l 查找设备，虽然这个机器慢一点，但是总归还是能够很稳的连接 ABD，然后一遍一遍尝试命令，Google，GPT，Deepseek，一遍又一遍。

![弄好已经夜深了](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250511223749490.png)

机车给了一个 USB 的接口，刚好拿来外接键盘，把 MBP 搬到车里查资料，手机开了热点越来越烫，然后就是一遍的调试，而 MBP 不能通过 adb 扫描到机车，不确定是不是和工厂模式里的设置有关系。这过程有点像刷机，有一点想像服务器上调 Linux。在此之前也想过用 USB 转 J45 连接路由器，就算没有网络的情况下，也应该能够显示一张没有网络连接的以太网卡。试验之后是完美没有，和朋友讨论之后，猜想是和内核驱动在编译的时候没有打包通用驱动或者这张卡驱动导致的。（来自之前 UFS 安装 Linux 的经验）而这个机器上完全无法执行 **lsmod** 和和 **cat /proc/modules**，而**`dmesg | grep -i "load"`**的记录也是空，实在无法想象这个系统是如何加载底层驱动的。

![image-20250511224325878](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250511224325878.png)

最后思来想去大概是这几个命令生效了，因为后来重启才发现 wifi 模块加载出来了，中间加执行了很多。

```
# 在甲壳虫中可以省略adb shell字眼

# 1. 直接指定组件启动 wifi（好像是自动进入 WLAN 搜索页面）
am start -n com.android.settings/.wifi.WifiSettings

# 2. 用系统通用 Intent（推荐）
am start -a android.settings.WIFI_SETTINGS

# 开启 Wi‑Fi
adb shell settings put global wifi_on 1


# 立即让系统刷新一次广播（有的 ROM 必须）
adb shell am broadcast -a android.intent.action.WIFI_STATE_CHANGED --ez state true


验证：
adb shell settings get global wifi_on → 返回 1；
adb shell dumpsys wifi | grep "Wi-Fi is" → 出现 enabled
```

回去看到 GPT 的提示，说**操作完一定重启**，否则配置不会写入  NVRAM。（我之前忽略了这个，走了很多弯路）

![image-20250511231504637](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250511231504637.png)

#### GPT 这些内容帮助很大，可以用来验证：

我的`dumpsys wifi`  里出现的那一行长这样，

```
Wi‑Fi is disabled
```

它只说明 **系统目前把  Wi‑Fi 开关拨到了“关”**，并不直接告诉你“有没有  Wi‑Fi  硬件”。要分清楚是“硬件存在但关掉”还是“根本没有硬件/驱动”，可以再看 4 处信号：

| 检查点              | 如何查看                               | 典型输出                | 结论                                                 |
| ------------------- | -------------------------------------- | ----------------------- | ---------------------------------------------------- | ---------------------------------------------- | --- |
| **1. Service 列表** | `adb shell service list                | grep -i wifi`           | `wifi: [android.net.wifi.IWifiManager]`              | 看到这一行 → Framework 里 **有** Wi‑Fi 服务    |
| **2. 驱动状态**     | `adb shell getprop wlan.driver.status` | `ok / ready / unloaded` | 有值 → 内核认识 Wi‑Fi 芯片；空值 → 多半缺驱动/被裁掉 |
| **3. 网络接口**     | `adb shell ifconfig -a                 | grep wlan`              | `wlan0  ...`                                         | 能看到 wlan0 → 芯片已初始化；完全没有 → 未加载 |
| **4. 内核模块**     | `adb shell lsmod \| grep -E "8188      | rt5370                  | wlan"`                                               |                                                |     |

### 结果判读

| 情况                                                          | 解释                                                   | 解决办法                                                                         |
| ------------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------- |
| **Service 有，wlan0 有，driver=ok，但 dumpsys 显示 disabled** | **硬件存在，只是软件开关关掉**                         | 用 UI 开关或`adb shell settings put global wifi_on 1`再重启 Wi‑Fi                |
| **Service 有，但 wlan0/驱动都没有**                           | Framework 在，但 **内核缺驱动/Factory 里关闭了 Wi‑Fi** | 先在工厂设置里勾选 WIFI 并保存；如仍无驱动 → 刷带 _wifi_bt_ 的 ROM 或插 USB 网卡 |
| **Service 没有（grep 不到 wifi）**                            | ROM/MCU 层完全裁掉了 Wi‑Fi                             | 只能刷完整固件或硬改/外接网卡                                                    |
| **Service 有，driver=unloaded**                               | 驱动文件在，但未成功加载                               | Factory 里未启用 / 模块版本不匹配 → 勾选保存或换匹配的系统+MCU                   |

---

### 快速打开 Wi‑Fi（无  `svc` 的情况下）

```bash
adb shell settings put global wifi_on 1
adb shell am broadcast -a android.intent.action.WIFI_STATE_CHANGED --ez state true
# 然后再查看
adb shell dumpsys wifi | grep "Wi‑Fi is"
```

如果改完仍显示 **disabled**，就说明硬件/驱动层面还没点亮，需要回“工厂设置”勾选  Wi‑Fi 或换带驱动的固件。

---

**一句话**：`dumpsys wifi` 看到 _disabled_ 只是“当前关着”，并不代表“没有  Wi‑Fi”。再看服务列表、驱动状态、`wlan0` 接口等就能分辨：

- 都在 → 只是没开；
- 驱动/接口缺失 → 硬件被关闭或驱动裁掉，需要在工厂设置启用或刷新固件。

我的结果是。无法执行 lsmod，服务正常，驱动正常，而网络接口必须在启动共享热点的时候才能看到，最后在工厂模式的时候手滑点了重启才发现一切正常。

![image-20250511230601385](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250511230601385.png)

看到这个页面的时候就感觉一切的付出都值得了，所谓念念不忘，必有回想吧。（设置里还是没有 wifi 选项，还得自己从下拉菜单启动）

### 工厂模式：

主要用来开关一些功能，实际在我这个过程中好像没有起到太大的作用，这个主要针对整个 OS 而言，有些版本可能在这里启动 wifi，但是我这个没有，主要还是见识一下车机模式，图一乐。

这些是 GPT 给的，没有真正执行：

**ADB 直接拉起**

```
bash


复制编辑
adb shell am start -n com.twd.settings/.FactorySetting   # FYT/TS10 系常见
adb shell am start -n com.android.settings/.DeviceInfoFactory   # 某些 XY‑Auto
```

若提示 **Error type 3** 仍找不到，说明 ROM 确实删掉了对应 Activity。

### Mesh：高层 WIFI 的荣耀

家里在高层，即使把车开到楼下也不见能够有多好的信号，也能是根本就搜不到。然后突发奇想，正好之前有一个

交流的移动电源，然后把 Mesh 子路由拿到楼下供电，然后把楼上的路由放在窗户上。这才是有线 Mesh 的正确用法，尽管在高层，还能跑到 10M 以上的速度，然后再用楼下的子路由无线桥接，可以媲美一些无线路由器的速度了。

![image-20250511231244805](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250511231244805.png)

其实还有一个方案，借助 POE 路由的便携性，把网线从窗户顺下去，然后顺便也解决供电的问题。但是，翻了翻箱子，确实没有这么长的网线，那么就速战速决，将就一下把。

设备如下，方案做好了，摸黑也要实施完。

![image-20250511224530841](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250511224530841.png)

###

### 这过程中的命令和帖子

一些安卓 8 以上才可以用的命令，先记录下来，作为折腾的过程。

```
iwlist wlan0 scan
adb shell am broadcast -a android.intent.action.WIFI_STATE_CHANGED --ez state true
adb shell am start -n com.android.settings/.wifi.WifiSettings

https://blog.csdn.net/BOJUE01/article/details/136684847
https://blog.csdn.net/BOJUE01/article/details/136684847
https://www.cnblogs.com/linux-37ge/p/11111596.html
https://blog.csdn.net/pwp032984/article/details/126286159
http://www.allmost.org/2019/11/android-head-unit-root-device-model.html
```

#### 以下来自 GPT，也帮了很大的忙

下面给你 **4  种常用办法**，按「年代新  →  旧」排列，只要你的 ROM 里有对应的命令或工具，就能在 **PC  端终端** 直接看到扫描结果。不用担心全记不住，逐个试，命令不认识就跳下一个。

| 方法                          | 适用 Android 版本                               | 是否要 root       | 命令示例                                                                                                                                                                                           |
| ----------------------------- | ----------------------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. `cmd wifi` 子命令**      | 8.1 (Oreo) 及以上，只要系统内置 `cmd`           | ❌                | `bash\nadb shell cmd wifi enable            # 先确保开 Wi‑Fi\nadb shell cmd wifi scan               # 立即触发一次扫描\nadb shell cmd wifi list-scan-results  # 打印扫描结果（BSSID/SSID/信号）\n` |
| **B. `dumpsys wifi` 解析**    | 4.0+（几乎所有）                                | ❌                | ```bash\nadb shell dumpsys wifi                                                                                                                                                                    |
| **C. `wpa_cli` 工具链**       | ROM 里带 `wpa_supplicant` + `wpa_cli`           | ⭕（通常要 root） | `bash\nadb shell su -c 'wpa_cli scan'\nadb shell su -c 'wpa_cli scan_results'\n`                                                                                                                   |
| **D. `iw`/`iwlist` 直查射频** | 内核自带 mac80211/CFG80211，工具在 /system/xbin | ⭕                | ```bash\nadb shell su -c 'iw dev wlan0 scan                                                                                                                                                        |

---

### 步骤拆解（通用）

1. **让 ADB 连上车机**

   ```bash
   adb devices        # 出现 device 才算连上
   ```

2. **确保 Wi‑Fi 已经启用**

   - 可用 `adb shell cmd wifi enable` 或 `settings put global wifi_on 1` 后再开一次 UI 开关。
   - 查看状态：`adb shell dumpsys wifi | grep "Wi‑Fi is"` → `enabled`/`disabled`。

3. **触发一次扫描**

   - 新版用 `cmd wifi scan`；旧版可发送广播：

     ```bash
     adb shell am broadcast -a android.intent.action.SCAN_RESULTS
     ```

4. **查看结果**

   - 任选上表 4  种方法里你设备支持的那一行。
   - 若看不到 SSID，只见一堆 `<hidden>`：说明热点隐藏了 SSID，属正常现象。

---

### 命令输出示例（`cmd wifi list-scan-results`）

```
BSSID              frequency level SSID
60:45:cb:aa:1b:30  2462      -55   HomeWiFi_2G
60:45:cb:aa:1b:34  5200      -70   HomeWiFi_5G
b0:d5:9d:cc:31:c0  2412      -65   MiPhoneHotspot
```

字段含义：

| 字段          | 解释                                       |
| ------------- | ------------------------------------------ |
| **BSSID**     | 无线 AP 的 MAC 地址                        |
| **frequency** | 2412 – 2472 MHz = 2.4 GHz；5180 + = 5 GHz  |
| **level**     | 信号强度，单位 dBm（-30≈ 满格，-80≈ 临界） |
| **SSID**      | 热点名称（隐藏网络会显示 `<hidden>`）      |

---

### 常见坑 & 对策

| 症状                                  | 原因                                 | 解决                                                            |
| ------------------------------------- | ------------------------------------ | --------------------------------------------------------------- |
| `cmd: not found`                      | ROM 删了 toybox / cmd                | 改用 **方法  B、C、D**                                          |
| `cmd wifi: Unknown command`           | Android 7.1 及以下                   | 用 **dumpsys** 或 `wpa_cli`                                     |
| `permission denied` / `su: not found` | 没 root                              | 选不用 root 的 **方法  A 或 B**                                 |
| 扫描结果为空                          | Wi‑Fi 实际没启用、没有天线、驱动缺失 | 先 `settings put global wifi_on 1` 并从 UI 打开；或检查硬件/ROM |

---

### 小贴士

- **批量重扫**：想每 5  秒自动扫一次可用循环：

  ```bash
  while true; do adb shell cmd wifi scan; adb shell cmd wifi list-scan-results | head -n 10; sleep 5; done
  ```

- **只取最强信号**：

  ```bash
  adb shell cmd wifi list-scan-results | sed 1d | sort -k3 -n | head
  ```

- **无 Wi‑Fi 硬件时**：任何扫描命令都会报错或空结果 —— 确认已在 Factory Setting 勾选 Wi‑Fi、或插上 RTL8188EU/RT5370 USB 网卡后重试。

---

> **一句话**：连好  ADB → 开 Wi‑Fi → 在 PC 端执行 **`cmd wifi scan && cmd wifi list-scan-results`**（Android 8.1+ 最方便）；旧版系统就用 `adb shell dumpsys wifi` 或 root 下的 `wpa_cli scan_results` / `iw dev wlan0 scan` 来列出热点。祝你早日看到满屏 SSID！

---

`dumpsys`  是 **只读（dump）** 的诊断工具——它只能把系统当前状态“倒”出来给你看，**完全没有写入/控制能力**。
所以：

> **`dumpsys wifi`  只能查看 Wi‑Fi 的开关状态、扫描结果、连接信息等，不能直接把开关从 OFF 变成 ON。**

---

## 为什么 `dumpsys` 不能改状态？

- **实现方式**：`dumpsys` 调用各系统服务的 _dump()_ 接口，这个接口按约定必须是“无副作用”的纯输出。
- **权限限制**：即使给  `dumpsys` root 权限，它也只有 _READ_ 能力。
- **系统设计**：修改 Wi‑Fi 状态属于 **IWifiManager.setWifiEnabled()** 这一类“更改设备行为”的 API，必须走 Binder 或写全局设置值，不能通过 dump。

---

## 不用 UI 打开 Wi‑Fi 的正规方法（回顾）

> 任选其一，具体支持情况取决于你的 ROM / 是否 root

| 方法                              | 是否 root | Android 版本 | 示例                                                                                 |
| --------------------------------- | --------- | ------------ | ------------------------------------------------------------------------------------ |
| **settings put global wifi_on 1** | 不要求    | 4.0+         | `adb shell settings put global wifi_on 1`                                            |
| **service call wifi 13 i32 1**    | 需要      | 4.1+         | `adb shell su -c 'service call wifi 13 i32 1'`                                       |
| **cmd wifi enable**               | 不要求    | 8.1+         | `adb shell cmd wifi enable`                                                          |
| **广播／Intent**(部分 ROM 有效)   | 不要求    | 4.0+         | `adb shell am start -a android.settings.WIFI_SETTINGS`（拉起设置页后系统会自动打开） |

> `svc wifi enable` 也是写操作，但你的 ROM 把 `svc` 精简掉了，所以用不了。

---

### 一键脚本（无 root 情况下最通用）

```bash
# 1. 打开 Wi‑Fi（写 settings）
adb shell settings put global wifi_on 1
adb shell settings put system wifi_on 1

# 2. 触发系统刷新（广播）
adb shell am broadcast -a android.intent.action.WIFI_STATE_CHANGED --ez state true
```

大多数 MT3561 Android 6/7  车机用这两行就能把 Wi‑Fi 开关拨到 ON。
如果执行后 `dumpsys wifi` 仍显示 **disabled**，说明：

1. **ROM 在启动脚本里强制关掉** —— 去“工厂设置”里把 **WIFI** 复选框勾上并保存；
2. **硬件或驱动缺失** —— 需要刷带 Wi‑Fi 的完整 ROM，或外接 RTL8188EU/RT5370 免驱 USB 网卡。

---

## 结论

- **`dumpsys wifi` 只能看，不能改**。
- 想无 UI 打开 Wi‑Fi：用 `settings put …`、`service call wifi …`、`cmd wifi enable`（≥8.1）等写操作；提前确保 ROM 没把 Wi‑Fi 功能裁掉，或已在“工厂设置”里启用。祝你折腾顺利！

---

`dumpsys wifi`  里出现的那一行通常长这样：

```
Wi‑Fi is disabled
```

它只说明 **系统目前把  Wi‑Fi 开关拨到了“关”**，并不直接告诉你“有没有  Wi‑Fi  硬件”。要分清楚是“硬件存在但关掉”还是“根本没有硬件/驱动”，可以再看 4 处信号：

| 检查点              | 如何查看                               | 典型输出                | 结论                                                 |
| ------------------- | -------------------------------------- | ----------------------- | ---------------------------------------------------- | ---------------------------------------------- | --- |
| **1. Service 列表** | `adb shell service list                | grep -i wifi`           | `wifi: [android.net.wifi.IWifiManager]`              | 看到这一行 → Framework 里 **有** Wi‑Fi 服务    |
| **2. 驱动状态**     | `adb shell getprop wlan.driver.status` | `ok / ready / unloaded` | 有值 → 内核认识 Wi‑Fi 芯片；空值 → 多半缺驱动/被裁掉 |
| **3. 网络接口**     | `adb shell ifconfig -a                 | grep wlan`              | `wlan0  ...`                                         | 能看到 wlan0 → 芯片已初始化；完全没有 → 未加载 |
| **4. 内核模块**     | `adb shell lsmod \| grep -E "8188      | rt5370                  | wlan"`                                               |                                                |     |

### 结果判读

| 情况                                                          | 解释                                                   | 解决办法                                                                         |
| ------------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------- |
| **Service 有，wlan0 有，driver=ok，但 dumpsys 显示 disabled** | **硬件存在，只是软件开关关掉**                         | 用 UI 开关或`adb shell settings put global wifi_on 1`再重启 Wi‑Fi                |
| **Service 有，但 wlan0/驱动都没有**                           | Framework 在，但 **内核缺驱动/Factory 里关闭了 Wi‑Fi** | 先在工厂设置里勾选 WIFI 并保存；如仍无驱动 → 刷带 _wifi_bt_ 的 ROM 或插 USB 网卡 |
| **Service 没有（grep 不到 wifi）**                            | ROM/MCU 层完全裁掉了 Wi‑Fi                             | 只能刷完整固件或硬改/外接网卡                                                    |
| **Service 有，driver=unloaded**                               | 驱动文件在，但未成功加载                               | Factory 里未启用 / 模块版本不匹配 → 勾选保存或换匹配的系统+MCU                   |

---

### 快速打开 Wi‑Fi（无  `svc` 的情况下）

```bash
adb shell settings put global wifi_on 1
adb shell am broadcast -a android.intent.action.WIFI_STATE_CHANGED --ez state true
# 然后再查看
adb shell dumpsys wifi | grep "Wi‑Fi is"
```

如果改完仍显示 **disabled**，就说明硬件/驱动层面还没点亮，需要回“工厂设置”勾选  Wi‑Fi 或换带驱动的固件。

---

**一句话**：`dumpsys wifi` 看到 _disabled_ 只是“当前关着”，并不代表“没有  Wi‑Fi”。再看服务列表、驱动状态、`wlan0` 接口等就能分辨：

- 都在 → 只是没开；
- 驱动/接口缺失 → 硬件被关闭或驱动裁掉，需要在工厂设置启用或刷新固件。

---

### 在  Android 6.0（API 23）＋  Linux 3.x  内核的 MT3561 车机上

> 下面所有命令都在 **PC 端终端** 输入（前面带 `adb`），车机端只需提前打开「USB 调试」。

---

## 1  功能概览：Android 6.0 能/不能用什么

| 功能                            | Android 6.0 支持情况                                                      | 备注 |
| ------------------------------- | ------------------------------------------------------------------------- | ---- |
| **cmd wifi …**                  | ❌ *没有*（8.1 才加入）                                                   |      |
| **svc wifi enable/disable**     | ✅  系统自带 **toybox svc**但你的 ROM 把 `svc` 删掉，才会显示 _not found_ |      |
| **settings put global wifi_on** | ✅ **无  root 也能写**                                                    |      |
| **service call wifi …**         | ✅ 需要 **root/SU**                                                       |      |
| **wpa_cli / iwlist / iw**       | 取决于 ROM 是否编译进 /system/xbin                                        |      |

---

## 2  无  `svc` 情况下打开  Wi‑Fi（不需要 root）

```bash
# 打开 Wi‑Fi
adb shell settings put global wifi_on 1
adb shell settings put system wifi_on 1    # 某些 ROM 还要写 system 表

# 立即广播一次状态，让 Framework 赶紧刷新
adb shell am broadcast -a android.intent.action.WIFI_STATE_CHANGED --ez state true
```

### 校验开关是否生效

```bash
adb shell settings get global wifi_on      # 应返回 1
adb shell dumpsys wifi | grep "Wi‑Fi is"   # 应变成 enabled
```

> 如果还是 _disabled_，说明 **Factory Setting 里仍把 Wi‑Fi 禁掉** 或 **驱动没加载**——请回工厂菜单勾选 **WIFI** 或插免驱 USB 网卡后再试。

---

## 3  有 root 时的“硬开”——直接调 Binder

```bash
# 查询 wifi 服务是否存在
adb shell service list | grep -i wifi

# 调用 setWifiEnabled(true)
adb shell su -c 'service call wifi 13 i32 1'   # 13 是 Android 6.* 通常的事务码
```

- 返回 result=0x1 表示成功；0x0 表示失败（多半被 Factory 关闭或驱动缺失）。

---

## 4  在 Android 6.0 上扫描 Wi‑Fi 热点

| 方法                                 | 是否 root | 命令                                                                             |
| ------------------------------------ | --------- | -------------------------------------------------------------------------------- |
| **settings + dumplog**（最稳）       | ❌        | ```bash\nadb shell dumpsys wifi                                                  |
| **wpa_cli**（ROM 带 wpa_supplicant） | ⭕        | `bash\nadb shell su -c 'wpa_cli scan'\nadb shell su -c 'wpa_cli scan_results'\n` |
| **iwlist**（busybox）                | ⭕        | ```bash\nadb shell su -c 'busybox iwlist wlan0 scanning                          |

---

## 5  驱动检查——确认 8188EU/RT5370 是否加载

```bash
adb shell lsmod | grep -E "8188|rt5370|wlan"
adb shell getprop wlan.driver.status
adb shell ifconfig -a | grep wlan
```

| 结果                                 | 说明                       | 后续                                                                   |
| ------------------------------------ | -------------------------- | ---------------------------------------------------------------------- |
| 能看到 **8188eu / rt5370sta** 等模块 | 驱动已插                   | 只需把 Wi‑Fi 开关打开即可                                              |
| 没有任何模块 / getprop 为空          | 内核缺驱动 or Factory 关闭 | 1) Factory 勾选 WIFI 保存 2) 刷带 _wifi_bt_ 的 ROM3) 外接免驱 USB 网卡 |

---

## 6 Factory Setting 触摸不到  Wi‑Fi 条目的两大原因

1. **MCU/System 不匹配** →  刷同型号、带  *wifi_bt*  标记的 **全量包**
2. **硬件本身无 Wi‑Fi 芯片** →  外接 **RTL8188EU / RT5370** USB 网卡（Android 6 内核 3.x 自带驱动）

---

### 一句话总结

在 **Android 6.0 + Linux 3.x** 的  evb3561sv  车机里：

- `svc` 被删时，用 **`settings put global wifi_on 1` + 状态广播** 就能无界面开 Wi‑Fi；
- 若有 root，也可 `service call wifi 13 i32 1` 直接写 Binder；
- `dumpsys wifi` 看到 _disabled_ 只是开关关着，不代表硬件不存在——再看 `service list`、`lsmod`、`wlan0` 就能判断；
- 真缺驱动或 Factory 关闭时，要么在隐藏菜单勾选 **WIFI**，要么刷带  Wi‑Fi  驱动的完整固件，或者插 RTL8188EU/RT5370  免驱 USB 网卡。祝你早点连上网！

---

`shell: svc wifi enable`  这条命令只是 **Android 自带的小工具封装**；
你那台  evb3561sv  的 ROM 把 _toybox/toolbox_ 精简了，直接把 **`svc` 可执行文件删掉**，所以才提示 _not found_。
没关系，**核心功能还在**——我们可以绕过 `svc`，改用 **系统设置 / Binder 服务 / cmd** 三种办法来“硬切” Wi‑Fi。先按难度从低到高排一下，你照顺序尝试即可。

---

## 0  先确认两件事

| 检查                                    | 命令 (PC 端执行)                                     | 说明                                                              |
| --------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------- |
| 车机是否连上 ADB                        | `adb devices`                                        | 看到 `device` 才算连通；若是 `unauthorized`，去车机点“始终允许”。 |
| ROM 里有没有 `cmd`/`settings`/`service` | `adb shell which cmd; which settings; which service` | 至少会有 **`settings`** 和 **`service`**；有哪个就用哪个。        |

---

## 1  用 **settings** 写系统值（多数无 root 机器可用）

```bash
# 开启 Wi‑Fi
adb shell settings put global wifi_on 1
adb shell settings put system wifi_on 1

# 立即让系统刷新一次广播（有的 ROM 必须）
adb shell am broadcast -a android.intent.action.WIFI_STATE_CHANGED --ez state true

# 可选：重启 Wi‑Fi 子系统（有 sh 脚本时）
adb shell stop wifi
adb shell start wifi
```

> **验证**：
> `adb shell settings get global wifi_on` → 返回 `1`；
> `adb shell dumpsys wifi | grep "Wi-Fi is"` → 出现 **enabled**。

如果重启车机后又变回 `0`，说明 ROM 在启动脚本里把 Wi‑Fi 强行关掉——请继续看下一招。

---

## 2  用 **service call wifi** 直接打 Binder（需 root，但最稳）

1. 先确认系统里有 `wifi` 服务：

   ```bash
   adb shell service list | grep -i wifi
   # 正常会看到 "wifi: [android.net.wifi.IWifiManager]" 之类
   ```

2. 调用 `setWifiEnabled(true)`（在 Android 5/6  上通常是 **事务码 13**；如果无效换 6、8 试）：

   ```bash
   adb shell su -c 'service call wifi 13 i32 1'   # 开
   adb shell su -c 'service call wifi 13 i32 0'   # 关
   ```

   - 若提示 _su: not found_ 就表示没 root；跳过这个方案或先刷 Magisk。

---

## 3  用 **cmd wifi**（Android 8.1‑O 以后才有）

```bash
adb shell cmd wifi enable
adb shell cmd wifi disable
```

> 在 MT3561 Android 8.1（Oreo）第三方 ROM 上测试可行；如果返回 _Unknown command_ 就说明版本还在 7.1 以下，没有 `cmd wifi` 子命令。

---

## 4  如果上述全部无效 → 八成是 ROM 层面禁用 / 缺硬件

1. **再回 Factory Setting**

   - 密码 3368 / 8888 → 勾选 **WIFI** → Save → 重启。
   - 没有该项 = ROM 完全裁掉了 Wi‑Fi。

2. **查驱动**

   ```bash
   adb shell lsmod | grep -E '8188|rt5370|wlan'
   adb shell dmesg | grep -i wlan
   ```

   - 空白 = 说明内核没加载任何 Wi‑Fi 模块。

3. **解决思路**

   | 路线                                     | 说明                                                                    |
   | ---------------------------------------- | ----------------------------------------------------------------------- |
   | 刷带 _wifi_bt_ 字样的 **完整 ROM + MCU** | 与主板编码 `evb3561sv_w_65_m0` 对应的版本，一键恢复 Wi‑Fi。             |
   | 外接 **RTL8188EU / RT5370** USB 网卡     | 车机对这两款芯片免驱，插上后重启即可在「网络与互联网」里出现 Wi‑Fi。    |
   | 临时上网                                 | 手机 USB 共享网络 (Tethering) → 车机当“有线客户端”，不依赖 Wi‑Fi 射频。 |

---

### 常见报错对照

| 报错 / 现象                                      | 判断                                               | 处理                                                               |
| ------------------------------------------------ | -------------------------------------------------- | ------------------------------------------------------------------ |
| `svc: not found`                                 | ROM 精简掉 toybox → 用 **settings / service** 方案 | 见步骤 1/2                                                         |
| `settings: not found`                            | 工具也被删                                         | 装一个 _busybox_ 或 _toybox_ APK，或直接跳到 **service call wifi** |
| `service call wifi … result=0x0` 且 Wi‑Fi 仍 off | Binder 调用了，但返回 false                        | 多半 “Factory” 里没勾选 Wi‑Fi 或硬件缺失                           |
| `service list` 根本没 wifi                       | 内核 / Framework 把整个 Wi‑Fi Manager 移除了       | 只能刷新 ROM 或外接 USB 网卡                                       |

---

## 一句话总结

> 你的 ROM 砍掉了 `svc` 可执行文件，所以 `svc wifi enable` 无法用；先尝试 **`settings put global wifi_on 1`**，再不行就（有 root 时）用 **`service call wifi 13 i32 1`**。若系统连 `wifi` 服务都不存在，就说明 Wi‑Fi 在 Factory Setting 被禁用或 ROM/硬件干脆没装，最终只能刷含驱动的完整固件或外接免驱 USB 网卡。祝折腾顺利！

---

下面给你一份**最通用、从零到一**的操作清单，帮你重新进入  evb3561sv  车机的「工厂设置（Factory Setting）」隐藏菜单，并把  Wi‑Fi  模块启/停用。整套流程 3‑5  分钟，风险低，只要别在保存‑重启时断电即可。

| 步骤                      | 详细做法                                                                                                                                                                      | 补充说明                                                                                                                                                                                                                                                                 |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1  回到主界面**         | 点实体  🏠  键或手势返回，退出你现在的「运行命令」App，回到桌面。                                                                                                             |                                                                                                                                                                                                                                                                          |
| **2  打开系统设置**       | 桌面找灰色齿轮 → **设置（Settings/设置中心/Car Setting）**。如果桌面上没有，可在所有 App 列表里找“设置”或“车机设置”。                                                         |                                                                                                                                                                                                                                                                          |
| **3  定位“工厂设置”入口** | 不同 ROM 位置略有差异，常见三种：① **系统  →  关于设备 → 工厂设置**② **Car Setting → 版本信息** 页面右上角小齿轮/🔧③  直接在主设置页底部看到 **Factory**/“工厂” 按钮          | 还有少数机型需要在顶部状态栏下拉，长按 ⚙️ 5  秒弹出“工厂模式”，可先试前两种常见路径再换招。                                                                                                                                                                              |
| **4  输入密码**           | 出现数字键盘后依次试：• **8888**（XY‑Auto 机型）• **3368**（FYT 机型，多数 evb3561sv 属此族）• **3711、0000、123456** 等备选                                                  | 正确密码会立刻进入隐藏菜单；错了则原样返回，继续换密码即可。([XDA Forums](https://xdaforums.com/t/list-of-factory-codes-for-android-head-units.4240053/?utm_source=chatgpt.com), [FCC Report](https://fcc.report/FCC-ID/2A47F-7038B/5728176.pdf?utm_source=chatgpt.com)) |
| **5  勾选/取消  Wi‑Fi**   | 进入后通常会看到 **General / Feature / Hardware** 等标签：•  找到 **WIFI / WLAN / WIFI&BT** 这一项• **启用** → 打勾；**停用** → 取消勾选•  若有 **BT** 选项，可一并视需要勾选 | 字段名可能稍有区别，但一定带 “WIFI” 字样；看不到这一行多半是刷错 MCU 或 ROM 被阉割。                                                                                                                                                                                     |
| **6  保存并重启**         | 点页面底部 **Save / Apply / OK**；系统提示 _Reboot now?_ 选 **Yes**，或手动重启一次电源。                                                                                     | 期间千万别断 12 V 电源（ACC + B+)。                                                                                                                                                                                                                                      |
| **7  验证生效**           | 重启后进 **设置  →  网络与互联网**：•  若出现 **Wi‑Fi** 开关并能扫描热点，说明启用成功；•  若仍无开关，则回隐藏菜单检查是否勾选保存成功，或确认硬件/驱动。                    | 想进一步排错：`adb shell getprop wlan.driver.status` 应返回 `ok/ready`；空值说明驱动仍未加载。                                                                                                                                                                           |

---

### 如果根本找不到“工厂设置”按钮怎么办？

1. **用 Activity Launcher 类工具**

   - 在 APK 市场搜索并安装 **“Activity Launcher”** 或 **“QuickShortcutMaker”**；
   - 打开后搜索 `factory` / `settings.FactorySetting` / `com.twd.factorysetting`，点进去也能弹出隐藏菜单。

2. **ADB 直接拉起**

   ```bash
   adb shell am start -n com.twd.settings/.FactorySetting   # FYT/TS10 系常见
   adb shell am start -n com.android.settings/.DeviceInfoFactory   # 某些 XY‑Auto
   ```

   若提示 **Error type 3** 仍找不到，说明 ROM 确实删掉了对应 Activity。

---

### 常见疑问速答

| 疑问                                   | 解答                                                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **密码都试完仍进不去？**               | 可能设备品牌归属不同，联系卖家确认密码；或在 Activity Launcher 搜索 `factory` 直接拉 Activity。         |
| **选项勾了保存却自动跳回未勾？**       | MCU 与系统包不匹配 → 刷与主板版本一致、带 _wifi_bt_ 标识的完整 ROM + MCU。                              |
| **Wi‑Fi 列表能扫，但想让车机开热点？** | 默认无线芯片可能只支持 STA；需外接支持 AP 模式的 USB Wi‑Fi (RTL8188EU/RT5370) 或刷支持 hostapd 的内核。 |

---

#### 关键提醒

- **操作完一定重启**，否则配置不会写入  NVRAM。
- 切记保持 **稳定供电**，避免在行车或电池电压忽高忽低时操作。
- 建议首次进入隐藏菜单先点 _Backup_ 或 _Export Config_ 备份一份原始配置，方便误操作后恢复。

---

> **一句话**：回桌面 → 打开「设置」→ 找到「工厂设置」→ 输入 8888／3368 等密码 → 在隐藏菜单勾选 **WIFI** → 保存并重启；若连入口都找不到，就用 Activity Launcher 或  ADB 命令直拉工厂设置界面，再按同样步骤操作。祝你成功点亮  Wi‑Fi！

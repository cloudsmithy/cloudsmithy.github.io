---
title: 被CUPS共享打印机驱动搞疯了，换windows10 做打印机 server吧
tags:
  - 外设
categories: 硬件
date: 2026-02-17 14:43:24
---

之前黑群晖上部署的CUPS挂了，后来查了一下是数据盘坏了，还有一个原因是CUPS对联想打印机的兼容不是很好，索性就刷成windows10，有原生驱动，出问题还能RDP。

参考了这个方案：

兜兜转转回到了一个不折腾的方案：**Win10 安装 Mobility Print Server → 发布本地打印机 → 手机走 AirPrint / Mobility Print 直接打印**。

其实就是：

让 Win10 这台电脑充当“打印服务器”，把 USB/本地打印机发布到局域网里，手机就能像用无线打印机一样用它。

如果你家里有打印机可以试试，比CUPS的安装和运维成本小很多。

  <!--more-->

### windows 安装打印机驱动

先把打印机的 **Windows 驱动和配套软件**装好（重点是：确保 Win10 上“本地打印”完全正常）。

驱动下载页（示例）：
[https://www.lenovoimage.com/index.php/services/servers_drivers?cat_id=2&ProCode=48001877&OS=%E5%85%A8&baseclass=&key_words=](https://www.lenovoimage.com/index.php/services/servers_drivers?cat_id=2&ProCode=48001877&OS=全&baseclass=&key_words=)

有种折腾半生，安装Windows养老的感觉。

![image-20260217101806744](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260217101806744.png)

可以从这里看到了我安装的软件列表。Windows自带的打印机共享好像是SMB，总之是不太好用，我直接给他关掉了。

![image-20260217101946540](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260217101946540.png)

这个办法算是解决技术债，有条件还是建议买带无线打印的机器。

### 条件确认

- 打印机在 Win10 上 **能正常本地打印**
- Win10 这台电脑后续要当“打印服务器”
  - **不要睡眠/休眠**（至少在你要打印的时间段）
  - 手机和这台电脑要在**同一个 Wi-Fi/同一网段**（不要访客网络）

这里最容易翻车的是两件事：

1）Win10 睡死
很多人以为“屏幕熄灭”没关系，但如果机器进入睡眠/休眠，手机就会直接找不到打印机。

2）访客 Wi-Fi / 网络隔离
有些路由器默认把“访客网络”做了隔离，手机在访客 Wi-Fi 下是看不到你内网 Win10 电脑的——打印服务自然也发现不了。

让GPT写了一个命令，目测还挺稳的：**让这台 Win10 在你需要打印时别睡过去**（屏幕可以灭，但系统别休眠/睡眠）。

```
powercfg -h off
powercfg /x standby-timeout-ac 0
powercfg /x standby-timeout-dc 0
powercfg /x hibernate-timeout-ac 0
powercfg /x hibernate-timeout-dc 0
powercfg /x monitor-timeout-ac 10
powercfg /x monitor-timeout-dc 10
```

![44b63ab9261745c8b94c7462a616eeb5](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/44b63ab9261745c8b94c7462a616eeb5.png)

稍微解释一下这几行大概在干嘛（不用深究，但有助于排错）：

- `powercfg -h off`：关掉休眠（顺带会禁用“快速启动”相关的一些行为）
- `standby-timeout-* 0`：不进入睡眠
- `hibernate-timeout-* 0`：不进入休眠
- `monitor-timeout-* 10`：屏幕 10 分钟后熄灭（省电，但不影响打印服务）

### Win10 安装 Mobility Print Server 并发布打印机

1. 在 Win10 上安装 **Mobility Print Server**（安装过程基本一路下一步即可），不需要额外安装组件
2. 打开 Mobility Print Server 管理界面，在打印机列表里 **勾选“发布/共享”** 你的那台打印机，中间简单配置下用户名米啊么
   - 例如：`Lenovo M7400 Pro`（或者你自定义的队列名）

3. 给这台打印机设置一个**共享显示名称**

发布后，你会在界面里看到打印机处于可用状态，并且共享名称生效。

![image-20260217101853752](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260217101853752.png)

### iPhone 打印

iPhone 这边基本是“傻瓜式”：
只要手机和 Win10 在同一网络里，你在任意支持打印的 App（备忘录、照片、文件）里点“打印”，就能看到你发布出来的打印机名称，选中即可打印。

![image-20260217103054171](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260217103054171.png)

也就是说：**iPhone 端通常不需要额外装 App**，体验非常接近原生 AirPrint。

### 安卓打印

安卓这边装一个 **Mobility Print**（App）就行。装好后同样确保在同一 Wi-Fi/同网段，然后在打印选择里找到你刚才设置的共享显示名称，直接打印。

![image-20260217105135583](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260217105135583.png)

如果你家里安卓机比较多，这个方案的好处是：**一次配置，全家通用**，后续基本就是“选打印机 → 打印”。

### 实际效果

把 Win10 当打印服务器之后，手机端看到的体验就是：打印机像一台“真正的无线打印机”一样出现。

下面两张图就是我这边的实际效果（手机端能直接发现、直接选择、直接打印）：

![](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/3f1404043041bf6725fab5cee1d89f30.jpg)

![](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/3f1404043041bf6725fab5cee1d89f30-20260217110154905.jpg)

### 后记

用熟悉的Windows做Server，出问题还能RDP，有window原厂驱动还比CUPS少折腾了很多。也不需要买任何“无线打印盒子”，只要家里有一台 Win10 电脑能长期在线即可。

关键点就两个：

- Win10 必须能稳定在线（别睡死）
- 手机和 Win10 必须在同一网络（访客 Wi-Fi 很容易把设备隔离掉）

当然了，这个windows还能当远程小主机用，安装微信，Office远程办公也行啊。

https://sspai.com/post/63776

1.  Bonjour Print Services (Windows)
2.  AirPrint Installer
3.  修改防火墙

其中AirPrint Installer对我没有起到什么明显的作用，只是可以在移动端搜到打印机了，但是每次都打印失败。
Bonjour 还留着了，也不确定是不是真的有用，现在能用就不折腾了。

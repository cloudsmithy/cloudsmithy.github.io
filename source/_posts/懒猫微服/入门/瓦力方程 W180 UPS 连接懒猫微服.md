---
title: 瓦力方程 W180 UPS 连接懒猫微服
date: 2026-09-27 00:00:00
description: 记录瓦力方程 W180 UPS 接入懒猫微服 LC-03 的过程，包括接线、19V 电压设置、UPS Guard 监测、关机策略和消息推送。
tags:
  - 懒猫微服
  - UPS
  - NAS
  - 瓦力方程
categories:
  - 懒猫微服
  - 入门
series: 懒猫微服入门
toc: false
abbrlink: d6c7214b
---

懒猫微服推荐了**瓦力方程**和**山特**的 UPS。我手里还有一台山特 TG-BOX 850 在服役，所以这次入手了瓦力方程 W180。

![](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260926225221685.png)

首先，这个盒子的做工真的很好。全铝 CNC，不光颜值高，手感也很好，第一感觉就喜欢。巴掌大小，也很轻。

![2931a5ac91d7c6e73874c8f0f1d85898](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/2931a5ac91d7c6e73874c8f0f1d85898.jpg)

我买的是 5525 接口的规格，配件只有两根线，供电需要用懒猫微服原来的电源适配器。接法就是：市电接适配器，适配器给 UPS 供电，再由 UPS 的 DC 输出给懒猫微服供电。USB 数据线也要接到懒猫微服上，用来给上位机监控状态。

![8fb5fdfe4434661776013839d1b3be19](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/8fb5fdfe4434661776013839d1b3be19.jpg)

我这台懒猫微服用的是 19V 电源，所以一开始就需要调整 UPS 的电池供电电压。**这一步要在断开 NAS 的情况下操作。**

有市电、由适配器供电时，UPS 的输出电压跟着适配器走；断电、切换到电池供电时，我这台 W180 的默认输出是 12V。所以不能只看接着适配器时输出正常，就直接拿来用，还得把电池供电时的输出电压改成 19V。

具体设成多少，要看自己那台懒猫微服的适配器。我的 LC-03 适配器标注的是 **19V × 6.32A**，折算额定输出功率是 **120.08W**。

![image-20260926222823969](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260926222823969.png)

下面是我的设备一览。和山特 TG-BOX 850 不同，这次的 W180 并不能把我这些设备都带起来，官方的建议也是只带一台。所以我让它单独给全 SSD 的懒猫微服 LC-03 供电，其他设备还得靠山特 TG-BOX 850 继续服役。

![f3c56dfc4c7449d3fc5ec34fa19d945c](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/f3c56dfc4c7449d3fc5ec34fa19d945c.jpg)

更改电压是在瓦力盒子的小程序里操作，把电池供电时的输出电压设成和电源适配器一样的 19V。还是那句话，先断开 NAS，再改电压。

显示出来的输出电压也不会刚刚好。在我的 case 里，总会比设定值多出来一点。

![image-20260926221813270](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260926221813270.png)

在懒猫微服里，我用 **UPS Guard** 进行监测，直接去商店下载就好。其实就是用 Docker Compose 拉起来一个 UPS 上位机。

这里没有用瓦力的官方上位机，是因为懒猫的 OS 是定制的，采用分层文件系统，应用和部分系统组件都通过容器运行，不能和传统 Linux 一概而论。直接用商店里的应用，也方便沿用懒猫现有的管理方式。

![image-20260926224047216](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260926224047216.png)

这个 App 是通过 Docker 跑起来的。我这里需要**在启动 UPS Guard 之前插好 USB 数据线**；如果先启动应用、后插数据线，就得重启这个 App，才能识别到设备。

重启这个功能还是我给他们提的，其实就是通过 Docker socket 调用容器的 `restart` API。应用重新启动之后，就能继续监测 UPS。

![image-20260926222114348](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260926222114348.png)

然后就是 UPS 客户端的首页，可以看到瓦力方程 W180 的型号，以及输出的电压、电流。剩下的你们都会了，就不在这里赘述了。

![image-20260926221737282](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260926221737282.png)

其实 UPS 最重要的是**关机策略**。作为一个优秀的 UPS，你的目的不仅是让主人在停电的时候，还能从 NAS 拷贝一个电影，发个朋友圈得瑟，还得在电池耗尽之前让设备正常关机，保护好磁盘和数据。

供电切换和断电后的消息推送，也是我关心的地方。监测页面能看到状态只是接入的一步，关机策略也得按自己的使用情况设好。

![image-20260926223522436](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260926223522436.png)

当然了，瓦力也有自己的服务号模板消息推送，断电和恢复供电都有通知。

![ad0f598f11955dafc088bc2a2a15774c](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/ad0f598f11955dafc088bc2a2a15774c.jpg)

好了，最后放一张实拍图。手机随手拍的，大家有好看的照片也可以拿来交流。

![69f8f3fe87535704da355a8dfd02edb1](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/69f8f3fe87535704da355a8dfd02edb1.jpg)

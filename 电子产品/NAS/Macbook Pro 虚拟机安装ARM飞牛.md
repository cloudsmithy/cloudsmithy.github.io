---
title: Macbook Pro 虚拟机安装ARM飞牛
tags: NAS
toc: true
categories: 电脑外设
abbrlink: 567b12ef
date: 2026-02-15 00:00:00
---


飞牛公测有一阵子了，一直没腾出时间折腾这些。手里的ARM设备有泰山派开发板和Macbook Pro。由于泰山派实在没啥资料，所以还是先用Macbook + PD 安装飞牛吧，官网也提供了安装包下载。

我本来想给泰山派也刷一个：[https://www.fnnas.com/download-arm](https://www.fnnas.com/download-arm) 不过我看这里没有镜像了，估计是和OEC的关系影响到了RK3566的适配。

![image-20260215105650976](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260215105650976.png)
 <!--more-->
不用UTM的原因是大家都觉得很难用，所以还是选择了Parallel Desktop，安装很丝滑，几分钟就完成了。

![image-20260215112004395](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260215112004395.png)

自动识别到了飞牛的ISO，因为FN用的debian内核，就当debian用吧。（本质就是一套 Linux 安装流程，PD 对 Debian 这套适配也成熟，少踩坑。）

![image-20260215112025557 ](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260215112025557.png)

然后进入图形化安装流程，其实和安装debian一样的。

![image-20260215112211407](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260215112211407.png)

选择安装磁盘，这里是系统盘。

![image-20260215112144639](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260215112144639.png)

然后无脑安装就行了，等进度条。

![image-20260215112100974](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260215112100974.png)

安装进度条结束之后就看到了FNOS的标志，没有图形GUI。会显示IP地址。（这一步其实已经装完系统了，后续基本都在 Web 后台做初始化。）

![image-20260215112159477](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260215112159477.png)

然后从IP地址进入web后台，设置管理员用户名密码。

![image-20260215112233024](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260215112233024.png)

进入系统之后我们可以看到系统盘的容量，现在没有数据盘，所以没办法安装软件。（飞牛的应用基本都要落到存储空间里：没有数据盘=没建存储池=应用中心很多东西会直接灰掉。）

而且这个IP地址是虚拟机DHCP分的，我们需要改成和局域网一个网段。（不然每次重启 DHCP 变一下 IP，就得重新找；另外后面想从别的设备访问，也希望它像“局域网里的一台 NAS”，而不是“宿主机后面的一台小黑盒”。）

![image-20260215112250789](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260215112250789.png)

先停止虚拟机，我们做配置变更，加数据盘和改WIFI配置。

![image-20260215112527114](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260215112527114.png)

停机之后，加硬盘2。

![image-20260215112541088](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260215112541088.png)

网络配置也改成和宿主机共享无线网卡。（PD 这里如果走默认的 NAT，虚拟机通常在一个私有网段里，外面设备访问会绕一圈甚至直接不通；共享无线网卡等价于让虚拟机“挂”到当前 WiFi 这张网里，局域网可达性更好。）

![image-20260215112345977](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260215112345977.png)

修改完配置重启之后，我们会看到新的IP地址，然后进入后台之后，就可以看到新的数据盘了。

![image-20260215112601105](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260215112601105.png)

创建存储空间，我这里选Btrfs。（主要图它快照/校验这些特性，NAS 场景挺合适。）

![image-20260215112701506](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260215112701506.png)

就一块盘，存储模式也无所谓了。

![image-20260215112649988](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260215112649988.png)

接下来就是格式化。

![image-20260215112719577](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260215112719577.png)

等待存储池创建完成。

![image-20260215112735667](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260215112735667.png)

然后我们就可以从应用中心安装软件了。（有存储池之后，应用的安装路径、数据目录才有地方落盘。）

![image-20260215115336822](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260215115336822.png)

配置一览。

![image-20260215120559904](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260215120559904.png)



这套在 Mac 上用 PD 跑 FNOS 的方式，优点就是“快”和“稳”：几分钟起一台 NAS 环境，装应用、建存储池、跑基础功能都够用。等啥时候有时间，再慢慢折腾泰山派安装飞牛吧。

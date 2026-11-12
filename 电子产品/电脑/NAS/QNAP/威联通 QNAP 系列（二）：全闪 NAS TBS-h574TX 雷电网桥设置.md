---
title: 威联通 QNAP 系列（二）：全闪 NAS TBS-h574TX 雷电网桥设置
date: '2025-01-24 16:48:34'
updated: '2025-01-24 16:48:34'
abbrlink: 767176d1
description: 记录 QNAP TBS-h574TX 雷电网桥的连接、路由、iperf3 测速、MTU 调整，以及 Thunderbolt to Ethernet 的使用体验。
categories:
- 电子产品
- 电脑
- NAS
- QNAP
tags:
- NAS
- 外设
toc: true
source_platform: csdn
source_url: https://blog.csdn.net/weixin_38781498/article/details/145340228
source_title: 威联通QNAP 系列 (二）全闪NAS TBS-h574TX 雷电网桥设置
---

雷电网桥是体验过后就回不去的存在，在传统的NAS中我们更多会升级到10G内网，甚至在MacbookPro这种设备上还需要使用拓展坞将雷电接口转成10G，或者在一些台式机上使用PCIE转接卡拓展10G。  
![在这里插入图片描述](/images/migrated/c1c784e3de6a207cf551.png)

#### <a id="t0"></a><a id="_3"></a>雷电网桥介绍

拥有雷电的机器可以当作前端高速设备与PC连接，也可以做持久存储，或者把数据放到另外一台QNAP或者Cloud做热备份。  
![在这里插入图片描述](/images/migrated/01dc91258e7ba0febe10.png)

#### <a id="t1"></a><a id="NAS_6"></a>NAS上的雷电网桥

在之前的安装中，我们插入了雷电的线，在初始化中显示了雷电网桥的IP地址。  
![在这里插入图片描述](/images/migrated/013c5c0477231c2fc0fa.png)  
与此同时，在Mac上也可以看到虚拟的雷电网桥和对应信息：  
![在这里插入图片描述](/images/migrated/21491fa25b00b4ecbb3b.png)

在NAS上也可以看到路由表，169.254.0.0/16都走雷电的网桥。  
![在这里插入图片描述](/images/migrated/ed894836fdef81c4935a.png)

#### <a id="t2"></a><a id="_15"></a>雷电网桥测速

先开启SSH功能：

![在这里插入图片描述](/images/migrated/dc995b88ac4d88f80cb8.png)

我们使用iperf3进行下载，由于QNAP官方没有提供iperf3的工具下载，下载二进制安装：



```
sudo wget -0 /usr/lib/libiperf.so.0 https://iperf.fr/download/ubuntu/libiperf.so.0 3.1.3
sudo wget -0 /usr/bin/iperf3 https://iperf.fr/download/ubuntu/iperf3_3.1.3
sudo chmod +x /usr/bin/iperf3
```



可以达到官方宣传的20G BPS  
![在这里插入图片描述](/images/migrated/4591e1571a8341ae55fe.png)

在Mac端设置，开了MTU 9000 之后，可以接近35G BPS（不知道为什么QNAP侧不能在雷电网桥上改MTU）

![在这里插入图片描述](/images/migrated/bfcfc56ab310976e86d3.png)  
在QNAP的监控传输大文件过程中，也可以到接近20G BPS的吞吐量。  
![在这里插入图片描述](/images/migrated/c85edbc71ddaed485091.png)

#### <a id="t3"></a><a id="Thunderbolt_to_Ethernet_39"></a>Thunderbolt to Ethernet

可以利用Thunderbolt连接NAS上网，算是一个比较新奇的功能，有些显示器也能实现这个。不过相应的需要牺牲一些传输带宽：

- MTU 设置为1500
- 上传限制到180MB/S
- 下载不受影响

![在这里插入图片描述](/images/migrated/8cd207fb308cecca35b0.png)

本质上就是让雷电当作虚拟交换机，让PC连接NAS直接上网。  
![在这里插入图片描述](/images/migrated/8f4c7db20192a3721085.png)

雷电网桥的页面IP地址也变化了，不再是169.254.X.X，而是和直接从上级交换机获取地址了。  
![在这里插入图片描述](/images/migrated/bc3b552139e92f133f73.png)

路由器后台也可以看到：

![在这里插入图片描述](/images/migrated/71e5eb0c74a45d26cda7.png)

互联网测速，可以跑满家里宽带：  
![在这里插入图片描述](/images/migrated/214261dab8b8e8235561.png)

#### <a id="t4"></a><a id="_62"></a>写在最后

还是建议使用雷电网桥做高速内网的传输，还可以省掉一个10G的交换机和复杂的网络拓扑的规划。

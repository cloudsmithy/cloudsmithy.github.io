# 威联通 QNAP 系列（二）：全闪 NAS TBS-h574TX 雷电网桥设置

- URL: https://blog.no-claw.com/767176d1/
- 日期: 2025-01-24
- 分类: 电子产品 / 电脑 / NAS / QNAP
- 标签: 外设, NAS

雷电网桥是体验过后就回不去的存在，在传统的NAS中我们更多会升级到10G内网，甚至在MacbookPro这种设备上还需要使用拓展坞将雷电接口转成10G，或者在一些台式机上使用PCIE转接卡拓展10G。

#### 雷电网桥介绍

拥有雷电的机器可以当作前端高速设备与PC连接，也可以做持久存储，或者把数据放到另外一台QNAP或者Cloud做热备份。

#### NAS上的雷电网桥

在之前的安装中，我们插入了雷电的线，在初始化中显示了雷电网桥的IP地址。

与此同时，在Mac上也可以看到虚拟的雷电网桥和对应信息：

在NAS上也可以看到路由表，169.254.0.0/16都走雷电的网桥。

#### 雷电网桥测速

先开启SSH功能：

我们使用iperf3进行下载，由于QNAP官方没有提供iperf3的工具下载，下载二进制安装：

```
sudo wget -0 /usr/lib/libiperf.so.0 https://iperf.fr/download/ubuntu/libiperf.so.0 3.1.3
sudo wget -0 /usr/bin/iperf3 https://iperf.fr/download/ubuntu/iperf3_3.1.3
sudo chmod +x /usr/bin/iperf3
```

可以达到官方宣传的20G BPS

在Mac端设置，开了MTU 9000 之后，可以接近35G BPS（不知道为什么QNAP侧不能在雷电网桥上改MTU）

在QNAP的监控传输大文件过程中，也可以到接近20G BPS的吞吐量。

#### Thunderbolt to Ethernet

可以利用Thunderbolt连接NAS上网，算是一个比较新奇的功能，有些显示器也能实现这个。不过相应的需要牺牲一些传输带宽：

- MTU 设置为1500
- 上传限制到180MB/S
- 下载不受影响

本质上就是让雷电当作虚拟交换机，让PC连接NAS直接上网。

雷电网桥的页面IP地址也变化了，不再是169.254.X.X，而是和直接从上级交换机获取地址了。

路由器后台也可以看到：

互联网测速，可以跑满家里宽带：

#### 写在最后

还是建议使用雷电网桥做高速内网的传输，还可以省掉一个10G的交换机和复杂的网络拓扑的规划。

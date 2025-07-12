---
title: 威联通 QNAP 系列 (一) 全闪 NAS TBS-h574TX QuTS hero 初探
tags: 搜索引擎（ES）
toc: true
categories: 极限科技
abbrlink: 7acb32ac
date: 2025-04-24 00:00:00
---

> 字数 1371，阅读大约需 7 分钟

都说 2024 是全闪 NAS 的元年，各个厂商也纷纷出品的自家的 NAS，独占鳌头的还是 QNAP 的**TBS-h574TX**，5 盘位 NVME，支持 10G 网口以及雷电网桥，甚至还有 12 代 i5 CPU 这个配置很难不让人心动。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/IbSwDcwia5ice0zutOCVThUsZxdPhqicibIwnO7Aic8zVW6tMPatN4O25CQOILhhRKIGkCuYDkadRicWHad2Sia2gnibJA/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

### 初始化系统安装

使用 Qfinder Pro 可以查找局域网内的 QNAP NAS, 免去手动查找 IP 的麻烦,软件支持全平台。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/IbSwDcwia5ice0zutOCVThUsZxdPhqicibIwzYxLDHhXkqJy7a5Pq0ficr2icc869F1dvMtBz7M4If2GCjCPjZFI5LFg/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

Qfinder 寻找结果如下，可以识别出 NAS 名称，IP 地址，MAC 地址，机器型号以及系统及其版本。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/IbSwDcwia5ice0zutOCVThUsZxdPhqicibIw9eEsksIytcKk701AFIibC92Zp6Cf0piaiajGhvvCia0s5Nk83iakFgauicvg/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

除此之外，我们也可以在路由器后台寻找 IP 地址。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/IbSwDcwia5ice0zutOCVThUsZxdPhqicibIwoO2VX1BqZwfqnvntrichSp6lZNNx0MWVuJ4lXWP1cxyL8daNH3AMSCw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

开始初始化流程：

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/IbSwDcwia5ice0zutOCVThUsZxdPhqicibIwRqTphdlkdTlP4k3kCA8AKLxJpnRKrdAaaUiajA4Ljcmbxk84e8R4ibAw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

进入 web 页面，开始安装系统

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/IbSwDcwia5ice0zutOCVThUsZxdPhqicibIwvscFUjaE7WTKsDOOlgRibr78ia6uP2wMTCaiaRr0wUUOocJf3sSO4vakw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

授权条款如下：

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/IbSwDcwia5ice0zutOCVThUsZxdPhqicibIwKrTojDUbabH9XjlhoR2Faqg9a7W2GJVkOBS0GiaCbCYYSsn1L7Ric9icA/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

选择固件版本，为了快速安装，一般选择当前版本，然后进入 OS 内部再进行升级

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/IbSwDcwia5ice0zutOCVThUsZxdPhqicibIw9UHPgKpVicy7WxTd9WA2bE5YOPMTXGDjb0nsjJDib2IbyHiclscL1WFibw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

设置 nas 名称和用户名,密码,由于系统内置了 admin 用户，所以这里不能使用 admin

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/IbSwDcwia5ice0zutOCVThUsZxdPhqicibIwXyA6H4W1KiabYdfaCbW02ImbKjUQGwJqavCoYWLWcZD8qKscb4hjhvA/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

设置时区以及 NTP 服务器同步时间。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/IbSwDcwia5ice0zutOCVThUsZxdPhqicibIwvS161ndibydZvc7sgXiacaibRnlnXzyr1aXdgfcjYSocRRic3HUV3J8NPQ/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

设置 IP 地址，可以选择 DHCP 或者静态地址，我一般为了方便选 DHCP，这些后期都可以系统内部进行修改。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/IbSwDcwia5ice0zutOCVThUsZxdPhqicibIwlO8nSxsiaewP9qOuPaxOckUQewxSsdcLesnbRWYAaWC227pejUzbOwg/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

如果设置静态地址需要的参数如下：IP 地址，子网掩码，网关，DNS 服务器，不过还是建议直接在路由器上设置静态 IP 方便管理。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/IbSwDcwia5ice0zutOCVThUsZxdPhqicibIwIfrXJ8ibsLknuSXNP0RiaiaFjnyicMCB39m5eXkDBOnWzYhlBRpAZknq1w/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

这个机器支持了雷电 4 的接口，原生支持了雷电网桥，所以这里多出来一个检测雷电的步骤，拔插雷电的时候机器会滴滴的响几声。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/IbSwDcwia5ice0zutOCVThUsZxdPhqicibIwthkBL4TAUKPrPxgeiakAia7DiaV4yBHCo3WHoEbJhlmDZogVumn2rZUpw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

固件更新设置，建议设置通知，手动更新。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/IbSwDcwia5ice0zutOCVThUsZxdPhqicibIwQFrmDicficmyAg9Sy3W5iabTOf1r5BxRD5ZnATJqtR4uZzcNNHebHQSjg/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

这个初始化的步骤会清除硬盘上的所有数据。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/IbSwDcwia5ice0zutOCVThUsZxdPhqicibIw1j9YxldqT57LVpibJPxKsiaFlNt263jhG3JM289KWjdcVSiaRldsr7xQQ/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

接下来就几分钟的等待，主要是等待往硬盘上安装软件，可以看到进度条。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/IbSwDcwia5ice0zutOCVThUsZxdPhqicibIwBCxtBxcoFW8BAHq9q50Idm2ph4LAVibjwAslS5zB8Y6m0beMseb4DCQ/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

这个机器的配置比较高，全程用了五分钟左右，这里主要启动 SMB 和系统的一些进程。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/IbSwDcwia5ice0zutOCVThUsZxdPhqicibIwXJrXOgWLDtATWZXwf5cRa8jcE8PaVLmMusxwy58s9wCDwjdhc0BjMw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

设置完毕之后，我们就可以使用 NAS 了。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/IbSwDcwia5ice0zutOCVThUsZxdPhqicibIwkZL0ZNMRkB7xXWovXSicS6T34Sqic7UfLM7uvC2SdpR0TSCPkBgX8I7Q/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

使用之前设置好的用户名和密码进行登录

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/IbSwDcwia5ice0zutOCVThUsZxdPhqicibIwbozeKBoibkdLxm4yWfOg4QIdlm2keMIzlHLZ3gISUvhk7eBmh0uSfCQ/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

### 初始化磁盘

第一步需要设置存储池，用我们安装的 NVME 硬盘组成一个 raid 存储池。

RAID 通过将多个硬盘组合在一起，形成一个更大的存储单元，以实现数据冗余备份或提升存储性能。它是一种存储虚拟化技术，可以让系统同时从多个硬盘中读取和写入数据，从而提高读写速度。

RAID 的常见级别如下：

- • **RAID 0（条带化）**：数据被分割成多个部分，分别存储在多个硬盘上，读写速度快，但没有冗余保护，任意一块硬盘损坏会导致数据丢失。（建议谨慎使用）
- • **RAID 1（镜像）**：数据在两个硬盘上存储两份，每次写操作都会写到两个硬盘上，数据安全性高，但磁盘利用率低。
- • **RAID 5（分布式奇偶校验）**：利用条带化和奇偶校验实现数据保护，至少需要三块硬盘，能够在提高存储性能的同时保证数据的冗余性，可以容忍一块盘故障。
- • **RAID 6（双奇偶校验）**：与 RAID 5 类似，但使用双重奇偶校验，可以容忍两块硬盘同时故障。
- • **RAID 10（镜像+条带化）**：结合了 RAID 1 和 RAID 0 的优点，先进行镜像操作，再进行条带化，提供高性能和高可靠性。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/IbSwDcwia5ice0zutOCVThUsZxdPhqicibIwTVNSp8KNpkSN2BU2Qqmm1tTSL4wHWhyTuxm7L6QHhR0lxNW9R8aicaw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

我只有两个 NVME，所以出于测试目的，组建了 Raid0。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/IbSwDcwia5ice0zutOCVThUsZxdPhqicibIwJ5fF9IbvbpwIicibYHnZVDzj6BNTeMOHkGvIYtVu3QjibmmhHaa5gLsag/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

设置存储池预留空间，快照预留空间以及警报阈值。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/IbSwDcwia5ice0zutOCVThUsZxdPhqicibIwmFOTYKLZ5dt4LvVXaoIl3Yg0zFNUd5vqWEmJt5h1Bgxd9EESnHBI8g/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

可以看到我的 4T 和 2T 的 NVME 组建的 RAID0 阵列， 设置完毕，除了保留空间外，最后之后 3.6T 可以用。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/IbSwDcwia5ice0zutOCVThUsZxdPhqicibIwBQLSkzcsCYLuba17OHflx9uXoa9oIdvBdha7EwYlFlMSrphaPn93BQ/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

同样存储池也会清除磁盘上的所有数据。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/IbSwDcwia5ice0zutOCVThUsZxdPhqicibIwIZXoYGfNe8QGRyAH9J2NHJQDLicw8W72ialcGc8VljXkHoZusRkmz08w/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

存储池磁盘位一览：

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

存储池目录结构如下：

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

### 简单的监控

在用户管理处我们可以看到刚刚设置的用户，在这里也可以新建用户做一些额外的权限控制。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

同时 NAS 还自带了监控，可以看到 CPU，内存以及磁盘使用率，还有运行时间，风扇转速，访问记录等等。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

### 日志处理

QuLog Center 是一款集中日志管理应用程序，可将详细的系统事件、系统访问和在线用户状态记录到您的设备。收集的信息可用于有效地诊断和理解设备系统问题，例如与用户访问相关的记录

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

QuLog 服务用于将日志传输到其他设备的 QuLog Center。您可以将其他设备的日志集中起来管理。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

日志也可以发送到 Syslog 服务器：

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

### 公网访问

如果想在公网上访问这个 NAS，那么也可以在路由器上设置端口转发，使用自家的 IP 地址进行访问。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

### 写在最后

全闪主要是风扇的声音比较大，用手机贴在上面测试了下，在 50 分贝左右，拿开一段距离的话在 40 分贝左右。有条件还是放在柜子里吧。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

---
title: 飞牛OS虚拟机初体验
description: 飞牛 NAS 系统虚拟机安装初体验，上手感受与基本配置。
tags:
  - NAS
  - 飞牛OS
toc: true
categories:
  - 电子产品
  - 电脑
  - NAS
abbrlink: 3608dae8
date: 2025-03-11 00:00:00
---

前段时间，飞牛 OS 上线了虚拟机功能，尽管目前仍处于公测阶段，但已经可以尝鲜体验。官方文档也相当详细，感兴趣的可以参考：[虚拟机文档](https://help.fnnas.com/articles/fnosV1/virtual-machine/install.md)。

![](https://fastly.jsdelivr.net/gh/bucketio/img0@main/2025/02/08/1738986517925-87ab4dc4-009c-49ad-b012-981c27831baa.png)

 <!--more-->

### 公测声明

官方的公测声明如下：

![](https://fastly.jsdelivr.net/gh/bucketio/img19@main/2025/02/08/1738986651672-27741772-bbad-4fc3-825b-6927f0d37dde.png)

通俗来说，这个虚拟机功能可以看作是一个精简版的 PVE（Proxmox Virtual Environment）。在使用时，磁盘和网卡建议选择 **virtio**，这是一种半虚拟化方案，能够提供更好的性能和兼容性。

### 配置磁盘和网卡

磁盘部分推荐选择 **virtio** 驱动，以获得更好的 I/O 性能：

![](https://fastly.jsdelivr.net/gh/bucketio/img15@main/2025/02/08/1738987080763-9edab5a9-df99-46fd-967a-cd103a9ab1ae.png)

网卡同样支持 **半虚拟化**，可以在创建虚拟机时选择：

![](https://fastly.jsdelivr.net/gh/bucketio/img6@main/2025/02/08/1738987033508-81d29596-2bcf-426f-85de-a1f8d3be9bc4.png)

### Windows 虚拟机驱动安装

由于 Windows 默认不包含 **virtio** 驱动，因此需要手动下载并安装：[VirtIO 官方下载地址](https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/archive-virtio/virtio-win-0.1.266-1/)

安装后，需要手动选择对应的驱动，这样才能正确识别到磁盘：

![](https://fastly.jsdelivr.net/gh/bucketio/img4@main/2025/02/08/1738986969521-726f7e25-7f24-4857-8aae-782c8fadc540.png)

如果安装过程中未能识别到网卡驱动，可以在进入系统后再安装：

![](https://fastly.jsdelivr.net/gh/bucketio/img5@main/2025/02/08/1738986953186-9a8f8914-031b-422e-ae15-2fdb8b84f1e2.png)

### Guest-tools 安装

ISO 镜像中包含 **Guest-tools**，相当于虚拟机的 **agent**，需要安装，以提升性能和兼容性：

![](https://fastly.jsdelivr.net/gh/bucketio/img18@main/2025/02/08/1738986962306-e20fd35e-c1b9-4140-95b7-a0ae9d070e27.png)

安装方式很简单，可以直接从 **ISO** 镜像里安装，里面包含所有必要的驱动和工具：

![](https://fastly.jsdelivr.net/gh/bucketio/img12@main/2025/02/08/1738987388483-336fd548-9314-457b-bf0d-02320124370f.png)

安装过程如下：

![](https://fastly.jsdelivr.net/gh/bucketio/img6@main/2025/02/08/1738987502926-926f9aac-eac1-4988-be17-97bfce6f64cb.png)

### 性能测试

安装完成后，可以看到网卡已正常识别，并且协商速率为 **10G**：

![](https://fastly.jsdelivr.net/gh/bucketio/img8@main/2025/02/08/1738986943168-c470d98b-1201-493b-9456-d23076700e78.png)

测速结果表明，CPU 占用率相对较低，性能表现良好：

![](https://fastly.jsdelivr.net/gh/bucketio/img4@main/2025/02/08/1738986928791-86941ac3-6220-46dd-8a0c-c372505e50bc.png)

在内网环境下，测速几乎可以跑满 **10G** 网桥带宽：

![](https://fastly.jsdelivr.net/gh/bucketio/img5@main/2025/02/08/1738986911764-1ab35eed-ac6f-467d-b1fd-83dc8cbed55d.png)

---

总体来看，飞牛 OS 的虚拟机功能虽处于公测阶段，但体验已经相当不错。对于有轻量级虚拟化需求的用户来说，已经具备一定可玩性。如果你也对这项功能感兴趣，不妨动手试试！🚀

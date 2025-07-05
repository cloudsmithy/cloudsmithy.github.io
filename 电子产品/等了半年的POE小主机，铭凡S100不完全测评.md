---
title: 等了半年的 POE 系统，铭凡 S100 不完全测评
tags: 电脑外设
toc: true
categories: 电脑外设
date: 2025-04-02 00:00:00
---

这个电脑吸引我的点是 POE 供电，如果配上 POE 交换机岂不是妥妥的软路由圣体，抱着这样的目的下单的。

![image-20250505113735318](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250505113735318.png)

 <!--more-->

**先写吐槽**

1. 原来店家宣传的是 16G 内存，后来改成 8G，之前还经常断货
2. 差评率很高，基本是吐槽锁功耗和预装 win11（如果是准系统还能省点 lisence 的钱）
3. N100 这个价位性价比其实很低，可以购买 N305 了
4. 这机器磁盘用的 UFS2.1，是在太落后了
5. 运行的时候很热，风扇声音很大。

![image-20250505113810346](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250505113810346.png)

而铭凡这个厂家也是比较口碑两极化，这几年国产小主机层出不穷，minisforum 应该算是最早的一批。一部分玩家为了性价比方案选择国产小主机，而另一部分玩家还是只认电脑三巨头再加上 Apple。就比如雷神被吐槽是，一线的价格，二线的产品，三线的售后。（来自网络，不代表本人观点）

回到电脑本身，自带的 windows 真的卡，非常卡！！！！我是觉得实际办公都卡，跑 geekbeanch 也很卡。

然后换了 Ubuntu，网上说要根据 UFS 做一些更改，卖家也表示不支持除了 windows 以外的系统。但是我实际用的 ubuntu24.0，直接随身碟也装上了，安装时候也很卡，甚至不如大学的笔记本=。=，不确定是性能是在拉垮还是这几年 ubuntu 越来越臃肿了。

网上是这个方案，我先贴出来，Mark 一下。https://www.reddit.com/r/MiniPCs/comments/1eb8dgv/minisforum_s100_only_runs_windows_anyone_else/

```bash
sudo mount --bind /dev "$PWD/dev"
sudo mount --bind /proc "$PWD/proc"
sudo mount --bind /sys "$PWD/sys"

Type:
sudo chroot "$PWD" /bin/bash --login

Type:
echo "ufshcd" >> /etc/initramfs-tools/modules
echo "ufshcd-pci" >> /etc/initramfs-tools/modules

Type:
update-initramfs -u -k all
```

这是加了详细注释的版本（完全针对新手也能理解的程度）：

---

**将 Ubuntu 系统的根分区挂载到/mnt 目录**
（假设你已经挂载好了，这一步是之前完成的）

```bash
# 进入挂载好的/mnt目录
cd /mnt
```

---

**挂载必要的系统目录，确保在 chroot 环境中能正常使用系统功能**

```bash
# 绑定/dev目录，这样chroot后能访问设备文件（如磁盘、终端等）
sudo mount --bind /dev "$PWD/dev"

# 绑定/proc目录，这样chroot后能访问进程信息
sudo mount --bind /proc "$PWD/proc"

# 绑定/sys目录，这样chroot后能访问内核信息
sudo mount --bind /sys "$PWD/sys"
```

---

**切换到 chroot 环境，相当于“进入”你的 Ubuntu 系统中，像正常启动一样操作**

```bash
sudo chroot "$PWD" /bin/bash --login
```

> 说明：
> 这样之后你在这个终端里的所有操作，都会直接作用于你挂载的 Ubuntu 系统上（而不是 LiveCD 或恢复环境）。

---

**在 initramfs 的配置文件中添加模块，确保开机时加载 UFS 硬盘相关驱动**

```bash
echo "ufshcd" >> /etc/initramfs-tools/modules
echo "ufshcd-pci" >> /etc/initramfs-tools/modules
```

> 说明：
> 这里`ufshcd`和`ufshcd-pci`是 UFS 存储设备的驱动模块，如果不加，可能开机找不到硬盘导致无法启动。

---

**更新 initramfs，将刚才加入的模块纳入系统启动时加载的内容**

```bash
update-initramfs -u -k all
```

> 说明：
> `-u` 表示更新现有的 initramfs，`-k all`表示为所有内核版本更新。
> 这一步非常重要，否则刚才写入的模块不会生效。

---

**退出 chroot 环境**

```bash
exit
```

> 说明：
> 这会退出你刚才“进入”的 Ubuntu 系统，回到正常的恢复环境终端。

---

**总结一句话**
整个流程的作用是：
**在离线状态下手动为 Ubuntu 系统补充 UFS 硬盘驱动，确保系统下次启动时可以识别和加载 UFS 硬盘，从而正常启动。**

这个是在安装了 ubuntu 系统的 geekbench6 的跑分，这个是调整功耗到 9W 的，如果是默认的 6W 跑分只有 665，是完全没眼看的程度。期间也尝试过在 Bios 把功耗调整到 12.5W，但是分数反而降到 145 左右，不确定是不是降频或者功耗撞墙什么的。https://browser.geekbench.com/v6/cpu/11818077

改功耗：https://www.youtube.com/watch?v=g6Dk3BMgoYw程度

![image-20250505092958833](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250505092958833.png)

本来还想试试 openwrt 的，但是也没成功，UFS2.1 也没啥折腾的必要。用了前面修复 UFS 的命令，执行之后 boot 里也没有引导。

```
sudo dd if=immortalwrt-24.10.0-x86-64-generic-ext4-combined-efi.img of=/dev/sda bs=4M status=progress
```

### 写在最后

如果追求桌面办公的话，适合对性能要求不高，能容忍卡顿的。

如果安装 Linux 的话，不强制追求 X86 话，还是树莓派吧，不过价格能够降一半倒是一个可以接受的方案。

这个能 POE 一线通固然是优点，但是 Typec 供电+wifi 网卡也没差太多。虽然放弱电箱真的好看好管理，但是 N100 对于现在的我来说，也就只能跑跑路由器系统或者轻 NAS 了吧。

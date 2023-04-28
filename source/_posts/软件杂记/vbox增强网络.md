---
title: vbox增强网络
tags:
  - 虚拟机
date: 2022-12-30 00:00:00
---

## Vbox

```bash
df -h
Filesystem      Size  Used Avail Use% Mounted on
tmpfs           391M  1.4M  390M   1% /run
/dev/sda1        26G  7.5G   17G  31% /
tmpfs           2.0G     0  2.0G   0% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
tmpfs           391M  148K  391M   1% /run/user/1000
/dev/sr0         61M   61M     0 100% /media/VBox_GAs_6.1.38
```
然后把VBox_GAs_6.1.38这个目录拷贝到一个可以操作的目录下，然后执行对应脚本，安装之后重启操作系统，比如:

```bash
cp -r media/VBox_GAs_6.1.38 .
chmod -R 777 VBox_GAs_6.1.38/
cd VBox_GAs_6.1.38/
sudo ./VBoxLinuxAdditions.run 
```

[1] yeshttps://blog.csdn.net/qq_21165007/article/details/80344810
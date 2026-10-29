---
title: Ubuntu 18.04 安装 NVIDIA 1080 Ti 驱动记录
date: '2019-09-12 18:37:31'
updated: '2019-09-12 18:37:31'
abbrlink: f868b20e
categories:
- 软件
tags:
- Linux
description: 记录 Ubuntu 18.04 中清理旧 NVIDIA 驱动、添加驱动源、安装与重启的步骤，以及 deb 安装时遇到的依赖问题。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/100780196
source_title: install Nvidia 1080Ti driver on ubuntu1804
---

if you’re using ubuntu 16.04, I recommand your upgrade your system to ubuntu1804.

#### <a id="install_1080TI_driver_for_ubuntu1804_3"></a>install 1080TI driver for ubuntu1804

###### <a id="1Remove_old_Nvidia_driver_5"></a>1.Remove old Nvidia driver


```
sudo apt-get purge nvidia*
```


###### <a id="2_add_a_repository_9"></a>2. add a repository


```
sudo add-apt-repository ppa:graphics-drivers/ppa
sudo apt-get update
```


###### <a id="3_Installation_14"></a>3. Installation

Type in this command, then press Tab, I install nividia-driver-435.


```
sudo apt-get install nividia-
```


or try this command


```
sudo ubuntu-drivers autoinstall
```


then reboot


```
reboot
```


#### <a id="Last_30"></a>Last

when I try to install deb file, there’s some wrong in it.


```
sudo apt-get install -f
```


then run command


```
sudo dpkg - i *.deb
```


##### <a id="install_deb_40"></a>install deb


```
1.CODE:

sudo apt-get install rpm alien

2.CODE:

alien -d package.rpm

3.CODE:

sudo dpkg -i package.deb
```

---
title: VS code+linux子系统打造开发环境
description: Linux
tags: GIT
toc: true
categories: 软件
abbrlink: 7225c876
date: 2019-02-14 00:00:00
---

### 1.下载子系统

![](https://upload-images.jianshu.io/upload_images/5415189-406b132777749578.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


![](https://upload-images.jianshu.io/upload_images/5415189-759da722a6f05673.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


### 2.安装必要软件

0.[更换软件源](https://www.linuxidc.com/Linux/2017-11/148627.htm)
https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu/
1.安装build-essential
```
sudo apt-get install build-essential
```
![](https://upload-images.jianshu.io/upload_images/5415189-78cca69c80437e10.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

安装完之后发现gcc和g++都是5.4版本的，需要进行更新。
![](https://upload-images.jianshu.io/upload_images/5415189-077bb0fbf917c7cf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2.升级gcc, g++
首先添加ppa到库
```
sudo add-apt-repository ppa:ubuntu-toolchain-r/test
sudo apt-get update
sudo apt-get install g++-8
```
![](https://upload-images.jianshu.io/upload_images/5415189-67806fc2235cede0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
接下来使用管理员权限更新一下。
```
update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-8 53 \
--slave /usr/bin/g++ g++ /usr/bin/g++-8 \
--slave /usr/bin/gcc-ar gcc-ar /usr/bin/gcc-ar-8 \
--slave /usr/bin/gcc-nm gcc-nm /usr/bin/gcc-nm-8 \
--slave /usr/bin/gcc-ranlib gcc-ranlib /usr/bin/gcc-ranlib-8
```
![](https://upload-images.jianshu.io/upload_images/5415189-42a28db55856a4fc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

3.安装anaconda 

[官网](https://www.anaconda.com/distribution/)或者[清华镜像](https://mirrors.tuna.tsinghua.edu.cn/help/anaconda/)下载anaconda

![](https://upload-images.jianshu.io/upload_images/5415189-e77fc35b6452e09e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


配置环境变量
```

echo 'export PATH="~/anaconda3/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```
安装成功
![](https://upload-images.jianshu.io/upload_images/5415189-bb6f3572fdf47e9f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![](https://upload-images.jianshu.io/upload_images/5415189-824afee4b835411e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

https://www.jianshu.com/p/fe327b72fa31
4.vscode配置终端

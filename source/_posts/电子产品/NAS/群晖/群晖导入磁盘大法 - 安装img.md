---
title: 群晖导入磁盘大法 - 安装img
tags: 家庭网络
toc: true
categories: 群晖
abbrlink: 8c366e49
date: 2025-03-02 00:00:00
---

很多年之后再用群晖的虚拟机，发现越来越像云了，可能也有在云计算行业摸爬滚打了几年的原因吧，总喜欢一些比较稀奇古怪的玩法，在家里常常玩公有云那一套。

## 一、导入磁盘映像

得到 Img 之后，点击映像，然后点击导入磁盘映像，我这里有两块盘，随便选一个就好。

![image-20250322105417636.png](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250322105417636.png)

选中上传的 img 文件上传到磁盘映像。

 <!--more-->

![image-20250322110125732.png](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250322110125732.png)

然后可以观察到群晖根据这个 img 正在创建卷文件。

![image-20250322105500706.png](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250322105500706.png)

这个是创建好的卷。

![image-20250322105529539.png](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250322105529539.png)

## 二、导入虚拟机并启动

下面开始启动虚拟机，新增附近有一个三角箭头点击，有个导入的选项。（藏的挺深）

![image-20250322110401490.png](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250322110401490.png)

可以导入 OVA，也可以导入上面的磁盘映像。

![image-20250322105605240.png](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250322105605240.png)

同样也是选择磁盘。

![image-20250322105627911.png](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250322105627911.png)

唯一不同的是，在虚拟磁盘这里我们可以选择刚刚创建的**硬盘映像**，然后后面下一步就可以了，不再需要 ISO 啥的。

![image-20250322105649130.png](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250322105649130.png)

## 三、总结

其实吧，在公有云这算基础操作，在群晖这藏的这么深。随便玩玩，差不多该有的都有了。

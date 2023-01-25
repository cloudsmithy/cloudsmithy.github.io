---
title: pcigo 搭建GitHub图床
date: 2023-01-24
tags: blog
toc: true
categories: blog
---





很想吐槽hexo图片的逻辑，他所有的图片都是去source这个目录下找，也就是说这个是默认的绝对路径的根目录。如果使用相对路径的话，就需要在和文件同名的文件夹下，然后使用名字文件夹名/图片名来访问，但是这样本地的编辑器就没办法渲染了。当然网上一些修正路径的插件试了基本都不满意，所以就使用了网络图床的方式。

<!--more-->

PIGO用来生成链接已经是一个很成熟的方案了，先在GitHub上获取token（setting - developer settings - Personal access tokens (classic)），然后设置把仓库地址，分支和token都填到picgo中，可以使用剪切板上传，然后生成的URL也会复制到剪切板，当然也可以在typora中设置自动上传。



![GIthub 获取token](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/image-20230124103700115.png)



![GitHub 图床](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/image-20230124095238717.png)

![剪切板上传](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/image-20230124103345638.png)

![typora的设置](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/image-20230124103423565.png)



这个是图片效果，从popos壁纸中截取的一块，很好看~

![图片示例](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/20230124092009.png)




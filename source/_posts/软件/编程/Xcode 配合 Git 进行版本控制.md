---
title: Xcode 配合 Git 进行版本控制
date: '2019-09-11 07:29:30'
updated: '2024-04-22 21:42:04'
abbrlink: 868d9711
categories:
- 软件
- 编程
tags:
- Git
- Apple
- 开发
description: 记录在 Xcode 中创建 Git 工程、关联 GitHub 仓库、查看代码差异，以及 commit、push 和分支操作的过程。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/100724313
source_title: Xcode配合git进行版本控制
---

最近入了mac的坑，装了Xcode要写c++，索性直接配置了xcode的git，省着命令行commit了。

首先新建工程，一定要点create git。。。。  
![Xcode 配合 Git 进行版本控制配图](/images/migrated/d77e9243be1fcabaca0f.png)

接下来添加git信息  
![Xcode 配合 Git 进行版本控制配图](/images/migrated/9c4b7511f4c9c5327e3e.png)  
这里可以关联github已经有的仓库，也可以使用新的仓库，这里我选择新的仓库。接下来填入github的用户名和密码确认就发现远程github就已经创建了。  
![Xcode 配合 Git 进行版本控制配图](/images/migrated/941bcd56f3ecf1eecf99.png)  
这个就是我刚才新建的仓库，在github上边已经显示出来了。  
![Xcode 配合 Git 进行版本控制配图](/images/migrated/e4e2a0d361983dab83ca.png)

接下来是commit和pull代码，这里没有add的选项，可能鼠标直接代替了吧。  
![Xcode 配合 Git 进行版本控制配图](/images/migrated/00c80ef39982bbdff439.png)

我们添加了一行代码，一会提交试试。  
![Xcode 配合 Git 进行版本控制配图](/images/migrated/e4941f7ef656a7e1ac9f.png)

点击这里的commit，我们可以再选中我们的main.cpp。  
![Xcode 配合 Git 进行版本控制配图](/images/migrated/4ab01db761877f718ca0.png)

git已经告诉我们改动了什么。点击右下角的commit file。  
![Xcode 配合 Git 进行版本控制配图](/images/migrated/8813985bd373c0a61d49.png)  
然后push就ok啦。

![Xcode 配合 Git 进行版本控制配图](/images/migrated/fa5ba5af2cd34de6a5c7.png)

在github已经看见提交信息。大功告成！！！！！

PS：新建branch

![Xcode 配合 Git 进行版本控制配图](/images/migrated/2a51a92b98e8c3d2cf7e.png)

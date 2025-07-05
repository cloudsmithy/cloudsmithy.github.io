---
title: Typora 和Obsidian 自动使用 Github 做在线图床
tags: NAS
toc: true
categories: 电脑外设
date: 2025-05-11 00:00:00
---

从前写 Markdown 使用使用相对路径，后来上了 Vuepres/Hexo 之后图床迁移一直有问题，最后采用了在线图床的办法，虽然在国内访问 Github 并不完美，但是毕竟都是都是一些折腾的记忆，如果放在不一直续费的公有云或者一些免费的小厂商，倘若有一天数据丢失那也是一个伤心的事情。

### 设置 Github

先新建 Github 的图床目标仓库：

 <!--more-->

![image-20250215103303802](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250215103303802.png)

![image-20250215103206785](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250215103206785.png)

然后设置 Token

打开 Github –> 点击头像 –> Settings –> Developer settings –> 点击 Personal access tokens –> 点击 Tokens(classic) –> 选择 Generate new token –> 填写 Note(token 名称)\选择过期时间\选择 token 权限 –> 点击 Generate token 保存 token

![image-20250215103617389](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250215103617389.png)

### 下载 Picgo

这个用来做上传图片的 Agent，实际上 Typora 和 Obsidian 都是调用了 PicGo 的 API

![image-20250215102641429](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250215102641429.png)

![image-20250215102734567](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250215102734567.png)

安装时候可能需要这个问题：

因为 PicGo 没有签名，所以会被 macOS 的安全检查所拦下。

安装后打开遇到「文件已损坏」的情况，请按如下方式操作：
信任开发者，会要求输入密码:

```bash
sudo spctl --master-disable
```

然后放行 PicGo :

```bash
xattr -cr /Applications/PicGo.app
```

然后就能正常打开。https://github.com/Molunerfinn/PicGo/blob/dev/FAQ.md

填入仓库信息和 token：

![image-20250215103235460](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250215103235460.png)

### 设置 Typora 和 Obsidian

在 Typora 中设置上传图片时候调用 Picgo。

![image-20250215102926948](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250215102926948.png)

Obsidian 需要安装插件，先关闭安装模式：

![image-20250215103044288](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250215103044288.png)

安装 Image upload 插件：

![image-20250215103103811](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250215103103811.png)

###

### 效果展示

Github 上可以看到 commit 记录：

![image-20250215103420945](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250215103420945.png)

Obsidian 也能正常渲染：

![image-20250215103253797](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250215103253797.png)

微信排版工具也能正常渲染 Github Raw 链接：https://doocs.github.io/md/

![image-20250215103517169](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250215103517169.png)

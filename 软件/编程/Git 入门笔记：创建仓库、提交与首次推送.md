---
title: Git 入门笔记：创建仓库、提交与首次推送
date: '2019-11-30 15:58:42'
updated: '2026-09-23 10:28:25'
abbrlink: 'e56cfb4d'
categories:
- 软件
- 编程
tags:
- Git
- 开发
description: 从安装 Git、创建 GitHub 仓库开始，练习 git init、add、commit、remote 和 push，完成本地目录与远程仓库的关联。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/103324670
source_title: git使用教程
---

这是最初把本地项目推到 GitHub 时记下的步骤。示例沿用当时的 `master` 分支名；操作自己的仓库时，替换为实际分支名和远程地址。

## 1.安装

如果你是Mac用户，那么使用下边命令进行安装。  
`brew install git`  
如果是Linux的话，那么就是  
`apt-get install git 或者 yum install git`  
如果你是windows的话，那么去git官网下载exe直接就可以使用了（需要科学上网）。

## 2.新建版本库

我们进入GitHub仓库，点击New，这样我们就会新建出来一个代码仓库，  
![GitHub 仓库列表中的 New 按钮](/images/migrated/3ba46aa4f03059ca564a.png)

来到下边的页面，我们可以选择仓库的名称，描述文件和是否在新建仓库的时候新建README.md 文件。  
![创建仓库时填写名称、描述并选择初始化 README](/images/migrated/a1b396e2aa0d9fe58676.png)

我一般是通过命令行去新建一个新的代码仓库。  
我们在想要关联仓库的文件夹中打开终端，输入如下的代码：  
`echo "# xxx-" >> README.md` 这句是把一“# xxx- ”这个字符串写到 README.md 文件中，同时也会在这个目录新建readme.md这个文件。  
`git init`是初始化git仓库，这样这个文件夹才会被视为是git的项目文件，如果终端执行`ls -a`的话，我们才能看见一个.git的隐藏文件夹。之所以称它为文件夹而不是文件，因为在终端确实是可以cd进去的。

有了.git文件夹，我们才可以执行后边的命令把项目文件夹关联到github仓库中。  
`git add README.md`这句是把Readme.md这个文件放在暂存区，其实更多的时候，我这个步骤使用的代码是`git add .`或者`git add -A`，如果用Linux使用经验的朋友们都知道，`.`在Linux文件夹中是当前目录的意思，也就是说`git add .` 暂存当前目录及子目录的变化，`git add -A` 暂存整个工作树的变化；它们都还没有创建提交。

`git commit -m "这里写提交信息，可以理解为注释"`这句把暂存区的内容记录成一次本地提交，再用 `git push` 推送到远程仓库。  
![GitHub 新仓库页面给出的初始化与首次推送命令](/images/migrated/dfe9c769a187cb8f5dfe.png)  
如果你是第一次建立仓库并且关联文件夹的话，我们可以使用这两句把GitHub上的仓库信息储存到我们的.git文件夹里，换句话说，就是仓库和文件夹的绑定。

```
git remote add origin https://github.com/Github用户名/项目名称.git
git push -u origin master
```

`git push -u origin master`是默认提交到master分支，如果后续提交，直接`git push`就好了。

---
title: Hexo 注意
date: 2021-01-22
tags: 
    - blog
    - hexo
toc: true
categories:
    - blog
---

## 文章类型

source 目录是放置文稿的地方，其中有几个保留的名称，也就是hexo的三种布局post、page 和 draft，其中post是需要发布的文章，draft是草稿，文章分别存放在\_post, \_draft的目录下,page是单独的文件夹，名字随意，类似于路由，比如tag，about这些。draft的文章不会被渲染出来，page 只能通过标签栏访问。草稿写好之后在复制post文件夹，觉得hexo的命令过于繁琐，文字工作者就应该搭建好再不折腾。（我应该没脸说这个话）



## 渲染方法

```yaml
title: 标题
date: 2021-01-22 #时间
tags:  # 标签
    - blog
    - hexo
toc: true # 显示目录
categories: blog #显示分类
```

折叠文章用：
<!--more-->

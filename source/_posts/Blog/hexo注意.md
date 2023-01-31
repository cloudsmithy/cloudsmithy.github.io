---
title: Hexo 注意
tags:
  - blog
  - hexo
toc: true
categories:
  - blog
abbrlink: 2dedb869
date: 2021-01-22 00:00:00
---

## 文章类型

source 目录是放置文稿的地方，其中有几个保留的名称，也就是hexo的三种布局post、page 和 draft，其中post是需要发布的文章，draft是草稿，文章分别存放在\_post, \_draft的目录下,page是单独的文件夹，名字随意，类似于路由，比如tag，about这些。draft的文章不会被渲染出来，page 只能通过标签栏访问。草稿写好之后在复制post文件夹，觉得hexo的命令过于繁琐，文字工作者就应该搭建好再不折腾。（我应该没脸说这个话）



## 渲染方法

```
title: 标题
date: 2021-01-22 #时间
tags:  # 标签
    - blog
    - hexo
toc: true # 显示目录
categories: blog #显示分类
```

```yaml
---
title: 
date: 2021-01-22
tags: 
toc: true 
categories: blog 
---
```



折叠文章用，不喜欢改框架里的JS代码
<!--more-->

https://sherlockgy.github.io/2018/06/03/Hexo%E6%90%AD%E5%BB%BA%E5%8D%9A%E5%AE%A2%E2%80%94%E2%80%94%E5%AE%9E%E7%8E%B0%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87/

## 404页面

404页面和page页面地位一样，404文件夹+index.md, 网上也有很多好看的404页面可以借鉴，不过本地调式的时候不显示，部署之后就有了。



## 附件

yml文件附件找的根目录是source，所有图片什么的放在source/images下就好。

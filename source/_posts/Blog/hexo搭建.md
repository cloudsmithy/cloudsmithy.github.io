---
title: Hexo 搭建
date: 2021-01-22
tags: blog
toc: true
categories: blog
---



玩了这么多年博客，也要记录搭建的心路。重新整理HEXO的一套方法。

## 环境搭建

hexo需要依赖nodejs环境，关于搭建nodejs的环境最佳建议还是使用NVM。

简单来说，nodejs是运行环境，hexo是运行所需的依赖，对于这个博客而言就是起到渲染的作用。

本地的话，还是建议全局安装, 当然也可以安装到项目中，方便迁移。

```bash
npm install -g hexo-cli # 全局
npm install hexo #项目
```


安装好之后就可以使用hexo命令进行操作了，这个是一个hexo附带的模板。
<!--more-->


Welcome to [Hexo](https://hexo.io/)! This is your very first post. Check [documentation](https://hexo.io/docs/) for more info. If you get any problems when using Hexo, you can find the answer in [troubleshooting](https://hexo.io/docs/troubleshooting.html) or you can ask me on [GitHub](https://github.com/hexojs/hexo/issues).

## Quick Start

### Create a new post

``` bash
$ hexo new "My New Post"
```

More info: [Writing](https://hexo.io/docs/writing.html)

### Run server

``` bash
$ hexo server
```

More info: [Server](https://hexo.io/docs/server.html)

### Generate static files

``` bash
$ hexo generate
```

More info: [Generating](https://hexo.io/docs/generating.html)

### Deploy to remote sites

``` bash
$ hexo deploy
```

More info: [Deployment](https://hexo.io/docs/one-command-deployment.html)



# 主题美化

当然，初始的界面还很丑，还需要我们去找一些主题。我现在用的是icarus，目前有5.7K的star，配置上比以前配置hexo简直方便太多。以前用过hexo，无奈太火了导致烂大街，不然小清新十分好看。Indigo这个主题和写字楼同名，不确定是不是楼里大佬所写。最终还是选了icarus的简单配置，上了年纪，已经不像年轻人一般追求热火，力求轻量。用最少的配置来写文章，用最轻的电脑来办公，用核心显卡来代替独立显卡。

hexo的配置文件是_config.yml，其中加了注释的是覆盖主题配置文件的。

```
title: 镜湖
subtitle: ''
description: ''
keywords: null
author: Xu
language: zh-CN
timezone: ''
url: https://xu-hardy.github.io/
permalink: ':year/:month/:day/:title/'
permalink_defaults: null
pretty_urls:
  trailing_index: true
  trailing_html: true
source_dir: source
public_dir: public
tag_dir: tags
archive_dir: archives
category_dir: categories
code_dir: downloads/code
i18n_dir: ':lang'
skip_render: null
new_post_name: ':title.md'
default_layout: post
titlecase: false
external_link:
  enable: true
  field: site
  exclude: ''
filename_case: 0
render_drafts: false
post_asset_folder: true
relative_link: true
future: true
highlight:
  enable: true
  line_number: true
  auto_detect: false
  tab_replace: ''
  wrap: true
  hljs: false
prismjs:
  enable: false
  preprocess: true
  line_number: true
  tab_replace: ''
index_generator:
  path: ''
  per_page: 10
  order_by: '-date'
default_category: uncategorized
category_map: null
tag_map: null
meta_generator: true
date_format: YYYY-MM-DD
time_format: HH:mm:ss
updated_option: mtime
per_page: 10
pagination_dir: page
include: null
exclude: null
ignore: null
theme: icarus
deploy:
  type: ''
feed:
    type: atom
    path: atom.xml
    limit: 20

```



接下来是_config.icarus.yml，这个是icarus主题的配置文件：

```yaml
version: 5.1.0
variant: default
logo: /img/favicon.svg
head:
    favicon: /img/favicon.svg
    manifest:
        name: 
        short_name: 
        start_url: 
        theme_color: 
        background_color: 
        display: standalone
        icons:
            -
                src: ''
                sizes: ''
                type: 
    open_graph:
        title: 
        type: blog
        url: 
        image: 
        site_name: 
        author: 
        description: 
        twitter_card: 
        twitter_id: 
        twitter_site: 
        google_plus: 
        fb_admins: 
        fb_app_id: 
    structured_data:
        title: 
        description: 
        url: 
        author: 
        publisher: 
        publisher_logo: 
        image: 
    meta:
        - ''
    rss: 
navbar:
    menu:
        镜湖: /
        时光线: /archives
        标签: /tags
        博客新功能计划: /todo
        计算机技术: /vue_blog
        AWS: /aws
        备注: /note
        关于我: /about
    links:
        Download on GitHub:
            icon: fab fa-github
            url: https://github.com/Xu-Hardy/Xu-Hardy.github.io
footer:
    links:
        Creative Commons:
            icon: fab fa-creative-commons
            url: https://creativecommons.org/
        Attribution 4.0 International:
            icon: fab fa-creative-commons-by
            url: https://creativecommons.org/licenses/by/4.0/
        Download on GitHub:
            icon: fab fa-github
            url: https://github.com/Xu-Hardy/Xu-Hardy.github.io
article:
    highlight:
        theme: atom-one-light
        clipboard: true
        fold: unfolded
    readtime: true
    update_time: true
    licenses:
        Creative Commons:
            icon: fab fa-creative-commons
            url: https://creativecommons.org/
        Attribution:
            icon: fab fa-creative-commons-by
            url: https://creativecommons.org/licenses/by/4.0/
        Noncommercial:
            icon: fab fa-creative-commons-nc
            url: https://creativecommons.org/licenses/by-nc/4.0/
search:
    type: insight
    index_pages: true
comment:
    type: disqus
    shortname: 'my'
donates:
    -
        type: alipay
        qrcode: '/images/ali.jpg'
    -
        type: wechat
        qrcode: '/images/wechat.jpg'
# share:
#     type: sharethis
#     install_url: ''
sidebar: # 固定左右边栏
    left:
        sticky: true
    right:
        sticky: true
widgets:
    -
        position: left
        type: profile
        author: Xu
        author_title: AWS SUPPORT
        location: BEI JING
        avatar: '/images/me.png'
        avatar_rounded: true
        gravatar: 
        follow_link: https://github.com/Xu-Hardy/Xu-Hardy.github.io
        social_links:
            Home:
                icon: fa fa-home
                url: https://xu-hardy.github.io/
            AWS:
                icon: fab fa-aws
                url: https://xu-hardy.github.io/aws
            archives:
                icon: fa fa-calendar
                url: https://xu-hardy.github.io/archives
            Tags: 
                icon: fa fa-tags
                url: https://xu-hardy.github.io/tag
            RSS:
                icon: fas fa-rss
                url: "atom.xml"
    -
        position: left
        type: toc
        index: true
        collapsed: true
        depth: 3
    -
        position: left
        type: links
        links:
            Hexo: https://hexo.io
            Bulma: https://bulma.io
            Liarlee: https://liarlee.site/
            easyhexo: https://easyhexo.com/
            hexo-theme-icarus: https://ppoffice.github.io/hexo-theme-icarus/
    -
        position: left
        type: categories
    -
        position: right
        type: recent_posts
    -
        position: right
        type: archives
    -
        position: right
        type: tags
        order_by: name
        amount: 
        show_count: true
    -
        position: right
        type: subscribe_email
        description: 
        feedburner_id: ''
    # -
        # position: left
        # type: adsense
        # client_id: ''
        # slot_id: ''
    -
        position: left
        type: followit
        description: 
        action_url: ''
        verification_code: ''
plugins:
    animejs: true
    back_to_top: true
    baidu_analytics:
        tracking_id: 
    bing_webmaster:
        tracking_id: 
    busuanzi: false
    cnzz:
        id: 
        web_id: 
    cookie_consent:
        type: info
        theme: edgeless
        static: false
        position: bottom-left
        policyLink: https://www.cookiesandyou.com/
    gallery: true
    google_analytics:
        tracking_id: 
    hotjar:
        site_id: 
    katex: false
    mathjax: false
    outdated_browser: false
    progressbar: true
    statcounter:
        project: 
        security: 
    twitter_conversion_tracking:
        pixel_id: 
providers:
    cdn: jsdelivr
    fontcdn: google
    iconcdn: fontawesome
```


---
title: Hexo RSS订阅
date: 2022-01-25
tags: 
    - blog
    - hexo
toc: true
categories:
    - blog

---


给HEXO博客搭建RSS功能，先安装依赖

```bash
npm install --save hexo-generator-feed
```

然后在 hexo 根目录下的 `_config.yml` 文件中添加配置

```yaml
feed:
    type: atom
    path: atom.xml
    limit: 20
```

然后在 theme 目录下的 `_config.yml` 文件中添加配置, 然后部署就可以看到效果了

```yaml
social_links：
	rss: /atom.xml
```



参考：

https://wxnacy.com/2018/12/12/hexo-add-rss/

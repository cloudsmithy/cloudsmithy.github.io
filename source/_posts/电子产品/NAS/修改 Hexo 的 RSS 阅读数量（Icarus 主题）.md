---
title: 修改 Hexo 的 RSS 阅读数量（Icarus 主题）
tags: Hexo
toc: true
categories: NAS
abbrlink: 2d0d3922
date: 2025-08-08 00:00:00
---

Icarus 主题本身**不直接生成 RSS**，只是**提供 RSS 链接的展示位置**（例如导航栏、侧边栏的 RSS 按钮）。
真正生成 RSS/Atom 的功能，需要依赖 Hexo 的插件（通常是 [`hexo-generator-feed`](https://github.com/hexojs/hexo-generator-feed)）。

因此，要修改 RSS 条数，需要分两步：

## <!--more-->

## 1. 安装 RSS 生成插件

在博客根目录（`_config.yml` 所在目录）执行：

```bash
npm install hexo-generator-feed --save
```

---

## 2. 在站点 `_config.yml`（根目录）配置 RSS

RSS 条数由站点配置控制，而不是主题配置。示例：

```yaml
feed:
  type: atom # 类型，可选 atom、rss2、json
  path: atom.xml # 输出文件名
  limit: 50 # 输出文章数，0 表示全部文章
```

> 如果不写 `limit`，默认值是 20（插件源码中 `var limit = config.limit || 20`）。

---

## 3. 在 Icarus 主题 `_config.yml` 添加 RSS 链接

Icarus 主题只是显示你生成好的 RSS 地址，常见的配置方式有两种：

**导航栏：**

```yaml
navbar:
  menu:
    RSS: /atom.xml # 对应 feed.path 的路径
```

**侧边栏（Profile 小部件）：**

```yaml
widgets:
  - position: left
    type: profile
    social_links:
      RSS:
        icon: fas fa-rss
        url: /atom.xml
```

---

## 4. 重新生成站点

```bash
hexo clean && hexo g
```

然后访问：

```
http://你的域名/atom.xml
```

即可查看 RSS 内容。

---

## 优先级说明

- **RSS 条数生成逻辑** → 由 `hexo-generator-feed` 插件控制，只读取 **站点 `_config.yml`** 的 `feed` 配置。
- **RSS 链接展示** → 由主题（如 Icarus）控制，在主题 `_config.yml` 中设置按钮或链接。
- 如果两个地方都有 `feed:` 配置，**站点 `_config.yml` 优先级更高**，主题配置不会覆盖它。

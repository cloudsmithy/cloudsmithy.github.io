---
title: Hexo Sitemap 踩坑复盘：CRC32 哈希碰撞导致重复 URL
description: >-
  记录博客 sitemap 中出现重复 URL 的排查过程，根因是 hexo-abbrlink 插件使用 CRC32 产生了哈希碰撞，最终通过
  postinstall patch 替换为 MD5 解决。
tags:
  - SEO
toc: true
author: Claude Code
categories:
  - 软件
abbrlink: 428cc28c
date: 2026-05-14 00:00:00
---

## 现象

用 Google Search Console 检查站点收录时，发现 sitemap.xml 里有多组完全相同的 `<loc>` URL，但 `lastmod` 不同。比如：

```xml
<url>
  <loc>https://blog.no-claw.com/posts/ebd08f3f/</loc>
  <lastmod>2024-07-02</lastmod>
</url>
<url>
  <loc>https://blog.no-claw.com/posts/ebd08f3f/</loc>
  <lastmod>2024-07-03</lastmod>
</url>
<url>
  <loc>https://blog.no-claw.com/posts/ebd08f3f/</loc>
  <lastmod>2024-07-09</lastmod>
</url>
```

同一个 URL 出现 3 次。搜索引擎对这种 sitemap 会降低信任度甚至忽略。

## 排查

用命令快速定位：

```bash
grep "<loc>" public/sitemap.xml | sort | uniq -d
```

发现 6 组重复，涉及 7 篇文章。

接着查源文件的 front matter：

```bash
grep -rn "abbrlink: ebd08f3f" source/_posts/
```

输出：

```
Easysearch/3. 玩转Easysearch语法.md:12:abbrlink: ebd08f3f
Easysearch/4. 使用Elasticsearch Python SDK 查询Easysearch.md:12:abbrlink: ebd08f3f
Easysearch/2. Easysearch 数据可视化和管理平台.md:12:abbrlink: ebd08f3f
```

三篇不同的文章被分配了相同的 abbrlink。

## 根因

`hexo-abbrlink` 插件的核心逻辑（`lib/logic.js` 第 39 行）：

```js
let res = opt_alg == 'crc32' ? crc32.str(data.title) >>> 0 : crc16(data.title) >>> 0;
```

它用文章标题的 **CRC32** 值作为短链接。CRC32 只有 32 位输出空间（约 43 亿个值），且不是密码学哈希，碰撞概率相对高。

根据生日悖论，当文章数量达到 ~77000 篇时碰撞概率就有 50%。但 CRC32 对相似输入（同系列标题前缀相同）的碰撞率远高于理论值——我 300 篇文章就撞了 6 次。

## 修复方案

用 `postinstall` hook 在 `npm install` 后自动把 CRC32 替换为 MD5 截取 8 位 hex：

**`tools/patch-abbrlink.js`**：

```js
const oldLine = "let res = opt_alg == 'crc32' ? crc32.str(data.title) >>> 0 : crc16(data.title) >>> 0;";
const newLine = "let res = parseInt(require('crypto').createHash('md5').update(data.title).digest('hex').slice(0, 8), 16) >>> 0;";
content = content.replace(oldLine, newLine);
```

**`package.json`**：

```json
"postinstall": "node tools/patch-abbrlink.js"
```

MD5 截取 8 位 hex 同样是 32 位空间，但分布均匀性远优于 CRC32，对 300 篇级别的博客碰撞概率几乎为零。

已有文章的 abbrlink 写在 front matter 里不会重新计算，所以 patch 只影响新文章，不破坏现有 URL。

## 兜底：构建时碰撞自动修复

在 `scripts/check-abbrlink-collision.js` 中注册 Hexo 的 `generateBefore` 事件，检测到碰撞时自动分配新的随机 hex 并写入源文件：

```js
hexo.on('generateBefore', () => {
  // 检测重复 abbrlink，碰撞时用 crypto.randomBytes(4) 生成新值
});
```

CI/CD 构建时如果碰撞，日志会输出 warn 并自动修复，不会构建失败。

## 顺手做的 Sitemap 清理

| 问题 | 修复 |
|------|------|
| `/manifest.json` 被索引 | 加入 `skip_render` |
| `/404` 页面被索引 | front matter 加 `sitemap: false` |
| tag/category 聚合页占抓取预算 | `sitemap.tags: false` + `sitemap.categories: false` |
| 功能页（日记、收藏、语录等） | front matter 加 `sitemap: false` |
| `priority` / `changefreq` 无意义 | 自定义模板去掉这两个字段 |
| `lastmod: 1999-12-31` 异常值 | 修正源文件日期 |

最终 sitemap 从 453 条缩减到 315 条纯内容 URL，零重复。

## 经验

1. **CRC 不适合做唯一标识**。它是校验和算法，设计目标是检测传输错误，不是抗碰撞。需要唯一性就用密码学哈希截取。
2. **Hexo 的 `scripts/` 目录会加载所有 JS 文件**，包括 `.bak`。工具脚本放在别的目录（比如 `tools/`），通过 npm scripts 显式调用。
3. **Sitemap 应该只放值得被搜索引擎抓取的页面**。功能页、聚合页、配置文件都不该出现——它们白白消耗抓取预算。

---

本文排查和修复过程由 Claude Code 辅助完成。

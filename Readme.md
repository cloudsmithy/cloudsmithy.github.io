# 镜湖

> 镜湖元自属闲人，又何必、君恩赐与

忘机山人的个人博客，记录技术折腾、电子产品体验与生活碎碎念。

## 技术栈

| 组件 | 说明 |
|------|------|
| 框架 | [Hexo](https://hexo.io/) 8.x |
| 主题 | [Butterfly](https://butterfly.js.org/) |
| 评论 | [Giscus](https://giscus.app/)（基于 GitHub Discussions） |
| 部署 | GitHub Actions → GitHub Pages |


## 分支说明

| 分支 | 用途 |
|------|------|
| `master` | Hexo 源代码 |
| `gh-pages` | 构建产物，静态网页托管 |
| `docs` | Markdown 源文件（自动从 `source/_posts/` 同步） |

## 快速开始

```bash
# 克隆（只拉最新提交，速度最快）
git clone --single-branch --branch master --depth 1 git@github.com:cloudsmithy/cloudsmithy.github.io.git
cd cloudsmithy.github.io

# 安装依赖
pnpm install

# 本地预览
pnpm dev
```

## 发布渠道

**自有平台**：Hexo 博客 / 微信公众号

**外部媒体**：CSDN / 知乎 / 什么值得买

**合作投稿**：AWS 公众号 / 极限科技 / 懒猫微服

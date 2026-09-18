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

## 内容导览

- 首页专题入口和技术专题页共用 `source/_data/topics.yml`，在这里维护专题介绍、推荐阅读顺序和文章链接。
- 完整技术分类在 `source/_data/technical_categories.yml` 中指定根分类与补充标签；子分类和文章数量自动读取，新增子分类后会自动出现。
- 主导航在 `_config.butterfly.yml` 的 `menu` 下配置；日记、月报、阅读等入口汇总在 `source/life/index.md`。
- 首页优先使用文章的 `description`；缺失、不足 15 字或重复标题时，自动截取正文，长度为 150 字。

## 许可协议

本仓库采用双协议：

- **代码**（主题配置、构建脚本、CI 等）以 [MIT](LICENSE) 协议授权
- **博客内容**（`source/_posts/`、`source/_pages/` 下的文章、图片等）以 [CC BY 4.0](LICENSE-CONTENT) 协议授权，转载请注明出处

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
- 首页使用紧凑的专题按钮，手机上可横向滚动；`home_title` 可设置短名称，专题页继续显示完整名称和阅读路线。
- 首页无封面的文章卡片按内容决定高度，依次展示标题、摘要、日期和分类标签。
- 自定义导航样式的 URL 自动附带内容版本号，修改 CSS 后生成新版本，避免浏览器沿用旧布局。
- 专题中的 `match.tags`、`match.categories` 指定哪些文章显示该专题的返回入口；推荐阅读步骤中的文章也会自动关联到专题。
- 完整技术分类在 `source/_data/technical_categories.yml` 中指定根分类与补充标签；子分类和文章数量自动读取，新增子分类后会自动出现。
- 分类总览与技术专题共用目录数据；生活分类自动收录其余根分类。侧栏分类不截断总数，默认折叠子分类，避免某个分类占满名额。
- 主导航在 `_config.butterfly.yml` 的 `menu` 下配置；日记、月报、阅读等入口汇总在 `source/life/index.md`。
- 首页优先使用文章的 `description`；缺失、不足 15 字或重复标题时，自动截取正文，长度为 150 字。

## 分类与标签维护

- **专题**是推荐阅读路线；**分类**是文章的主归档，优先沿用已有分类树；**标签**用于连接不同分类中的相关文章。
- 文章标签写在 Markdown 的 `tags` 中，以文章实际讨论的内容为准。优先选择已有名称，如 `Easysearch`、`OpenSearch`、`Kubernetes`、`Git`，避免大小写或缩写产生重复标签。
- `AI` 是综合入口；`LLM` 用于模型使用、应用开发和观测；`RAG`、`MCP`、`AgentCore` 等用于具体实践。一篇文章可以同时属于综合标签和具体标签，但不要因为正文偶尔提及就添加。
- 标签页的分组在 `source/_data/tag_groups.yml` 中维护，数量和链接自动读取。尚未分组的新标签会显示在“其他标签”。
- 标签改名时，通过 `_config.yml` 的 `tag_map` 保留原有 URL。目前 `Git` 和 `搜索引擎` 分别沿用 `GIT` 和 `搜索引擎（ES）` 的旧地址。
- 专题的“浏览更多”入口必须覆盖这条路线的文章；例如 AI 专题链接到 `AI` 标签，而不是仅链接到 `LLM`。

## 许可协议

本仓库采用双协议：

- **代码**（主题配置、构建脚本、CI 等）以 [MIT](LICENSE) 协议授权
- **博客内容**（`source/_posts/`、`source/_pages/` 下的文章、图片等）以 [CC BY 4.0](LICENSE-CONTENT) 协议授权，转载请注明出处

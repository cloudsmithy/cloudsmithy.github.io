# Typora 与 Obsidian 配置 GitHub 图床

- URL: https://blog.no-claw.com/c9e271b6/
- 日期: 2025-02-15
- 分类: 软件
- 标签: Git, Blog, Markdown

在撰写 Markdown 文档时，我曾使用相对路径来引用图片。然而，当我转向使用 Vuepress 和 Hexo 等静态网站生成器时，图床迁移变得复杂且容易出错。最终，我选择了在线图床的解决方案。尽管在国内访问 Github 可能不够稳定，但考虑到这些内容大多是我技术探索的记录，如果将它们存放在需要持续付费的公有云或一些小型免费服务商那里，一旦数据丢失，将会是巨大的遗憾。因此，Github 成为了我的首选。

#### 配置 Github 图床

首先，我们需要在 Github 上创建一个用于存储图片的仓库。

1. **创建新仓库**：
    [图：创建新仓库]
2. **设置仓库名称**：
    [图：设置仓库名称]
3. **生成 Personal Access Token**：

   - 打开 Github，点击头像，选择 **Settings**。
   - 进入 **Developer settings**，选择 **Personal access tokens**。
   - 点击 **Tokens (classic)**，然后选择 **Generate new token**。
   - 填写 Token 名称、选择过期时间并勾选所需权限。
   - 点击 **Generate token** 并保存生成的 Token。
      [图：生成 Token]

#### 下载并配置 PicGo

PicGo 是一个用于上传图片的工具，Typora 和 Obsidian 都通过调用 PicGo 的 API 来实现图片上传功能。

1. **下载 PicGo**：
    [图：下载 PicGo]
2. **安装 PicGo**：
    [图：安装 PicGo]
3. **解决 macOS 安装问题**：

   - 由于 PicGo 未签名，macOS 可能会阻止其安装。若遇到“文件已损坏”的提示，可以通过以下命令解决：

```bash
sudo spctl --master-disable
```

   - 然后放行 PicGo：

```bash
xattr -cr /Applications/PicGo.app
```

   - 参考 [PicGo FAQ](https://github.com/Molunerfinn/PicGo/blob/dev/FAQ.md) 获取更多帮助。
4. **配置 PicGo**：

   - 打开 PicGo，填入 Github 仓库信息和之前生成的 Token。
      [图：配置 PicGo]

#### 配置 Typora 和 Obsidian

1. **Typora 设置**：

   - 在 Typora 中，设置图片上传时调用 PicGo。
      [图：Typora 设置]
2. **Obsidian 设置**：

   - 首先，关闭安全模式以安装插件。
      [图：关闭安全模式]
   - 安装 **Image Auto Upload Plugin**。
      [图：安装插件]

#### 效果展示

1. **Github 提交记录**：

   - 上传的图片会在 Github 仓库中生成提交记录。
      [图：Github 提交记录]
2. **Obsidian 渲染效果**：

   - Obsidian 能够正常渲染通过 Github 图床引用的图片。
      [图：Obsidian 渲染效果]
3. **微信排版工具渲染效果**：

   - 微信排版工具也能正常渲染 Github Raw 链接。
      [图：微信排版工具渲染效果]
   - 参考 [DOOCS MD](https://doocs.github.io/md/) 获取更多排版工具的使用方法。

通过以上步骤，你可以轻松地将 Typora 和 Obsidian 与 Github 图床集成，确保图片的安全存储和稳定访问。

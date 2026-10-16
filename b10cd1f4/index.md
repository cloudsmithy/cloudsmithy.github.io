# 懒猫微服实战入门（二十三）：使用 GitHub 单点登录到 Memos

- URL: https://blog.no-claw.com/b10cd1f4/
- 日期: 2025-07-23
- 分类: 懒猫微服 / 入门
- 标签: SSO, 懒猫微服

之前写过拿 Memos 替代 GitHub 记东西，这次往前走一步：给 Memos 挂上 GitHub 单点登录，省掉一套独立密码。你自己开发的应用想接 GitHub，走的也是这条路。

[图：image-20250724093520542]

## 一、创建 GitHub OAuth 应用

### 1. 打开 GitHub OAuth 应用配置入口

1. 登录 GitHub，点击右上角头像，选择 **Settings（设置）**
2. 在左侧栏选择 **Developer settings**
3. 点击 **OAuth Apps**，然后点击右侧的 **New OAuth App** 创建新的应用

📷 页面示意：

[图：创建 OAuth 应用]

---

### 2. 填写应用基本信息

在创建页面中填写如下字段：

- **Application Name**：如 `Console SSO`

- **Homepage URL**：建议填写系统主页，例如 `https://memos.name.heiyu.space`

- **Authorization callback URL**：授权成功后的回调地址，格式如下：

  ```
  https://memos.name.heiyu.space/auth/callback
  ```

📷 示例填写界面：

[图：填写信息]

---

### 3. 获取 Client ID 和 Client Secret

提交后，GitHub 将生成：

- **Client ID**：用于标识该 OAuth 应用
- **Client Secret**：用于身份验证，请妥善保存，**不要泄露！**

📷 凭证界面如下：

[图：获取客户端凭证]

---

## 二、查看和管理 OAuth 应用

创建完成后，返回 OAuth 应用列表，即可看到刚创建的应用。

点击应用名可查看授权信息和应用详情：

📷 应用列表和详情视图：

- 应用列表页面
  [图：OAuth 应用列表]

  然后邮箱会收到 GitHub OAuth 应用绑定通知。
  [图：授权详情]

---

### 4. 在 Memos 中配置 GitHub 登录

进入系统设置页面：

1. 点击左下角齿轮图标（设置）
2. 选择 **单点登录（SSO）**
3. 选择 GitHub 作为登录方式，填写刚获取的 Client ID 和 Client Secret

📷 Memos 配置页面示例：

[图：设置 GitHub 单点登录]

配置保存后，注销当前账号，登录页面会显示 GitHub 登录按钮。

📷 登录页面展示效果：

[图：GitHub 登录入口]

通过以上步骤，我们完成了 GitHub 登录的接入流程：

✅ 创建并配置 GitHub OAuth 应用
✅ 获取并填入凭证
✅ 在 Memos 中启用 OAuth 登录

最后成员列表一览：

[图：image-20250724093626741]

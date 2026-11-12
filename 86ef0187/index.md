# 实现 INFINI Console 与 GitHub 的单点登录集成：一站式身份验证解决方案

- URL: https://blog.no-claw.com/86ef0187/
- 日期: 2025-02-22
- 分类: 极限科技 / Easysearch
- 标签: 极限科技, Easysearch, 搜索引擎, SSO

本文将为您详细解析如何通过 GitHub OAuth 2.0 协议，为 INFINI Console 实现高效、安全的单点登录（Single Sign-On, SSO）集成。通过此方案，用户可直接使用 GitHub 账户无缝登录 INFINI Console，简化身份验证流程，提升系统安全性与用户体验。

---

## 一、GitHub OAuth 应用配置

### 1. 创建 OAuth 应用程序

- 登录 GitHub，导航至 **Settings** -> **Developer settings** -> **OAuth Apps**。
- 点击 **New OAuth App**，创建新的 OAuth 应用程序。

  [图：创建 OAuth 应用]

### 2. 配置应用信息

- 填写应用的基本信息，包括：

  - **Application Name**：应用名称（如 "INFINI Console SSO"）
  - **Homepage URL**：应用主页 URL
  - **Authorization callback URL**：回调 URL（格式：`http://localhost:9000/oauth/callback`）

  [图：配置应用信息]

### 3. 获取客户端凭证

- 创建应用后，系统将生成 **Client ID** 和 **Client Secret**。
- 这些凭证将用于 INFINI Console 的 OAuth 配置。

  [图：获取客户端凭证]

### 4. 查看已注册的 OAuth 应用

- 创建完成后，您可以在 OAuth 应用列表中查看应用的详细信息。

  [图：已注册的 OAuth 应用]

---

## 二、INFINI Console 的 OAuth 集成配置

### 1. 修改配置文件

- 编辑 INFINI Console 的配置文件，添加以下 OAuth 配置：

  ```yaml
  security:
    enabled: true
    oauth:
      enabled: true
      client_id: "xxxx" # 替换为您的 Client ID
      client_secret: "xxxx" # 替换为您的 Client Secret
      default_roles: ["ReadonlyUI", "AllClusters"] # 默认角色
      role_mapping:
        medcl: ["Administrator"] # 特定用户的角色映射
      authorize_url: "https://github.com/login/oauth/authorize"
      token_url: "https://github.com/login/oauth/access_token"
      redirect_url: ""
      scopes: []
  ```

### 2. 配置角色权限

- **AllClusters** 角色：用于管理集群的全局权限。
- **ReadonlyUI** 角色：为只读用户分配受限权限。

  [图：AllClusters 角色配置]

  [图：Readonly 角色配置]

---

## 三、单点登录流程演示

### 1. 访问 INFINI Console

- 打开浏览器，访问 `http://localhost:9000`。
- 点击 **单点登录** 按钮，进入登录流程。

  [图：单点登录入口]

### 2. 使用 GitHub 登录

- 点击 **GitHub** 图标，跳转至 GitHub 登录页面。

  [图：GitHub 登录界面]

### 3. 授权应用访问

- 在 GitHub 授权页面，确认授权 INFINI Console 访问您的 GitHub 账户。

  [图：GitHub 授权页面]

### 4. 登录成功

- 授权成功后，系统将自动跳转回 INFINI Console，并显示您的 GitHub 用户名。

  [图：登录成功页面]

  [图：显示 GitHub 用户名]

---

## 四、总结

通过以上步骤，您已成功将 INFINI Console 与 GitHub 的单点登录功能集成。此方案不仅简化了用户的登录流程，还通过 GitHub 的 OAuth 2.0 协议确保了身份验证的安全性。未来，希望 INFINI Console 进一步扩展角色权限管理，或集成其他身份提供者（如 Google、Microsoft 等），打造更加灵活的身份验证体系。

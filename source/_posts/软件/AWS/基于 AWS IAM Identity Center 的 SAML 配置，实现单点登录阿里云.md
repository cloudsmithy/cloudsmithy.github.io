---
title: 基于 AWS IAM Identity Center 的 SAML 配置，实现单点登录阿里云
tags: AWS
toc: true
categories: AWS
abbrlink: 511c83d9
date: 2025-06-20 00:00:00
---

在企业多云环境日益普及的今天，很多组织不仅使用 **AWS（亚马逊云科技）** 作为主要的计算与存储平台，同时也会使用 **阿里云** 来满足本地合规、地域性需求或价格优势。如何在多个云平台之间实现 **统一身份认证**，避免用户维护多个账号与密码，已经成为企业安全与运维中的核心问题。

**AWS IAM Identity Center**（身份中心，原 AWS SSO）作为 AWS 官方提供的集中式身份认证与访问管理服务，可以作为企业的 **主身份提供商（IdP）**。通过 **SAML 2.0 协议**，它能够将认证结果传递给其他云服务商（如阿里云），让用户在 AWS 完成一次身份验证后，直接进入阿里云控制台，而无需再次登录。这就是所谓的 **跨云单点登录（Single Sign-On, SSO）**。

<!-- more -->

本文将结合详细步骤与截图，完整演示如何配置 **AWS IAM Identity Center 与阿里云 RAM 的 SAML 对接**。

### 在 AWS IAM Identity Center 新建用户

在正式配置 SAML 对接之前，我们需要先在 AWS IAM Identity Center 中创建用户。

1. 登录 AWS 控制台，进入 **IAM Identity Center** 页面。
2. 选择 **Users → Add user**。
3. 填写 **用户名、密码、姓名和邮箱**。
   - 用户名：用于登录 AWS SSO 的唯一标识。
   - 姓名：通常填写用户的真实姓名，方便后续在阿里云匹配用户。
   - 邮箱：AWS 会将登录邀请邮件发送到该邮箱。
   - 密码：可以由管理员生成初始密码，也可以让用户自行设置。

![image.png](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20251003112401516.png)

### 创建应用并选择 SAML

在用户创建完成后，需要在 AWS IAM Identity Center 中配置一个 **应用（Application）**，它代表与阿里云之间的对接关系。

![image.png](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image%201.png)

操作步骤：

1. 打开 **Applications → Add application**。
2. 在应用类型中选择 **SAML 2.0**。
3. 将此应用与前面创建的用户或用户组进行绑定。

📌 **说明**：

- 应用相当于一个桥梁，AWS 通过它来生成 SAML 断言。
- 如果未来还要接入其他云服务（如 Salesforce、Office 365），也需要新建对应应用。
- 建议统一命名规范，例如：`AlibabaCloud-SAML`。

### OAuth 与 SAML 的区别

在配置过程中，你可能注意到 AWS 提供了多种协议选项，其中最常见的就是 **OAuth 2.0** 与 **SAML 2.0**。

![image.png](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image%202.png)

📌 **区别解析**：

| 对比项   | SAML                                | OAuth                        |
| -------- | ----------------------------------- | ---------------------------- |
| 核心用途 | 单点登录（SSO），跨云、跨域身份认证 | 应用授权，第三方应用获取资源 |
| 数据格式 | XML                                 | JSON                         |
| 常见场景 | 企业员工访问云平台、内部系统        | 微信/Google 登录第三方应用   |
| 安全特性 | 强调身份认证 + 授权                 | 强调令牌授权，不负责身份本身 |
| 适合对象 | 企业 IT 管理，多云环境              | C 端互联网应用               |

### 下载 AWS IAM Identity Center 的 SAML 元数据 XML

在创建好应用后，AWS 会为我们生成一个 **元数据 XML 文件**，其中包含：

- AWS IAM Identity Center 的 **端点 URL**；
- 公钥证书信息；
- 支持的协议与绑定方式。

![image.png](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image%203.png)

📌 **操作方法**：

1. 在应用详情页找到 **IAM SSO URL**。
2. 点击 **Download metadata XML**。
3. 保存到本地，稍后需要上传到阿里云。

⚠️ **注意事项**：

- 下载后请勿修改 XML 文件内容，否则会导致签名校验失败。
- 建议妥善保存，并在企业内部文档中记录文件版本。
- 如果更换证书，需要重新下载并更新到阿里云。

### 在阿里云导入身份提供商

接下来，切换到 **阿里云 RAM 控制台**，新建一个 **身份提供商（Identity Provider）**。

![image.png](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image%207.png)
📌 **步骤**：

1. 进入 **访问控制（RAM） → 身份提供商**。
2. 选择 **SAML 类型**。
3. 上传刚才下载的 AWS XML 文件。

在阿里云中，也提供了一个默认的 SAML 元数据地址：
👉 https://signin.aliyun.com/saml-role/sp-metadata.xml

![image.png](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image%204.png)

但在本场景下，我们需要导入 **AWS 提供的 XML**，因为 AWS 是 IdP，阿里云是 SP。

### 为应用分配用户或用户组

在 AWS IAM Identity Center 应用配置页面，需要把实际用户分配到该应用。

![image.png](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image%205.png)

📌 **操作细节**：

1. 在应用右下角点击 **Add user or group**。
2. 搜索用户，建议使用 **姓名搜索** 而不是用户名。

![image.png](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image%206.png)

⚠️ **注意事项**：

- 用户名可能无法正确匹配，使用姓名更稳定。
- 如果分配的是用户组，那么组内所有用户都能通过 SSO 登录阿里云。
- 建议按 **部门 / 职能** 建立用户组，例如：`DevOps-Team`、`Finance-Team`。

这个应用程序的属性映射如下：

![image.png](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image%2011.png)

```
[https://www.aliyun.com/SAML-Role/Attributes/RoleSessionName](https://www.aliyun.com/SAML-Role/Attributes/RoleSessionName)  awssso(可以自定义）

[https://www.aliyun.com/SAML-Role/Attributes/Role](https://www.aliyun.com/SAML-Role/Attributes/Role) acs:ram::1647543622349991:role/iamssorole,acs:ram::1647543622349991:saml-provider/iamsso（role, provider的arn）
```

![image.png](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image%2012.png)

### 在阿里云创建角色并建立信任关系

阿里云侧还需要配置一个 **角色（Role）**，与身份提供商进行绑定。

![](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image%208.png)

角色配置完成后， **信任策略**如下，例如：

![image.png](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image%209.png)

在 AWS 上可以看到我们新建的应用程序。

![image.png](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image%2010.png)

![image.png](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image%2011.png)

📌 **说明**：

- `role/iamssorole` 表示阿里云角色。
- `saml-provider/iamsso` 表示 AWS IAM Identity Center 提供的身份。
- 两者形成绑定关系后，用户通过 AWS SSO 登录时即可扮演此角色。

👉 可配置的属性：

- `RoleSessionName`：会话名称，通常可设置为 `awssso` 或自定义值。
- `Role`：指定的阿里云角色 ARN。

https://www.aliyun.com/SAML-Role/Attributes/RoleSessionName
https://www.aliyun.com/SAML-Role/Attributes/Role

在配置过程中，阿里云官方也提供了一些参考文档，例如：

[https://help.aliyun.com/zh/ram/user-guide/implement-role-based-sso-from-ad-fs](https://help.aliyun.com/zh/ram/user-guide/implement-role-based-sso-from-ad-fs?spm=a2c4g.11186623.help-menu-28625.d_2_4_3_0_5.2f7f4cc2kQ1KvN)

虽然文档以 AD FS 为例，但本质上对接 AWS IAM Identity Center 的原理是一样的。

### 验证 IAM SSO 登录流程

配置完成后，可以在 AWS IAM Identity Center 的 SSO 页面进行验证。

![image.png](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image%2013.png)

在 **Dashboard** 中，点击分配好的 “Alibaba Cloud” 应用：

![image.png](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image%2014.png)

此时用户会自动跳转到阿里云控制台，无需再次输入用户名和密码：

![image.png](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image%2015.png)

### 最佳实践与经验总结

1. **最小权限原则**
   - 在阿里云角色策略中，只授予用户所需的最低权限。
2. **分组管理**
   - 在 AWS IAM Identity Center 中按部门建组，再映射到阿里云角色。
3. **MFA 多因子认证**
   - 在 AWS 侧启用 MFA，提高整体安全性。
4. **跨云审计**
   - 结合 AWS CloudTrail 与阿里云 ActionTrail，实现跨平台日志追踪。
5. **会话管理**
   - 设置合理的会话过期时间，防止用户长时间保持登录状态。

### 总结

通过本文的配置流程，我们实现了 **AWS IAM Identity Center（IdP） → 阿里云 RAM（SP）** 的单点登录：

- 用户在 AWS 中完成身份认证；
- AWS 生成 SAML 断言并传递给阿里云；
- 阿里云验证后授予对应角色权限；
- 用户一键跳转进入阿里云控制台。

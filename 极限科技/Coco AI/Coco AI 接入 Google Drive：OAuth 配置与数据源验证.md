---
title: Coco AI 接入 Google Drive：OAuth 配置与数据源验证
date: '2025-04-17 22:05:49'
updated: '2025-04-17 22:05:49'
abbrlink: e011202f
categories:
- 极限科技
- Coco AI
tags:
- Coco AI
- SSO
- AI
description: 从 Google OAuth 客户端、Drive 权限和测试用户配置开始，为 Coco Server 接入 Google Drive，并验证文件读取结果。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/147314801
source_title: 零代码接入 Google Drive，让Coco- AI 看懂你的资料库
---

## <a id="CocoAI__Google_Drive__0"></a>Coco-AI 接入 Google Drive 数据源全流程指南（图形化界面演示）

Coco-AI 最早版本就内置了对 Google Drive 的访问能力。如今，借助图形化配置界面，我们终于可以一键完成授权接入，在 AI 数据处理流程中直接使用 Google Drive 中的视频、文档等文件作为数据源。

本文将完整演示如何通过 Google OAuth2 授权机制，让 Coco-AI 成功对接 Google Drive，并将其中的视频等文件作为可访问的数据源导入系统。相比以往繁琐的手工步骤，现在全程图形化，几乎零代码，极大地降低了使用门槛。

---

### <a id="_Google_OAuth2__8"></a>一、准备工作：创建 Google OAuth2 客户端

首先，我们需要在 [Google Cloud Console](https://console.cloud.google.com/) 中配置一个 OAuth2 客户端，用于获取用户授权，并访问其 Google Drive 数据。

参考官方文档（虽然略显简略）：

👉 https://developers.google.com/workspace/drive/api/quickstart/go?hl=zh-cn

#### <a id="_16"></a>步骤：

1. 进入 Google Cloud Console，启用 Drive API；
2. 创建一个新的 OAuth2 客户端，选择“Web 应用”，并配置回调地址（如图：`http://localhost:9000/connector/google_drive/oauth_redirect`）；

![image-20250417214328588](/images/migrated/ee6341a897635bf7bd7d.png)

---

3. 获取 `client_id` 和 `client_secret`，保存备用；
4. 在“OAuth 同意屏幕”中完善应用信息，并添加**敏感权限作用域**（scopes）。

![image-20250417214423627](/images/migrated/a2d69339bd74a4da5cef.png)

### <a id="_Drive__30"></a>二、添加所需权限：开放 Drive 访问能力

此处是很多人容易忽略的关键步骤。你必须手动添加如下权限，才能让授权后返回的 token 拥有访问 Google Drive 根目录的能力。

- 推荐添加权限：

  
```
https://www.googleapis.com/auth/drive
```


在控制台中“数据访问权限”页添加，如下图所示：

![添加权限](/images/migrated/e8f83801af739709c924.png)

---

在这加入测试用户，否则登陆后你会得到403

![image-20250417220449745](/images/migrated/73b79e4aef9b6eb08682.png)

### <a id="_Coco_Server_52"></a>三、将授权信息配置到 Coco Server

在 Coco Server 管理界面中，我们进入「设置」→[ connector ] →「Google Drive」，填写刚才获取的 `client_id` 和 `client_secret`。

![配置界面](/images/migrated/6941672755bb5a8d7b73.png)

点击「连接」按钮，系统会自动跳转到 Google SSO 授权页面，用户只需选择账号并授权即可。

![image-20250417214839097](/images/migrated/bfc846aa832e2fcff2bc.png)

---

### <a id="_Google_SSO__64"></a>四、进行 Google SSO 登录授权

授权页面如下，若账号处于测试状态，可能会有提示弹窗，点击「继续」即可。

![SSO 弹窗](/images/migrated/9bace3915aef6fc82965.png)

Google 联合登陆该有的这里都有

![image-20250417214908799](/images/migrated/a7958af60db696d04e76.png)

会提示你即将授予权限，选择继续

![image-20250417211919662](/images/migrated/ce9c19be51e26be257e7.png)

完成授权后，页面将显示「登录成功」，表示 access token 获取并存储完毕。

![登录成功](/images/migrated/856b9edd92482c59d5e6.png)

---

### <a id="_Drive__84"></a>五、验证接入效果：导入 Drive 文件

授权成功后，我们回到 Coco Server 后台的数据源页面，可以看到系统已成功读取绑定用户的 Google Drive 文件：

![数据列表](/images/migrated/ccaaf8f6cdbae24aacc4.png)

此时，你就可以像操作本地文件一样，自由使用 Google Drive 中的视频或文档数据进行分析、问答、训练等操作。

---

### <a id="_94"></a>六、总结

通过以上步骤，我们成功完成了：

- Google Cloud 平台创建 OAuth2 客户端；
- 手动添加 Google Drive 所需权限；
- 在 Coco Server 中配置授权信息；
- 成功完成 Google 登录并接入 Drive 文件。

这也意味着，Coco-AI 具备了一个重要能力：**将外部云盘作为数据源，直接参与 AI 分析与问答流程**。借助全图形化配置界面，用户几乎无需编写一行代码，即可接入 Google Drive，非常适合需要快速试验、无需繁琐开发的场景。

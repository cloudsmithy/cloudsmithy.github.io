---
title: 如何关闭 AWS root 账号的 MFA 认证
tags:
  - AWS
  - MFA
toc: true
categories: AWS
abbrlink: f4ce40dc
date: 2025-05-20 00:00:00
---

**警告**：关闭 root 账号的 MFA 认证存在较高风险。AWS 通常不建议此操作，因为 root 账号拥有对所有 AWS 资源的完全控制权限。如果密码或账号信息泄露，可能导致严重的安全事故。

## 关闭步骤

1. 使用 root 账号登录 AWS 管理控制台

2. 点击右上角账号名称

3. 选择"安全凭证"选项

![image-20250716105410922](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250716105410922.png)

1. 在页面中找到"多重身份认证(MFA)"部分
2. 点击"删除"即可

![image-20250716105355108](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250716105355108.png)

然后会收到邮件提醒：

![image-20250716105716435](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250716105716435.png)

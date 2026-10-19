# 如何关闭 AWS root 账号的 MFA 认证

- URL: https://blog.no-claw.com/f4ce40dc/
- 日期: 2025-05-20
- 分类: 软件 / AWS
- 标签: AWS, MFA

**警告**：关闭 root 账号的 MFA 认证存在较高风险。AWS 通常不建议此操作，因为 root 账号拥有对所有 AWS 资源的完全控制权限。如果密码或账号信息泄露，可能导致严重的安全事故。

## 关闭步骤

1. 使用 root 账号登录 AWS 管理控制台

2. 点击右上角账号名称

3. 选择"安全凭证"选项

[图：image-20250716105410922]

1. 在页面中找到"多重身份认证(MFA)"部分
2. 点击"删除"即可

[图：image-20250716105355108]

然后会收到邮件提醒：

[图：image-20250716105716435]

如果遇到这个报错，那么重新登陆之后再重复前面的步骤：

```
To complete this action, please ensure that you are authenticated with an MFA device that is enabled for this user.
```

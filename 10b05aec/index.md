# Coco-AI 接入 Google drive

- URL: https://blog.no-claw.com/10b05aec/
- 日期: 2025-04-17
- 分类: 极限科技 / Coco AI
- 标签: 极限科技, Coco AI, AI

在 Coco-AI 最早的版本就提供了接入 Google drive 的视频，今天我终于实现了，而且借着全图形化的优势更加方便了。

参考这个文档新建 google SSO（好像也没啥参考性）

https://developers.google.com/workspace/drive/api/quickstart/go?hl=zh-cn

创建客户端
[图：image-20250417214328588]

填入信息，

[图：image-20250417214423627]

然后在数据访问中添加权限 -

缺少的权限加在这里（如图），https://www.googleapis.com/auth/drive

[图：image-20250417211814068]

在 coco-sever 更新 google drive 的信息

[图：image-20250417214739221]

然后在 coco-server 中连接

[图：image-20250417214802320]

跳转 google sso

[图：image-20250417214839097]

由于是测试账户，所以会有这个弹窗，继续就好

[图：image-20250417214847470]

再次进行测试

[图：image-20250417214908799]

获取权限

[图：image-20250417211919662]

显示登陆成功

[图：image-20250417214925986]

然后可以在数据源中看到对应数据

[图：image-20250417212018974]

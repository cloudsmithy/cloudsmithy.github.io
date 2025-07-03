---
title: 通过 SMTP 使用 163 邮箱发送邮件
tags: Python
toc: true
categories: SMTP
date: 2025-07-01 00:00:00
---

这里的 **授权码（Authorization Code）** 是 163 邮箱（以及 QQ 邮箱等国内常见邮箱服务商）专门为 **SMTP/POP3/IMAP** 等邮件协议提供的独立密码，与邮箱的登录密码不同。

- **作用**：用于通过第三方客户端（如 Python 的 `smtplib`）发送邮件，避免直接暴露邮箱登录密码。

- **获取方式**（以 163 邮箱为例）：

  1. 登录 [163 邮箱](https://mail.163.com/)。

  2. 进入 **设置 → POP3/SMTP/IMAP**。
  <!--more-->
  3. 开启 **SMTP 服务**，系统会提示你设置授权码（类似 `ABCDEFG123456`，不是你的登录密码）。

  4. 复制这个授权码，替换代码中的 `your_authorization_code`。

![image-20250701174551330](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250701174551330.png)

```python
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

def send_163_email():
    # 163邮箱SMTP配置
    smtp_server = "smtp.163.com"
    smtp_port = 465  # SSL加密端口
    sender = "your_username@163.com"  # 你的163邮箱
    password = "ABCDEFG123456"  # 替换为你的SMTP授权码（不是登录密码！）
    receiver = "recipient@example.com"  # 收件人邮箱

    # 创建邮件
    msg = MIMEMultipart()
    msg['From'] = sender
    msg['To'] = receiver
    msg['Subject'] = "测试邮件（带Markdown附件）"

    # 邮件正文
    msg.attach(MIMEText("这是邮件正文，附件是Markdown文件。", 'plain', 'utf-8'))

    # 添加Markdown附件
    markdown_content = "# CSDN文章汇总\n| 标题 | 链接 |\n|------|------|\n| [Python教程] | https://example.com |"
    attachment = MIMEApplication(markdown_content.encode('utf-8'), Name="articles.md")
    attachment['Content-Disposition'] = 'attachment; filename="articles.md"'
    msg.attach(attachment)

    # 发送邮件
    try:
        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(sender, password)
            server.sendmail(sender, receiver, msg.as_string())
        print("邮件发送成功！")
    except Exception as e:
        print(f"发送失败: {e}")

if __name__ == "__main__":
    send_163_email()
```

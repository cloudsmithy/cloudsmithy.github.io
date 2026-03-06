---
title: 使用 AWS SES + S3 发送 HTML 邮件
tags: AWS
toc: true
categories: AWS
date: 2026-02-02 00:00:00
---

在营销、通知等场景中，我们经常需要发送格式丰富的 HTML 邮件。本文介绍如何用 Python + boto3，从 S3 读取 HTML 模板并通过 SES 发送邮件。

## 架构

S3 (HTML模板) → Python脚本 → SES → 收件人

## 前置条件

1. AWS 账号已开通 SES 服务，且发件地址已验证
2. S3 Bucket 中已上传 HTML 模板文件
3. 本地已配置 AWS 凭证（aws configure 或 IAM Role）
4. 安装依赖：pip install boto3

## 核心代码

```python
#!/usr/bin/env python3
"""从 S3 读取 HTML 模板并通过 SES 发送邮件"""
import boto3

REGION = '<region>'
BUCKET = '<your-bucket-name>'
TEMPLATE_KEY = '<your-template-key>.html'

s3 = boto3.client('s3', region_name=REGION)
ses = boto3.client('ses', region_name=REGION)


def get_html_from_s3(bucket: str, key: str) -> str:
    """从 S3 读取 HTML 内容"""
    response = s3.get_object(Bucket=bucket, Key=key)
    return response['Body'].read().decode('utf-8')


def send_html_email(to: str, subject: str, html_content: str):
    """发送 HTML 邮件"""
    ses.send_email(
        Source='<sender-email>',
        Destination={'ToAddresses': [to]},
        Message={
            'Subject': {'Data': subject, 'Charset': 'UTF-8'},
            'Body': {'Html': {'Data': html_content, 'Charset': 'UTF-8'}}
        }
    )
    print(f'邮件已发送至 {to}')


if __name__ == '__main__':
    html = get_html_from_s3(BUCKET, TEMPLATE_KEY)
    send_html_email('<recipient-email>', '测试邮件', html)
```

## 关键点说明

- get_html_from_s3：通过 s3.get_object 拉取 HTML 文件内容，注意 decode('utf-8') 确保中文正常显示
- send_html_email：调用 ses.send_email，将 HTML 作为邮件 Body 发送，指定 Charset: UTF-8 避免乱码
- Source 地址必须是 SES 中已验证的邮箱或域名

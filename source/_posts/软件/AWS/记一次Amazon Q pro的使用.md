---
title: 记一次Amazon Q pro的使用
tags: AWS
toc: true
categories: AWS
abbrlink: 56bb1eb7
date: 2025-06-02 00:00:00
---

参加 AWS 的比赛申请了 Amazon Q pro，平时也在用 builderID 登陆使用免费的账户。Amazon Q pro 需要和 IAM identity center 一起用，不过比赛直接给配置好了，直接分发 IAM identity center 的账户，我们只需要注册，登陆，然后关联 Q pro。

![image-20250613214705836](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250613214705836.png)

从邮箱里给的链接注册，登录。然后绑定 MFA，这个 MFA 其实就是一个二次验证，如果账户被盗，对方没有 MFA 也是无法登录的。

<!-- more -->

![image-20250613215145521](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250613215145521.png)

我用了 2Fauth 来绑定的，当然你也可以使用 google authenticator 之类的软件，绑定六位动态码。当然比较常见的 MFA 就是短信验证码，当然还有打电话的。这边刚刚登录，这边电话马上过来。

![221ef1ff7faa7d41d0b2032bfe981928](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/221ef1ff7faa7d41d0b2032bfe981928.png)

注册成功会有这个提示。后面需要使用这个绑定的 MFA 进行登录。

![image-20250613214403296](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250613214403296.png)

登录之后会跳转到这个门户页面，点击 Q 的图标之后会跳转到 Amazon Q 的官方文档。

![03f17da2afbfeaf936933ac5b9014db0](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/03f17da2afbfeaf936933ac5b9014db0.jpg)

完成了登录，我们来做本地的配置：

在 VS code 商店中搜索 Amazon Q 并且安装：

![image-20250613220402714](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250613220402714.png)

Amazon Q 有免费版和 Pro 版。免费版使用 build ID 进行登录，无需 AWS 账户。而今天体验的是 Q pro 版本，还好主办方给配置好了 AWS 的账户，

![image-20250613220656884](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250613220656884.png)

安装之后右下角就有一个提示登录的弹窗，点击 Sign in，URL 输入邮箱里给的 URL。其实就是 IAM identity center 的登录链接。

![75a9cf790abee0500c03a4fef5906e0b](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/75a9cf790abee0500c03a4fef5906e0b.png)

然后是跳转浏览器：

![08d51abf78a42aac97e2f6d3901dbc4f](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/08d51abf78a42aac97e2f6d3901dbc4f.png)

以及提示打开浏览器的弹窗：

![image-20250613221104615](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250613221104615.png)

浏览器打开之后有获取权限的提示：

![a77a557cab162ca6d22c644330b1debc](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/a77a557cab162ca6d22c644330b1debc.png)

点击允许之后就大功告成了：

![a5eac153f41f318771e8ed90a258bb44](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/a5eac153f41f318771e8ed90a258bb44.png)

同时 VScode 里的 Q 也会变成这样，最后变成聊天窗口

![image-20250613221132184](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250613221132184.png)

如图是聊天模式：

![image-20250613221851367](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250613221851367.png)

如果你使用 Ubuntu server：

1. 下载命令行：

   ```
   wget https://desktop-release.q.us-east-1.amazonaws.com/latest/amazon-q.deb
   ```

2. 安装

   ```
   sudo apt-get install -f
   sudo dpkg -i amazon-q.deb
   ```

3. 打开，然后同样的通过浏览器打开：

   ```
   q
   ```

![4e449305647468b637ebe4600479a868](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/4e449305647468b637ebe4600479a868.png)

如果你用的是苹果系统，就更简单了。从这个链接下载，直接安装就可以了。

[https://desktop-release.q.us-east-1.amazonaws.com/latest/Amazon%20Q.dmg](https://desktop-release.q.us-east-1.amazonaws.com/latest/Amazon%20Q.dmg)

然后在终端中输入 q 或者 Q chat 就可以了。

![714911ccd41755315794150d4e748318](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/714911ccd41755315794150d4e748318.png)

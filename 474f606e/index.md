# 使用ipad 串流 MacOS

- URL: https://blog.no-claw.com/474f606e/
- 日期: 2024-03-24
- 分类: 电子产品 / 电脑 / 苹果
- 标签: Apple, 家庭网络

服务端是 sunshine，客户端叫做 moonlight

MacOS 安装的命令如下：

使用该命令会自动拉取源码包并且自动编译，然后使用 sunshine 命令启动：

```bash
brew tap LizardByte/homebrew                        
brew install sunshine
```

这个服务会启动在 47990 端口，进入网页是这个样子

客户端是使用 moonlight，可以在 app store 直接下载

点击 Add Host Manully，填入服务端的 ip。

然后会提示提示配对，这里给了一串 PIN 码，需要填写到服务端的 WEB 中

然后把上一步 moonlight 的 PIN 写到这里

然后对于 MacOS 来说，需要给到终端录屏和辅助功能的权限。

然后就可以开心的玩了～

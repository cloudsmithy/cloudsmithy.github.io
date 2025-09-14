---
title: 群晖如何配置 Server 酱 Webhook 事件通知？
tags: 家庭网络
toc: true
categories: 群晖
abbrlink: e70dd7d7
date: 2025-06-15 00:00:00
---

网上冲浪的时候看到给群晖配置 server 酱通知的帖子，不过看着比较老旧了。所以自己探索了一下，顺便更新一下教程。也省着下次被停电还得翻日志才能知道。

![cd9625571e708b7d07967c4489126c15](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/cd9625571e708b7d07967c4489126c15.jpg)

 <!--more-->

### 1. 开启 Webhook 通知

进入 **控制面板 → 通知设置**，在通知服务里选择 **Webhook**。这样群晖就能通过 Webhook 推送消息到 Server 酱。

![c28f57266317bfea595f0a082f267102](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/c28f57266317bfea595f0a082f267102-20250914183816053.png)

### 2. 配置 Webhook 提供商

选择 **自定义提供商**，规则我这里选择了 **监听全部**，这样所有通知都会转发。

![image-20250914182910650](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250914182910650.png)

这里的“提供商”和“主题”随便写，自己能认出来就行。真正关键的是 **URL 和请求体**。

Server 酱的接口地址是：

```
https://sctapi.ftqq.com/<key>.send
```

保存后群晖会自动在后面拼接一段：

```
text=%40%40TEXT%40%40
```

这里的 `@@TEXT@@` 就是一个占位符，表示群晖实际推送消息时会自动替换成通知内容。

![eee5ed6c1a3a38a0bb93e06a49015e66](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/eee5ed6c1a3a38a0bb93e06a49015e66.png)

### 3. 修改请求体

这里是 webhook 的重头戏，所谓 webhook 其实就是 app 里预留了一个 POST API，规定好请求体，然后给用户自由发消息的权利。server 酱接受 title 和 desp 两个字段，无论是 parms 或者 body 都接受。

所以我在群晖 Webhook 的请求体里添加了对应的 JSON：

![image-20250914182156202](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250914182156202.png)

### 4. 验证效果

配置完成后，随便触发一条系统通知，就能看到 Server 酱成功收到了推送：

![image-20250914183645826](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250914183645826.png)

### 5. 小结

整个配置思路其实很简单：

1. 群晖支持 Webhook 通知；
2. Server 酱提供了一个接收消息的 API；
3. 我们只需要把群晖的通知格式改成 Server 酱要求的字段，就能打通。

这样一来，无论是停电、磁盘告警，还是系统更新提醒，群晖的消息都能第一时间通过 Server 酱推送到手机上。

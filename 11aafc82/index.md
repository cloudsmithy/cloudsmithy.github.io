# 树莓派入门笔记：系统安装与远程连接

- URL: https://blog.no-claw.com/11aafc82/
- 日期: 2019-02-21
- 分类: 电子产品 / 嵌入式 / 树莓派
- 标签: Linux, 树莓派

> 这是一篇 2019 年的树莓派学习笔记，文中的系统和连接方式保留当时的记录。 [查看系列目录](/series/embedded/)。

（声明，部分资料摘自微雪课堂，这只是为了做个笔记，方便日后复习，尊重微雪知识产权）

##准备tf卡
金士顿32g内存卡一张（其实8g就够用），我的是class 10
[图：树莓派引脚图]

##准备散热片
淘宝自己准备，树莓派发热很烫
##安装系统win32diskimagewriter

### 连接pc

1.外接显示屏
HDMI 或者 HDMI转接VGA
2.vnc
无线连接或者用网线，pi最新系统自带vnc，无需安装。
3.xshell
4.win自带的远程 (不喜欢)

```
sudo apt-get install xrdp
```

5,teamview
跨平台的远程软件，不过arm还没有尝试。
6.juiceSSH（手机端）

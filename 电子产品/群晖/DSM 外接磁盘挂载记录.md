---
title: DSM 外接磁盘挂载记录
tags: 家庭网络
toc: true
categories: 群晖
date: 2025-02-15 00:00:00
---

## 1. 外接磁盘识别情况

将移动硬盘连接至群晖 NAS（DSM 7.2），系统右上角立即弹出外接设备提示：

![外接磁盘识别](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250326121435537.png)

可在“控制面板 - 外接设备”中查看磁盘详情：

 <!--more-->

![控制面板识别磁盘](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250326121751756.png)

## 2. exFAT 支持插件提示

首次插入 exFAT 文件系统磁盘，系统提示需安装对应插件才能访问。可跳转 Package Center 安装 exFAT Access：

![exFAT 插件提示](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250326121733932.png)

## 3. Mac 格式化分区异常

在 Mac 上格式化为 exFAT 后插入群晖，系统将其识别为两个分区：

![两个分区](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250326121611592.png)

## 4. 在群晖中重新格式化

为避免多分区问题，使用群晖内置“格式化”功能重新整理磁盘。可在外接设备列表中操作：

- 选择磁盘 → 点击“格式化”
- 文件系统建议继续使用 exFAT，以兼容 Mac/Windows

![格式化选项](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250326121643508.png) ![格式化确认](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250326121603583.png)

## 5. 结果验证

格式化为 exFAT 后，无论在群晖还是 Mac 上均可正常挂载与读写：

![Mac 上读取](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250326121509162.png)

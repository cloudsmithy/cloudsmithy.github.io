---
title: Powershell 启动 Cloudflared
tags: Cloudflared
toc: true
categories: Cloudflared
date: 2025-07-19 00:00:00
---

直接启动已安装的  Cloudflared  服务

运行 Start-Service cloudflared 启动服务

使用 Get-Service cloudflared 查看服务状态

设为开机自启

运行 Set-Service cloudflared -StartupType Automatic 将

Cloudflared 设置为自动启动

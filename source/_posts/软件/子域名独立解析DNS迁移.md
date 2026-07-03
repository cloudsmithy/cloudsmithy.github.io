---
title: 子域名独立解析DNS迁移
description: 通过NS委派实现子域名跨服务商独立管理
tags: DNS
toc: true
categories:
  - 软件
date: 2026-07-03 00:00:00
---

子域名 NS 委派（Delegation）是指将某个子域名的解析权从主域名的 DNS 服务商"下放"给另一套 DNS 服务器单独管理。本文介绍完整的操作思路和步骤。

## 核心概念

假设你的主域名 `example.com` 托管在 A 服务商（如阿里云/腾讯云/Cloudflare/AWS），现在想让子域名 `sub.example.com` 由 B 服务商（如 AWS Route53）单独解析。

**实现原理**：在主域名的 DNS 中为子域名添加 NS 记录，指向 B 服务商分配的 Name Server。此后所有 `*.sub.example.com` 的 DNS 查询都会被"转交"给 B 服务商处理。

## 操作步骤

### 1. 在新的 DNS 服务商创建子域名托管区

以 AWS Route53 为例：

- 创建一个 Hosted Zone，名称填写 `sub.example.com`
- 创建完成后，Route53 会自动分配 4 个 NS 服务器，格式类似：

```
ns-123.awsdns-45.com
ns-678.awsdns-90.net
ns-234.awsdns-12.org
ns-567.awsdns-89.co.uk
```

- 记录这 4 个 NS 值，下一步需要用到

### 2. 在原主域名 DNS 服务商添加 NS 记录

在 `example.com` 的 DNS 解析记录中新增以下 NS 记录：

| 主机记录 | 记录类型 | 记录值 |
|---------|---------|--------|
| sub | NS | ns-123.awsdns-45.com |
| sub | NS | ns-678.awsdns-90.net |
| sub | NS | ns-234.awsdns-12.org |
| sub | NS | ns-567.awsdns-89.co.uk |

> **注意**：主机记录只需填写 `sub`，不要填写完整的 `sub.example.com`。大多数 DNS 控制台会自动补全主域名。

### 3. 在新服务商配置子域名的具体解析

现在可以在 Route53 的 `sub.example.com` 托管区中添加 A / CNAME 等记录：

```
www.sub.example.com  A     1.2.3.4
api.sub.example.com  CNAME xxx.example.net
```

## 关键注意事项

### 避免记录冲突

⚠️ **不要在主域名同时保留冲突记录**

如果 A 服务商中之前已经存在 `sub` 的 A 记录或 CNAME 记录，委派完成后必须删除。原因：
- NS 委派和 A/CNAME 记录在同一节点会产生冲突
- DNS 协议规定 NS 委派优先级更高，子记录会被忽略甚至导致解析错误

### 生效时间

⚠️ **生效时间受 TTL 影响**

NS 记录的生效时间取决于 TTL（Time To Live）设置，通常在几分钟到 48 小时之间。

**加速切换的方法**：
- 在切换前将 TTL 提前调小（如设置为 600 秒）
- 完成切换并验证后，再将 TTL 调回正常值

## 验证方法

使用以下命令验证 NS 委派是否生效：

```bash
# 检查子域名的 NS 委派是否生效
dig NS sub.example.com +short

# 从主域名的权威服务器直接查询（验证委派是否配对）
dig NS sub.example.com @<A服务商的NS服务器>

# 检查具体记录是否能正常解析
dig www.sub.example.com +short

# 完整追踪委派链路
dig +trace www.sub.example.com
```

**验证标准**：如果 `dig NS sub.example.com` 返回的是 B 服务商的 NS 服务器地址，说明委派已成功生效。

## 应用场景

NS 委派适用于以下场景：

- **多云架构**：不同子域名由不同云服务商管理，实现解耦和灵活性
- **团队协作**：不同团队独立管理各自的子域名，减少相互依赖
- **服务迁移**：在迁移过程中通过子域名实现灰度切换
- **性能优化**：利用特定服务商的 DNS 优势（如 GeoDNS、智能解析等）

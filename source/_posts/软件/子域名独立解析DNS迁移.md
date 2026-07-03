---
title: 子域名独立解析DNS迁移
description: 
tags: DNS
toc: true
categories:
  - 软件
date: 2026-07-03 00:00:00
---

> 步骤来自Claude Desktop：尝试可以成功。未整理。

子域名 NS 委派（delegation）就是把某个子域名的解析权,从主域名的 DNS 服务商"下放"给另一套 DNS 服务器单独管理。下面是完整思路和步骤。

## 核心概念

假设你的主域名是 `example.com`,托管在 A 服务商(比如阿里云/腾讯云/Cloudflare)。现在你想让 `sub.example.com` 由 B 服务商(比如 AWS Route53)单独解析。

原理:在**主域名的 DNS 里**给子域名添加 **NS 记录**,指向 B 服务商分配的 NS 服务器。之后所有 `*.sub.example.com` 的查询都会被"转交"给 B。

## 操作步骤

**1. 在新的 DNS 服务商(B)创建子域名托管区**

以 AWS Route53 为例:
- 创建一个 Hosted Zone,名字填 `sub.example.com`
- 创建后,Route53 会自动分配 4 个 NS 服务器,类似:
  ```
  ns-123.awsdns-45.com
  ns-678.awsdns-90.net
  ns-234.awsdns-12.org
  ns-567.awsdns-89.co.uk
  ```
- 记下这 4 个 NS 值

**2. 在原主域名的 DNS 服务商(A)添加 NS 记录**

在 `example.com` 的解析记录里新增:

| 主机记录 | 类型 | 记录值 |
|---------|------|--------|
| sub | NS | ns-123.awsdns-45.com |
| sub | NS | ns-678.awsdns-90.net |
| sub | NS | ns-234.awsdns-12.org |
| sub | NS | ns-567.awsdns-89.co.uk |

> 注意:主机记录只填 `sub`(不要填 `sub.example.com`,大多数控制台会自动补全主域名)。

**3. 在新服务商(B)里配置子域名的具体解析**

现在到 Route53 的 `sub.example.com` 区里添加 A / CNAME 等记录:
```
www.sub.example.com  A     1.2.3.4
api.sub.example.com  CNAME xxx.example.net
```

## 关键注意事项

⚠️ **不要在主域名同时保留冲突记录**:如果 A 服务商里之前已经有 `sub` 的 A 记录或 CNAME,委派后要删掉。NS 委派和 A/CNAME 记录在同一节点会冲突(NS 委派优先,子记录会被忽略甚至报错)。

⚠️ **生效时间**:受 NS 记录 TTL 影响,通常几分钟到 48 小时。可以把 TTL 提前调小(比如 600 秒)加快切换。

## 验证

```bash
# 查子域名的 NS 委派是否生效
dig NS sub.example.com +short

# 从主域名的权威服务器直接查(看委派是否配对)
dig NS sub.example.com @<A服务商的NS服务器>

# 查具体记录是否能解析
dig www.sub.example.com +short

# 完整追踪委派链路
dig +trace www.sub.example.com
```

如果 `dig NS sub.example.com` 返回的是 B 服务商的 NS,说明委派成功。

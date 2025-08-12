---
title: Mac 上 Orbstack的Docker容器访问微服 Wordpress IPv6 解析问题记录
tags: Docker
toc: true
categories: 懒猫微服
abbrlink: 2ad973ba
date: 2025-08-08 00:00:00
---

今天在 Mac 上的 Docker 容器访问微服里的 Wordpress 时，遇到了 IPv6 无法正常访问的问题。
现象是：`dig` 能解析出 IPv6 地址，但容器内网络不可达。

https://appstore.lazycat.cloud/#/shop/detail/dev.beiyu.wordpress

### 问题现象

- `dig` 查询正常，能返回 IPv6 结果。
- 但容器内访问（`curl`、`ping6`）失败，提示网络不可达。

<!-- more -->

### 原因排查

查询后发现：

- 默认情况下，Docker 引擎并未为容器分配 IPv6 地址。
- 这导致虽然 DNS 能解析，但容器无 IPv6 出口。

### 解决方法

在 Orbstack 设置中开启 IPv6 支持即可：

![开启 IPv6](https://lzc-playground-1301583638.cos.ap-chengdu.myqcloud.com/guidelines/459/4aa9a333-dd99-4667-914e-18c71fc4504b.png)

- 开启后，Docker 引擎会自动重启。
- 无需手动添加 `--ipv6` 启动参数。

### 验证结果

开启 IPv6 后，在容器内执行 `curl` 获取 Wordpress RSS 链接，正常返回内容：

```bash
curl https://micro.heiyu.space/feed
```

![curl 成功结果](https://lzc-playground-1301583638.cos.ap-chengdu.myqcloud.com/guidelines/459/070f7321-c061-4a1b-9fb4-7805a0dc0b35.png)

`ping6` 测试也正常：

```bash
[root@5c79a5875d68 easysearch]# ping6 micro.heiyu.space
PING micro.heiyu.space(fc03:1136:384f:313:a637:437:d22b:0) 56 data bytes
64 bytes from fc03:1136:384f:313:a637:437:d22b:0: icmp_seq=1 ttl=62 time=4.27 ms
64 bytes from fc03:1136:384f:313:a637:437:d22b:0: icmp_seq=2 ttl=62 time=5.85 ms
64 bytes from fc03:1136:384f:313:a637:437:d22b:0: icmp_seq=3 ttl=62 time=3.36 ms
64 bytes from fc03:1136:384f:313:a637:437:d22b:0: icmp_seq=4 ttl=62 time=3.97 ms
```

**总结**
在 Mac 上运行的 Docker 容器默认不分配 IPv6 地址，需要在 Orbstack 设置中手动开启 IPv6 支持。开启后无需额外配置，容器即可正常解析并访问 IPv6 目标。

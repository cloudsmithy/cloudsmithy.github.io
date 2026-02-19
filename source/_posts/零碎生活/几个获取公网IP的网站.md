---
title: 几个获取公网IP的网站
tags:
  - 租房
  - 生活
date: 2023-9-27
categories: 外设
toc: "true"
abbrlink: b893f77b
---

如果你固定了公网IP，那么这几个结果都是一样的，如果你是二级运营商，那么可能出口IP不一样，需要向运营商索要动态公网IP。

speedtest： https://api-v3.speedtest.cn/ip

<!--more-->

```json
{
  "code": 0,
  "data": {
    "country": "中国",
    "province": "北京",
    "city": "北京",
    "district": "朝阳区",
    "isp": "中国联通",
    "lon": "120.333",
    "lat": "45.34",
    "countryCode": "CN",
    "ip": "123.113.111.178",
    "operator": "中国联通"
  },
  "msg": "ok"
}
```

IP.cn: https://ip.cn/api/index?type=0

```json
{
  "rs": 1,
  "code": 0,
  "address": "中国 北京 北京市 联通",
  "ip": "123.113.111.178",
  "isDomain": 0
}
```

IP API: http://ip-api.com/json/

```json
{
  "status": "success",
  "country": "China",
  "countryCode": "CN",
  "region": "BJ",
  "regionName": "Beijing",
  "city": "Beijing",
  "zip": "",
  "lat": 23.22,
  "lon": 21.222,
  "timezone": "Asia/Shanghai",
  "isp": "China Unicom Beijing Province Network",
  "org": "",
  "as": "AS4808 China Unicom Beijing Province Network",
  "query": "xxxx"
}
```

https://checkip.amazonaws.com/
123.113.111.178

---
title: Docker启动Coco Server后，如何访问内置Easysearch?
tags: Coco-AI
toc: true
categories: 极限科技
abbrlink: 25088cdd
date: 2026-03-17 00:00:00
---

使用 Docker 启动 Coco AI 的时候会自带一个 Easysearch，我们使用连接器连接外部数据源的时候，就会把这个数据解析到 Easysearch 里。

但是默认的话，容器不会把这个 Easysearch 的端口映射出来，那就需要我们自己做些小的技巧：在官网的命令上修改一下，把 `9200` 端口先映射出来。

启动命令如下：

```bash
docker run -d --name cocoserver \
  -p 9000:9000 \
  -p 9200:9200 \
  -v coco_data_vol:/app/easysearch/data \
  -v coco_config_vol:/app/easysearch/config \
  -v coco_logs_vol:/app/easysearch/logs \
  infinilabs/coco:0.10.0-2678
```

![image-20260216121827526](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260216121827526.png)

启动之后，可以使用 netstat 看到容器端口的情况。换句话说，这个自带的 Easysearch 把 `9200` 和 `9300` 的端口确实启动起来了，但默认只绑定在 `127.0.0.1` 上，所以外部访问不到——即使你已经加了 `-p 9200` 也不行。

```bash
docker exec -it cocoserver sh -lc "netstat -lnt | egrep ':9000|:9200|:9300' || true"
```

```text
tcp6       0      0 127.0.0.1:9200          :::*                    LISTEN     
tcp6       0      0 127.0.0.1:9300          :::*                    LISTEN     
tcp6       0      0 :::9000                 :::*                    LISTEN     
```

![image-20260216122129558](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260216122129558.png)

因为这部分是 `easysearch.yml` 控制的，所以我们可以直接通过命令更改，就使用 sed 替换吧。使用之前最好确认 Coco Server 进程已经起来了，防止不必要的问题。

```bash
docker exec -it cocoserver bash -lc '
CFG=/app/easysearch/config/easysearch.yml
cp -a "$CFG" "$CFG.bak.$(date +%Y%m%d%H%M%S)"
sed -i "s/^network\.host:\s*127\.0\.0\.1/network.host: 0.0.0.0/" "$CFG"
grep -n "^network\.host:" "$CFG"
'
```

然后重启服务，就能通过 `https://IP:9200` 的方式访问 cocoserver 自带的 Easysearch 了。

```bash
docker restart cocoserver
```

这个时候我们再看端口的占用情况，已经开了外网访问（`9200/9300` 不再是 `127.0.0.1`，而是对外监听了）。

```bash
(base) lzcbox-029c588e ~ # docker exec -it cocoserver sh -lc "netstat -lnt | egrep ':9000|:9200|:9300' || true"
```

```text
tcp6       0      0 :::9300                 :::*                    LISTEN     
tcp6       0      0 :::9200                 :::*                    LISTEN     
tcp6       0      0 :::9000                 :::*                    LISTEN    
```

Easysearch 的进程会先起来，Coco Sever 会慢一些。这时候可以通过 `http://ip:9000` 访问 Coco Server，也可以通过 `https://IP:9200` 访问 Easysearch 和 Easysearch 的 UI。密码还是老样子去 log 里找。

可以直接从 log 里把 curl 示例过滤出来，一般会直接告诉你默认账号密码：

```bash
pg-docker logs cocoserver 2>&1 | egrep -i "curl" | tail -n 50
```

输出里会有类似这一行（账号通常是 admin，密码就是那串 `Coco-Server-xxxx==`）：

```bash
curl -ku 'admin:Coco-Server-6dsxtGXhD+MUNhPBKf1hug==' https://localhost:9200
```

如果你是从宿主机访问，把 `localhost` 换成你的 `IP` 或 `127.0.0.1` 就行：

```bash
curl -k -u 'admin:Coco-Server-6dsxtGXhD+MUNhPBKf1hug==' https://127.0.0.1:9200
```

![image-20260216123333103](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260216123333103.png)

然后我们就收获了一台可以在 Coco server 里使用的 Easysearch，可以实时查看数据。

![09c6e7525db4e26cee9f961d619c3764](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/09c6e7525db4e26cee9f961d619c3764.png)

平时用 API 写进去的数据还能被 Coco Server 索引，自带 UI 真的太爽了！

![8e435b3209ab7dd2110e6f55c4f0d79a](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/8e435b3209ab7dd2110e6f55c4f0d79a.png)

到这里就搞定了：Coco Server 自带的 Easysearch 不仅能正常跑起来，还能把 `9200` 端口暴露出来给外部访问。

日常用法也很简单：

* 连接器同步进来的数据会实时写进这台 Easysearch 里；
* 自己用 API 写进去的数据也会被 Coco Server 索引；
* 遇到“数据到底进没进、字段长啥样、索引有没有建对”这种问题，直接打开 Easysearch UI 看一眼就能确认，再也不用抓瞎！

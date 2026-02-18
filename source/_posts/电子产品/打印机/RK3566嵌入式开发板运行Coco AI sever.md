---
title: RK3566嵌入式开发板运行Coco AI Sever
tags: Coco-AI
toc: true
categories: 极限科技
date: 2026-02-18 00:00:00
---

之前在泰山派上运行了Easysearch，这次也想着是不是可以在泰山派开发板RK3566上运行Coco server，毕竟这板子功耗小，适合常开。

我的RK3566上是Armbian，但是没有配置网络环境，访问Dockerhub有问题，所以从Macbook 上下载玩，然后通过离线方式导成tar文件。我的镜像改了tag叫做cocoai-arm:test，你也可以不改。

```
docker save -o cocoai-arm_test.tar cocoai-arm:test
```

然后通过SCP上传到RK3566的开发板

<!-- more -->

```
scp cocoai-arm_test.tar lckfb@192.168.5.36:~
** WARNING: connection is not using a post-quantum key exchange algorithm.
** This session may be vulnerable to "store now, decrypt later" attacks.
** The server may need to be upgraded. See https://openssh.com/pq.html
lckfb@192.168.5.36's password:
cocoai-arm_test.tar                            14%  125MB   5.6MB/s   02:14 ETA^cocoai-arm_test.tar                            16%  143MB   5.7MB/s   02:10 ETA^cocoai-arm_test.tar                            38%  337MB   5.7MB/s   01:35 ETA
cocoai-arm_test.tar                            44%  391MB   5.5MB/s   01:29 ETA
```

> 补充：这个 warning 主要是 SSH 协商算法提示，不影响传输本身。真正要关注的是传输速度和是否中断——毕竟 900MB 级别的镜像，板子这边 IO 慢一点就容易“感觉很久”。

然后ssh到开发板上，使用docker laod命令还原这个Docker镜像。

```
root@lckfb:/home/lckfb# docker load -i cocoai-arm_test.tar
45e40363867d: Loading layer  336.5MB/922.7MB
```

这个过程会花费一些时间，所以有时候假死直接等待就好了。漫长的时间过去之后，我们可以通过Docker images来查看镜像，还有一个Easysearch 镜像，是我之前测试的，也能够在嵌入式开发板上运行的很好。

```
root@lckfb:/home/lckfb# docker images
REPOSITORY              TAG       IMAGE ID       CREATED        SIZE
cocoai-arm              test      172b428f2dcf   45 hours ago   915MB
infinilabs/easysearch   1.15.0    295014c1f959   5 months ago   697MB
```

`docker load` “假死”一般是写盘/解包慢，我这个板子的 eMMC 速度就很一般。

> 顺手可以记一下：板子上镜像多了以后，存储空间会很快见底，后续最好固定一个清理策略（比如只留当前版本）。

然后使用这个命令启动，然后使用Docker PS查看。

```
docker run -d --name cocoserver -p 9000:9000 \
           -v coco_data_vol:/app/easysearch/data \
           -v coco_config_vol:/app/easysearch/config \
           -v coco_logs_vol:/app/easysearch/logs \
              cocoai-arm:test
```

![image-20260217221525932](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260217221525932.png)

**图：容器已经跑起来，端口映射也生效。**
**我当时会顺手确认几个问题：**

- `STATUS` 是不是一直 `Up`，有没有出现反复重启（`Restarting`）？
- `PORTS` 是否显示 `0.0.0.0:9000->9000/tcp`（如果只绑到 `127.0.0.1`，局域网其他设备就访问不到）
- 容器名 `cocoserver` 固定后，后续排查日志/重启都更方便：`docker logs -f cocoserver`
  开发板的性能有限，所以初始化的时候需要多等一会。

![image-20260217221617329](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260217221617329.png)

**图：初始化日志在跑，说明服务在“慢慢起身”。**
**这张图我会重点盯两类信息：**

- 有没有明显的报错关键词：`error / exception / failed / oom / killed`
- 有没有持续输出（哪怕很慢）——只要日志还在动，一般就不是卡死
  **补充一个小习惯：** 如果你怀疑卡住了，可以开另一个窗口 `docker stats` 看 CPU/内存是否还有波动；也可以 `docker logs --tail 200 cocoserver` 快速看最近输出。

漫长的等待之后，CPU很清闲，不过内存快用满了。

![image-20260217225210333](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260217225210333.png)

**补充：** 这种“CPU 很闲、内存紧张”的状态，在小板跑 Java/搜索组件/AI 服务时很常见，能跑起来不奇怪，关键是别被 OOM 一刀带走。

![image-20260217225343990](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20260217225343990.png)

到这里，Coco AI Server 算是成功在 RK3566 上跑起来了：容器状态正常、日志能持续输出、端口映射也能对外提供访问。

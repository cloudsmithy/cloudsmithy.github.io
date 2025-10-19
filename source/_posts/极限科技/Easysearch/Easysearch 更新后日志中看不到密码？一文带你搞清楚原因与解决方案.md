---
title: Easysearch 更新后日志中看不到密码？一文带你搞清楚原因与解决方案
tags: 搜索引擎（ES）
toc: true
categories: 极限科技
date: 2025-10-20 00:00:00
---

最近在群里看到不少朋友反馈，Easysearch 升级到某个版本之后，**日志文件里不再能看到初始化密码**了。以前版本我们可以轻松在 `/app/easysearch/logs/initialize.log` 中找到，比如 exec 进入容器后直接 `grep curl` 搜索 Easysearch URI 字段，就能定位密码所在行。但现在——无论是 grep 还是手动翻，都空空如也。

### 问题现象：日志里“密码不见了”

过去版本，Easysearch 初始化时会将自动生成的默认密码打印到日志文件中。
如下图所示，这样的日志路径在老版本中非常常见：

![acb195d6923a17d3f8714735fad78f9a](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/acb195d6923a17d3f8714735fad78f9a.png)

  <!-- more -->

但在新版中，这条日志记录已经消失。
我平常习惯用 Dockage 来拉起 docker-compose，但由于日志滚动过快，输出信息一多也容易被覆盖。

![1fbd31bb9e12c944744725b465f679f2](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/1fbd31bb9e12c944744725b465f679f2.png)

### 02. 官方确认：这是出于安全考虑

在 Easysearch 的官方交流群中咨询后，得到了 CEO 本人的亲自回复：
新版之所以不再在日志中输出密码，是为了**提高安全性**，防止明文凭证泄露。

![image-20251020062450719](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20251020062450719.png)

换句话说，密码仍然会在启动过程中生成，只是**不再被重定向到容器内部的日志文件**。

这意味着我们要换个思路，从 **Docker 运行日志** 中找密码。

### 查看启动日志中的密码

新版的密码信息仍会在启动时输出，只是没落地到文件。
所以我们可以直接用 Docker 命令查看：

```bash
docker logs <easysearch_container_name> | grep password
```

在 macOS 上，用 **Obstack** 或 **Dozzle** 这样的图形化 Docker 日志工具也能非常直观地查看输出：

![image-20251020062149897](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20251020062149897.png)

不过要注意：如果容器重启过多次，历史日志会被覆盖，因此建议在第一次启动时就及时复制密码。

### 更稳妥的方案：自定义初始化密码

其实完全可以避免手动找密码的麻烦——直接在启动 Easysearch 时**自定义密码**。

参考我之前的文章：
👉 [启动 Easysearch 时自定义密码的操作方法](https://mp.weixin.qq.com/s/8YM87CJJAnUme65V93TY5w)

这样在 CI/CD 或本地部署时都能保持一致的密码配置，避免每次重启都要重新查找。

### 忘记密码？还可以重置！

如果你已经错过了初始化日志，又没配置自定义密码，也不用慌。
热心群友提供了铭毅天下发布的官方重置方法，实测可行：

👉 [Easysearch 重置密码的办法](https://mp.weixin.qq.com/s/t-VyJWDzXKLLbeP1JVgRuw)

重置完成后系统会生成一个新的密码。

![image-20251020063254779](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20251020063254779.png)

执行验证命令时，如果密码里有 `!`，要注意 `zsh` 的特殊行为。
`zsh` 会把 `!` 当作“历史命令展开符”，不转义会直接报错。
正确的写法如下：

```bash
curl -ku admin:'!8We9L6@g6!NMZpEDx2Apn6U' https://localhost:9200
```

或者使用反斜杠转义：

```bash
curl -ku admin:\!8We9L6@g6\!NMZpEDx2Apn6U https://localhost:9200
```

### 总结

新版 Easysearch 不再在日志文件中明文输出密码，是出于**安全强化**的考虑。
要找密码，可以：

1. 用 `docker logs` 查看启动日志；
2. 启动时通过环境变量自定义密码；
3. 若遗忘，可使用官方 reset 方法重置。

虽然麻烦了一点，但这确实是更安全、更企业化的做法。

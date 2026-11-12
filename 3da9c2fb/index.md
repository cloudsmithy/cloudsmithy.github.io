# LLM时代，密码也能日抛了

- URL: https://blog.no-claw.com/3da9c2fb/
- 日期: 2026-05-06
- 分类: 极限科技 / Easysearch
- 标签: 极限科技, Easysearch, 搜索引擎, Docker

装好了Easysearch，刚想去日志里面找默认密码，然后发现Orbstack的输出竟然不像以前一样有用户名和密码，于是不死心,用`docker logs`继续看，所以也没有。

```
docker logs easysearch
```

我的启动命令不变，还是文档上面的：
```bash
docker run -d --name easysearch \
  -v easysearch-data:/app/easysearch/data \
  -v easysearch-config:/app/easysearch/config \
  -v easysearch-logs:/app/easysearch/logs \
  infinilabs/easysearch:2.1.2-2696
```

现在首次安装后需要重置密码，而 不是像原来一样从日志里面找了。

```
docker exec -it easysearch bash -c "/app/easysearch/bin/reset_admin_password.sh"
```

如果哪天把密码忘记了，就执行一下上边这个命令，然后直接重置密码，不用再像以前一样进行繁琐的配置了。

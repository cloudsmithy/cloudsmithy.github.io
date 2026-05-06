
装好了Easysearch，刚想去日志里面找默认密码，然后发现Orbstack的输出竟然不像以前一样有用户名和密码，于是不死心,用`docker logs`继续看，所以也没有。

```
docker logs easysearch
```
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/7cc6a976cd9c4e19ba3daf79cabbf885.png)

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

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/4f5daa34b7ba42deaaa534e0ed02e9a6.png)

如果哪天把密码忘记了，就执行一下上边这个命令，然后直接重置密码，不用再像以前一样进行繁琐的配置了。

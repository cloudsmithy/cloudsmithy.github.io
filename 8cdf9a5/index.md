# 懒猫微服进阶心得（七）：懒猫的镜像仓库

- URL: https://blog.no-claw.com/8cdf9a5/
- 日期: 2025-06-07
- 分类: 懒猫微服 / 进阶
- 标签: 懒猫微服, Docker

这几年国内访问 Dockerhub 总有类似的问题，所以很多情况都建议自建 docker 仓库，比如 Habor，Nexus 或者。毕竟 GFW 的花样我们想不到。

云厂商的 ECR。但是对于个人玩家或者爱好者来说这一套实在是太重太难以维护了，可能也就是这个原因，懒猫微服也提供了镜像仓库的和本地仓库的功能。

先说镜像仓库，就是从懒猫微服的服务器上先拉 Docker image，然后再推到自己的 registry。这一步骤通常由出海链路比较好的机器来完成。

### 懒猫镜像同步功能

懒猫提供了便捷的镜像同步命令：

```bash
lzc-cli appstore copy-image cloudsmithy/lazycat-nav
```

执行之后就可以看到镜像仓库，registry.lazycat.cloud 这个地址。

[图：镜像同步界面截图]

**重要说明**：
这个地址只能在微服环境中使用，如果在其他地方使用会出现认证错误：

```bash
docker pull registry.lazycat.cloud/u04123229/cloudsmithy/lazycat-nav:854b14e73ab0726e
Error response from daemon: Head "https://registry.lazycat.cloud/v2/u04123229/cloudsmithy/lazycat-nav/manifests/854b14e73ab0726e": no basic auth credentials
```

其实就一个加了认证的 registry，只是微服有凭证可以直接进。
[图：认证错误截图]

### 内置 Docker Registry V2

懒猫微服内置了一个简化版的 registry，完整使用流程如下：

```bash
# 构建x86架构镜像
docker build --platform linux/amd64 -t helloworld:latest .

# 获取当前微服名称
BOXNAME=$(lzc-cli box default)

# 为镜像打上仓库标签
docker tag helloworld:latest dev.$BOXNAME.heiyu.space/helloworld:latest

# 推送镜像到仓库
docker push dev.$BOXNAME.heiyu.space/helloworld:latest

# 从仓库拉取镜像
docker pull dev.$BOXNAME.heiyu.space/helloworld:latest
```

**实际操作演示**：

在 M2 芯片设备上的构建过程：
[图：M2构建截图]

在 Orbstack 上拉取验证（先删除本地镜像再拉取）：
[图：镜像拉取验证]

通过 API 查看镜像列表：
[图：镜像列表API]

这个简单版本的 docker registry v2，后面用来做跑 CI 的镜像仓库应该是够了。

### 插曲：

如果遇到这个问题，千万别信 AI 是 buildX 坏了，就是中文路径的问题。（AI 查一小时。Google 一分钟）

```bash
docker-container:multiarchERROR: failed to dial gRPC: rpc error: code = Internal desc = rpc error: code= Internal desc =header key"x-docker-expose-session-sharedkey" contains value with non-printable ASCII characters
```

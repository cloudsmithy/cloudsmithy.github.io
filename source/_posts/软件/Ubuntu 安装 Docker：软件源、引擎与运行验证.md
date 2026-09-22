---
title: Ubuntu 安装 Docker：软件源、引擎与运行验证
date: '2025-04-19 09:42:31'
updated: '2025-04-19 09:44:56'
abbrlink: e149e3cd
categories:
- 软件
tags:
- Docker
- Linux
description: 在 Ubuntu 中清理旧 Docker 软件包，配置官方软件源和 GPG 密钥，安装引擎，并用 hello-world 验证运行。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/147345508
source_title: Ubuntu 安装 Docker 教程（官方推荐方式）
---

[Docker 容器小书：系列目录](/series/docker/)


#### <a id="__1_2"></a>✅ 步骤 1：卸载旧版本（如果有）


````bash
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done```

---

### ✅ 步骤 2：更新 APT 索引并安装依赖项

```bash
sudo apt-get update
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
````


---

#### <a id="__3_Docker__GPG__22"></a>✅ 步骤 3：添加 Docker 官方 GPG 密钥


```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
```


---

#### <a id="__4_Docker__35"></a>✅ 步骤 4：设置 Docker 软件源


```bash


# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```


---

#### <a id="__5_Docker__50"></a>✅ 步骤 5：安装 Docker 引擎


```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```


---

#### <a id="__6_58"></a>✅ 步骤 6：验证安装


```bash
sudo docker run hello-world
```


---

#### <a id="__7_sudo__docker_66"></a>✅ 步骤 7（可选）：让当前用户可以不用 sudo 使用 docker


```bash
sudo usermod -aG docker $USER
newgrp docker
```


重新登录后就可以直接运行：


```bash
docker ps
```


---

#### <a id="__80"></a>🎉 安装成功！

---

如果你想一键脚本安装


```
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh ./get-docker.sh
```

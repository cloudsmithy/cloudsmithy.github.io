---
title: 从 Flask 项目打包为多平台 Docker 镜像并上传 Docker Hub（含 GitHub Actions
tags: 开发
toc: true
categories: 开发
date: 2025-03-02 00:00:00
---

## 🧱 1. 创建一个基础 Flask 项目

**项目结构：**

flask-demo/  
├── app.py  
├── requirements.txt  
├── Dockerfile  
├── start.sh  
└── .github/  
   └── workflows/  
       └── docker.yml

### `app.py`

from flask import Flask  
app = Flask(**name**)  
​  
@app.route('/')  
def hello():  
    return "Hello from multi-arch Flask Docker in production mode!"

<!-- more -->

### `requirements.txt`

flask  
gunicorn

### `start.sh`

#!/bin/bash

# start.sh

​

# 默认使用 4 个 Gunicorn worker

WORKERS=${WORKERS:-4}  
​  
echo "🚀 Starting Gunicorn with $WORKERS workers..."  
​

# 启动 Flask 应用

exec gunicorn -w "$WORKERS" -b 0.0.0.0:5000 app:app  
​

---

## 🐋 2. 编写多平台 Dockerfile

FROM python:3.12-slim  
​  
WORKDIR /app  
​  
COPY requirements.txt .  
RUN pip install --no-cache-dir -r requirements.txt  
​  
COPY . .  
​  
RUN chmod +x start.sh  
​  
CMD ["./start.sh"]

---

## ⚙️ 3. 本地构建 & 推送多平台镜像（可选）

#!/bin/bash  
​  
set -e  
​

# ==== 配置区域 ====

IMAGE_NAME="cloudsmithy/flask-demo"             # Docker Hub 镜像名  
PLATFORMS="linux/amd64,linux/arm64"             # 多架构支持  
BUILDER_NAME="multiarch"                        # buildx 构建器名

# ==================

​

# 获取 TAG，优先使用 Git tag，其次 fallback 为时间戳

TAG=$(git describe --tags --abbrev=0 2>/dev/null || date +%Y%m%d)  
​  
echo "🔖 使用镜像 tag：$TAG"  
echo "📦 构建并推送镜像："  
echo " - $IMAGE_NAME:$TAG"  
echo " - $IMAGE_NAME:latest"  
​

# 登录 Docker Hub（如果没有缓存登录状态）

if ! docker info | grep -q "Username: cloudsmithy"; then  
  echo "🔐 正在登录 Docker Hub..."  
 docker login -u cloudsmithy  
fi  
​

# 创建 buildx builder（如不存在）

if ! docker buildx inspect "$BUILDER_NAME" &> /dev/null; then  
  docker buildx create --name "$BUILDER_NAME" --use  
else  
 docker buildx use "$BUILDER_NAME"  
fi  
​  
docker buildx inspect --bootstrap  
​

# 构建并推送镜像

docker buildx build --platform "$PLATFORMS" \  
  -t "$IMAGE_NAME:$TAG" \  
  -t "$IMAGE_NAME:latest" \  
  --push .  
​

---

## 🚀 4. 设置 GitHub Actions 自动推送镜像

在 `.github/workflows/docker.yml` 中创建以下内容：

name: Build and Push Docker Image  
​  
on:  
 push:  
   tags:  
     - 'v\*'  # 仅在 tag push（如 v1.0.0）时触发  
​  
jobs:  
 build-and-push:  
   runs-on: ubuntu-latest  
​  
   steps:  
   - name: Checkout source code  
     uses: actions/checkout@v4  
​  
   - name: Check DockerHub secrets  
     run: |  
       if [ -z "${{ secrets.DOCKER_USERNAME }}" ] || [ -z "${{ secrets.DOCKER_PASSWORD }}" ]; then  
         echo "❌ ERROR: DOCKER_USERNAME or DOCKER_PASSWORD is missing"  
         exit 1  
       fi  
​  
   - name: Set up QEMU  
     uses: docker/setup-qemu-action@v3  
​  
   - name: Set up Docker Buildx  
     uses: docker/setup-buildx-action@v3  
     with:  
       install: true  # ✅ 自动创建默认 builder  
​  
   - name: Docker login  
     uses: docker/login-action@v3  
     with:  
       username: ${{ secrets.DOCKER_USERNAME }}  
        password: ${{ secrets.DOCKER_PASSWORD }}  
​  
    - name: Extract tag name  
      id: vars  
      run: echo "TAG=${GITHUB_REF#refs/tags/}" >> $GITHUB_ENV  
​  
    - name: Build and push Docker image (multi-arch + latest)  
      uses: docker/build-push-action@v5  
      with:  
        context: .  
        push: true  
        platforms: linux/amd64,linux/arm64  
        tags: |  
          cloudsmithy/flask-demo:${{ env.TAG }}  
         cloudsmithy/flask-demo:latest  
​

---

## 🔐 5. 配置 GitHub Secrets

在仓库的 **Settings → Secrets → Actions** 中添加：

| Name              | Value                         |
| ----------------- | ----------------------------- |
| `DOCKER_USERNAME` | 你的 Docker Hub 用户名        |
| `DOCKER_PASSWORD` | 你的 Docker Hub Token（推荐） |

---

## 🏁 6. 触发构建 & 发布流程

git tag v1.0.0  
git push origin v1.0.0

GitHub Actions 会自动：

1. 构建支持 x86 + ARM 的镜像
2. 推送到 Docker Hub：

   - `cloudsmithy/flask-demo:v1.0.0`
   - `cloudsmithy/flask-demo:latest`

---

## ✅ 7. 结果验证

docker pull cloudsmithy/flask-demo:latest  
docker run -p 5000:5000 cloudsmithy/flask-demo:latest

---

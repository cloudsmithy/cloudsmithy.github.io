---
title: Docker 容器小书
date: '2026-09-22 18:44:44'
description: 从容器化部署、镜像与生命周期，到数据卷和 Compose，按顺序阅读 Docker 入门及跨架构部署实践。
aside: false
toc: true
comments: false
---

这组文章从普通 Docker 命令讲起，先把应用跑起来，再处理日志、数据和多服务配置。叙事里的小李和老周保留着；需要查命令时，可以直接进入各篇目录。

## 从基础开始

1. [Docker 入门（一）：容器化部署与基本概念](/effe7a9a/) — 从部署环境不一致的问题理解 Docker，认识镜像、容器、Dockerfile 和仓库，并运行第一个容器。
2. [Docker 镜像（二）：分层、构建、仓库与镜像优化](/e0565a55/) — 理解 Docker 镜像的分层结构，练习构建、拉取、推送、导出与导入，并用多阶段构建和缓存优化镜像。
3. [Docker 容器管理（三）：启动、停止、日志与重启策略](/5517bd46/) — 练习 docker run、ps、stop、start、exec 和 logs，理解前后台运行、端口映射、环境变量与容器重启策略。
4. [Docker 数据持久化（四）：Volume、Bind Mount 与备份恢复](/8b5626cb/) — 对照 Docker Volume 与 Bind Mount，练习数据卷创建、容器共享、目录挂载以及备份恢复，并延伸到 Kubernetes PVC。
5. [Docker Compose（五）：多容器编排、网络与多环境配置](/61cfcd24/) — 用 Docker Compose 管理应用、数据库与前端服务，配置网络、卷、环境变量和健康检查，并整理多环境覆盖与 V2 迁移。

## 接着做几个实际部署

- [Ubuntu 安装 Docker：软件源、引擎与运行验证](/e149e3cd/) — 在 Ubuntu 中清理旧 Docker 软件包，配置官方软件源和 GPG 密钥，安装引擎，并用 hello-world 验证运行。
- [使用 Docker 与 Nginx 部署静态网站](/478f80e7/) — 为 HTML、CSS 和 JavaScript 文件编写 Dockerfile，构建 Nginx 镜像并映射端口，完成静态网站部署。
- [使用 Docker 部署 Wiki.js 与 PostgreSQL](/7c39692e/) — 使用 Docker 启动 PostgreSQL 和 Wiki.js，配置数据库连接及端口映射，并记录安装向导和使用体验。

- [ARM 与 x86 镜像选择、QEMU 和迁移](/86ab1d7c/) — 在不同架构设备间验证和搬运镜像。
- [一台机器上的多套 Docker：懒猫微服案例](/categories/懒猫微服/进阶/) — 继续阅读微服上的容器共存与部署记录。

## 使用这些示例前

代码来自不同时间的记录，镜像版本、Compose 版本与主机架构以各篇说明为准。懒猫微服使用 pg-docker 和 Dockge 的地方，在具体文章中保留了区别；普通 Docker 环境不需要照搬设备专用命令。

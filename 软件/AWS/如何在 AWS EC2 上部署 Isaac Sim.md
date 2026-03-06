---
title: 如何在 AWS EC2 上部署 Isaac Sim
tags: Isaac
toc: true
categories:
  - 软件
  - AWS
abbrlink: 10d4e175
date: 2025-06-12 00:00:00
---

网上已经有一些关于在阿里云和腾讯云上部署 Isaac Sim 的教程，本文将带大家了解如何在 **AWS EC2 上部署 NVIDIA Isaac Sim 仿真平台**，并以 **A10G GPU（g5.2xlarge 实例）**为例进行实战操作。

---

## 一、环境说明

- **GPU 类型**：A10G（适用于 RTX 渲染）
- **实例类型**：`g5.2xlarge`
- **操作系统镜像（AMI）**：
  `Deep Learning OSS Nvidia Driver AMI GPU PyTorch 2.7 (Ubuntu 22.04)`
  👉 该镜像自带 NVIDIA 驱动、CUDA、Docker、nvidia-docker，无需手动安装

---

<!-- more -->

## 二、登录 AWS 控制台并创建实例

1. 打开 [AWS 官网](https://aws.amazon.com/)，点击右上角登录。

   ![登录入口](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250614220057596.png)

2. 选择 **使用 Root 账户登录**：

   ![root 登录](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250614220133816.png)

3. 输入 root 邮箱和密码，若首次登录需要绑定 MFA（建议使用 Authenticator App）：

   ![MFA 验证](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250614220233221.png)

4. 进入 AWS 控制台后，选择左侧的 EC2，点击右上角的 **“启动实例”**。

   ![启动 EC2 实例](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250614220401797.png)

---

## 三、配置 EC2 实例（含 GPU 驱动）

1. **选择操作系统镜像（AMI）**：
   搜索并选择：

   ```
   Deep Learning OSS Nvidia Driver AMI GPU PyTorch 2.7 (Ubuntu 22.04)
   ```

   > 自带了 NVIDIA 驱动、nvidia-container-toolkit、Docker 等，无需额外安装。

   ![选择镜像](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250614220549942.png)

2. **选择实例类型**：`g5.2xlarge`（带 A10G GPU）

   ![选择实例类型](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250614220637975.png)

3. **创建密钥对**：系统会生成 `.pem` 格式的密钥，下载后：

   ```bash
   chmod 400 your-key.pem
   ```

4. **网络设置**：

   - 选择已有 VPC，或默认网络
   - 确保启用公网 IP 分配

5. **安全组设置**：

   - 开放所需端口
   - 如部署 livestream 或远程访问，确保相应端口可用

   ![安全组设置](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250614220708780.png)

---

## 四、连接实例并确认环境

使用 SSH 登录 EC2 实例：

```bash
ssh -i your-key.pem ubuntu@<EC2公有IP>
```

1. 查看基本系统信息（需先安装 neofetch）：

   ```bash
   sudo apt update && sudo apt install neofetch -y
   neofetch
   ```

   ![neofetch 系统信息](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/d7283c4b7f3ae527c53fdb06facaf7bf.png)

2. 查看 GPU 驱动是否正常：

   ```bash
   nvidia-smi
   ```

   ![nvidia-smi](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250614221542279.png)

3. 查看是否已安装 `nvidia-docker` 插件：

   ```bash
   docker info | grep -i nvidia
   ```

   ![nvidia-docker 插件](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250614225538525.png)

---

## 五、安装 Isaac Sim（官方容器方式）

接下来按照 NVIDIA 官方文档进行 Isaac Sim 的容器部署即可：

👉 文档链接：
https://docs.isaacsim.omniverse.nvidia.com/4.5.0/installation/install_container.html

- 如果首次启动卡在 `RtPso async compilation` 阶段较久（10 分钟左右），这是因为光线追踪 shader 正在编译。只要缓存持久化，之后启动会非常快（1 分钟内）。

---

## ✅ 总结

通过 AWS 的 G5 系列实例（搭载 A10G GPU），我们可以方便地在云端部署 Isaac Sim。选用 NVIDIA 官方预装驱动的 AMI，可以省去繁琐的 CUDA 和容器配置。搭配持久化缓存和合理的端口管理，即可稳定高效运行 Isaac Sim 的云端仿真。

---
title: Proxmox Virtual Environment (PVE) 虚拟机安装不完全指南
tags: NAS
toc: true
categories: 电脑外设
date: 2025-05-11 00:00:00
---

本文将详细介绍如何在 Proxmox Virtual Environment (PVE) 中安装虚拟机。我们将从系统安装开始，逐步引导您完成虚拟机的创建和配置。

## 准备工作

我选择使用 Ventoy 进行引导，这样可以避免反复使用 Etcher 等工具进行写盘操作。

![Ventoy引导界面](https://fastly.jsdelivr.net/gh/bucketio/img14@main/2025/02/14/1739495708950-8ff5ad67-a79d-4c77-b0c0-5e02f5acd091.png)

 <!--more-->

## 系统安装

1. **启动安装程序**

   启动后，您将看到如下界面：

   ![装机启动页面](https://fastly.jsdelivr.net/gh/bucketio/img11@main/2025/02/14/1739495627040-1aa04d81-450c-42c9-8bac-8170d89b7138.png)

2. **用户协议**

   阅读并接受用户协议：

   ![用户协议](https://fastly.jsdelivr.net/gh/bucketio/img13@main/2025/02/14/1739495904206-0d29b327-2ea5-4329-a4e0-9ceb00ae05e4.png)

3. **选择安装目录**

   选择安装 Proxmox VE 的磁盘：

   ![选择安装目录](https://fastly.jsdelivr.net/gh/bucketio/img0@main/2025/02/14/1739495937155-0e3363b9-5463-4f99-ac50-6b3add6dc2c0.png)

4. **设置密码**

   设置 root 用户的密码，邮箱地址可以随意填写：

   ![设置密码](https://fastly.jsdelivr.net/gh/bucketio/img11@main/2025/02/14/1739495963290-ac605244-e2e1-458a-a95b-4e8ade3f7fb4.png)

5. **配置网络**

   设置系统的 IP 地址：

   ![设置IP地址](https://fastly.jsdelivr.net/gh/bucketio/img8@main/2025/02/14/1739496093500-ea037d25-1425-4b00-9b8f-7372307748ac.png)

6. **开始安装**

   确认所有设置后，开始安装：

   ![写盘安装](https://fastly.jsdelivr.net/gh/bucketio/img12@main/2025/02/14/1739496103042-b405e76f-9e53-47c8-b1ec-8159079663d4.png)

7. **安装完成**

   安装完成后，系统将提示您访问 Web 管理界面，默认端口为 8006：

   ![安装完成](https://fastly.jsdelivr.net/gh/bucketio/img18@main/2025/02/14/1739496130460-7c1478d4-2ed3-4e1d-961a-0c9c8f440cb7.png)

8. **重启系统**

   拔掉引导 U 盘并重启系统：

   ![重启系统](https://fastly.jsdelivr.net/gh/bucketio/img1@main/2025/02/14/1739496156501-56f4c603-2a22-4313-bdd9-5c79e603fff3.png)

## 登录与配置

1. **登录系统**

   使用前面设置的密码登录系统：

   ![登录界面](https://fastly.jsdelivr.net/gh/bucketio/img13@main/2025/02/14/1739496256424-0a1e4ec0-fb5c-49d4-b017-49a9982f1dde.png)

2. **Web 管理界面**

   登录后，您将看到 Proxmox VE 的 Web 管理界面：

   ![Web管理界面](https://fastly.jsdelivr.net/gh/bucketio/img6@main/2025/02/14/1739496317429-c7c595d0-28f7-48be-94ee-6c534ac44c7f.png)

3. **测试网络连通性**

   确保网络连接正常：

   ![测试网络连通性](https://fastly.jsdelivr.net/gh/bucketio/img5@main/2025/02/14/1739496429879-3932554f-71c9-42c4-8b69-d23619e0781b.png)

## 创建虚拟机

4. **上传 ISO 文件**

   首先，上传操作系统的 ISO 文件：

   ![上传ISO文件](https://fastly.jsdelivr.net/gh/bucketio/img11@main/2025/02/14/1739496398176-ae0c6dfc-6935-4692-adfd-5f18a31ae8ed.png)

5. **创建虚拟机**

   - **设置虚拟机编号**

     为虚拟机设置一个编号：

     ![设置虚拟机编号](https://fastly.jsdelivr.net/gh/bucketio/img7@main/2025/02/14/1739496452054-57e7920b-fb05-4ef9-a21e-a61a1faa4f96.png)

   - **选择镜像**

     选择之前上传的 ISO 文件作为安装镜像：

     ![选择镜像](https://fastly.jsdelivr.net/gh/bucketio/img10@main/2025/02/14/1739496486416-b23bcf19-3054-4227-9f38-8734adda0d7a.png)

   - **配置硬件**

     - **主板信息**

       保持默认设置即可：

       ![主板信息](https://fastly.jsdelivr.net/gh/bucketio/img10@main/2025/02/14/1739496507107-d7b905a2-15f2-4f82-984b-de1838473abb.png)

     - **磁盘设置**

       建议选择 VirtIO 以提高性能：

       ![磁盘信息](https://fastly.jsdelivr.net/gh/bucketio/img9@main/2025/02/14/1739496518036-c92d53c9-26f1-41b0-a2f8-c0a27ff3da6e.png)

     - **CPU 配置**

       注意不要超过宿主机的 CPU 核心数，否则虚拟机将无法启动：

       ![CPU配置](https://fastly.jsdelivr.net/gh/bucketio/img14@main/2025/02/14/1739496553350-c56e06ea-452e-4c47-83ba-c5862ee4fb2c.png)

     - **内存分配**

       根据需求分配内存：

       ![内存分配](https://fastly.jsdelivr.net/gh/bucketio/img2@main/2025/02/14/1739496596444-f2f1e55d-5cbb-4785-bf62-0594c8b21fd5.png)

     - **网络设置**

       同样建议选择 VirtIO：

       ![网络设置](https://fastly.jsdelivr.net/gh/bucketio/img18@main/2025/02/14/1739496606806-c87db584-4e0d-4cad-a02a-85b99203c78a.png)

   - **确认信息**

     确认所有设置无误后，点击完成：

     ![确认信息](https://fastly.jsdelivr.net/gh/bucketio/img16@main/2025/02/14/1739496631571-e5268655-ef8a-4013-8150-ef9a4c52445d.png)

6. **启动虚拟机**

   启动虚拟机并开始安装操作系统：

   ![启动虚拟机](https://fastly.jsdelivr.net/gh/bucketio/img11@main/2025/02/14/1739496828640-31167397-96bf-4119-818a-43d50bb773d8.png)

## 操作系统安装

7. **安装过程**

   按照提示进行操作系统安装：

   ![安装过程](https://fastly.jsdelivr.net/gh/bucketio/img4@main/2025/02/14/1739496852570-0ce8ac5b-35ca-4a3b-8941-b7743854c09d.png)

8. **加载驱动**

   在安装过程中，加载 VirtIO 驱动：

   ![加载驱动](https://fastly.jsdelivr.net/gh/bucketio/img10@main/2025/02/14/1739496688201-f337a991-9413-46f1-b7d6-ac9f0d37c1e7.png)

   ![选择VirtIO驱动](https://fastly.jsdelivr.net/gh/bucketio/img11@main/2025/02/14/1739496710136-4aaabb2e-1f4a-4557-9fb1-29f95dc31e38.png)

9. **分区与安装**

   对磁盘进行分区并开始安装：

   ![分区与安装](https://fastly.jsdelivr.net/gh/bucketio/img3@main/2025/02/14/1739496747084-525bc23a-cefd-4125-b475-4ffd8daa5a15.png)

10. **复制安装文件**

安装程序将复制文件并进行系统安装：

![复制安装文件](https://fastly.jsdelivr.net/gh/bucketio/img7@main/2025/02/14/1739496768338-782c747c-30a2-4621-a3eb-0256ffecb588.png)

11. **设置时间**

设置系统时区：

![设置时间](https://fastly.jsdelivr.net/gh/bucketio/img16@main/2025/02/14/1739496890195-2798b236-ecf5-4a58-802b-96a47f69ac6f.png)

12. **网络配置**

安装完成后，系统可能暂时无法联网，稍后我们将安装网络驱动：

![网络配置](https://fastly.jsdelivr.net/gh/bucketio/img0@main/2025/02/14/1739496907046-ffc098df-4d4f-4e74-b5e5-86a71f377844.png)

13. **设置用户名和密码**

为操作系统设置用户名和密码：

![设置用户名和密码](https://fastly.jsdelivr.net/gh/bucketio/img14@main/2025/02/14/1739496981075-0188047a-70cd-47a1-b054-c9687e674b35.png)

14. **安装 VirtIO 驱动**

安装 VirtIO 网络驱动以确保网络功能正常：

![安装VirtIO驱动](https://fastly.jsdelivr.net/gh/bucketio/img13@main/2025/02/14/1739496999682-a1dea257-7663-430b-90f4-6967c0ca7a43.png)

## Linux 系统安装

对于 Linux 系统，安装过程类似，但通常 Linux 系统已经自带 VirtIO 驱动，无需手动安装：

![Linux安装](https://fastly.jsdelivr.net/gh/bucketio/img1@main/2025/02/14/1739497063172-b31a2a3d-f080-4f5d-8842-603e1db11cfe.png)

通过以上步骤，您应该已经成功在 Proxmox VE 中安装并配置了虚拟机。希望本指南对您有所帮助！

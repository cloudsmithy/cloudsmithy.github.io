---
title: Amazon EKS 托管 Kubernetes 学习笔记
date: '2024-03-13 21:39:45'
updated: '2024-03-13 21:39:45'
abbrlink: 19746f09
categories:
- 软件
- AWS
tags:
- AWS
- Kubernetes
description: 记录 Amazon EKS 的托管 Kubernetes 架构、控制平面与工作节点，以及集群运行的基本概念。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/136692411
source_title: EKS - Elastic Kubernetes Service
---

[AWS 实战与学习笔记：系列目录](/series/aws/)


首先，对于那些不熟悉 Kubernetes 的人，让我简要解释一下它是什么。 Kubernetes 是一种开源容器编排工具，旨在自动化、部署、扩展和操作容器化应用程序。 它被设计为从数十、数千甚至数百万个容器增长。 Kubernetes 与容器运行时无关，这意味着您实际上可以使用 Kubernetes 来运行 Rocket 和 Docker 容器。

回到 EKS，通过 EKS，AWS 提供了一项托管服务，允许您在 AWS 基础设施上运行 Kubernetes，而无需在所谓的控制平面中配置和运行 Kubernetes 管理基础设施。 您，AWS 账户所有者，只需预置和维护工作节点。

什么是控制平面，什么是工作节点？

Kubernetes 控制平面：

控制平面由许多不同的组件组成，其中包括许多不同的 API、kubelet 进程和 Kubernetes Master，这些组件决定了 Kubernetes 和集群如何相互通信。 控制平面本身跨主节点运行。

控制平面将容器调度到节点上。 在此上下文中，术语“调度”并非指时间。 在这种情况下，调度是指根据容器声明的计算要求将容器放置到节点上的决策过程。 控制平面还通过持续监视对象来跟踪所有 kubernetes 对象的状态。 因此，在 EKS 中，AWS 负责配置、扩展和管理控制平面，他们通过利用多个可用区来实现额外的弹性。

工作节点：

Kubernetes 集群由节点组成，术语“集群”是指所有节点的聚合。 节点是 Kubernetes 中的工作计算机，作为按需 EC2 实例运行，并包含用于运行由 Kubernetes 控制平面管理的容器的软件。 对于创建的每个节点，都会使用特定的 AMI，这还确保除了 AWS IAM 身份验证器之外还安装了 docker 和 kubelet 以进行安全控制。 这些节点是我们作为客户负责在 EKS 内管理的节点。 配置工作节点后，它们就可以使用端点连接到 EKS。

有关 Kubernetes 的更多信息，请参阅我们现有的课程“Kubernetes 简介”

让我简要概述一下开始使用 EKS 服务所需的条件。

创建 EKS 服务角色：在开始使用 EKS 之前，您需要配置和创建一个 IAM 服务角色，以允许 EKS 预置和配置特定资源。 该角色只需创建一次，即可用于以后创建的所有其他 EKS 集群。 该角色需要附加以下权限策略：AmazonEKSServicePolicy 和 AmazonEKSClusterPolicy

创建 EKS 集群 VPC：使用 AWS CloudFormation，您需要根据以下模板创建并运行 CloudFormation 堆栈：https://amazon-eks.s3-us-west-2.amazonaws.com/cloudformation/2019-02 -11/amazon-eks-vpc-sample.yaml，它将配置一个新的 VPC 供您与 EKS 一起使用

安装 kubectl 和 AWS-IAM-Authenticator：Kubectl 是 Kubernetes 的命令行实用程序，可以按照此处提供的详细信息进行安装。需要 IAM-Authenticator 才能对 EKS 集群进行身份验证。 根据您的客户端操作系统（Linux、MacOS 或 Windows），可以从此处下载：

创建 EKS 集群：使用 EKS 控制台，您现在可以使用步骤 1 和 2 中创建的 VPC 的详细信息和信息创建 EKS 集群

为 EKS 配置 kubectl：通过 AWS CLI 使用 update-kubeconfig 命令，您需要为 EKS 集群创建一个 kubeconfig 文件

配置和配置工作节点：一旦您的 EKS 集群显示“活动”状态，您就可以根据以下模板使用 CloudFormation 启动工作节点：https://amazon-eks.s3-us-west-2.amazonaws.com/ cloudformation/2019-02-11/amazon-eks-nodegroup.yaml

配置工作节点以加入 EKS 集群：使用此处下载的配置图：  
curl -O https://amazon-eks.s3-us-west-2.amazonaws.com/cloudformation/2019-02-11/aws-auth-cm.yaml

您必须对其进行编辑，并将 <实例角色的 ARN（不是实例配置文件）> 替换为步骤 6 中的 NodeInstanceRole 值

您的 EKS 集群和工作节点现已配置完毕，可供您使用 Kubernetes 部署应用程序。

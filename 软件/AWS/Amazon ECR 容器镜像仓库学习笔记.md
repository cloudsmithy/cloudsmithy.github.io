---
title: Amazon ECR 容器镜像仓库学习笔记
date: '2024-03-13 21:37:15'
updated: '2024-03-13 21:37:15'
abbrlink: 83d4807
categories:
- 软件
- AWS
tags:
- AWS
- Docker
description: 整理 Amazon ECR 镜像仓库的基本功能、镜像存储与访问方式，以及与容器部署流程的关系。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/136692354
source_title: ECR - Elastic Container Registry
---

[AWS 实战与学习笔记：系列目录](/series/aws/)


这是一项完全托管的服务，因此，您不需要配置任何基础设施来创建此 Docker 映像注册表。 这一切均由 AWS 进行配置和管理。 该服务主要由开发人员使用，允许他们在集中且安全的位置推送、拉取和管理其 Docker 镜像库。

为了更好地理解该服务，让我们看一下所使用的一些组件。 它们是注册表、授权令牌、存储库、存储库策略和image。 我们先看一下注册表。 ECR 注册表是允许您托管和存储 docker 映像以及创建映像存储库的对象。 在您的 AWS 账户中，您将获得一个默认注册表。 创建注册表后，默认情况下，注册表的 URL 如下：

https://aws_account_id.dkr.ecr.region.amazonaws.com

您需要将红色文本替换为您自己的适用于您的帐户或媒介的信息。 默认情况下，您的帐户将对您在注册表和任何存储库中创建的任何图像具有读取和写入访问权限。 除了存储库策略之外，还可以通过 IAM 策略来控制对注册表和映像的访问，以实施更严格的安全控制。 由于 docker 命令行界面不支持所使用的不同 AWS 身份验证方法，因此在 docker 客户端可以访问您的注册表之前，需要将其验证为 AWS 用户，这将允许您的客户端进行推送和拉取 图片。 这是通过使用授权令牌来完成的。 要开始授权过程以允许 docker 客户端与默认注册表进行通信，您可以使用 AWS CLI 运行 get login 命令，如下所示：

aws ecr get-login --region 区域 --no-include-email  
其中红色文本应替换为您自己的区域。 然后，这将产生一个输出响应，这将是一个 docker 登录命令。

docker 登录 -u AWS -p 密码 https://aws_account_id.dkr.ecr.region.amazonaws.com  
然后，您必须复制此命令并将其粘贴到您的 docker 终端中，该终端将验证您的客户端并将 docker CLI 关联到您的默认注册表。 此过程会生成一个授权令牌，可在注册表中使用 12 小时，此时，您需要按照相同的过程重新进行身份验证。 存储库是注册表中的对象，允许您将不同的 docker 映像组合在一起并保护其安全。 您可以使用注册表创建多个存储库，从而允许您将 docker 映像组织和管理到不同的类别。

使用 IAM 和存储库策略中的策略，您可以向每个存储库分配权限，允许特定用户执行某些操作，例如执行推送或拉取 IP 线路。 正如我刚才提到的，您可以使用 IAM 策略和存储库策略来控制对存储库和映像的访问。 有许多不同的 IAM 托管策略可帮助您控制对 ECR 的访问，屏幕上显示了这三个策略。

AmazonEC2ContainerRegistryFullAccess  
AmazonEC2ContainerRegistryPowerUser  
AmazonEC2ContainerRegistry只读  
有关 IAM 和策略的更多信息，请参阅此处的系统课程，其中涵盖 IAM 和策略创建和管理。 存储库策略是基于资源的策略，这意味着您需要确保向策略添加原则来确定谁有权访问以及他们拥有哪些权限。 重要的是要注意，AWS 用户要获得对注册表的访问权限，他们将需要访问 ecr 获取授权令牌 API 调用。 一旦他们拥有此访问权限，存储库策略就可以控制这些用户可以在每个存储库上执行哪些操作。 这些基于资源的策略是在 ECR 本身以及您拥有的每个其他存储库中创建的。 配置注册表、存储库和安全控制并使用 ECR 对 docker 客户端进行身份验证后，您就可以开始将 docker 镜像存储在所需的存储库中，准备好在需要时再次下拉。

要将映像推送到 ECR，您可以使用 docker push 命令，要检索映像，您可以使用 docker pull 命令。 有关如何执行图像推送和拉取的更多信息，请参阅以下链接。

Docker 推送：https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html

Docker 拉取：https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-pull-ecr-image.html

---
title: AWS 实战与学习笔记
date: '2026-09-22 18:44:44'
description: 按服务基础、连接认证、应用部署、AI 与数据处理浏览 AWS 实践记录和学习笔记。
aside: false
toc: true
comments: false
---

从连接一台 EC2、配置命令行开始，再进入身份认证、应用部署和数据处理。这里既有操作实录，也有当时整理的服务学习笔记，标题中作了区分。

文章保留原始发表日期和当时的版本、界面与测试结果。涉及服务限额、区域支持、价格和已经变化的产品名称时，实际使用前应再核对当前文档。

## 先认识服务

- [Lightsail 与 EC2：云服务器选择笔记](/d93d06d/) — 从使用门槛、资源配置、网络和典型场景对照 Lightsail 与 EC2，记录选择云服务器时的考虑。
- [AWS IoT 服务组件学习笔记](/a4330068/) — 整理 AWS IoT 的设备接入、消息通信、规则处理、设备影子与管理组件，记录各部分的职责。
- [Amazon ECS 容器服务学习笔记](/2fe9416a/) — 整理 ECS 的容器运行、任务、服务和集群概念，以及托管容器应用的基本方式。
- [Amazon EKS 托管 Kubernetes 学习笔记](/19746f09/) — 记录 Amazon EKS 的托管 Kubernetes 架构、控制平面与工作节点，以及集群运行的基本概念。
- [Amazon ECR 容器镜像仓库学习笔记](/83d4807/) — 整理 Amazon ECR 镜像仓库的基本功能、镜像存储与访问方式，以及与容器部署流程的关系。

## 连接、认证与服务部署

- [Amazon MSK 连接笔记：匿名、TLS、IAM 与 SASL/SCRAM](/b0f1dbc0/) — 对照认证方式、端口、客户端配置和 Secrets Manager，排查连接串混用与密码轮换问题。
- [AWS CLI 使用笔记：多账户、角色切换与代理](/c3549f55/) — 从 AWS CLI 的凭证配置入手，整理多个 profile、IAM Role、AssumeRole、凭证查找顺序与 HTTP 代理使用方法。
- [连接 EC2 的四种方式：SSH、Instance Connect、SSM 与串行控制台](/a851db/) — 对照 EC2 Instance Connect、SSH、会话管理器与串行控制台，记录连接设置、常见 SSH 错误及排查思路。
- [API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT](/74f8a437/) — 分别测试 REST API 与 HTTP API 的资源策略、Lambda 授权、Cognito、IAM 和 JWT，并记录 API Key 使用计划及限流响应。
- [通过 Squid 代理访问 AWS VPC 内网资源](/d143e1fe/) — 在公有子网部署 Squid 代理，通过安全组白名单控制访问，配置客户端代理并验证 VPC 内网资源的连通性。
- [把 Pop!_OS 搬到 EC2：磁盘转换与远程桌面](/dd1a54e9/) — 记录将 Pop!_OS 虚拟机磁盘转换为 RAW、写入 EBS 并替换 EC2 根卷的过程，以及 BIOS 引导和 RDP 桌面体验。
- [在 Amazon Linux 2 上安装 PHP 7.4 与 Nginx](/10ddce89/) — 记录 Amazon Linux 2 中 Nginx、PHP 7.4 和 PHP-FPM 的安装配置，以及用测试页面验证并清理环境的步骤。
- [Elastic Beanstalk 更新策略笔记](/d48dda7b/) — 对照 Elastic Beanstalk 的一次性、滚动、附加批次、不可变、蓝绿和流量拆分部署，记录停机、回滚与资源开销的区别。
- [在 AWS EKS 上部署 Easysearch](/628ec63/) — 使用 eksctl 创建 EKS 集群，配置 EBS CSI 驱动与负载均衡控制器，通过 Helm 部署 Easysearch 和 Console 并验证连接。
- [OpenSearch ISM 索引轮换策略笔记](/4ea76b9/) — 记录 OpenSearch ISM 策略的创建请求、分层存储状态配置，以及将策略附加到索引的方法。

## AI 与机器学习

- [Bedrock Converse 调用笔记：DeepSeek R1 与 Claude](/6384163b/) — 两组 Boto3 调用示例，以及文本响应读取、多轮消息和 InvokeModel 的区别。
- [Amazon Bedrock 基础模型初体验](/fd6e8ce3/) — 记录在 Amazon Bedrock 中尝试文本生成、图片生成、模型评估和 Guardrails 的过程，保留当时的模型选择与界面。
- [Amazon Q Developer 实践：读代码与修改游戏功能](/aa5bd787/) — 借助 Amazon Q Developer 实验手册，在 VS Code 中解读体素游戏代码、插入功能修改，并尝试生成 Boto3 调用示例。
- [Amazon SageMaker 学习笔记：数据、训练与部署](/39f5bddc/) — 整理 SageMaker 在数据准备、模型构建、训练和部署中的功能，以及端点、预测数据捕获与模型观察的学习记录。
- [分布式机器学习笔记：Spark、MLlib 与 EMR](/6dd3a41b/) — 整理 Apache Spark 的分布式计算、MLlib 机器学习和 EMR 集群使用方式，以及存储连接与集群调整。

## 数据集成、流处理与安全

- [Amazon Redshift 数据仓库学习笔记](/ea823df3/) — 整理数据仓库、Redshift 集群和节点、数据加载、性能监控以及 IAM 角色访问其他 AWS 服务的学习记录。
- [Kinesis Analytics 学习笔记：流处理与时间窗口](/72adfd47/) — 保留 Kinesis Analytics SQL 流处理的学习记录，涵盖输入输出流、数据模式、泵、连续查询和时间窗口。
- [Amazon MSK 学习笔记：托管 Kafka 基础](/a527500d/) — 整理 Amazon MSK 托管 Kafka 的服务组成、集群管理、数据传输与监控相关概念。
- [AWS KMS 密钥管理学习笔记](/3cb7eae/) — 整理 AWS KMS 的密钥类型、加解密、访问权限、密钥管理及服务集成相关概念。
- [Amazon Kinesis 流数据服务学习笔记](/d8c69dd2/) — 记录流数据处理的场景和 Amazon Kinesis 服务组成，对照数据采集、传递与实时分析的分工。
- [Kinesis Data Streams 学习笔记](/f763080/) — 整理 Kinesis Data Streams 的流、分片、生产者、消费者、容量与数据处理方式，保留原有学习记录。
- [AWS Glue 数据集成学习笔记](/f920bebc/) — 整理 AWS Glue 的数据目录、爬网程序、ETL 作业和数据集成流程，以及与数据分析服务的配合。
- [AWS Lake Formation 数据湖学习笔记](/909feaee/) — 记录 Lake Formation 的数据湖构建、数据目录与访问管理概念，以及数据采集和权限配置的学习内容。
- [Amazon EMR 大数据处理学习笔记](/eb3fec0b/) — 整理 EMR 集群的大数据处理场景、节点配置、存储选择和伸缩方式，以及与 S3 数据存储的配合。

## 其他云端实践

- [全部 AWS 文章](/tags/AWS/) — 继续查阅 Lambda、S3、AgentCore、单点登录等已有记录。
- [Easysearch 技术专题](/topics/#easysearch) — 连接云端部署与搜索集群的使用、运维和排查。
- [机器学习课程笔记](/series/machine-learning/) — 配套的 Python 算法与 Notebook 练习。

---
title: 组队参加 Amazon Q Idea 1000，我们的作品上了 AWS 峰会
tags: AWS
toc: true
categories: AWS
abbrlink: ac23bcf7
date: 2025-06-20 00:00:00
---

Amazon Transit Gateway (TGW) 是一个强大的网络连接服务，用于在不同的 VPC（虚拟私有云）之间实现高效互联。本文将指导您如何创建和配置 TGW，以便实现跨账户和跨区域的 VPC 互联。

### VPC Peering 的局限性

**点对点连接**：VPC Peering 是一个点对点的连接，每次只能连接两个 VPC。如果需要连接多个 VPC，需要为每对 VPC 单独设置 Peering 连接，也就是我们常说的不能进行路由的传递，需要打通的 VPC 很多的时候会非常的麻烦。

<!-- more -->

**手动路由配置**：每个 VPC Peering 连接都需要手动配置路由表，这在大规模环境下非常繁琐。

#### TGW 的优势

**集中式管理**：TGW 作为一个中央枢纽，允许多个 VPC 和本地网络通过单个网关相互连接，简化了网络架构和管理。

**自动路由传播**：TGW 支持自动路由传播，简化了路由配置，减少了人为错误的风险。

**跨账户和跨区域支持**：TGW 支持跨多个亚马逊云科技账户和跨区域的连接，提供更大的灵活性和扩展性。

总结下来说，TGW 就是是一个中转网关，使用时候需要在需要打通的 VPC 内创建一个挂载点，TGW 会管理一张路由表来决定流量的转发到对应的挂载点上。本质上是 EC2 的请求路由到 TGW，然后在查询 TGW 的路由表来再来决定下一跳，所以需要同时修改 VPC 内子网的路由表和 TGW 的路由表。

TGW 的网络拓扑图如下：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/725dc106ded8fa6428a48cc6bf20d1d1.png)

### 1. 创建 TGW

登录到亚马逊云科技管理控制台，导航到"VPC"服务。
在左侧菜单中选择"Transit Gateways"，点击"Create Transit Gateway"。
填写 TGW 名称和描述，配置 DNS 支持等选项。

根据要求创建 TGW，如果不需要和本地网络打通，这里填写名称和描述就好。

![](https://i-blog.csdnimg.cn/blog_migrate/526162c3c12656cb9b59fcd755b0a080.png)

建议开启以下三个选项：

DNS support：开启打通 VPC 的 DNS 支持，这个 DNS support 无法解析对端的私有 R53 记录，还需要使用 Resolver 才行 [^1]

Default route table association：自动创建一个路由表并且关联这个 TGW

Default route table propagation：自动路由表自动传播，这样每次更新的时候就不用手动管理路由。

### 2. 在每个 VPC 新建挂载点

在 TGW 创建完成后，导航到"Transit Gateway Attachments"。
点击"Create Transit Gateway Attachment"，选择目标 VPC 并配置相关选项。

创建挂载点需要选择关联的 TGW 以及挂载点的 Type，除了 VPC 之外还有 peering，DX 类型的可供选择。

![](https://i-blog.csdnimg.cn/blog_migrate/f6f20f7a98607b975d5e48590acec9f2.png)

同样这里也要开启对 DNS 的支持，另外关于 Appliance Mode support，如果这个功能开启的话，流量只能在相同的可用区进行转发，这个功能开启需要慎重考虑。

### 3. 设置 TGW 路由

手动新建 TGW 的路由表并且关联到一个 TGW，如果前面开启了 Default route table association 和 Default route table propagation 不再需要此步骤。

![](https://i-blog.csdnimg.cn/blog_migrate/fe0bfdcccd14c2694e46dbd5cab24921.png)

需要在 Routes 部分手动添加路由规则

![](https://i-blog.csdnimg.cn/blog_migrate/98506c132b5f22087bdb79d3ee7e034c.png)

### 4. 设置子网路由

为每个 VPC 配置路由表，添加到 TGW 的路由。确保启用路由传播，使 VPC 可以通过 TGW 相互通信。

和 peering 一一样，需要把对应的流量指到对端，这里 10.1.0.0/16 的流量到 TGW。

![](https://i-blog.csdnimg.cn/blog_migrate/189191718ded45bfd296fb4b345bd12f.png)

### 5. 跨账户 RAM 分享，对端 RAM 接收

如果需要跨账户打通网络，那么需要用到 TGW 的 share 功能，其实就是使用 RAM 进行资源共享。

如果需要跨账户共享 TGW，使用 AWS Resource Access Manager (RAM)。

在 RAM 控制台中创建资源共享并邀请其他 AWS 账户。

对方也是需要在 RAM 里进行确认，并且接收方不能二次 share 此 TGW。

![](https://i-blog.csdnimg.cn/blog_migrate/f228631cba10ecb1ed96ef3c60d7f6a4.png)

拓展阅读：

1. Building a global network using Amazon Transit Gateway Inter-Region peering

https://aws.amazon.com/cn/blogs/networking-and-content-delivery/building-a-global-network-using-aws-transit-gateway-inter-region-peering/

2. Amazon Transit Gateway now supports Inter-Region Peering

https://aws.amazon.com/about-aws/whats-new/2019/12/aws-transit-gateway-supports-inter-region-peering/

3. Transit Gateway inter-Region peering

https://docs.aws.amazon.com/solutions/latest/network-orchestration-aws-transit-gateway/transit-gateway-inter-region-peering.html

4. Amazon Transit Gateway - Amazon Virtual Private Cloud Connectivity Options

https://docs.aws.amazon.com/whitepapers/latest/aws-vpc-connectivity-options/aws-transit-gateway.html

5. Centralized DNS management of hybrid cloud with Amazon Route 53 and AWS Transit Gateway

https://aws.amazon.com/cn/blogs/networking-and-content-delivery/centralized-dns-management-of-hybrid-cloud-with-amazon-route-53-and-aws-transit-gateway/

通过这些文档，可以全面了解 TGW 在跨区域连接中的显著优势，确保在大规模和复杂网络环境中的高效、安全和可扩展性。

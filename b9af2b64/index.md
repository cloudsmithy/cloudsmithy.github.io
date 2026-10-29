# 半小时学会 Amazon Transit Gateway 跨 VPC 网络互联配置

- URL: https://blog.no-claw.com/b9af2b64/
- 日期: 2025-06-20
- 分类: 软件 / AWS
- 标签: AWS

多个 VPC 需要互通时，可以用 Amazon Transit Gateway（TGW）集中转发流量。下面记录创建 TGW、连接 VPC、配置两层路由表，以及通过 RAM 跨账户共享的过程。

### VPC Peering 的局限性

**点对点连接**：一条 VPC Peering 连接只连接两个 VPC，而且不支持传递路由。比如 A 与 B、B 与 C 建立了 Peering，并不意味着 A 就能经由 B 访问 C。需要全互联的 VPC 多起来后，要维护的连接也会增加。

**手动路由配置**：每个 VPC Peering 连接都需要手动配置路由表，这在大规模环境下非常繁琐。

#### TGW 的优势

**集中式管理**：TGW 作为一个中央枢纽，允许多个 VPC 和本地网络通过单个网关相互连接，简化了网络架构和管理。

**自动路由传播**：TGW 支持自动路由传播，简化了路由配置，减少了人为错误的风险。

**跨账户和跨区域支持**：TGW 支持跨多个亚马逊云科技账户和跨区域的连接，提供更大的灵活性和扩展性。

可以把 TGW 理解成中转网关。每个需要互通的 VPC 创建一个挂载点（attachment），TGW 根据路由表把流量转发到对应挂载点。EC2 发出的请求先经过子网路由表到达 TGW，再由 TGW 路由表决定下一跳，所以这两层路由都要配置。

TGW 的网络拓扑图如下：

### 1. 创建 TGW

登录到亚马逊云科技管理控制台，导航到"VPC"服务。
在左侧菜单中选择"Transit Gateways"，点击"Create Transit Gateway"。
填写 TGW 名称和描述，配置 DNS 支持等选项。

根据要求创建 TGW，如果不需要和本地网络打通，这里填写名称和描述就好。

建议开启以下三个选项：

DNS support：开启 DNS 支持，但它不会自动打通其他 VPC 关联的 Route 53 私有托管区域。跨 VPC 的私有域名解析还需要单独规划，例如使用 Route 53 Resolver。[^1]

Default route table association：让新建的挂载点自动关联 TGW 的默认路由表。

Default route table propagation：让挂载点的路由传播到默认 TGW 路由表。它不会代替 VPC 子网路由表中的配置。

### 2. 在每个 VPC 新建挂载点

在 TGW 创建完成后，导航到"Transit Gateway Attachments"。
点击"Create Transit Gateway Attachment"，选择目标 VPC 并配置相关选项。

创建挂载点需要选择关联的 TGW 以及挂载点的 Type，除了 VPC 之外还有 peering，DX 类型的可供选择。

这里也开启 DNS 支持。另一个选项 Appliance Mode support 主要用于有状态网络设备，例如集中式防火墙。它让同一条流在该挂载点保持可用区路径的一致性，并不是把所有流量限制在同一个可用区内。普通 VPC 互联先按实际需要配置，具体行为见 [VPC 挂载点的 Appliance mode 说明](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-vpc-attachments.html#vpc-attachment-appliance-mode)。

### 3. 设置 TGW 路由

如果使用前面开启的默认关联和传播，可以先检查默认 TGW 路由表。需要隔离不同网络时，再创建额外的 TGW 路由表，并分别配置挂载点关联和路由传播。

在 Routes 中检查目标网段是否已有传播路由。下面是手动添加静态路由的界面：

### 4. 设置子网路由

为需要通信的 VPC 子网配置路由表，把对端网段指向 TGW；对端也要配置返回路由。这里的子网路由需要单独添加，不能只依赖 TGW 路由传播。

和 Peering 类似，需要告诉子网路由表如何到达对端。这里把发往 `10.1.0.0/16` 的流量交给 TGW。

### 5. 跨账户 RAM 分享，对端 RAM 接收

如果需要跨账户打通网络，那么需要用到 TGW 的 share 功能，其实就是使用 RAM 进行资源共享。

如果需要跨账户共享 TGW，使用 AWS Resource Access Manager (RAM)。

在 RAM 控制台中创建资源共享并邀请其他 AWS 账户。

对方接收共享后，就可以按权限创建 VPC 挂载点；接收方不能再把这个 TGW 转分享给其他账户。

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

本文先完成 VPC 互联与跨账户共享。跨区域 Peering 和集中式 DNS 可以继续对照上面的资料配置。

[^1]: TGW 的 DNS 支持不会自动解析其他 VPC 中的私有托管区域，见上面的 Centralized DNS management 文档。

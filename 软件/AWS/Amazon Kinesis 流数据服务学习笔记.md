---
title: Amazon Kinesis 流数据服务学习笔记
date: '2024-03-13 17:27:25'
updated: '2024-03-13 17:31:09'
abbrlink: d8c69dd2
categories:
- 软件
- AWS
tags:
- AWS
description: 记录流数据处理的场景和 Amazon Kinesis 服务组成，对照数据采集、传递与实时分析的分工。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/136685508
source_title: Amazon kinesis 介绍
---

[AWS 实战与学习笔记：系列目录](/series/aws/)


kinesis是由 KinesisData Streams、Kinesis Data Fire Hose、KinesisVideo Streams 和 Kinesis Data Analytics。 每个组件都解决独特的业务问题。

简单地认为 KinesisData Streams 和 Kinesis Data Firehose 执行完全相同的操作是错误的，区别在于 Firehose 完全由 AWS 管理。

它们各不相同，服务于不同的用例，并以不同的方式管理流数据。

Amazon Kinesis 旨在解决将数据流式传输到 AWS 云的复杂性和成本。

Kinesis 可以轻松实时或近实时地收集、处理和分析各种类型的数据流，例如事件日志、社交媒体源、点击流数据、应用程序数据和 IoT 传感器数据。

使用 AWS Identity and Access Management IAM 控制对 Kinesis 的访问。

使用 AWS 密钥管理服务 (KMS)，数据在流中以及放置在 AWS 存储服务（例如 Amazon S3 或 Redshift）中时都会受到自动保护。传输中的数据使用 TLS（传输层安全协议）进行保护。

Amazon Kinesis 由四种服务组成：Kinesis Video Streams、Kinesis Data Streams、Kinesis Data Firehose 和 Kinesis Data Analytics。

Kinesis Video Streams 用于对二进制编码数据（例如音频和视频）进行流处理。

Kinesis Data Streams、Kinesis Data Firehose 和 Kinesis Data Analytics 用于流式传输 Base64 文本编码数据。 这种基于文本的信息包括日志、点击流数据、社交媒体源、金融交易、游戏内玩家活动、地理空间服务和物联网设备遥测等来源。

一般来说，流数据框架被描述为有五层； 源、流摄取、流存储、流处理和目标。

使用 Kinesis Data Streams，该过程如下所示。

数据由一个或多个来源生成，包括移动设备、智能家居中的仪表、点击流、物联网传感器或日志。

在流摄取层，数据由一个或多个生产者收集，格式化为数据记录，并放入流中。

Kinesis Data Stream 是一个流存储层，是一个高速缓冲区，可存储数据至少 24 小时到365 天。 默认为 24 小时。

在 Kinesis Data Streams 内部，数据记录是不可变的。 一旦存储，它们就无法修改。 数据更新需要将新记录放入流中。 数据也不会从流中删除，它只会过期。

流处理层由消费者管理。 消费者也称为 Amazon Kinesis Data Streams 应用程序，负责处理流中包含的数据。

消费者将数据记录发送到目标层。 这可以是数据湖、数据仓库、持久存储，甚至是另一个流。

#### <a id="Kinesis_Video_Streams_35"></a>Kinesis Video Streams

Amazon Kinesis Video Streams 旨在将数百万个来源的二进制编码数据流式传输到 AWS。 传统上，这是音频和视频数据，但它可以是任何类型的二进制编码时间序列数据。 它的名称中包含视频，因为它是主要用例。

AWS 软件开发工具包可以安全地将数据流式传输到 AWS 进行播放、存储、分析、机器学习和其他处理。

数据可以从智能手机、安全摄像头、边缘设备、雷达、激光雷达、无人机、卫星和行车记录仪等设备中获取。

Kinesis Video Streams 支持开源项目 WebRTC。 这允许在网络浏览器、移动应用程序和连接设备之间进行双向实时媒体流。

#### <a id="Kinesis_Data_Stream_45"></a>Kinesis Data Stream

Amazon Kinesis Data Streams 是 AWS 提供的高度可定制的流解决方案。

高度可定制意味着与流处理相关的所有部分（数据摄取、监控、扩展、弹性和消耗）都是在创建流时以编程方式完成的。 AWS 仅在请求时才会配置资源。

这里的一个重要要点是 Kinesis Data Streams 不具备自动缩放功能。 如果您需要扩展流，则需要将其构建到您的解决方案中。

为了促进 Kinesis Data Streams 的开发、管理和使用，AWS 提供了 API、AWS 开发工具包、AWS CLI、Kinesis Agent for Linux 和 Kinesis Agent for Windows。

生产者将数据记录放入数据流中。

kinesis 可以使用AWS SDK、Kinesis Agent、Kinesis API 或Kinesis Producer Library、KPL 创建生产者。

最初，Kinesis Agent 仅适用于 Linux。 不过，AWS 已经发布了适用于 Windows 的 Kinesis Agent。

Kinesis Data Stream 是一组分片。 分片包含一系列数据记录。 数据记录由序列号、分区键和数据 Blob 组成，它们存储为不可变的字节序列。

在 Amazon Kinesis 中，Kinesis Data Streams 是一个流存储层。

Kinesis Data Stream 中的数据记录是不可变的（无法更新或删除），并且在流中可用的时间有限，范围从 24 小时到 365 天。

最初，默认有效期为 24 小时，如果支付额外费用，此默认有效期可延长至 7 天。

存储时间超过 24 小时且最多 7 天的数据记录按每个分片小时收取额外费用。7 天后，数据按每月每 GB 计费。

保留期是在创建流时配置的，可以使用 IncreaseStreamRetentionPeriod() 和 DecreaseStreamRetentionPeriod() API 调用进行更新。

使用 GetRecords() API 调用从 Kinesis Data Stream 检索超过 7 天的数据也需要付费。

使用 SubscribeToShard() API 来使用增强型扇出使用者时，长期数据检索不收取任何费用。

消费者（Amazon Kinesis Data Streams 应用程序）从 Kinesis Data Streams 获取记录并进行处理。 可以使用 AWS 开发工具包、Kinesis API 或 KCL、Kinesis 客户端库创建自定义应用程序。

有两种类型的使用者可以从 Kinesis Data Stream 获取数据。 经典消费者将从流中提取数据。 我看到这也被描述为轮询机制。

消费者每秒从分片中提取数据的次数和数据量是有限制的。 将消费者应用程序添加到分片会导致必须在它们之间划分可用吞吐量。

从 KCL 版本 2 开始，现在有一种名为“增强型扇出”的 Push 方法。 通过增强扇出，消费者可以订阅分片。 这会导致数据自动从分片推送到消费者应用程序中。 由于消费者不会轮询分片以获取数据，因此共享限制被删除，每个消费者每秒可获得每个分片 2 兆字节的预配置吞吐量。

#### <a id="Amazon_Kinesis_Data_Firehose_84"></a>Amazon Kinesis Data Firehose

Amazon Kinesis Data Firehose 是来自 AWS 的数据流服务，类似于 Kinesis Data Streams。 然而，虽然 Kinesis Data Streams 是高度可定制的，但完全托管的 Data Firehose 实际上是一种数据流传输服务。

摄取的数据可以动态转换、自动缩放，并自动传送到数据存储。

然而，有时，我需要解释某些东西不是什么。 在这种情况下，Kinesis Data Firehose 不像 Kinesis Data Streams 那样是流存储层。

Kinesis Data Firehose 使用生产者将数据批量加载到流中，一旦进入流，数据就会传输到数据存储。 无需开发消费者应用程序并在 Data Firehose 流中使用自定义代码处理数据。

与 Kinesis Data Streams 不同，Amazon Kinesis Data Firehose 会先缓冲传入的流数据，然后再将其传送到目的地。 缓冲区大小和缓冲区间隔是在创建传输流时选择的。

缓冲区大小以兆字节为单位，并且根据目的地具有不同的范围。 缓冲间隔的范围可以是 60 秒到 900 秒。

本质上，数据在流内缓冲，当缓冲区已满或缓冲间隔到期时，数据将离开缓冲区。 因此，Kinesis Data Firehose 被认为是近乎实时的流解决方案。

最初，Kinesis Data Firehose 可以将数据传输到四个数据存储； Amazon S3、Amazon Redshift、Amazon Elasticsearch 或 Splunk。

2020 年，这一功能得到了扩展，包括通用 HTTP 端点以及第三方提供商 Datadog、MongoDB Cloud 和 New Relic 的 HTTP 端点。

Kinesis Data Streams 和 Kinesis Data Firehose 之间的另一个区别是 Kinesis Data Firehose 将根据需要自动扩展。

Kinesis Data Firehose 可以将输入数据的格式从 JSON 转换为 Apache Parquet 或 Apache ORC，然后再将数据存储在 Amazon S3 中。

Parquet 和 ORC 是列式数据格式，与 JSON 等面向行的格式相比，可以节省空间并实现更快的查询。

Kinesis Data Firehose 还可以调用 Lambda 函数来转换传入的源数据并将转换后的数据传送到其目的地。

例如，如果数据不是 JSON 的格式（例如逗号分隔值），请先使用 AWS Lambda 将其转换为 JSON。

使用 Kinesis Data Firehose 没有免费套餐。 但是，仅当数据位于 Firehose 流内时才会产生成本。 没有预配置容量的账单，只有已使用容量的账单。

Amazon Kinesis 中的第四个也是最后一个主要服务是数据分析。

#### <a id="Kinesis_Data_Analytics_117"></a>Kinesis Data Analytics

Kinesis Data Analytics 能够实时读取流，并在数据运动时对数据进行聚合和分析。

它通过利用 SQL 查询或使用 Java 或 Scala 的 Apache Flink 来执行时间序列分析、提供实时仪表板并创建实时指标来实现此目的。

将 Kinesis Data Firehose 与 Kinesis Data Analytics 结合使用时，只能使用 SQL 查询数据记录。

带有 Java 和 Scala 应用程序的 Apache Flink 仅适用于 Kinesis Data Streams。

Kinesis Data Analytics 具有内置模板和运算符，用于通用处理功能，以大规模组织、转换、聚合和分析数据。

用例包括 ETL、连续指标的生成以及进行响应式实时分析。

如果您是 ETL 新手，它代表提取、转换、加载 ETL 的主要目的之一是丰富、组织和转换数据以匹配数据湖或数据仓库的架构。

连续指标生成应用程序监视并报告数据随时间变化的趋势。

当某些指标达到预定义的阈值时，或者在更高级的情况下，当应用程序使用机器学习算法检测到异常时，实时分析应用程序会触发警报或发送通知。

我将通过一些定价考虑因素来结束本概述。

##### <a id="Kinesis__138"></a>Kinesis 没有免费套餐

Kinesis Video Streams 定价基于摄取的数据量、消耗的数据量以及帐户中所有视频流中存储的数据。

Kinesis Data Streams 的定价稍微复杂一些。 根据 Kinesis Data Stream 中的分片数量收取每小时费用。

无论数据是否实际在流中，都会产生此费用。 当生产者将数据放入流中时，需要单独付费。

启用可选的扩展数据保留后，每个分片将对存储在流中的数据按小时收费。

对于消费者而言，费用取决于是否使用增强型扇出。 如果是，则根据数据量和消费者数量收费。

Firehose 费用基于放入传输流的数据量、Data Firehose 转换的数据量、如果数据发送到 VPC，则基于传输的数据量以及每个可用区的每小时费用。

Amazon Kinesis Data Analytics 根据用于运行流应用程序的 Amazon Kinesis 处理单元（或 KPU）的数量更改每小时费率。

KPU是流处理能力的单位。 它由 1 个虚拟 CPU 和 4 GB 内存，50磁盘组成。

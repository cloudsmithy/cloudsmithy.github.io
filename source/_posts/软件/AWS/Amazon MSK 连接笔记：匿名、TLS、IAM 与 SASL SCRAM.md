---
title: Amazon MSK 连接笔记：匿名、TLS、IAM 与 SASL/SCRAM
date: '2024-03-01 08:39:55'
updated: '2026-09-23'
abbrlink: 'b0f1dbc0'
categories:
  - 软件
  - AWS
tags:
  - AWS
  - Kafka
description: 整理 Amazon MSK 的匿名、TLS、IAM 和 SASL/SCRAM 连接方式，对照端口、Kafka 客户端配置、Secrets Manager 与公有访问条件。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/136386013
source_title: AWS MSK的连接
---

连接 MSK 时，先确认集群开了哪种认证，再取对应的 bootstrap brokers。端口、客户端配置和认证方式要配套，不能只换一个端口就继续沿用前面的配置。

这里整理的是 2024 年使用 Kafka Java 客户端的笔记。下面保留当时的 Java 11、Kafka 2.8.1 和 IAM 插件版本；整理时修正了变量混用、重复参数和密码轮换的说明。集群连接串需要从自己的 MSK 控制台获取。

## 客户端和端口

当时先在客户端机器安装 Java：

```bash
sudo yum install java-11
```

Kafka 命令在解压后的 `bin` 目录执行。本文用到的私网 IPv4 端口如下：

| 连接方式 | 端口 | 客户端配置 |
| --- | --- | --- |
| 匿名明文 | 9092 | 默认明文连接 |
| TLS 加密 | 9094 | `security.protocol=SSL` |
| SASL/SCRAM | 9096 | `SASL_SSL` 和 `SCRAM-SHA-512` |
| IAM | 9098 | `SASL_SSL` 和 IAM 认证插件 |

公有访问使用另一组端口：TLS 是 9194，SASL/SCRAM 是 9196，IAM 是 9198。端口表见 [MSK 官方文档](https://docs.aws.amazon.com/msk/latest/developerguide/port-info.html)，不要把私网连接串直接用于公网。

## 匿名连接

下面的 broker 地址是占位示例。创建主题时使用两个副本，集群至少需要两个可用 broker。

```bash
BootstrapServerString=b-2.xxxx.kafka.cn-north-1.amazonaws.com.cn:9092,b-1.xxxx.c4.kafka.cn-north-1.amazonaws.com.cn:9092

# 创建 topic
./kafka-topics.sh --create --bootstrap-server "$BootstrapServerString" --replication-factor 2 --partitions 1 --topic MSKTutorialTopic

# 生产者
./kafka-console-producer.sh --broker-list "$BootstrapServerString" --topic MSKTutorialTopic

# 消费者
./kafka-console-consumer.sh --bootstrap-server "$BootstrapServerString" --topic MSKTutorialTopic --from-beginning
```

生产者输入一行消息后，在另一个终端启动消费者，检查能否读到消息。

## TLS 连接

TLS 加密与双向 TLS 认证是两个不同的配置。下面只配置了客户端到 broker 的 TLS 加密，没有提供客户端证书，因此不是 mTLS 示例。

创建 `client_tls.properties`：

```properties
security.protocol=SSL
```

重新取得 TLS 的 bootstrap brokers，再连接：

```bash
BootstrapServerString=b-1.xxxx.c4.kafka.cn-north-1.amazonaws.com.cn:9094,b-2.xxxx.c4.kafka.cn-north-1.amazonaws.com.cn:9094

./kafka-console-producer.sh --broker-list "$BootstrapServerString" --topic MSKTutorialTopic --producer.config client_tls.properties

./kafka-console-consumer.sh --bootstrap-server "$BootstrapServerString" --topic MSKTutorialTopic --from-beginning --consumer.config client_tls.properties
```

原笔记记录了当时中国区无法使用双向 TLS 的情况。这里保留这项环境记录，不把它当成所有区域、所有时间都适用的限制。

## IAM 连接

Kafka Java 客户端需要加载 [aws-msk-iam-auth](https://github.com/aws/aws-msk-iam-auth) 插件。下面是当时把插件放入 Kafka `libs` 目录的命令：

```bash
cp aws-msk-iam-auth-1.1.1-all.jar kafka_2.13-2.8.1/libs/
```

创建 `client.properties`：

```properties
security.protocol=SASL_SSL
sasl.mechanism=AWS_MSK_IAM
sasl.jaas.config=software.amazon.msk.auth.iam.IAMLoginModule required;
sasl.client.callback.handler.class=software.amazon.msk.auth.iam.IAMClientCallbackHandler
```

客户端还需要能取得 AWS 凭证，对应身份也要有集群和主题的操作权限。仅加载插件并不等于已经获得授权。

```bash
BootstrapServerString=b-1.xxxx.c4.kafka.cn-north-1.amazonaws.com.cn:9098,b-2.xxxx.c4.kafka.cn-north-1.amazonaws.com.cn:9098

./kafka-topics.sh --create --bootstrap-server "$BootstrapServerString" --command-config client.properties --replication-factor 2 --partitions 1 --topic MSKTutorialTopic
```

如果使用命名 profile，在 `sasl.jaas.config` 中增加 `awsProfileName`，例如：

```properties
sasl.jaas.config=software.amazon.msk.auth.iam.IAMLoginModule required awsProfileName="your-profile-name";
```

## SASL/SCRAM 连接

这条路线使用用户名和密码，需要把 Secrets Manager secret 关联到 MSK 集群。secret 名称以 `AmazonMSK_` 开头，且与集群处于同一账户、同一区域；加密 secret 时使用客户管理的对称 KMS 密钥。具体条件见 [SCRAM secret 限制](https://docs.aws.amazon.com/msk/latest/developerguide/msk-password-limitations.html)。

创建 `users_jaas.conf`。下面的用户名和密码都是示例值：

```text
KafkaClient {
   org.apache.kafka.common.security.scram.ScramLoginModule required
   username="alice"
   password="alice-secret";
};
```

在运行 Kafka 客户端的终端中设置：

```bash
export KAFKA_OPTS="-Djava.security.auth.login.config=$PWD/users_jaas.conf"
```

创建 `client_sasl.properties`：

```properties
security.protocol=SASL_SSL
sasl.mechanism=SCRAM-SHA-512
```

生产者和消费者都使用 SASL/SCRAM 的连接串：

```bash
BootstrapBrokerStringSaslScram=b-1.xxxx.c4.kafka.cn-north-1.amazonaws.com.cn:9096,b-2.xxxx.kafka.cn-north-1.amazonaws.com.cn:9096

./kafka-console-producer.sh --broker-list "$BootstrapBrokerStringSaslScram" --topic MSKTutorialTopic --producer.config client_sasl.properties

./kafka-console-consumer.sh --bootstrap-server "$BootstrapBrokerStringSaslScram" --topic MSKTutorialTopic --from-beginning --consumer.config client_sasl.properties
```

原笔记里，生产者误用了前面 IAM 示例的变量，这会把请求发到错误的认证入口。这里已经统一成 `BootstrapBrokerStringSaslScram`。

改密码后也不能只看现有连接是否还能收发消息。原笔记提到新旧密码都能使用的现象，并把重新关联 secret 写成了必要操作，这里补充它的适用边界。按 [MSK 用户管理文档](https://docs.aws.amazon.com/msk/latest/developerguide/msk-password-users.html)，secret 变更传播可能需要最多 10 分钟，移除用户也不会关闭已有连接。因此应在传播完成后，用新建连接检查旧凭证是否失效；需要立即撤销访问时，还要处理 ACL。

## 公有访问

公有访问还需要满足集群配置要求：

- 集群所在子网是公有子网。
- 关闭匿名访问。
- 开启 broker 间加密，并关闭客户端明文连接。
- 使用 SASL/SCRAM 或 mTLS 时，配置 Kafka ACL，并将 `allow.everyone.if.no.acl.found` 设为 `false`。

这里的“公有子网”只是条件之一，并不意味着集群会自动开放公网入口。完整条件见 [MSK 公有访问文档](https://docs.aws.amazon.com/msk/latest/developerguide/public-access.html)。

多 VPC 私有连接当时还没有测试，这篇先记录到客户端认证和连接为止。

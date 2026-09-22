---
title: AWS CLI 使用笔记：多账户、角色切换与代理
date: '2024-04-07 20:44:39'
updated: '2024-05-26 19:54:45'
abbrlink: c3549f55
categories:
- 软件
- AWS
tags:
- AWS
- 代理
description: 从 AWS CLI 的凭证配置入手，整理多个 profile、IAM Role、AssumeRole、凭证查找顺序与 HTTP 代理使用方法。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/137477594
source_title: 一文讲透亚马逊云命令行使用
---

[AWS 实战与学习笔记：系列目录](/series/aws/)


### <a id="AWS_CLI_0"></a>安装和配置AWS CLI

学习使用亚马逊云，自然免不了使用命令行工具，首先我们从下载和配置开始：

现在都使用V2版本的命令行工具，可以从官网下载最新的二进制安装包。<a id="fnref1"></a>[1](#fn1)

首先是配置凭证：


```bash
aws configure 
```


输入之后会提示输入AK/SK，region以及输入的格式信息,对于输出格式一般使用json，也可以选择text，table，yaml，yaml-stream ，比如在后边加上–output table。

> AWS Access Key ID [None]:  
>  AWS Secret Access Key [None]:  
>  Default region name [None]:  
>  Default output format [None]:

如果需要多个凭证共存，可以使用–profile 来指定别名，然后每次在后边加上–profile dev即可。


```
aws configure --profile dev
```


配置好了可以使用如下命令进行查看：


```
aws configure list --profile dev
```


> Name Value Type Location
>
> ---
>
> profile dev manual --profile  
>  access_key \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*ABCC shared-credentials-file  
>  secret_key \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*1234 shared-credentials-file  
>  region cn-north-1 config-file ~/.aws/config

使用多账户凭证  
 配置多个账户的凭证文件，并通过命令行参数切换账户。例如：

aws s3 ls --profile your-profile  
 身份切换  
 通过IAM角色进行身份切换，使用以下命令：

aws sts assume-role --role-arn “arn:aws:iam::123456789012:role/oleName” --role-session-name your-Session-name

从结果可以看出来，我们的凭证文件都存在credentials和config文件中。这两个文件都存在Home的.aws文件夹中，其中凭证存在credentials, 配置信息存在config中。


```
cat ~/.aws/credentials   

[default]
aws_access_key_id = ****************ABCC
aws_secret_access_key = ****************ABCC
[dev]
aws_access_key_id = ****************ABCC
aws_secret_access_key = ****************ABCC

cat ~/.aws/config  

[default]
region = cn-north-1
output = json
[profile dev]
region = cn-north-1
output = json
```


如果不想查看配置文件，那么也可以使用如下命令来查看当前使用的身份：


```
aws sts get-caller-identity --output
```


结果如下：


```json
{
    "UserId": "ACBGGHLPJLJKJOKKHJ",
    "Account": "your account id",
    "Arn": "your user/role arn"
}
```


### <a id="_85"></a>多个凭证调用顺序

除了使用AK/SK之外，亚逊云更加推荐使用IAM role的身份，这样的好处是可以每次获取短暂的临时凭证，能够极大减少凭证泄漏的风险。

我们可以把IAM Role绑定在EC2 实例上，这样EC2就可以使用这个Role的身份了。如果一台机器上同时配置了AK/SK和Role，那么就会遵循无如下的优先级：<a id="fnref2"></a>[2](#fn2)

1. **命令行选项**： 覆盖任何其他位置的设置，例如 --region、–output 和 --profile 参数，比如在没有显示指定region的情况下，可以使用—region 指定区域，使用-- profile 指定配置文件中其他的身份。
2. **环境变量**：环境变量中读取aws_access_key_id/aws_secret_access_key/region，对于临时凭证来说，还需要aws_session_token。这里还有一个技巧，使用AWS_PROFILE来指定配置时候profile的名字也可以达到一样的效果。只是对于不同的编程语言来说，这个环境变量大小写的要求不尽相同。
3. **AssumeRole**：其他账户使用assume-role切换过来的角色，主要是为了跨账户操作，分为以下三种：

   1. AssumeRole：aws sts assume-role 切换的凭证
   2. AssumeRoleWithWebIdentity：OIDC 联合登陆
   3. AssumeRole with sso：使用IAM Identity Center 联合登陆
4. **配置文件**：

   1. ~/.aws/credentials文件: 一般这里存放AK/SK切换信息
   2. 自定义流程文件
   3. ~/.aws/config文件：一般存放region和format
5. **实例凭证**：

   1. 容器凭证：在同一机器的每个容器都有各自不同权限，优先级大于EC2实例凭证
   2. EC2 实例凭证：优先级最低，开发时候也最常使用

总结下来：命令行选项 > 环境变量 > 切换身份 > 配置文件 > 实例凭证

而配置文件和实例凭证恰恰是我们最常用的做法。

### <a id="_113"></a>凭证切换

前面提到了AssumeRole，我们所知IAM Role是一种权限的集合，也常常用来实现跨账户访问以及联合登陆。前提需要配置好信任关系，一下信任关系表示该Role可以同时被指定IAM 身份和相同账户下的EC2访问。


```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "your IAM ARN",              
                "Service": "ec2.amazonaws.com.cn"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
```


**从用户切换到Role：**

> [profile prod]  
>  role_arn = arn:aws:iam::123456789012:role/prod  
>  source_profile = dev

这个命令的作用是使用dev身份切换到123456789012账户的prod，命令行会自动查找dev配置文件的凭证并且在后台使用 sts:AssumeRole 操作来切换到Prod身份。

**从EC2 切换到Role**

> [profile prod]  
>  role_arn = arn:aws:iam::123456789012:role/prod  
>  credential_source = Ec2InstanceMetadata （是不是不关联也可以？）

这个一般用户AK/SK与IAM 共存的情况，这里credential_source可以是Ec2InstanceMetadata，Environment，EcsContainer。

我们先看来跨账户访问，配置如下：

> [profile prod]  
>  role_arn = arn:aws:iam::1234567890123:role/prod  
>  source_profile = default  
>  role_session_name = Session_Maria_Garcia

如果没有设置role_session_name，那么缺省值为userid:botocore-session-unix timestamps的形式，如下：

aws sts get-caller-identity --profile prod --region cn-north-1  
 {  
 “UserId”: “userid:botocore-session-unix timestamps”,  
 “Account”: “your account ”,  
 “Arn”: “arn:aws-cn:sts::your account:assumed-role/prod/botocore-session-unix timestamps”  
 }

反之，  
 {  
 “UserId”: “userid:botocore-session-Session_Maria_Garcia”,  
 “Account”: “your account ”,  
 “Arn”: “arn:aws-cn:sts::your account:assumed-role/prod/Session_Maria_Garcia”  
 }

### <a id="_176"></a>代理相关

由于命令行是基于botocore进行开发的，那么可以安装Python方式来加代理。<a id="fnref3"></a>[3](#fn3)


```bash
export HTTP_PROXY=http://10.15.20.25:1234
export HTTP_PROXY=http://proxy.example.com:1234
export HTTPS_PROXY=http://10.15.20.25:5678
export HTTPS_PROXY=http://proxy.example.com:5678
```


代理使用验证的方式如下：


```bash
export HTTP_PROXY=http://username:password@proxy.example.com:1234
export HTTPS_PROXY=http://username:password@proxy.example.com:5678
```


当然如果是全局代理，那么会影响命令行访问的内部通讯, 如有必要排除元数据地址：


```bash
export NO_PROXY=169.254.169.254
```


代理设置  
 配置代理以便在受限网络环境中使用AWS CLI。在配置文件中添加：


```
[default]
proxy_host = your.proxy.host
proxy_port = 8080
```


---

1. <a id="fn1"></a>[安装或更新到最新版本的 AWS CLI - AWS Command Line Interface](https://docs.aws.amazon.com/zh_cn/cli/latest/userguide/getting-started-install.html) [↩︎](#fnref1)
2. <a id="fn2"></a>[配置 AWS CLI - AWS Command Line Interface](https://docs.aws.amazon.com/zh_cn/cli/latest/userguide/cli-chap-configure.html) [↩︎](#fnref2)
3. <a id="fn3"></a>[使用 HTTP 代理 - AWS Command Line Interface](https://docs.aws.amazon.com/zh_cn/cli/latest/userguide/cli-configure-proxy.html#cli-configure-proxy-ec2) [↩︎](#fnref3)

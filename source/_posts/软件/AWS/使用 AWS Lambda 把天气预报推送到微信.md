---
title: 使用 AWS Lambda 把天气预报推送到微信
date: '2024-07-20 20:25:13'
updated: '2024-07-21 10:55:34'
abbrlink: 8b54051
description: 用彩云天气 API 获取天气，通过 AWS Lambda、EventBridge 和 Server 酱定时推送到微信。
categories:
- 软件
- AWS
tags:
- AWS
- Python
toc: true
source_platform: csdn
source_url: https://blog.csdn.net/weixin_38781498/article/details/140576191
source_title: 使用Amazon Web Services Lambda把天气预报推送到微信
---

最近北京开始下雨，开始和同事打赌几点能够雨停，虽然Iphone已经提供了实时天气，但是还是想用国内的API试试看看是不是更加准确些。

以下是我使用的服务：

- 地图SDK/APP获取 经纬度
- 彩云天气API 通过地理位置获取天气信息
- Lambda 作为运行环境之行Python代码
- APIGatway + Lambda代理集成
- Eventbridge 触发定时任务
- Server 酱推送消息

选择Lambda而没有选择EC2的原因是，每天的请求不大，每天10个请求以内，还有一点是不想自己管理服务器，所以在这就体现了无服务的优势。

由于以前做过实时天气的小程序，当时申请了彩云天气和高德地图的开发者SDK，所以这次相当于复用了之前的思路，顺便把这个逻辑迁移到云上。主要的思路是这样的：

1. 使用地图SDK获取当前定位的经纬度，由于这次使用了Server酱推没办法实时获取前端地址，所以直接使用了地图拾取器获取了固定的坐标，毕竟平时两点一线基本在这个范围。这个是高德地图的示例：

![在这里插入图片描述](/images/migrated/cbd3fc1017d4719d705d.png)

如果使用Google地图的话，会发现精度会更高些。

![在这里插入图片描述](/images/migrated/8a11d2e31ce003915583.png)

2. 使用彩云API，使用的是V2.6的稳定版，通过彩云API获取实时以及小时级别的天气。彩云对开发者提供了REST API调用。



```bash
curl "https://api.caiyunapp.com/v2.6/{token}/101.6656,39.2072/realtime"
```



3. 编写Python代码调用这个API，然后把拿回来的数据发送给server酱的Webhook，然后把这个代码部署到Lambda上。

server酱的调用方式如下：



```bash
POST https://sctapi.ftqq.com/<token>.send?title=标题&desp=内容
```



转换成Python代码就是：



```python
import requests

url = "https://sctapi.ftqq.com/<token>.send?title=标题&desp=内容"
response = requests.request("POST", url)
print(response.text)
```



4. 提供EventBridge 定时调用和APIGateway实时调用两种方式。

### <a id="t0"></a><a id="_48"></a>操作步骤

#### <a id="t1"></a><a id="Lambda_50"></a>准备Lambda

我们先创建一个新的Lambda函数，使用最新的Python3.11，因为我的本地MacOS环境是M2 Pro，所以为了软件包更好的兼容性我选择了arm64，如果你是Intel 芯片的PC，当然也可以选择X86。  
![在这里插入图片描述](/images/migrated/e53f0e772ae5257f5a1f.png)

然后是更改默认执行角色和高级设置，如果默认的话Lambda会自动创建一个角色，这个我们在配置-权限-执行角色这里可以找到,默认给了写日志到cloudwatch的权限，如果缺少这个权限，那么我们在函数的print()和log.info()后后将看不见任何输出。



```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "logs:CreateLogGroup",
            "Resource": "arn:aws:logs:us-east-1:123456789012:*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": [
                "arn:aws:logs:us-east-1:123456789012:log-group:/aws/lambda/caiyun:*"
            ]
        }
    ]
}
```



信任关系如下，如果你账户中恰好有这样信任关系的Role，那么也可使用这个Role而无需新建。



```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "lambda.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
```



然后是网络，默认情况下Lambda是Public的，也就是说无法连接到VPC内的资源，比如数据库，或者下一层的API。幸运的是，Lambda可以随时在Public和VPC模式之前切换。最佳实践是至少为 Lambda 选择 2 个子网以在高可用性模式下运行。如果将一个函数连接到您账户中的 VPC 时，要提供函数对互联网的访问权限，需要将出站流量路由到公有子网中的 NAT 网关。

如果在创建Lambda的时候选择VPC模式，那么会自动加上如下策略，这个策略是允许在Lambda所在子网新建网卡的。



```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ec2:CreateNetworkInterface",
                "ec2:DeleteNetworkInterface",
                "ec2:DescribeNetworkInterfaces"
            ],
            "Resource": "*"
        }
    ]
}
```



下面看两种模式的对比，由于我不需要访问VPC内部的资源，所以我选择了Public模式。

| 两种模式对比 | 优点 | 缺点 |
| --- | --- | --- |
| Public | 无需配置访问互联网 | 无法访问VPC内资源 |
| VPC | 可以使用私有网卡访问VPC资源 | 需要NAT网关才能访问互联 |

#### <a id="t2"></a><a id="_123"></a>准备配置

在 Lambda 中，可以使用 AWS Systems Manager 和 AWS Secrets Manager 来管理环境变量。两者虽然有一些相似之处，但它们的用途和功能有所不同。以下是它们的区别：

好的，我们来比较一下在 AWS Lambda 中存储和访问数据的方式，并加入 S3：

1. **Lambda 环境变量:**

   - 直接将敏感信息（例如 API 密钥）或配置数据作为键值对存储在 Lambda 函数的配置中。
   - 优点：简单易用，无需额外配置。
   - 缺点：安全性较低，环境变量会存储在 Lambda 函数代码包中，如果代码泄露，敏感信息也会随之暴露。不适合存储高度敏感的信息。
2. **AWS Systems Manager Parameter Store:**

   - 将配置数据（例如数据库连接字符串、API 端点）存储在 Parameter Store 中，该服务提供安全存储和版本控制功能。
   - 优点：安全性更高，Parameter Store 可以使用 KMS 加密参数值，并支持版本控制和访问控制。
   - 缺点：需要额外配置 Lambda 函数以访问 Parameter Store。
3. **AWS Secrets Manager:**

   - 将敏感信息（例如数据库密码、API 密钥）存储在 Secrets Manager 中，该服务提供高安全性的加密存储和访问控制。
   - 优点：安全性最高，Secrets Manager 使用 KMS 加密敏感信息，并提供严格的访问控制机制。支持密钥旋转功能。
   - 缺点：需要额外配置 Lambda 函数以访问 Secrets Manager。
4. **AWS S3:**

   - 将数据（例如图片、日志文件、模型文件）存储在 S3 对象存储中，该服务提供高可扩展性、持久性和安全性。
   - 优点：高可扩展性、低成本、高度可用性。可以配置访问控制策略来限制对数据的访问。
   - 缺点：需要额外配置 Lambda 函数以访问 S3。S3 不是专门为存储敏感信息设计的，因此需要使用其他机制（例如 KMS 加密）来保护数据安全。

**以下是关键区别的表格:**

| 特性 | Lambda 环境变量 | Parameter Store | Secrets Manager | S3 |
| --- | --- | --- | --- | --- |
| 安全性 | 低 | 中 | 高 | 中（需要额外的安全措施） |
| 加密 | 无 | 可选 (KMS) | KMS 加密 | KMS加密，S3服务端加密 |
| 访问控制 | 无 | 可配置 | 有 | 可配置 |
| 数据类型 | 通常用于敏感信息 | 通常用于配置数据 | 通常用于高度敏感信息 | 图片、日志文件、模型文件等 |
| 版本控制 | 无 | 有 | 有 | 可通过版本控制功能实现 |
| 轮换密钥 | 无 | 无 | 支持 | KMS加密支持 |

**建议:**

- **对于非关键的配置数据，例如 API 端点，可以使用 Lambda 环境变量。**
- **对于需要版本控制和访问控制的配置数据，例如数据库连接字符串，可以使用 Parameter Store。**
- **对于高安全性的信息，例如数据库密码、API 密钥等，强烈建议使用 Secrets Manager。**
- **对于大型文件或不需要频繁更新的数据，例如图片、日志文件、模型文件等，可以使用 S3 对象存储。**

#### <a id="t3"></a><a id="_176"></a>示例代码

以下是使用 AWS SDK 获取 Parameter Store 参数、Secrets Manager 密钥以及设置环境变量的 Python 代码示例：

**1. 从 Parameter Store 获取参数:**



```python
import boto3

# 创建 Systems Manager 客户端
ssm_client = boto3.client('ssm')

# 获取参数值
response = ssm_client.get_parameter(
    Name='your-parameter-name',  # 替换为您的参数名称
    WithDecryption=True  # 如果参数已加密，请设置为 True
)
parameter_value = response['Parameter']['Value']

print(f"Parameter value: {parameter_value}")
```



**解释:**

- 我们使用 `boto3` 库创建 Systems Manager 客户端。
- `get_parameter()` 函数用于获取指定参数的值。
- `WithDecryption=True` 参数确保加密的参数会被解密。
- `response['Parameter']['Value']` 包含参数值，您可以将其打印或使用。

**2. 从 Secrets Manager 获取密钥:**



```python
import boto3

# 创建 Secrets Manager 客户端
secrets_client = boto3.client('secretsmanager')

# 获取 Secret 值
response = secrets_client.get_secret_value(SecretId='your-secret-id')

# 解密 Secret 字符串
secret_string = response['SecretString']

print(f"Secret value: {secret_string}")
```



**解释:**

- 我们使用 `boto3` 库创建 Secrets Manager 客户端。
- `get_secret_value()` 函数用于获取指定 Secret 的值。
- `response['SecretString']` 包含解密后的 Secret 值，您可以将其打印或使用。

**3. 设置环境变量:**



```python
import os

# 设置环境变量
os.environ['MY_ENVIRONMENT_VARIABLE'] = 'value'
```



**解释:**

- 我们使用 `os.environ` 来设置环境变量。
- 这里我们以 `MY_ENVIRONMENT_VARIABLE` 为例，您需要将它替换为实际的环境变量名称，并用相应的参数值填充 `value`。

希望这些代码示例能够帮助您理解如何从 Parameter Store 和 Secrets Manager 获取数据，以及如何将其设置为环境变量!

##### <a id="S3_247"></a>使用S3

使用 boto3 从 Amazon S3 下载文件非常简单。以下是一个完整的 Python 代码示例，展示了如何实现此功能：



```python
import boto3

# 创建 S3 客户端对象
s3 = boto3.client('s3')

# 设置您的 S3 Bucket 名称和要下载的文件路径
bucket_name = 'your-bucket-name'  
file_key = 'path/to/your/file.txt'  

# 设置要保存文件本地路径
download_path = '/local/path/to/save/file.txt'

# 下载文件
s3.download_file(bucket_name, file_key, download_path)

print('File downloaded successfully!')
```



**解释:**

1. **导入 boto3 库**: `import boto3` 将 boto3 库导入您的 Python 代码中，以便使用其功能。
2. **创建 S3 客户端对象**: `s3 = boto3.client('s3')` 创建一个 S3 客户端对象，用于与 Amazon S3 服务进行交互。
3. **设置 S3 Bucket 和文件路径**:
   - `bucket_name`: 将此变量设置为您要下载文件所在的 S3 Bucket 名称。
   - `file_key`: 将此变量设置为要下载的文件在 S3 Bucket 中的完整路径（包括文件夹）。
4. **设置本地保存路径**: `download_path` 应该指向您想要将文件保存到本地机器上的位置。
5. **下载文件**:
   - `s3.download_file(bucket_name, file_key, download_path)` 使用 `download_file()` 方法从 S3 Bucket 下载指定的文件，并将内容保存到本地路径中。
6. **打印成功消息**: 如果下载成功，代码将打印 “File downloaded successfully!” 消息。

补充一下关于使用 boto3 从 S3 流式下载文件的内容：



```python
import boto3

# 创建 S3 客户端对象
s3 = boto3.client('s3')

# 设置您的 S3 Bucket 名称和要下载的文件路径
bucket_name = 'your-bucket-name'  
file_key = 'path/to/your/file.txt'

# 下载文件流
response = s3.download_fileobj(bucket_name, file_key)

# 处理文件流，例如将其写入本地文件
with open('/local/path/to/save/file.txt', 'wb') as f:
    for chunk in response:
        f.write(chunk)

print('File downloaded successfully!')
```



1. **使用 `download_fileobj()` 方法**:

   - 这将返回一个文件对象流，而不是直接下载文件内容到内存中。
2. **处理文件流**:

   - 我们使用 `with open()` 语句打开一个本地文件以写入模式 (‘wb’)。
   - 然后，我们循环遍历 `response` 中的每个块（chunk），并将它们写入打开的文件中。

**优势:**

- **内存效率**: 流式下载避免将整个文件加载到内存中，这对于处理非常大的文件尤其重要。
- **灵活性**: 您可以使用流式下载来直接处理文件数据，例如将其传递给其他程序或将其转换为不同的格式。



```python
import boto3
import os
import requests
import json

# 从环境变量中加载 S3 桶名称
BUCKET_NAME = os.environ.get('S3_BUCKET_NAME') 

# 加载配置（API 密钥、位置和服务器密钥）
def load_config():
    secretsmanager = boto3.client('secretsmanager')
    try:
        # 从 Secrets Manager 中获取 API 密钥
        response = secretsmanager.get_secret_value(SecretId='apikey-secret') 
        apikey = response['SecretString']

        # 从 Secrets Manager 中获取服务器密钥
        response = secretsmanager.get_secret_value(SecretId='server_key-secret') 
        server_key = response['SecretString']
    except ClientError as e:
        print(f"从 Secrets Manager 获取配置失败: {e}")
        exit(1)

    # 从 Parameter Store 中获取位置信息
    ssm = boto3.client('ssm')
    try:
      response = ssm.get_parameter(Name='location', WithDecryption=False)
      location = response['Parameter']['Value'] 
    except ClientError as e:
        print(f"从 Parameter Store 获取位置信息失败: {e}")
        exit(1)

    return apikey, location, server_key

# 从 S3 中加载天气数据
def load_skycon_data():
    s3 = boto3.client('s3')
    file_key = 'path/to/skycon_data.json' # 将此替换为 S3 中天气数据的路径

    try:
        response = s3.get_object(Bucket=BUCKET_NAME, Key=file_key)
        skycon_data = response['Body'].read().decode('utf-8')
        return json.loads(skycon_data)
    except ClientError as e:
        print(f"从 S3 获取天气数据失败: {e}")
        exit(1)

# 获取实时天气数据（需要根据您的 API 和逻辑实现）
def get_real_data():
  # 使用 apikey 和 location 调用天气 API，获取实时数据 
  pass 

# 从天气数据中提取每小时预报信息（需要根据数据格式实现）
def hourly_data(skycon_data):
  # 处理 skycon_data，提取每小时的温度、降雨概率等信息
  pass

# 将 JSON 数据转换为 Markdown 格式（需要根据您的需求实现）
def json2markdown(data):
  # 将处理后的天气数据转换为 Markdown 文本格式
  pass

# 将 Markdown 数据发送到服务器（需要根据您的服务器设置实现）
def request_server(markdown_data, server_key):
  # 使用 server_key 对请求进行身份验证，将 markdown_data 发送到您的服务器
  pass

if __name__ == '__main__':
    apikey, location, server_key = load_config()
    skycon_data = load_skycon_data()

    real_data = get_real_data()  # 替换为您获取实时天气数据的逻辑
    hourly_forecast = hourly_data(skycon_data)  # 从天气数据中提取每小时预报信息
    markdown_output = json2markdown(hourly_forecast) # 将数据转换为 Markdown 格式
    request_server(markdown_output, server_key) # 发送 Markdown 数据到服务器
```



1. **加载配置：**

   - `load_config()` 函数从 Secrets Manager 中获取 API 密钥 (`apikey`) 和服务器密钥 (`server_key`)，并从 AWS Parameter Store 中获取位置信息 (`location`).
2. **加载天气数据：**

   - `load_skycon_data()` 从 S3 中读取天气数据文件，并将其转换为 Python 字典。
3. **获取实时天气数据：**

   - `get_real_data()` 这是一个占位符函数，需要根据您的实际需求和天气 API 实现。它使用 API 密钥和位置信息来获取最新的天气数据。
4. **提取每小时预报：**

   - `hourly_data()` 也是一个占位符函数，需要根据您从 S3 中读取的天气数据格式进行实现。它负责解析天气数据并提取每小时的温度、降雨概率等信息。
5. **转换为 Markdown 格式：**

   - `json2markdown()` 这是一个占位符函数，需要根据您的需求实现将处理后的天气数据转换为 Markdown 文本格式。
6. **发送数据到服务器：**

   - `request_server()` 也是一个占位符函数，需要根据您的服务器设置实现。它使用服务器密钥对请求进行身份验证，并将 Markdown 数据发送到您的服务器。

*请注意，您需要根据实际需求和数据格式来实现`get_real_data()`, `hourly_data()`, `json2markdown()` 和 `request_server()` 这些函数。*

执行之后我们就可以在方糖的公账号上看到推送了，  
![在这里插入图片描述](/images/migrated/0910750e242a8a4d4f29.png)

这个是具体的信息，我这里列出来了实时天气和每小时的天气。  
![在这里插入图片描述](/images/migrated/d444df38259203ce54cd.jpg)

#### <a id="t4"></a><a id="EventBridgelambda_428"></a>EventBridge触发lambda

#### <a id="t5"></a><a id="APIGateway_430"></a>APIGateway代理集成

【1】https://aws.amazon.com/cn/lambda/  
【2】https://lbs.amap.com/tools/picker  
【3】https://docs.caiyunapp.com/weather-api/v2/v2.6/1-realtime.html  
【4】https://sct.ftqq.com/

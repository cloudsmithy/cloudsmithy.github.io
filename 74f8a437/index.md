# API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT

- URL: https://blog.no-claw.com/74f8a437/
- 日期: 2024-04-13
- 分类: 软件 / AWS
- 标签: AWS, SSO

[AWS 实战与学习笔记：系列目录](/series/aws/)

APIGateway的支持的认证如下：

我们从表格中可以看到，HTTP API 不支持资源策略的功能，另外是通过JWT的方式集成Cognito的。

对于REST API则是没有显示说明支持JWT认证，这个我们可以通过Lambda 自定义的方式来实现。

所以按照这个说法，除了资源策略，各种认证方式HTTP API和REST API 都能够实现。

[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]

### 资源策略

> note：HTTP API没有资源策略，所以这个部分都都是关于REST API的。

先谈资源策略，因为这个是两个API唯一不同的地方。

资源策略默认为空，对于公有API来是完全放开的，但是如果写了任意一条策略，那么其他的策略都会变成Deny，但是对于私有API来说，没有资源策略则意味着完全私有。

下面是三种资源策略：

允许特定的账户访问APIGateway，因为访问人是账户，所以这个就需要开启IAM验证。

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": [
                    "arn:aws:iam::{{otherAWSAccountID}}:root",
                    "arn:aws:iam::{{otherAWSAccountID}}:user/{{otherAWSUserName}}",
                    "arn:aws:iam::{{otherAWSAccountID}}:role/{{otherAWSRoleName}}"
                ]
            },
            "Action": "execute-api:Invoke",
            "Resource": [
                "execute-api:/{{stageNameOrWildcard*}}/{{httpVerbOrWildcard*}}/{{resourcePathOrWildcard*}}"
            ]
        }
    ]
}
```

基于IP的访问策略如下：。

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Deny",
            "Principal": "*",
            "Action": "execute-api:Invoke",
            "Resource": "execute-api:/{{stageNameOrWildcard}}/{{httpVerbOrWildcard}}/{{resourcePathOrWildcard}}",
            "Condition" : {
                "IpAddress": {
                    "aws:SourceIp": [ "{{sourceIpOrCIDRBlock}}", "{{sourceIpOrCIDRBlock}}" ]
                }
            }
        },
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "execute-api:Invoke",
            "Resource": "execute-api:/{{stageNameOrWildcard}}/{{httpVerbOrWildcard}}/{{resourcePathOrWildcard}}"
        }
    ]
}
```

允许来自来自特定VPC的流量：

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Deny",
            "Principal": "*",
            "Action": "execute-api:Invoke",
            "Resource": "execute-api:/{{stageNameOrWildcard}}/{{httpVerbOrWildcard}}/{{resourcePathOrWildcard}}",
            "Condition": {
                "StringNotEquals": {
                    "aws:sourceVpc": "{{vpcID}}"
                }
            }
        },
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "execute-api:Invoke",
            "Resource": "execute-api:/{{stageNameOrWildcard}}/{{httpVerbOrWildcard}}/{{resourcePathOrWildcard}}"
        }
    ]
}
```

### Lambda授权方

Lambda的认证方式可以自定义认证的方式，以下是一个官方提供的RSET API认证的例子，当然也在这个代码中实现JWT的颁发认证，以及SSO中我们常用的Oauth，SAML和OIDC协议 。

#### REST API

```python
# A simple token-based authorizer example to demonstrate how to use an authorization token
# to allow or deny a request. In this example, the caller named 'user' is allowed to invoke
# a request if the client-supplied token value is 'allow'. The caller is not allowed to invoke
# the request if the token value is 'deny'. If the token value is 'unauthorized' or an empty
# string, the authorizer function returns an HTTP 401 status code. For any other token value,
# the authorizer returns an HTTP 500 status code.
# Note that token values are case-sensitive.

import json

def lambda_handler(event, context):
    token = event['authorizationToken']
    if token == 'allow':
        print('authorized')
        response = generatePolicy('user', 'Allow', event['methodArn'])
    elif token == 'deny':
        print('unauthorized')
        response = generatePolicy('user', 'Deny', event['methodArn'])
    elif token == 'unauthorized':
        print('unauthorized')
        raise Exception('Unauthorized')  # Return a 401 Unauthorized response
        return 'unauthorized'
    try:
        return json.loads(response)
    except BaseException:
        print('unauthorized')
        return 'unauthorized'  # Return a 500 error

def generatePolicy(principalId, effect, resource):
    authResponse = {}
    authResponse['principalId'] = principalId
    if (effect and resource):
        policyDocument = {}
        policyDocument['Version'] = '2012-10-17'
        policyDocument['Statement'] = []
        statementOne = {}
        statementOne['Action'] = 'execute-api:Invoke'
        statementOne['Effect'] = effect
        statementOne['Resource'] = resource
        policyDocument['Statement'] = [statementOne]
        authResponse['policyDocument'] = policyDocument
    authResponse['context'] = {
        "stringKey": "stringval",
        "numberKey": 123,
        "booleanKey": True
    }
    authResponse_JSON = json.dumps(authResponse)
    return authResponse_JSON
```

这个是官方文档的一张图：
[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]
也就是说当访问APIGatewa有的时候会带上一个凭证，然后这个凭证会被传递到负责验证的Lambda中，这个lambda会根据传递的请求头会返回allow或者deny的资源策略，或者unauthorized的异常。

[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]
在Header中添加{Authorization: allow}，是可以请求成功的。

[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]
在Header中添加{Authorization: deny}，可以按照预期拦截。
[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]
在Header中添加未认证的token，即不在黑白名单内的，报错500 符合预期

[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]

#### HTTP API

然后我们再来看HTTP API，由于没有资源策略，所以授权方函数的代码和之前不一样。授权方的配置如下：

[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]
再来看一看代码，

```python
import json

def lambda_handler(event, context):
    response = {
        "isAuthorized": False,
        "context": {
            "stringKey": "value",
            "numberKey": 1,
            "booleanKey": True,
            "arrayKey": ["value1", "value2"],
            "mapKey": {"value1": "value2"}
        }
    }

    try:
        if (event["headers"]["authorization"] == "secretToken"):
            response = {
                "isAuthorized": True,
                "context": {
                    "stringKey": "value",
                    "numberKey": 1,
                    "booleanKey": True,
                    "arrayKey": ["value1", "value2"],
                    "mapKey": {"value1": "value2"}
                }
            }
            print('allowed')
            return response
        else:
            print('denied')
            return response
    except BaseException:
        print('denied')
        return response
```

在Header中添加{Authorization: secretToken}，是可以请求成功的。

[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]

如果在请求的时候没有添加Authorization的Header，这个时候是返回401 “message”: “Unauthorized”，由于我们没有在请求的时候带入身份，所以会返回401。

[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]
如果传递的token不对，那么会报错403 “message”: “Forbidden”。即我们传递了一个token到后端，但是没有通过认证，也就说没有对应的权限。

[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]

### Cognito 授权

> note：
>
> 1. 由于中国区没有Cognito用户池，所以此功能在中国区不可用。
> 2. REST API 提供了直接集成Cognito的方式，对于HTTP API而言可以使用JWT的方式来支持Cognito。

下面启动一个Cognito用户池，由于是简单测试，所以没有集成第三方身份提供商。

[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]
接下来设置密码策略并且关闭MFA，然后下一步直接到 Step 5 Integrate your app。

[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]

[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]

使用托管UI并且设置Cognito domain的URL，以及回调URL。随后我们通过内置的Cognito UI登录，会调转到我们设置的回调函数，同时带着我们需要的凭证。

[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]
[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]
接下来是创建用户，我们接下来要我们使用这个用户登录Cognito UI。

[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]
然后编辑托管UI的配置选择Implicit grant

[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]
登录之后会跳转到我们的设置的回调函数，同时会返回id_token,access_token。
[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]
设置Cognito授权方，选择前面创建好的Cognito用户池，然后设置加上请求头Authorization。

[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]
填写之后可以测试，使用前面回调返回的id_token,这里测试之后，重新部署API 然后再使用Postman再次测试。

[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]

Postman的设置如下，这里添加了请求头{ Authorization： <ID_token> }

[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]

### IAM 授权

IAM 认证比较特殊，对于中国区而言，如果你没有备案，那么只能使用IAM认证的方式进行认证。

这里其实就是SignV4的算法，我们可以使用Postman来做签名，如下：

[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]
如果你的应用需要使用SignV4访问API使用代码：

```python
import boto3
import requests
from requests.auth import AuthBase
from botocore.auth import SigV4Auth
from botocore.awsrequest import AWSRequest

class BotoSigV4Auth(AuthBase):
    """为 HTTP 请求创建 AWS Signature V4"""
    def __init__(self, service, region):
        self.service = service
        self.region = region
        self.session = boto3.Session()
        self.credentials = self.session.get_credentials()

    def __call__(self, r):
        aws_request = AWSRequest(method=r.method, url=r.url, data=r.body)
        SigV4Auth(self.credentials, self.service, self.region).add_auth(aws_request)
        r.headers.update(dict(aws_request.headers.items()))
        return r

def main():
    # 配置
    service = 'execute-api'
    region = 'us-east-1'
    api_url = 'https://你的api网关.execute-api.us-east-1.amazonaws.com/你的阶段/你的资源'

    # 创建 requests Session
    session = requests.Session()
    session.auth = BotoSigV4Auth(service, region)

    # 发送 GET 请求
    response = session.get(api_url)

    # 打印响应
    print("Response Status Code:", response.status_code)
    print("Response Text:", response.text)

if __name__ == "__main__":
    main()
```

### JWT 授权

> note： 这个部分属于HTTP API的认证，REST API

由于OIDC协议使用JWT作为中间凭证，所以在这里可以使用Auth0来代替JWT的颁发商。配置如下：

在Applications - APIS中新建API：
[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]
然后这个时候，auth0 会自动生成一个Application，后续我们会使用这个Application的Client ID和Secret ID以及Domain的信息来登录。

也就是说这三个信息确定了一个身份池，然后符合规则的用户可以通过这个身份池来换取JWT。可以在Applications-Applications 中看到。

[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]
配置好之后，可以通过Auth0的API来拿到登录后的JWT，以下是一个官方给的教程可以用来测试功能，当然也可以集成到APP中。

APIGateway 的Authorization 配置如下：

[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]
auth0 也提供了实例代码供我们测试：

[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]
官方提供的代码很烂，这个功能完全可以使用requests来实现，代码如下：

```python
import requests

url = "https://xuhan.au.auth0.com/oauth/token"

payload = {
    "client_id": "iiptrnicFRTaDduDsWQ6W9WlHm0cdvMp",
    "client_secret": "POQsksHOg3330gITitO4-7B_wYBID8xgMN9-Tz8Asp8R6PbXxSg1vq6De8HoIn7p",
    "audience": "https://auth0-jwt-authorizer",
    "grant_type": "client_credentials"
}

headers = {'content-type': "application/json"}

response = requests.post(url, json=payload, headers=headers)

print(response.text)
```

然后可以使用Postman来进行验证，其实就是在请求头中加上了Authorization: Bearer < your JWT>，这样是可以通过客户端加上凭证范访问APIGateway.

[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]

### APIKEY

APIKEY本来是用来做限流的功能，比如说某个服务会提供API给开发者使用，但同时又不希望开发者滥用这样的凭证，所以才有了这个功能。很多人会把这个当成限制匿名用户的一部分，虽然这样的解释没有问题，但是APIKEY的作用仍然是做限流而不是认证。

对于REST API来说APIKEY通常与使用计划关联，然后再再特定的路由中启动APIKEY。在使用计划中写明Burst limit和Rate limit，以及每天或者每月的额度。然后在请求头中带上x-api-key: your apikey
[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]

**速率限制（Rate limit）** ：设计用来控制较长时间尺度（如每秒）内的平均请求量，确保服务的稳定性和可靠性，防止 API 被过度使用。

**突发限制（Burst limit）**： 设计用来处理短时间内的高流量突发，允许在极短的时间窗口内接受较多请求，但不应持续太久，以避免服务器资源被迅速耗尽。

使用Python多进程测试代码如下，实测达到任意限制都会报错 429 {“message”:“Too Many Requests”}

```python
import requests
from multiprocessing import Pool

def make_request(url):
    headers = {'x-api-key': 'your key api'}
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return f"Request failed. Status: {response.status_code} Response: {response.text}"
    return "Request successful."

def main():
    url = "your url"
    process_count = 100  # 你可以根据需要调整进程数量

    with Pool(process_count) as p:
        results = p.map(make_request, [url] * 10)  # 发送10次请求

    # 打印出所有结果，包括成功和失败的
    for result in results:
        print(result)

if __name__ == '__main__':
    main()
```

[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]

对于HTTP API 来说则是直接在阶段设置就可以，同样可以达到限流的效果。
[图：API Gateway 认证实践：IAM、Lambda、Cognito 与 JWT配图]

### 最后关于中国区

中国区有一个特殊的流程叫做ICP备案, 如果没有进行备案的话，那么无论是公网访问还是内网访问，都会遇到如下的401报错

```
{
	"message": null
}
```

当然如果使用自定义域名的话，那么域名也需要备案。

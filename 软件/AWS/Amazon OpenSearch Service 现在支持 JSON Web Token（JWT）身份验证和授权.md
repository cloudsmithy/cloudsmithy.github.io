---
title: Amazon OpenSearch Service 现在支持 JSON Web Token（JWT）身份验证和授权
tags: AWS
toc: true
categories: AWS
abbrlink: '330e574'
date: 2025-06-20 00:00:00
---

最近，Amazon OpenSearch 推出了一个新功能，支持 JWT 认证和授权。虽然这个功能在开源的 OpenSearch 中早已存在，但在托管的 Amazon OpenSearch 中的实现一直不够理想。

<!-- more -->

### 此前的授权方式

#### 控制台登录

1. **内部数据库**：使用基本的用户名和密码进行 HTTP 验证。如果切换到其他认证方式（如 IAM 或 SAML），此验证方式将被禁用。
2. **IAM 主用户**：实际上是通过 Cognito 进行验证。由于中国区没有用户池，设置为 IAM 作为主用户故无法使用。
3. **SAML 单点登录**：与 SAML 身份提供商（如 Azure AD、Auth0）集成。SAML 身份验证仅能在浏览器中访问 OpenSearch Dashboard，开启 SAML 后会禁用基本的 HTTP 验证。

#### 编程方式

对于 SDK 而言，可以通过在 HTTP 请求中携带用户名和密码，或使用 SignV4 携带 IAM 身份信息进行认证。

常见的解决方案包括：

1. 控制台和 SDK 都使用内部数据库的主用户进行基本 HTTP 验证。
2. 控制台使用内部数据库或 SAML 凭证登录 OpenSearch Dashboard，然后在权限认证中给 IAM 身份单独授权访问索引，这样编程方式就可以使用 SignV4 的签名算法访问集群资源。

### JWT 与 OIDC

#### JWT 验证流程

1. 客户端请求：客户端向服务器发出登录请求，提供用户凭证（例如用户名和密码）。
2. 服务器验证凭证：服务器验证用户凭证的有效性。
3. 生成 JWT：如果凭证有效，服务器生成一个包含用户身份信息和其他声明的 JWT，并使用服务器的私钥签名。
4. 返回 JWT：服务器将签名的 JWT 返回给客户端。
5. 客户端存储 JWT：客户端收到 JWT 后，将其存储在本地存储或 cookie 中，以便在后续请求中使用。
6. 携带 JWT 的请求：客户端在每次请求时将 JWT 包含在 HTTP 请求头中（通常是 Authorization: Bearer <JWT>）。
7. 服务器验证 JWT：服务器接收到请求后，提取并解析 JWT，验证其签名、有效期和其他声明的合法性。
8. 处理请求：如果 JWT 验证通过，服务器处理请求并返回响应；如果验证失败，返回 401 或 403 错误。

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/0ca0441fec14f7ca2d2790908c8b751a.png)

#### OIDC 验证流程

OpenID Connect（OIDC）是在 OAuth 2.0 协议之上构建的一个身份层，用于实现单点登录（SSO）和身份验证。以下是 OIDC 的详细验证流程：

1. 客户端请求身份认证：客户端向身份提供者（IdP）发送身份认证请求，包含 client_id、redirect_uri、scope、response_type 和 state 参数。
2. 用户身份验证：身份提供者显示登录界面，用户输入凭证进行身份验证。
3. 同意授权：用户登录成功后，身份提供者可能会显示同意授权页面。
4. 返回授权码：用户同意授权后，身份提供者重定向客户端到 redirect_uri，并附带一个授权码。
5. 交换授权码：客户端使用授权码向身份提供者的 Token 端点发送请求，以交换 access token 和 ID token。
6. 返回令牌：身份提供者验证授权码后，返回 access token 和 ID token。ID token 是一个包含用户身份信息的 JWT。
7. 验证 ID token：客户端接收到 ID token 后，验证其签名、声明合法性和过期时间。
8. 使用令牌：客户端使用 access token 访问受保护资源，并解码 ID token 中的用户身份信息。

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/2370bdde2b917cfdfdac4c5f0e7acf84.png)

### OpenSearch 的 JWT 认证授权

2024 年 6 月 19 日 Amazon OpenSearch 在全球区上线了 JWT 认证授权功能，中国区的北京和宁夏区域的此功能在 2024 年 6 月 23 日上线控制台增加了 JWT authentication and authorization 功能，启用此功能需要开启精细访问控制，并导入验证 JWT 有效性的证书。

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/9717422ccac90a4b758b96f11de01fa9.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/2e8ca062f82f779a4612b5b5aa635572.png)

#### 配置 Auth0

配置 JWT 认证授权的步骤包括在 IDP 中创建 API，并使用 API 获取 JWT。以下是使用 Auth0 生成 JWT 的示例代码：

```python
import requests
import json

# 配置
AUTH0_DOMAIN = "<domain>.auth0.com"
CLIENT_ID = "<CLIENT_ID>"
CLIENT_SECRET = "<CLIENT_SECRET>"
AUDIENCE = "https://auth0-jwt-authorize"
GRANT_TYPE = "client_credentials"
TOKEN_URL = f"https://{AUTH0_DOMAIN}/oauth/token"
OUTPUT_FILE_PATH = 'jwt_token.json'

# 请求负载和头部
payload = {
    "client_id": CLIENT_ID,
    "client_secret": CLIENT_SECRET,
    "audience": AUDIENCE,
    "grant_type": GRANT_TYPE
}
headers = {
    "content-type": "application/json"
}

# 发送 POST 请求获取 JWT
response = requests.post(TOKEN_URL, json=payload, headers=headers)

# 处理响应
if response.status_code == 200:
    data = response.json()
    with open(OUTPUT_FILE_PATH, 'w') as file:
        json.dump(data, file, indent=4)
    print(f"JWT 已保存到文件: {OUTPUT_FILE_PATH}")
else:
    print(f"请求失败，状态码：{response.status_code}")
    print(response.text)
```

我们在 Auth0 中新建一个 API，然后会帮我们生成一个 Application。后续我们会使用这个 Application 的 Client ID 和 Secret ID 以及 Domain 的信息来登录。

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/2f652bc95370df9c93021c19d6b2c75e.png)
也就是说这三个信息确定了一个身份池，然后符合规则的用户可以通过这个身份池来换取 JWT。可以在 Applications-Applications 中看到。

配置好之后，可以通过 Auth0 的 API 来拿到登录后的 JWT，以下是一个官方给的教程可以用来测试功能，当然也可以集成到 APP 中。

auth0 也提供了示例代码供我们测试：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/a5dec4ae3ac0d8c568560643c7cbe9e7.png)
官方提供代码样例可读性不是很高，让我们用用 requests 来改写一下，这个代码会把生成的 JWT 存在一个 Json 文件里面，这样我们就能容易的复制出来。

```python
import requests
import json

# 配置
AUTH0_DOMAIN = "<domain>.auth0.com"
CLIENT_ID = "<CLIENT_ID>"
CLIENT_SECRET = "<CLIENT_SECRET>"
AUDIENCE = "https://auth0-jwt-authorize"
GRANT_TYPE = "client_credentials"
TOKEN_URL = f"https://{AUTH0_DOMAIN}/oauth/token"
OUTPUT_FILE_PATH = 'jwt_token.json'

# 请求负载和头部
payload = {
    "client_id": CLIENT_ID,
    "client_secret": CLIENT_SECRET,
    "audience": AUDIENCE,
    "grant_type": GRANT_TYPE
}
headers = {
    "content-type": "application/json"
}

# 发送POST请求获取JWT
response = requests.post(TOKEN_URL, json=payload, headers=headers)

# 处理响应
if response.status_code == 200:
    data = response.json()
    with open(OUTPUT_FILE_PATH, 'w') as file:
        json.dump(data, file, indent=4)
    print(f"JWT已保存到文件: {OUTPUT_FILE_PATH}")
else:
    print(f"请求失败，状态码：{response.status_code}")
    print(response.text)

```

我们可以看到控制台多出了一个 JWT authentication and authorization 新功能，使用这个功能需要先开启精细访问控制，我们需要在这里需要导入验证 JWT 有效性的证书。
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/0197167461b3194268825beee866e6ee.png)

服务端需要填写验证 JWT 的 PEM 证书，那么我们要从 Auth0 的 API 中拿到这个信息。使用如下代码从.well-known/jwks.json 中解析出来需要的证书，然后填写到 OpenSearch 中。

```python
import requests
from jwcrypto import jwk
import json

# 配置
JWKS_URI = 'https://<domain>/.well-known/jwks.json'  # 替换为你的Auth0域名
OUTPUT_DIR = './pem_keys'  # 你希望保存PEM公钥的目录

# 创建输出目录
import os

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

# 获取JWKS
response = requests.get(JWKS_URI)
jwks = response.json()

# 处理每一个JWK
for index, jwk_key in enumerate(jwks['keys']):
    try:
        key = jwk.JWK(**jwk_key)
        pem = key.export_to_pem(private_key=False, password=None).decode('utf-8')
        kid = jwk_key['kid']

        # 将PEM格式公钥写入文件
        pem_file_path = os.path.join(OUTPUT_DIR, f'{kid}.pem')
        with open(pem_file_path, 'w') as pem_file:
            pem_file.write(pem)

        print(f'PEM格式公钥已保存到文件: {pem_file_path}')
    except Exception as e:
        print(f'处理公钥时出错: {e}')

```

配置好后，可以在 OpenSearch 的安全配置中看到 “View JWT details” 信息，验证 JWT 的有效性。通过标准的 JWT 流程使用 Postman 验证时，将 JWT 输入到 Bearer token 中，即可进行验证。
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/11581d01b998d4e844e32c16c8019d9f.png)

#### postman 测试 JWT

然后我们按照标准的 JWT 流程进行验证，这里使用 Postman，验证方式使用 Bear token，我们把通过应用程序模拟的 JWT 输入进去。
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/fef0ead3467fe57326c4baf4141e2fa9.png)

#### 编程方式访问(Python)

我们也可以使用编程方式来进行访问，其实就是上加上一个'Authorization': 'Bearer <jwt token>'的请求头。

```python
import requests

url = "OpenSearch URL"

payload = {}
headers = {
  'Authorization': 'Bearer <jwt token>'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
```

几个月前，我参与了一些内部功能的审核工作。当时认为，既然系统支持 JWT，那么这应该也意味着支持 OIDC IDP，并且能够解决中国区 Cognito 无法集成的问题。然而，通过测试发现，JWT 仅能在编程方式中使用，控制台仍然需要使用原来的认证方式。也就是说，预想的从控制台跳转到 OIDC IDP 的方式仍然无法实现。期待未来能够实现从控制台无缝跳转到 OIDC IDP 的目标，为用户提供更便捷和安全的使用体验。

参考文档
【1】https://aws.amazon.com/cn/about-aws/whats-new/2024/06/amazon-opensearch-service-jwt-authentication-authorization/

【2】https://www.amazonaws.cn/new/2024/amazon-opensearch-service-supports-json-web-token-authentication-and-authorization/

【3】https://docs.aws.amazon.com/zh_cn/opensearch-service/latest/developerguide/JSON-Web-tokens.html

---
title: 懒猫微服进阶心得（十六）：解密OpenID Connect，如何自主注册懒猫SSO？
description: 懒猫微服进阶心得（十六）：解密OpenID Connect，如何自主注册懒猫SSO？
tags:
  - 懒猫微服
toc: true
series: 懒猫微服进阶
categories:
  - 懒猫微服
  - 进阶
date: 2026-04-09 00:00:00
---

我们移植应用的时候经常希望集成懒猫微服的SSO，在打包LPK上架应用的时候，可以使用官方的配置文件进行集成。但是我们今天想要刨根问底，让他变得通用一些。如果我本地的app想要集成懒猫微服的SSO，是不是也有其他的办法呢，毕竟是底层也是通用的OpenID Connect协议，于是便有了这个文章。


懒猫的SSO是如下配置：

```
- Issuer：https://name.heiyu.space/sys/oauth
- HTTP 监听：0.0.0.0:8000（容器内部，没有映射到宿主机端口）
- gRPC 监听：0.0.0.0:5557，开启了 reflection
- 存储：SQLite3 内存模式（:memory:），意味着重启后所有数据丢失
- Connector：使用 authproxy 类型，名为 hportal
- 没有配置任何 staticClients（OAuth client）
- 在我的网络中，IP 为 172.18.0.2
- 没有端口映射到宿主机，应该是通过反向代理（路径 /sys/oauth）访问
```

懒猫微服的SSO服务运行在5557 端口，通过 docker 网络访问地址是 172.18.0.2:5557。

可以先使用grpcurl来连接测试：

```
./grpcurl -plaintext 172.18.0.2:5557 list
```

在这里下载GRPC：
https://github.com/fullstorydev/grpcurl/releases

> gRPC 是一个**跨语言、高性能**的远程过程调用（RPC）框架，它**强依赖 HTTP/2** 协议，并默认使用 **Protobuf** 作为二进制序列化协议。它的核心优势在于利用 HTTP/2 的**多路复用**和**头部压缩**提升了性能，通过二进制传输减少了带宽消耗，并且通过**强类型的接口定义**保证了跨语言调用的严谨性。”

然后使用grpcurl对懒猫微服的SSO的API进行操作，因为是OIDC，所以这一步骤主要一个Oauth的应用， 也就是注册App name，client_id，client_secret，以及 redirect_uris。存储用的是内存 SQLite，容器重启后所有 OAuth token、授权码、已注册的 client 都会丢失。当然如果你想持久化的话，也可以写到systemd启动脚本让系统自启动拉起来。

```
./grpcurl -plaintext -d '{"client":{"id":"my-app","secret":"my-app-secret","redirect_uris":["http://localhost:8080/auth/callback"],"name":"My App"}}' 172.18.0.2:5557 api.Dex/CreateClient
```

![image.png](https://lzc-playground-1301583638.cos.ap-chengdu.myqcloud.com/guidelines/459/eef8198c-d575-4923-add2-8645a776c4f5.png "image.png")


注册之后我们把这些信息放到authlib代码里面，把SSO串起来。

```
from flask import Flask, redirect, url_for, session, jsonify
from authlib.integrations.flask_client import OAuth
from functools import wraps
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)
oauth = OAuth(app)

oauth.register(
    name='dex',
    client_id='my-app',
    client_secret='my-app-secret',
    server_metadata_url='https://aimax.heiyu.space/sys/oauth/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'},
)

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated

@app.route('/')
def index():
    user = session.get('user')
    if user:
        return f'Hello, {user.get("email", user.get("name", "unknown"))}. <a href="/profile">Profile</a> | <a href="/logout">Logout</a>'
    return 'Welcome! Please <a href="/login">Login</a>.'

@app.route('/login')
def login():
    return oauth.dex.authorize_redirect(url_for('authorize', _external=True))

@app.route('/auth/callback')
def authorize():
    token = oauth.dex.authorize_access_token()
    session['user'] = token.get('userinfo')
    session['token_info'] = {
        'access_token': token.get('access_token'),
        'id_token': token.get('id_token'),
        'token_type': token.get('token_type'),
        'expires_at': token.get('expires_at'),
    }
    return redirect(url_for('index'))

@app.route('/profile')
@login_required
def profile():
    return jsonify(userinfo=session['user'], token=session.get('token_info'))

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)

```

> 这是一个用 Flask + authlib 对接 懒猫 SSO 的最小 OIDC 客户端应用：

- 通过 懒猫 SSO（OpenID Connect Provider）实现单点登录
- oauth.register 配置 懒猫 SSO 的 OIDC 发现端点，自动获取授权/token 等地址
- login_required 装饰器做路由守卫，未登录自动跳转登录
- /login 发起 OAuth2 授权码流程，跳转到 懒猫 SSO 登录页
- /auth/callback 接收 懒猫 SSO 回调，用授权码换取 access_token 和用户信息，存入 session
- /profile 展示当前登录用户的 userinfo 和 token 信息
- /logout 清除 session 登出

整个流程就是标准的 OAuth2 Authorization Code Flow：用户点登录 → 跳 懒猫 SSO → 认证通过 → 回调拿 token → 存
session → 完成登录。

访问应用的时候，一开始会出现这个认证，这个是懒猫域名自带的认证，是为了应用放在公网的上的强制用户名密码认证，所以不要把他当作是我们本次懒猫SSO的主角。

![image.png](https://lzc-playground-1301583638.cos.ap-chengdu.myqcloud.com/guidelines/459/fcf1ae18-2b1b-4cab-a64b-8d9331f3a4d6.png "image.png")

这个才是正式的OpenID Connect，点击Grant Access，然后就可以进行认证了。

![image.png](https://lzc-playground-1301583638.cos.ap-chengdu.myqcloud.com/guidelines/459/e81d2287-cf12-470a-9c7f-3b29a7e5a165.png "image.png")


登录之后我们可以查看profile信息，以及登录之后token，这样就抓到了OIDC的去全部信息：

![image.png](https://lzc-playground-1301583638.cos.ap-chengdu.myqcloud.com/guidelines/459/a040c5d5-3fee-4a2e-96e8-10baeec4936d.png "image.png")

如果之前注册的是 localhost，但 Flask 默认用127.0.0.1 。所以会收到Unregistered redirect_uri 的错误。所以把域名改成localhost就好。

![image.png](https://lzc-playground-1301583638.cos.ap-chengdu.myqcloud.com/guidelines/459/a1e2aa7a-f09d-4d2a-bf3b-d7787ffdc35b.png "image.png")

好了，以上就是如何超越系统注册，使用API建立自己的懒猫SSO应用了，这样我们就可以不必再依赖三方的IDP了。

Less is more。

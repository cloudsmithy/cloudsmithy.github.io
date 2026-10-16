# SAML登陆Amazon Grafana

- URL: https://blog.no-claw.com/98b752fe/
- 日期: 2026-06-01
- 分类: 软件
- 标签: AWS, SSO

现在很多古老的系统还是使用SAML协议进行单点登录，

可以使用SAML-tracer抓断言，
Chrome 插件https://chromewebstore.google.com/detail/saml-tracer/mpdajninpobndbfcldcmbpnnbhibjmch

对Grafana而言，大概是这几个字段，
用户名，显示名字，登陆邮箱，如果需要整组授权，还要把组名映射到role面，SAML登陆可以以人为单位，也可以以整个组为单位，直接映射到SAML的Role，出于方便的目的，我们给到Admin。

SAML那边直接按照这个断言设置就好。

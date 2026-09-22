---
title: 在 Amazon Linux 2 上安装 PHP 7.4 与 Nginx
date: '2024-05-20 08:42:10'
updated: '2024-05-20 08:42:10'
abbrlink: 10ddce89
categories:
- 软件
- AWS
tags:
- AWS
- Linux
description: 记录 Amazon Linux 2 中 Nginx、PHP 7.4 和 PHP-FPM 的安装配置，以及用测试页面验证并清理环境的步骤。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/139052713
source_title: 在 Amazon Linux 2 上安装 PHP 7.4 和配置 Nginx 的极简教程
---

[AWS 实战与学习笔记：系列目录](/series/aws/)


##### <a id="1__0"></a>1. 更新系统

首先，更新系统软件包：


```sh
sudo yum update -y
```


##### <a id="2__Nginx_6"></a>2. 安装 Nginx

使用 Amazon Linux Extras 仓库安装 Nginx：


```sh
sudo amazon-linux-extras install nginx1 -y
```


启动并设置 Nginx 开机自启动：


```sh
sudo systemctl start nginx
sudo systemctl enable nginx
```


##### <a id="3__PHP_74_17"></a>3. 安装 PHP 7.4

启用并安装 PHP 7.4：


```sh
sudo amazon-linux-extras enable php7.4
sudo yum clean metadata
sudo yum install php-cli php-fpm php-mysqlnd -y
```


##### <a id="4__PHPFPM_25"></a>4. 配置 PHP-FPM

编辑 PHP-FPM 配置文件，将 `user` 和 `group` 设置为 `nginx`：


```sh
sudo vim /etc/php-fpm.d/www.conf
```


找到并更新以下内容：


```
user = nginx
group = nginx

listen = /var/run/php-fpm/www.sock

listen.owner = nginx
listen.group = nginx
listen.mode = 0660
```


##### <a id="5__Nginx_42"></a>5. 配置 Nginx

编辑 Nginx 的默认站点配置文件：


```sh
sudo vim /etc/nginx/conf.d/default.conf
```


替换内容如下：


```
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.php index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_pass unix:/var/run/php-fpm/www.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    location ~ /\.ht {
        deny all;
    }
}
```


##### <a id="6__Nginx_73"></a>6. 重启 Nginx

重启 Nginx 以应用更改：


```sh
sudo systemctl restart nginx
```


##### <a id="7__79"></a>7. 验证安装

创建一个 PHP 信息文件以验证 PHP 是否正常工作：


```sh
echo "<?php phpinfo(); ?>" | sudo tee /usr/share/nginx/html/info.php
```


在浏览器中访问 `http://<your-server-ip>/info.php`，如果看到 PHP 信息页面，则表示配置成功。

##### <a id="8__86"></a>8. 安全提示（可选）

验证后删除 PHP 信息文件以防止泄露敏感信息：


```sh
sudo rm /usr/share/nginx/html/info.php
```


这样你就成功地在 Amazon Linux 2 上安装了 PHP 7.4 并配置了 Nginx。如果有任何问题或需要进一步的帮助，请随时询问！

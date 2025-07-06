---
title: 老式打印机改 Airprint 之 cups
tags: 打印机
categories: 打印机
toc: true
date: 2025-01-20 00:00:00
---

很多年以前就想把家里的老式打印机改成无线，前前后后摸索了这些方案：

1. 用小白盒连接路由器：其实这个思路了网络打印机很类似，就是打印机 over IP，企业里几乎也都是这样的做法。缺点就是需要客户端安装驱动，所以相比之下就牺牲了移动端。
2. windows/MacOS 共享：由于缺少 airprint，所以 Apple 设备无法使用隔空打印。其实 Windows 的兼容性是最好的。
3. 在 OpenWrt 上安装 Cups 驱动，然后打印机接路由器当做无线使用。
   <!--more-->
   感谢这篇文章，给了我很大的帮助：https://www.bilibili.com/opus/720655857020305463

我的方案是在打印机接群晖，然后使用 Docker 运行 Cups，来支持 Airprint。

虽然群晖自己支持了 cups，但是驱动不全，联想的打印机基本没有驱动，换几个其他的打印机型号也无法正确驱动起来，反而因为指令集冲突打印机一直在出空白页。

于是，打上了 docker 的主意。。。。

因为懒，也觉得没必要做数据映射：

```bash
sudo docker run -d --name=airprint --net=host --privileged=true -e TZ="Asia/Shanghai" -e CUPSADMIN="admin" -e CUPSPASSWORD="pass" -e HOST_OS="Synology" -e TCP_PORT_631="631" chuckcharlie/cups-avahi-airprint:latest
```

从 631 端口进去 web 页，

![image-20250224165925487](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250224165925487.png)

选择识别的打印机：

![image-20250224164153529](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250224164153529.png)

填写信息，选择共享这个打印机。

![image-20250224164118890](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250224164118890.png)

没有打印机的驱动，所以我选了兄弟的。

![image-20250224164059690](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250224164059690.png)

打印机信息一览：

![image-20250224164032734](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250224164032734.png)

一个小插曲：

Mac 升级之后把高级选项弄丢了，需要在这里邮件，选择自定义工具栏

![image-20250224164235899](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250224164235899.png)

要把 logo 拖放到 2 处而不是 1 处，这个设计很反人类。

![image-20250224164221298](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250224164221298.png)

主要原因是一开始使用其他的 docker 镜像无法识别打印机，所以在这里使用 http 和 ipp 添加

http 的这么添加：

![image-20250224164439409](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250224164439409.png)

ipp 的把这串输入到浏览器,MacOS 可以，手机和 Ipad 不行：

```bash
ipp://192.168.5.171:631/printers/Lenovo_M7400_Pro
```

这俩 docker 怎么都搜不到打印机（iPhone 不行，Window 可以，Mac 可以用上述办法添加），踩了几个小时的坑：

![image-20250224164625022](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250224164625022.png)

换了最上边那个容器之后全平台都可以了：

第二个就是我的打印机，第一个是群晖自己 cups 映射出来的，有 bug systemctl stop cupsd 也关不掉，不过也没啥影响。

![image-20250224164735702](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250224164735702.png)

MacOS 结果：

![](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250224164851437.png)

Iphone 默认无法选择打印机，只能点击分享，然后下拉菜单选择打印：

![image-20250224165243296](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250224165243296.png)

Iphone 默认只支持隔空打印，但是使用 Cups 之后我们的打印机不在列表中，但是也能正常的使用了。

![image-20250224165251869](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250224165251869.png)

整了这么多测试页，主打一个折腾开心：

![image-20250224165620697](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250224165620697.png)

最后还是有一个小问题，就是打印机由于关机或者拔掉 USB 的再重启的话，这个 docker 服务没有轮训机制，所以如果不常用的话，就需要每次打开打印机之后再手动运行重启下容器。

虽然现在的打印机都支持了 Airpint，cups 虽然已经成为了历史了，这么做算是圆了一个以前折腾的梦吧。

写了一个重启 CUPS docker 的 web：

![image-20250224175113482](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250224175113482.png)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Restart Container</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f9;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
      }
      .container {
        text-align: center;
        background: white;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #333;
        margin-bottom: 1.5rem;
      }
      #restart-btn {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      #restart-btn:hover {
        background-color: #0056b3;
      }
      #status {
        margin-top: 1.5rem;
        font-size: 1.1rem;
        color: #555;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Restart Docker Container</h1>
      <button id="restart-btn">重启打印机服务</button>
      <p id="status"></p>
    </div>

    <script>
      document
        .getElementById("restart-btn")
        .addEventListener("click", async () => {
          const statusElement = document.getElementById("status");
          statusElement.textContent = "Restarting...";

          try {
            const response = await fetch("/restart", {
              method: "POST",
            });
            const result = await response.json();
            statusElement.textContent = result.message;
          } catch (error) {
            statusElement.textContent = "Failed to restart container.";
          }
        });
    </script>
  </body>
</html>
```

后端使用 Flask：

```bash
from flask import Flask, render_template, request, jsonify
import docker

app = Flask(__name__)
client = docker.from_env()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/restart', methods=['POST'])
def restart_container():
    container_name = 'airprint'  # 你要重启的容器名字
    try:
        container = client.containers.get(container_name)
        container.restart()
        return jsonify({'status': 'success', 'message': f'Container {container_name} restarted successfully!'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
```

做好容器放在群晖上，完美～

```bash
docker buildx build --platform linux/amd64 -t printer:latest --load .
docker save printer:latest > 1.tar
docker run -d --name printer_container -p 8888:8000 -v /var/run/docker.sock:/var/run/docker.sock --restart unless-stopped printer:latest
```

![image-20250224190546784](https://raw.githubusercontent.com/Xu-Hardy/picgo-imh/master/image-20250224190546784.png)

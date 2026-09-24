---
title: 在 AWS Lambda 中运行 Selenium
date: '2024-03-13 14:49:19'
updated: '2024-03-13 14:49:19'
abbrlink: 6c599e86
description: 使用容器为 AWS Lambda 打包 Chrome、驱动与 Selenium，保留 Dockerfile 和 Python 示例。
categories:
- 软件
- AWS
tags:
- AWS
- Python
- Docker
toc: true
source_platform: csdn
source_url: https://blog.csdn.net/weixin_38781498/article/details/136679854
source_title: 亚马逊云科技 Lambda 运行selenium
---

有些定时任务需要使用自动化测试的工具，如果使用亚马逊云科技 Lambda来实现这个功能的话，那么就需要图形框架，而我们知道lambda其实是一个虚拟机，而且按照系统级别依赖比较困难。所以这里选择使用容器的形式进行发布。

在dockerfile中先安装chrome和对应的驱动，然后再安装系统级别的依赖。  
Dockerfile



```docekrfile
FROM public.ecr.aws/lambda/python@sha256:d8a8324834a079dbdfc6551831325113512a147bf70003622412565f216e36e0 as build
RUN yum install -y unzip && \
    curl -Lo "/tmp/chromedriver.zip" "https://chromedriver.storage.googleapis.com/114.0.5735.90/chromedriver_linux64.zip" && \
    curl -Lo "/tmp/chrome-linux.zip" "https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Linux_x64%2F1135561%2Fchrome-linux.zip?alt=media" && \
    unzip /tmp/chromedriver.zip -d /opt/ && \
    unzip /tmp/chrome-linux.zip -d /opt/

FROM public.ecr.aws/lambda/python@sha256:d8a8324834a079dbdfc6551831325113512a147bf70003622412565f216e36e0
RUN yum install atk cups-libs gtk3 libXcomposite alsa-lib \
    libXcursor libXdamage libXext libXi libXrandr libXScrnSaver \
    libXtst pango at-spi2-atk libXt xorg-x11-server-Xvfb \
    xorg-x11-xauth dbus-glib dbus-glib-devel -y
RUN pip install selenium==4.14.0
COPY --from=build /opt/chrome-linux /opt/chrome
COPY --from=build /opt/chromedriver /opt/
COPY main.py ./
CMD [ "main.handler" ]
```




```Python
from selenium import webdriver
from tempfile import mkdtemp
from selenium.webdriver.common.by import By


def handler(event=None, context=None):
    options = webdriver.ChromeOptions()
    service = webdriver.ChromeService("/opt/chromedriver")

    options.binary_location = '/opt/chrome/chrome'
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1280x1696")
    options.add_argument("--single-process")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-dev-tools")
    options.add_argument("--no-zygote")
    options.add_argument(f"--user-data-dir={mkdtemp()}")
    options.add_argument(f"--data-path={mkdtemp()}")
    options.add_argument(f"--disk-cache-dir={mkdtemp()}")
    options.add_argument("--remote-debugging-port=9222")

    chrome = webdriver.Chrome(options=options, service=service)
    chrome.get("https://example.com/")

    return chrome.find_element(by=By.XPATH, value="//html").text
```



这个是项目地址  
https://github.com/umihico/docker-selenium-lambda

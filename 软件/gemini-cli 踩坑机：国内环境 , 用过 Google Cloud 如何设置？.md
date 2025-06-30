---
title: Gemini-cli 踩坑机：国内环境 , 用过 Google Cloud 如何设置？
tags: LLM
toc: true
categories: LLM
date: 2025-07-02 00:00:00
---

Gemini 也发布了类似的 AI 编程产品 Gemini Cli - 开源命令行 AI 工具

而且个人谷歌账号登录就能免费用！

免费额度为每分钟 60 次请求、每天 1000 次请求，是业内最高的免费额度，几乎不会遇到限制。

- 支持 Google 搜索实时联网，为模型提供外部上下文。
- 支持 MCP 和扩展，便于功能拓展。
- 可自定义提示词和指令，适应个人或团队工作流。
- 可在脚本中非交互式调用，实现自动化和集成。

### 安装 gemini-cli

先来安装 gemini-cli，其实就是一个 NPM 包。

```bash
npm install -g @google/gemini-cli
gemini
```

如果不出意外的话，执行之后会闪退。网上说需要设置 TUN 代理，甚至连命令行 export 环境变量也不行。

---

### 登录 Google SSO 后仍无法使用

然后登录 Google SSO 验证，页面会显示 Gemini Code Assist 已获得访问您账号的授权。但是其实还是不行。我们继续看。

![de7757ea56e0bf2d668093ee788b240a](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/de7757ea56e0bf2d668093ee788b240a.png)

命令行还是会得到这个报错：

![image-20250626075949247](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250626075949247.png)

---

### 设置 GOOGLE_CLOUD_PROJECT 环境变量

网上基本有这个教程：

> 用过谷歌云或者 ai studio 的，使用 gemini cli 登陆时可能会有些麻烦，可能要打开 console.cloud.google.com，找到你的 project id，然后设置 GOOGLE_CLOUD_PROJECT 环境变量，使用这种方式打开 gemini cli，就可以用了

![image-20250626080352544](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250626080352544.png)

然后执行这句，这是环境变量。(临时设置, 仅当前会话有效）

```
export GOOGLE_CLOUD_PROJECT="your-project-id"
```

如果你想让这个永久生效的话：

```
echo 'export GOOGLE_CLOUD_PROJECT="your-project-id"' >> ~/.zshrc
```

然后 source ～/.zshrc 就可以了。

---

### 报错：API 未启用

有发现新的错，

```json
 [API Error: [{
    "error": {
      "code": 403,
      "message": "Gemini for Google Cloud API has not been used in project xxxxx before or it is disabled. Enable it by visiting
  https://console.developers.google.com/apis/api/cloudaicompanion.googleapis.com/overview?project=xxxxxx then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our
  systems and retry.",
      "errors": [
        {
          "message": "Gemini for Google Cloud API has not been used in project xxxx before or it is disabled. Enable it by visiting
  https://console.developers.google.com/apis/api/cloudaicompanion.googleapis.com/overview?project=xxxx then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our
  systems and retry.",
          "domain": "usageLimits",
          "reason": "accessNotConfigured",
          "extendedHelp": "https://console.developers.google.com"
        }
      ],
      "status": "PERMISSION_DENIED",
      "details": [
        {
          "@type": "type.googleapis.com/google.rpc.ErrorInfo",
          "reason": "SERVICE_DISABLED",
          "domain": "googleapis.com",
          "metadata": {
            "activationUrl": "https://console.developers.google.com/apis/api/cloudaicompanion.googleapis.com/overview?project=xxxx",
            "containerInfo": "xxxx",
            "consumer": "projects/xxxx",
            "service": "cloudaicompanion.googleapis.com",
            "serviceTitle": "Gemini for Google Cloud API"
          }
        },
        {
          "@type": "type.googleapis.com/google.rpc.LocalizedMessage",
          "locale": "en-US",
          "message": "Gemini for Google Cloud API has not been used in project xxxx before or it is disabled. Enable it by visiting
  https://console.developers.google.com/apis/api/cloudaicompanion.googleapis.com/overview?project=xxxx then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our
  systems and retry."
        },
        {
          "@type": "type.googleapis.com/google.rpc.Help",
          "links": [
            {
              "description": "Google developers console API activation",
              "url": "https://console.developers.google.com/apis/api/cloudaicompanion.googleapis.com/overview?project=xxxx"
            }
          ]
        }
      ]
    }
  }
  ]]
```

打开报错了的网页 [https://console.developers.google.com/apis/api/cloudaicompanion.googleapis.com/overview?project=xxxxxx，比如这个，这个网页是和你的](https://console.developers.google.com/apis/api/cloudaicompanion.googleapis.com/overview?project=xxxxxx，比如这个，这个网页是和你的) ID 相关的，然后点击启用。

![d94297cbdd8e54f2d75d126f07f09bcb](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/d94297cbdd8e54f2d75d126f07f09bcb.png)

---

### 成功运行！

终于可以用了不容易。

![image-20250626075518890](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250626075518890.png)

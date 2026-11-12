---
title: Amazon Q Developer 实践：读代码与修改游戏功能
date: '2024-08-17 22:27:37'
updated: '2024-08-17 23:05:25'
abbrlink: aa5bd787
categories:
- 软件
- AWS
tags:
- AWS
- AI 编程
- Python
description: 借助 Amazon Q Developer 实验手册，在 VS Code 中解读体素游戏代码、插入功能修改，并尝试生成 Boto3 调用示例。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/141286671
source_title: 生成式AI时代，让Amazon Q 帮助我们编写代码～
---

[AWS 实战与学习笔记：系列目录](/series/aws/)


在当今云计算高速发展的时代，企业面临的技术挑战日益复杂多样。要有效应对这些挑战，企业需要一套高效、可靠的解决方案，以加速上云进程，优化业务流程，并实现更高的商业目标。Amazon Q作为一款智能编程助手，正是为解决这些痛点而设计。它不仅能够协助开发者快速生成代码，还能提供智能化的建议，从而极大提升开发效率，减少出错几率。本文将深入探讨如何利用Amazon Q在不同应用场景下快速生成高质量代码，帮助企业加速云端部署，并确保解决方案的稳健性和可扩展性。

### <a id="_3"></a>体验

亚马逊云科技提供了详尽的[Amazon Q Developer实验手册](https://dev.amazoncloud.cn/experience/cloudlab?id=6645af5700cbe054da6e747b&visitfrom=AWScloudblogger&sc_medium=owned&sc_campaign=cloudlab&sc_channel=AWScloudblogger)，帮助开发者迅速掌握Amazon Q的功能。通过模拟“我的世界”游戏代码的示例，用户可以了解如何将提示输入Amazon Q，从而得到不断优化的代码，使应用更加健壮。教程中提供了一个简易的main.py文件作为核心示例，用户通过安装必要的Python环境和依赖，以及Amazon Q的插件，可以轻松在VScode中与Amazon Q进行对话，解读代码，并根据需求进行功能扩展。

![Amazon Q Developer 实践：读代码与修改游戏功能配图](/images/migrated/04329ed615a8c1e78bf0.png)

这个是教程提供了一个模拟“我的世界”的代码，然后我们把提示给到Amazon Q，得到代码不断改善这个应用，让它变得更加健壮。这个目录结构，主要就是一个main.py的代码，其他是附件和说明文档。

![Amazon Q Developer 实践：读代码与修改游戏功能配图](/images/migrated/15270a7a5b04a8378a1b.png)

首先我们需要安装项目所需的Python环境以及相关依赖，然后在VScode中安装Amazon Q的插件。这里推荐可以使用Builder ID 的账户来登陆，这样甚至不需要注册亚马逊云科技的账户（不用担心账单问题）。

Python这边我一般习惯使用Miniconda，然后使用conda来管理虚拟环境，相对于pyenv的好处是可以多个版本共存。

![Amazon Q Developer 实践：读代码与修改游戏功能配图](/images/migrated/8fa67a4a457f32836f30.png)

完成安装插件之后，我们就可以和小Q进行对话了，我让他帮我解读了这个main文件的代码，并且总结了相关的功能。由于小Q在英文方面表现最好，所以我使用了英文进行提问。

> 得到的答案如下：

main.pyfile 是一个 Python 程序，用于创建一个基于 3D 体素的世界，类似于游戏 Minecraft。它使用 Pyglet 库来渲染图形和处理用户输入。

以下是该程序功能的概述：

**初始化世界**：该程序首先创建一个 3D 世界，其中有一层平坦的地面，由石头和草地组成。然后，它会生成由草地、沙子或砖块组成的随机山丘。

**渲染世界**：该程序使用 OpenGL 来渲染 3D 世界。它为每个可见块创建一批顶点列表，以实现高效渲染。

**处理用户输入**：该程序监听来自用户的键盘和鼠标输入。此输入可能用于控制玩家的移动和与世界的互动。

**更新世界**：根据用户的输入，该程序会更新玩家在世界中的位置和方向。它还处理物理计算，例如重力和跳跃。

**管理方块可见性**：程序会跟踪哪些方块对玩家可见，并仅渲染这些方块。它还负责添加和移除世界中的方块，并相应地更新相邻方块的可见性。

**游戏循环**：程序以连续循环的方式运行，更新世界、处理用户输入并以固定速率（根据TICKS_PER_SEC常数，为每秒 60 帧）渲染可见方块。

总体而言，该程序创建了一个简单的基于 3D 体素的世界，用户可以通过添加或移除方块来探索和修改它。它可作为类似 Minecraft 的游戏或基于体素的世界编辑器的基本框架。默认执行是这样的效果：  
 ![Amazon Q Developer 实践：读代码与修改游戏功能配图](/images/migrated/7735cf5a2b15a859527c.png)

下面是默认的**我的世界**的地图，通过运行Python代码生成，也可以使用如下命令进行交互：

> 操作方式：  
>  按下 wasd 控制角色前后左右移动  
>  按下 空格键 控制角色跳跃  
>  按下 左键 破坏方块  
>  按下 右键 放置方块  
>  按下数字 123 切换即将放置的方块  
>  按下 tab 即可切换飞行模式  
>  按下 esc 释放鼠标后，点击右上角的 X 即可关闭游戏

![Amazon Q Developer 实践：读代码与修改游戏功能配图](/images/migrated/1bd74174a3f6f7e98ce1.png)

当然我们也可以让小Q从代码中读取游戏的配置信息，以及相关的操作逻辑，如图：

![Amazon Q Developer 实践：读代码与修改游戏功能配图](/images/migrated/09af7c379d0fe20f126b.png)

在完成代码解读之后，那么我就可以让小Q帮我完成一些功能，比如在特定的函数中加入特定的逻辑，我这里询问的是“如何更改 main.py 中的 _update() 函数，以便如果玩家的 y 位置低于 -10，他们将返回到起点 (0,0,0)？”

> 回答：

**main.py**：文件没有明确定义游戏的控制，但我们可以根据代码和类似游戏中的常见惯例做出一些有根据的猜测：

**移动**：WALKING_SPEED和FLYING_SPEED等常量的存在表明玩家可以在世界中移动，可能使用W、A、S、D  
 键进行行走/飞行。

**跳跃**：代码包括JUMP_SPEED、GRAVITY和MAX_JUMP_HEIGHT的计算，表明玩家可能可以跳跃，可能使用SPACE键。

**放置/移除方块**：add_block和remove_block方法表明玩家可以从世界中添加或移除方块，可能使用鼠标或其他键，如E。

**退出游戏**：游戏循环检查ESCAPE键和QUIT事件，这可能允许玩家退出游戏。

**环顾四周**：虽然没有明确说明，但鼠标通常用于在第一人称游戏中环顾四周，因此可以合理地假设鼠标控制相机/视图方向。

但是，如果没有代码中的明确定义或其他文档，这些只是基于常见惯例的有根据的猜测。开发人员需要提供游戏的实际控制方案。

![Amazon Q Developer 实践：读代码与修改游戏功能配图](/images/migrated/3805d4011dfc3f25ac48.png)  
 在IDE的左边我们得到了代码，那么就可以在右边一建插入，把光标移动到需要插入的位置，就会提示*Amazon Q is generating…*，然后点击**Insert at cursor**，即可一键插入代码，十分方便快捷。  
 ![Amazon Q Developer 实践：读代码与修改游戏功能配图](/images/migrated/223368258ffc069e7f83.png)

至此Amaozn Q已经帮助我们实现了大部分的功能，剩下的功能大家可以自由发挥或者参考[实验手册](https://dev.amazoncloud.cn/experience/cloudlab?id=6645af5700cbe054da6e747b&visitfrom=AWScloudblogger&sc_medium=owned&sc_campaign=cloudlab&sc_channel=AWScloudblogger)继续进行继续体验。

### <a id="_89"></a>展望

Amazon Q不仅在代码优化和功能增强方面表现出色，还集成了亚马逊云近二十年的最佳实践，能够快速生成如访问S3等云端服务的相关代码。利用Boto3库，Amazon Q可以帮助开发者轻松编写从零开始的代码片段，实现与亚马逊云交互的常见任务。

![Amazon Q Developer 实践：读代码与修改游戏功能配图](/images/migrated/cd4ccd18693e6f1f1320.png)


```python
import boto3

# Create an S3 client
s3 = boto3.client('s3')

# Specify the bucket name and object key (file path in the bucket)
bucket_name = 'XXXXXXXXXXXXXXXX'
object_key = 'path/to/file.txt'

# Specify the local file path where you want to download the file
local_file_path = '/path/to/local/file.txt'

# Download the file from S3
try:
    s3.download_file(bucket_name, object_key, local_file_path)
    print(f'File downloaded successfully from S3 to {local_file_path}')
except Exception as e:
    print(f'Error downloading file from S3: {e}')
```


![Amazon Q Developer 实践：读代码与修改游戏功能配图](/images/migrated/a6b9b0e845f0134b9bb8.png)

以下是代码的细分：

首先，我们使用\*\*boto3.client(‘s3’)\*\*创建一个 S3 客户端。

我们为要下载的文件指定存储桶名称和对象键（存储桶内的文件路径）。

我们指定要保存下载文件的本地文件路径。

我们使用 S3 客户端的**download_file**方法，将存储桶名称、对象键和本地文件路径作为参数传递。

如果下载成功，我们将打印一条成功消息。如果出现错误，我们将打印错误消息。

确保将\*\*‘your-bucket-name’**替换为您的 S3 存储桶的实际名称，并将**’path/to/file.txt’\*\*替换为您要下载的对象的正确路径和文件名。

> 注意：此示例假设您已在计算机上正确配置亚马逊云凭证。如果没有，您需要在运行此代码之前设置您的亚马逊云凭证。您可以通过设置ACCESS_KEY_ID和SECRET_ACCESS_KEY环境变量，或者使用亚马逊云凭证文件或 IAM 角色来执行此操作。

参考来源

1. [用SDK于 Python 的 Amazon S3 示例 (Boto3)](https://docs.aws.amazon.com/zh_cn/code-library/latest/ug/python_3_s3_code_examples.html)

以上内容来自《手搓游戏 —— 生成式 AI 助手 Amazon Q Developer 初体验》，,欢迎大家多多尝试, 使用生成式AI快速构建自己的应用, 为自己的项目带来全新的可能性。

![Amazon Q Developer 实践：读代码与修改游戏功能配图](/images/migrated/f406b48fa9f7af45c245.png)

### <a id="_143"></a>总结

总的来说，Amazon Q作为现代云计算时代的智能编程助手，凭借其强大的功能和便捷的用户体验，帮助企业和开发者更加高效地应对日益复杂的技术挑战。利用Amazon Q，企业能够在快速上云的过程中显著减少开发成本、提升代码质量，并推动业务创新。展望未来，Amazon Q将继续进化，推出更多功能支持，为用户提供更加简单、高效的上云解决方案，使企业能够在激烈的市场竞争中占据优势。

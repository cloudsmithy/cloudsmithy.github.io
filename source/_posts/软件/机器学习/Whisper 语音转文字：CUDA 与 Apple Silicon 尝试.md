---
title: Whisper 语音转文字：CUDA 与 Apple Silicon 尝试
date: '2024-04-20 23:50:33'
updated: '2024-04-23 12:08:44'
abbrlink: f5d64091
categories:
- 软件
- 机器学习
tags:
- AI
- Python
- LLM
description: 记录 Whisper 的安装、模型选择、GPU 占用和字幕清洗，并对照 whisper.cpp 在 Apple Silicon 上的转写体验。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/138014910
source_title: openai whisper 语音转文字尝鲜
---

[Python 编程与环境笔记：系列目录](/series/python/)


最近大模型很火，也试试搭一下，这个是openai 开源的whisper，用来语音转文字。

#### <a id="_2"></a>安装

按照此文档安装，个人习惯先使用第一个pip命令安装，然后再用第二个安装剩下的依赖（主要是tiktoken）

https://github.com/openai/whisper?tab=readme-ov-file


```bash
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple ## 清华源
pip install -U openai-whisper #安装pypi包（这个缺少tiktoken
pip install git+https://github.com/openai/whisper.git  #安装最新更新以及依赖
pip install --upgrade --no-deps --force-reinstall git+https://github.com/openai/whisper.git #更新用这个
```


安装ffmpeg，转码用


```bash
# on Ubuntu or Debian
sudo apt update && sudo apt install ffmpeg

# on Arch Linux
sudo pacman -S ffmpeg

# on MacOS using Homebrew (https://brew.sh/)
brew install ffmpeg

# on Windows using Chocolatey (https://chocolatey.org/)
choco install ffmpeg

# on Windows using Scoop (https://scoop.sh/)
scoop install ffmpeg
```


#### <a id="_33"></a>测试模型

默认模型是base，模型和需要的显存大小是  
![Whisper 语音转文字：CUDA 与 Apple Silicon 尝试配图](/images/migrated/db4ef81b8b9172e610ae.png)

(base) ubuntu@ip-10-0-29-42:~$ time whisper 1.mp4  
wDetecting language using up to the first 30 seconds. Use `--language` to specify the language  
Detected language: Chinese  
![Whisper 语音转文字：CUDA 与 Apple Silicon 尝试配图](/images/migrated/e76699db228f5113efad.png)  
使用 --model 指定模型，这里使用最大的模型


```bash
(base) ubuntu@ip-10-0-29-42:~$ time whisper 1.mp4 --model large
```


Detecting language using up to the first 30 seconds. Use `--language` to specify the language  
Detected language: Chinese![Whisper 语音转文字：CUDA 与 Apple Silicon 尝试配图](/images/migrated/4371a0238be2c72ef236.png)  
大模型的显存占用如下：  
![Whisper 语音转文字：CUDA 与 Apple Silicon 尝试配图](/images/migrated/2c428f9c6e5770073e27.png)  
这个默认使用cuda 进行，但是并不支持Apple Silicon的MPS。

从htop看还是使用的CPU进行的推理，受用–device mps也不支持。  
![Whisper 语音转文字：CUDA 与 Apple Silicon 尝试配图](/images/migrated/c33f5768818fc9bcc584.png)

#### <a id="_54"></a>脚本清洗

然后使用脚本清洗出现的时间线以及多出来的空格换行。


```bash
def remove_timestamps_and_empty_lines(input_file_path, output_file_path):
    # Read the file
    with open(input_file_path, "r", encoding="utf-8") as file:
        lines = file.readlines()

    # Remove the timestamp from each line and filter out empty lines
    cleaned_lines = [
        line.strip().split("] ", 1)[-1].strip()  # Split and remove the timestamp
        for line in lines if "] " in line and line.strip().split("] ", 1)[-1].strip()  # Check if there is text after removing timestamp
    ]

    # Write the cleaned, non-empty lines to a new file
    with open(output_file_path, "w", encoding="utf-8") as file:
        file.write("，".join(cleaned_lines))

# Example usage
input_file_path = '1.txt'  # Specify the path to your input file
output_file_path = '2.txt'  # Specify the path to your output file

remove_timestamps_and_empty_lines(input_file_path, output_file_path)
```


#### <a id="Apple_Silicon_81"></a>利用Apple Silicon

为了不浪费Apple Silicon的性能，查了youtube发现一个可以使用Apple 显存进行加速的项目。https://www.youtube.com/watch?v=lPg9NbFrFPI

Github如下：  
https://github.com/ggerganov/whisper.cpp

安装如下：


```bash
# Install Python dependencies needed for the creation of the Core ML model:
pip install ane_transformers
pip install openai-whisper
pip install coremltools


# using Makefile
make clean
WHISPER_COREML=1 make -j
```



```bash
### 下载模型
make base
### Generate a Core ML model.
./models/generate-coreml-model.sh base

# This will generate the folder models/ggml-base.en-encoder.mlmodelc  
```


各个模型的显存占用与模型大小：![Whisper 语音转文字：CUDA 与 Apple Silicon 尝试配图](/images/migrated/728620d97c91bffbfeec.png)  
同样推理一个两个半小时的视频，时间如下：


```bash
# 先用ffmpeg转码
ffmpeg -i 1.mp4 -ar 16000 -ac 1 output.wav

# 执行ggml-{model}.bin
time ./main -m models/ggml-base.bin -l zh -osrt -f 'output.wav'
```


这个视频在Tesla T4的卡上base模型要17分钟，large 1小时。（传统wispper）

#### <a id="Tiny210S_127"></a>Tiny：210S

![Whisper 语音转文字：CUDA 与 Apple Silicon 尝试配图](/images/migrated/b663f29f1df2b184eb97.png)

#### <a id="base301S_129"></a>base：301S

![Whisper 语音转文字：CUDA 与 Apple Silicon 尝试配图](/images/migrated/57291ea82979e05225e0.png)

large ：

V3最后输出的东西不对，V1和V2都还可以

总体三个时间差不多

![Whisper 语音转文字：CUDA 与 Apple Silicon 尝试配图](/images/migrated/2501c807eca612bd7d44.png)

**pip install ffmpeg-python**


```bash
import os
import subprocess
import ffmpeg


def convert_to_wav(source_file, target_file):
    """使用 ffmpeg 将音频或视频文件转换为 WAV 格式，自动覆盖现有文件。"""
    ffmpeg.input(source_file).output(target_file, ar='16000', ac=1).global_args('-y').run()


def process_audio_with_main(audio_file, output_dir):
    """使用 main 程序处理音频文件并提取文字到指定目录。"""
    audio_base_name = os.path.basename(audio_file)
    # output_file = os.path.join(output_dir, audio_base_name.replace('.wav', '.vtt'))
    command = [
        '/Desktop/whisper.cpp/main',  # 程序名
        '-m', '/Users/Desktop/whisper.cpp/models/ggml-large-v3.bin',  # 模型文件路径
        '-l', 'zh',  # 语言选项
        '-osrt',  # 输出选项
        '-f', audio_file,
        '-of', f'{output_dir}/{audio_base_name}',  # 输入文件参数
        '-otxt'  # 输出文件参数
    ]
    print(command)
    subprocess.run(command)


def ensure_dir(directory):
    """确保目录存在，如果不存在则创建它。"""
    if not os.path.exists(directory):
        os.makedirs(directory)


def find_and_process_files(directory):
    """遍历目录，查找所有 MP3 和 MP4 文件，转换并处理它们。"""
    wav_dir = os.path.join(directory, 'wav')
    vtt_dir = os.path.join(directory, 'vtt')
    ensure_dir(wav_dir)
    ensure_dir(vtt_dir)

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.mp3', '.mp4')):
                full_path = os.path.join(root, file)
                print(full_path)
                wav_path = os.path.join(wav_dir, os.path.splitext(file)[0] + '.wav')
                print(f"Converting {full_path} to {wav_path}")
                convert_to_wav(full_path, wav_path)
                print(f"Processing {wav_path}")
                print("1", wav_path, "0", vtt_dir)
                process_audio_with_main(wav_path, vtt_dir)


# 指定需要遍历的文件夹路径
directory_path = '/Desktop/dy'
find_and_process_files(directory_path)
```

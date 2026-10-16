---
title: Python 依赖迁移：导出与安装 requirements.txt
date: '2019-06-28 19:26:11'
updated: '2026-09-23'
abbrlink: 'cb008009'
categories:
  - 软件
  - 编程
tags:
  - Python
description: 使用 pip freeze 导出 Python 包和版本，再通过 requirements.txt 安装到目标环境，说明它与完整环境备份的区别。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/94037008
source_title: python环境迁移
---

换机器或者重建 Python 环境时，可以先把已安装的包和版本导出来，再在目标环境里安装。原笔记只有两条命令，这里补上它们分别在哪个环境执行。

## 导出依赖

先激活要迁移的 Python 环境，然后执行：

```bash
python -m pip freeze > requirements.txt
```

这里用 `python -m pip`，让 pip 跟随当前 `python` 解释器，减少机器上同时装了多套 Python 时用错 pip 的机会。

## 安装到目标环境

把 `requirements.txt` 复制到目标机器，准备好 Python 环境后执行：

```bash
python -m pip install -r requirements.txt
```

安装完可以检查依赖关系：

```bash
python -m pip check
```

这个检查能发现包之间的版本依赖问题，但不能代替运行自己的程序。

`requirements.txt` 记录的是 Python 包列表，不包含 Python 解释器、系统动态库、环境变量和项目数据。如果原环境里安装了本地包，导出的文件也可能带有本地路径，搬到另一台机器前需要检查。跨系统或跨 Python 版本迁移时，还要确认这些包有没有对应的可安装版本。

关于创建和隔离环境，可以接着看站内的 [Python 学习笔记目录](/series/python/)。

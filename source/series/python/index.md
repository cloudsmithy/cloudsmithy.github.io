---
title: Python 编程与环境笔记
date: '2026-09-22 18:44:44'
description: 从字符串、容器、函数与字典练习，到 Jupyter、NumPy、Pandas 和环境管理，汇集 Python 学习与实用笔记。
aside: false
toc: true
comments: false
---

这里收录从 2018 年开始记录的 Python 练习和工具用法。先查基本语法，再看具体的环境管理与程序运行问题。部分文章对照 Python 2 和 Python 3，阅读时留意文章日期与代码环境。

## 语法与练习

- [Python 调用 Java 与 C++ 的尝试](/fea420b7/) — 在 Ubuntu 16.04 中使用 JPype 从 Python 调用 Java，并将 C++ 编译为共享库后由 Python 加载调用。
- [在 Jupyter Notebook 中使用 Matplotlib 画图](/aee2a967/) — 保留使用 Matplotlib 绘制折线图和条形图的示例代码与结果，作为 Jupyter Notebook 绘图练习笔记。
- [Python 字符串笔记：换行与 format 格式化](/acdf14a8/) — 通过示例记录多行字符串、format 参数替换以及使用字典进行字符串格式化的方法。
- [Python 函数笔记：参数、global 与 lambda](/15c7745a/) — 整理函数调用、默认参数、关键字参数、global 作用域以及 lambda 表达式，保留练习代码与输出。
- [Python 小语法：链式比较、ASCII 与科学计数法](/2e034e73/) — 记录 Python 链式比较、ASCII 字符转换、科学计数法和类型检查的几组入门练习。
- [测试 Python 程序运行时间](/5360c45b/) — 保留一次 Python 计时实验的代码和结果，对照输出操作以及整数、Decimal 运算的时间开销。
- [Python 容器笔记：list、dict、set 与 tuple](/dae402df/) — 按初始化、增删改查、遍历和排序整理 Python 列表、字典、集合与元组的使用代码。
- [Python 字典练习：遍历、累加与寻找最小值](/4c6a71a3/) — 用交通费用的例子练习列表转字典、重复键累加、处理 KeyError，并使用 itemgetter 找到费用最小的项目。
- [Python zip 与星号表达式：打包、解包和版本差异](/a00c01cd/) — 记录 zip 的打包与解包、星号表达式的参数接收，以及 Python 2 和 Python 3 中 zip 返回结果的区别。
- [Python 列表 sort 与 sorted 的区别](/6230851d/) — 通过示例对照列表 sort 方法和 sorted 函数，观察原列表是否改变，以及 reverse 参数的倒序用法。
- [Python 备忘单：基础语法、NumPy 与 Pandas](/bf379e5e/) — 按主题整理 Python 字符串、容器、JSON、循环、文件、函数与日期时间示例，并收录 NumPy 数组和 Pandas 数据处理用法。

## 环境与运行

- [Python 依赖迁移：导出与安装 requirements.txt](/cb008009/) — 从原环境导出依赖，在目标环境安装，并检查包版本与系统依赖的边界。
- [Ubuntu 配置 JDK 8 环境变量](/08615b14/) — 配合 Python 调用 Java 的笔记，检查 JAVA_HOME、PATH 与配置文件的生效方式。
- [pipx 与 conda：应用隔离和 Python 环境管理](/7e63cf3c/) — 整理 pipx 安装命令行应用和 conda 管理开发环境的命令，比较两者的用途、依赖隔离及环境导入导出方式。
- [Python 项目如何忽略和清理 __pycache__](/2eb9cbc6/) — 解释 __pycache__ 和 pyc 文件的来源，记录 .gitignore 配置、取消 Git 跟踪和清理本地缓存的操作。
- [使用 systemd 设置 Python 程序开机启动](/a6528011/) — 为 Python 脚本编写 systemd 服务文件，设置运行用户、自动启动和重启行为，并记录 crontab 的 @reboot 用法。

## 继续学习

- [机器学习课程笔记](/series/machine-learning/) — 从数据探索、回归和分类继续读到聚类与图学习。
- [AWS 实战与学习笔记](/series/aws/) — 阅读 Python 在云端部署和服务调用中的使用记录。

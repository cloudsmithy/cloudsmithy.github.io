---
title: Ubuntu 配置 JDK 8 环境变量
date: '2019-09-13 19:54:32'
updated: '2026-09-23'
abbrlink: '08615b14'
categories:
  - 软件
  - 编程
tags:
  - Linux
  - Java
description: 记录在 Ubuntu 的 Bash 中配置 JDK 8 的 JAVA_HOME 和 PATH，并检查 java、javac 是否指向解压后的 JDK。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/100809590
source_title: ubuntu jdk环境变量
---

这是 2019 年手动解压 JDK 8 后配置环境变量的笔记。当时用的是 `jdk1.8.0_221`，下面的目录需要换成自己的安装位置。

只给当前用户的交互式 Bash 使用时，编辑 `~/.bashrc`：

```bash
vi ~/.bashrc
```

在文件末尾添加：

```bash
export JAVA_HOME=/home/florian/JDK/jdk1.8.0_221
export JRE_HOME=${JAVA_HOME}/jre
export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
export PATH=${JAVA_HOME}/bin:$PATH
```

保存后，让当前 Bash 重新读取同一个文件：

```bash
source ~/.bashrc
```

原笔记写成了“修改 `/etc/profile`，然后 `source ~/.bashrc`”，前后不是同一个文件，这里已经统一。

检查版本和实际使用的可执行文件：

```bash
java -version
javac -version
command -v java
command -v javac
```

`JAVA_HOME` 指向 JDK 根目录，`PATH` 中加入的是它下面的 `bin`。这里把该目录放在原有 `PATH` 前面，是为了优先找到这套 JDK。

`JRE_HOME` 和 `CLASSPATH` 保留了当时的 JDK 8 配置。一般只是从命令行调用 `java`、`javac` 时，并不需要全局设置 `CLASSPATH`；具体项目的类路径可以通过构建工具或 `-cp` 指定。新版 JDK 的目录结构也可能不同，不要直接照搬 `jre` 子目录。

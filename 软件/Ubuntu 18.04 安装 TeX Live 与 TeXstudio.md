---
title: Ubuntu 18.04 安装 TeX Live 与 TeXstudio
date: '2019-09-12 17:05:44'
updated: '2019-09-12 17:05:44'
abbrlink: 7fa7f203
categories:
- 软件
tags:
- LaTeX
- Linux
description: 在 Ubuntu 18.04 中安装 TeX Live 和 TeXstudio，设置 XeLaTeX 编译器及中文界面，并保留当时的配置命令。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/100777476
source_title: ubuntu18.04安装latex（texlive）
---

## <a id="texlive_0"></a>安装texlive


```
sudo apt-get install texlive-full
```


## <a id="texstudio_4"></a>安装texstudio

因为texstudio是在ubuntu下实在太好用，就不折腾vim了。


```
sudo apt-get install texstudio
```


TeXstudio中在Options->Configure TeXstudio->Build->Default Compiler中更改默认编译器为XeLaTeX。

Options->Configure TeXstudio->General->Language更改为zh-CN。


```
\documentclass[utf8]{ctexart}

\title{深度学习}
\author{匿名}

\begin{document}
	\maketitle
\end{document}
```

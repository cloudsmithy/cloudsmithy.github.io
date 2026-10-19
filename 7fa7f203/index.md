# Ubuntu 18.04 安装 TeX Live 与 TeXstudio

- URL: https://blog.no-claw.com/7fa7f203/
- 日期: 2019-09-12
- 分类: 软件
- 标签: Linux, LaTeX

## 安装texlive

```
sudo apt-get install texlive-full
```

## 安装texstudio

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

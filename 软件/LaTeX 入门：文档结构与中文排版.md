---
title: LaTeX 入门：文档结构与中文排版
date: '2019-06-22 16:30:10'
updated: '2019-06-22 16:30:10'
abbrlink: 144d3c45
categories:
- 软件
tags:
- LaTeX
description: 从一份中文 LaTeX 示例开始，认识文档类型、宏包、标题、作者和三级章节命令。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/93335718
source_title: latex入门
---

我们先看下latex的语法，我用的是cetex，对中文支持稍微好一点。


```
\documentclass{article}

\usepackage{CJK}
\begin{CJK*}{GBK}{song}
\title{\Large Latex入门}
\author{作者}

\begin{document}
\maketitle
\section{一级标题}
这里是一机标题下边的内容
    \subsection{二级标题}
    这里是二级标题
        \subsubsection{三级标题}
    这里是二级标题
求和公式$\sum_I^{n}$
\begin{thebibliography}{qw}
\cite{abc}
%\bibitem{liu} 刘海洋. \LaTeX 入门 [M]. 北京: 电子工业出版社, 2013.
%\bibitem{hu}  胡伟. \LaTeX 2e完全学习手册(第二版). 北京: 清华大学出版社, 2013.
\end{thebibliography}
\end{CJK*}

\end{document}
```


\documentclass{article}是文档类型，这里是文章，还可以定义的book  
\usepackage{CJK}这里加载使用中文的宏包  
\title{\Large Latex入门} 题目  
\author{作者} 作者  
文章内容放在\begin{document}和\end{document}之间

分级标题最多创建3层

\section{一级标题}  
这里是一机标题下边的内容  
\subsection{二级标题}  
这里是二级标题  
\subsubsection{三级标题}  
这里是二级标题

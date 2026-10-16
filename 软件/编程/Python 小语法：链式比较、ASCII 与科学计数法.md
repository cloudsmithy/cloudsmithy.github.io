---
title: Python 小语法：链式比较、ASCII 与科学计数法
date: '2018-05-02 21:33:00'
updated: '2018-05-02 21:33:00'
abbrlink: 2e034e73
categories:
- 软件
- 编程
tags:
- Python
- 开发
description: 记录 Python 链式比较、ASCII 字符转换、科学计数法和类型检查的几组入门练习。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/80172412
source_title: python的佛性
---

[Python 编程与环境笔记：系列目录](/series/python/)


**简单介绍一点python的佛性。**

1. python开始支持了连不等式,不用再拆开了。


```
weight = 30

if 18.5 < weight  < 25:
    print("BMI is considered 'normal'")

if weight > 18.5 and weight < 25:
	print("normal")

print(weight)
```


**结果：**  
30


```

if 18.5 < weight  < 25:
    print("BMI is considered 'normal'")

if weight > 18.5 and weight < 25:
	print("normal")

print(weight)
```


**结果：**  
BMI is considered ‘normal’  
normal  
20

![Python 小语法：链式比较、ASCII 与科学计数法配图](/images/migrated/e31527c38f0d86540030.png)

2. python 查看ASCII（美国信息交换标准代码）


```
print(ord('0'))
print(ord('a'))
print((ord('A')))
```


![Python 小语法：链式比较、ASCII 与科学计数法配图](/images/migrated/edd5297ff28e01b79b90.png)

3.科学技术法 type()


```
type(1e-7)
```


![Python 小语法：链式比较、ASCII 与科学计数法配图](/images/migrated/4f66637d1f93d2235c80.png)

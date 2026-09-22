---
title: Python 字符串笔记：换行与 format 格式化
date: '2018-05-03 17:14:35'
updated: '2018-05-03 17:14:35'
abbrlink: acdf14a8
categories:
- 软件
- 编程
tags:
- Python
- 开发
description: 通过示例记录多行字符串、format 参数替换以及使用字典进行字符串格式化的方法。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/80183074
source_title: python中str的特性
---

[Python 编程与环境笔记：系列目录](/series/python/)


<a id="换行字符串"></a>

##### 换行字符串


```
how_many_snakes = 1
snake_string = """
Welcome to Python3!

             ____
            / . .\\
            \  ---<
             \  /
   __________/ /
-=:___________/

<3, Juno
"""


print(snake_string * how_many_snakes)
```


![Python 字符串笔记：换行与 format 格式化配图](/images/migrated/cd05d3ef0e3fabf63bb4.png)

<a id="format的格式化"></a>

##### format的格式化


```
a = .5
print(a)
print("a={}".format(a))
print("a={:2%}".format(a))
```


![format的格式化](/images/migrated/01ccda511d1404907818.png)

<a id="format与dict"></a>

##### format与dict


```
dict = {'name': 'juno', 'color': 'blue', 'age': 'unknown'}
print(dict)
print("name={name}, color={color}, age={age}".format(**dict))
```


![Python 字符串笔记：换行与 format 格式化配图](/images/migrated/8cfda4c0e1e48ed6060e.png)

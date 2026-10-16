---
title: Python 函数笔记：参数、global 与 lambda
date: '2018-05-02 23:34:08'
updated: '2018-05-02 23:34:08'
abbrlink: 15c7745a
categories:
- 软件
- 编程
tags:
- Python
- 开发
description: 整理函数调用、默认参数、关键字参数、global 作用域以及 lambda 表达式，保留练习代码与输出。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/80173850
source_title: python函数小结
---

[Python 编程与环境笔记：系列目录](/series/python/)


<a id="1函数关键字"></a>

##### 1.函数关键字

一般的函数调用


```
import math 
def get_cylinder(height, radian):
    return height*math.pi*radian**2

print(get_cylinder(1,1))
```


![Python 函数笔记：参数、global 与 lambda配图](/images/migrated/bb5270d5750cf00eecd2.png)

含有默认值的参数


```
import math 
def get_cylinder(height, radian=1):
    return height*math.pi*radian**2

print(get_cylinder(1))
```


![Python 函数笔记：参数、global 与 lambda配图](/images/migrated/f3cbfd16594bfd231a21.png)


```
import math 
def get_cylinder(height=1, radian=1):
    return height*math.pi*radian**2

print(get_cylinder())
```


![Python 函数笔记：参数、global 与 lambda配图](/images/migrated/9b18e66198dbc3fd1c07.png)   
指定关键字，当然修改关键字默认值只能放在后边啦，放在前边报错的啊！


```
import math 
def get_cylinder(height=1, radian=1):
    return height*math.pi*radian**2

print(get_clinder(2, radian=3))
```


![Python 函数笔记：参数、global 与 lambda配图](/images/migrated/0ca3180b3ff5bbe660b8.png)

<a id="2函数更改全局作用域"></a>

##### 2.函数更改全局作用域

若想在函数内更改全局变量，需要用到global关键字。


```
x = 2
def printx(x):
    x = 0
    print("inside_function: ", x)

printx(x)
print("out_of_function: ", x)
```



```
x = 2
def printx():
    global x
    x = 0
    print("inside_function: ", x)

printx()
print("out_of_function: ", x)
```


![Python 函数笔记：参数、global 与 lambda配图](/images/migrated/432f585b09d4b2335430.png)

<a id="3lambda-表达式"></a>

##### 3.lambda 表达式


```
import math
get_cylinder = lambda height, radian: height*math.pi*radian**2

print(get_cylinder(1,1))
```


![image.png](/images/migrated/16f9ebd5477aede782b9.png)

如果lambda表达式使用函数参数默认值的话，默认值要放在最后

![Python 函数笔记：参数、global 与 lambda配图](/images/migrated/fa444f19baa8e8fc6a29.png)

一旦指定了关键字，参数顺序就不那么重要了。


```
import math

get_cylinder = lambda height=1, radian=1: height*math.pi*radian**2
print(get_cylinder(radian=2, height=3))
```


![Python 函数笔记：参数、global 与 lambda配图](/images/migrated/4e327ffdb726887bffd1.png)

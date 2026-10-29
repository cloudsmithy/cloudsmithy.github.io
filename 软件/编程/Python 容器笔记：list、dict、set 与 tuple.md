---
title: Python 容器笔记：list、dict、set 与 tuple
date: '2018-04-24 20:33:04'
updated: '2018-04-24 20:33:04'
abbrlink: dae402df
categories:
- 软件
- 编程
tags:
- Python
- 开发
description: 按初始化、增删改查、遍历和排序整理 Python 列表、字典、集合与元组的使用代码。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/80070140
source_title: python中list，dict，set的总结
---

[Python 编程与环境笔记：系列目录](/series/python/)


![Python 容器笔记：list、dict、set 与 tuple配图](/images/migrated/c8723a5a296434ccae12.png)

![summary](/images/migrated/718fbb6213644fc0a6c9.jpg)

<a id="list"></a>

#### list

1. 基本特性

> 有序可变,元素可以是任何已知的数据结构

1. 初始化   
     `a = []   
    a = [1,3,54]   
    a = [1, '34', (2,4)]`
2. 增删改查


```
a.append()
a.extend()
a.pop()
a.pop(index)
a[0] = 'need'
a.clear()
x in a
```


1. 遍历


```
for x in list:
    print(i)
```


1. 最大，最小，排序   
    max()   
    min()   
    sorted()   
    [sorted与sort区别](https://blog.csdn.net/weixin_38781498/article/details/79959089)

<a id="dict"></a>

#### dict

1. 基本特性

> key-value 键值映射，字典本身可变，键必须可哈希。Python 3.7 及以后保证保留插入顺序。

1. 初始化


```
a = {}
a = {'name': 'dog', 'color': black}
```


1. 增删改查


```
a[age] = 18
a.pop(key)
del a[key]
```


![Python 容器笔记：list、dict、set 与 tuple配图](/images/migrated/a6f32b89df517efc3fb5.png)   
 4. 遍历


```
a = {'name': 'dog', 'color': 'black'}
a['age'] = 18

for key in a:
    print(key)
    print(a[key])

for key, value in a.items():
    print(key, value)
```


![Python 容器笔记：list、dict、set 与 tuple配图](/images/migrated/1c7eedec48804cee76b5.png)

1. 最大，最小，排序


```
import operator

my_dict = { 'key1': 3, 'key2':2, 'key3': 1,'key0':0}
print(my_dict)
print("===================")
print("sorted")
print()
print("1.",sorted(my_dict))#按照key排序
print("2.",sorted(my_dict, key=my_dict.get))#按照value排序，输出list
print("3.",sorted(my_dict.items(), key=lambda x: x[1]))#按照value排序，输出dict
print("4.",sorted(my_dict.items(), key=operator.itemgetter(1)))#按照value排序，输出dict
print()

print("===================")
print("min ~~ max")
print()
print("1.",max(my_dict))#按照key取最大值
print("2.",max(my_dict, key=my_dict.get))#按照value取最大值
print("3.",max(my_dict.items(), key=lambda x: x[1]))#按照value排序，返回dict
print("4.",max(my_dict.items(), key=lambda x: x[1])[0])#按照value排序，返回dict第一个元素
print("5.",max(my_dict.items(), key=operator.itemgetter(1)))#按照value排序，返回dict
print("6.",max(my_dict.items(), key=operator.itemgetter(1))[0])
```


![Python 容器笔记：list、dict、set 与 tuple配图](/images/migrated/a7eb53423756f4cdf305.png)

![Python 容器笔记：list、dict、set 与 tuple配图](/images/migrated/97d3a76c52e18ea9e95f.png)

<a id="set收集元素"></a>

#### set（收集元素）

1. 基本特性

> 元素唯一，无序，可变

1. 初始化


```
a = set()   #如果a = {}会创建成dict
a = set(list)
a = set(tuple)
```


1. 增删改查


```
a.add()
a.update([1,2,3,1,2,3])
a.pop()#随机删除一个元素
a.remove(key)
a.clear()
```


1. 遍历


```
for element in a:
    print(element)
```


1. 最大，最小，排序

<a id="tuple"></a>

#### tuple

1.赋值


```
a = 2, 3
print(a)
print(type(a)
```


![Python 容器笔记：list、dict、set 与 tuple配图](/images/migrated/d3709e9391eafdea5fa1.png)

2.元组解包


```
demension = 52, 40, 100
length, width, height = demension
print("The dimensions are {} x {} x {}".format(length, width, height))
print("The dimensions are {} x {} x {}".format(*demension))
```


![Python 容器笔记：list、dict、set 与 tuple配图](/images/migrated/004a5dfca61caa63c03e.png)

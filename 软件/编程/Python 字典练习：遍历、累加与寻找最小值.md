---
title: Python 字典练习：遍历、累加与寻找最小值
date: '2018-04-18 21:13:12'
updated: '2018-04-18 21:13:12'
abbrlink: 4c6a71a3
categories:
- 软件
- 编程
tags:
- Python
- 开发
description: 用交通费用的例子练习列表转字典、重复键累加、处理 KeyError，并使用 itemgetter 找到费用最小的项目。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/79996955
source_title: python遍历字典以及list转化字典，求字典元素最大值
---

[Python 编程与环境笔记：系列目录](/series/python/)


**我们先来看这样一个故事：**

程序员加班回家，已经是深夜了，加上路途遥远，只好坐车回去，他现在想到的交通工具如下。


```
costs = ['bike', 'car', 'bus', 'light railway']
```


程序员想了想：


```
for cost in costs:
    print(cost)
```


各种交通工具的价格已经贴在墙上了：


```
costs = [['bike', 2], ['car', 10], ['bus', 5], ['light railway', 6]]
```


于是他又尝试了之前的方法：


```
for cost in costs:
    print(costs)
```


得到了如下结果：   
![Python 字典练习：遍历、累加与寻找最小值配图](/images/migrated/a94f67e71cc96c307d98.png)   
但是这次他对结果似乎不太满意，他要把这个变成字典形式。


```
costs = [['bike', 2], ['car', 10], ['bus', 5], ['light railway', 6]]
costs_dcit = {}
for cost in costs:
    tool = cost[0]
    money = cost[1]
    costs_dcit[tool] = money
print(costs_dcit)
```


![Python 字典练习：遍历、累加与寻找最小值配图](/images/migrated/983a26aeeadfa1a6d51a.png)   
看到这他似乎终于露出了笑容，不过又遇到了新的问题。由于雨天的原因，自行车坏了，还要花费额外的5元去换一个零件，而到了深夜，出租车也开始涨价了。   
结果就变成这个样子：


```
costs = [['bike', 2], ['car', 10], ['bus', 5], ['light railway', 6], ['bike', 5], ['car', 5]]
print(costs)
```


![Python 字典练习：遍历、累加与寻找最小值配图](/images/migrated/53757b7f355a301fb6ef.png)

于是他又按照原来的方法计算：


```
costs = [['bike', 2], ['car', 10], ['bus', 5], ['light railway', 6], ['bike', 5], ['car', 5]]
costs_dcit = {}
for cost in costs:
    tool = cost[0]
    money = cost[1]
    costs_dcit[tool] = money
print(costs_dcit)
```


![Python 字典练习：遍历、累加与寻找最小值配图](/images/migrated/4f6cdb6b93d5741bcd6a.png)   
结果发现总是哪里不对劲，原来后边的添加的数据把之前的给覆盖掉了，那要怎么办呢？聪明的程序员马上就有了结果。


```
costs = [['bike', 2], ['car', 10], ['bus', 5], ['light railway', 6], ['bike', 5], ['car', 5]]
costs_dcit = {}
for cost in costs:
    tool = cost[0]
    money = cost[1]
    costs_dcit[tool] = costs_dcit[tool] + money 
print(costs_dcit)
```


![Python 字典练习：遍历、累加与寻找最小值配图](/images/migrated/4fb0d242e369753ef205.png)

但是，貌似出了一点小bug，有个KeyError: ‘bike’的报错，原来一开始没有定义costs_dcit[tool]。是这样报的错啊。   
程序员想了想，马上想出了解决方案：如果一个key之前在字典里面，就用这样的累加方法。如果不在，就给他定义赋值。


```
costs = [['bike', 2], ['car', 10], ['bus', 5], ['light railway', 6], ['bike', 5], ['car', 5]]
costs_dcit = {}
for cost in costs:
    tool = cost[0]
    money = cost[1]
    if tool in costs_dcit:
        costs_dcit[tool] = costs_dcit[tool] + money 
    else:
        costs_dcit[tool] = money
print(costs_dcit)
```


![Python 字典练习：遍历、累加与寻找最小值配图](/images/migrated/d569131f89809d676cf6.png)

哈哈，终于解决了!距离回家更近了一步了，但是家里老婆管的严，又不让乱花钱，所以他只好选用一种最便宜的交通方式。


```
import operator

cheaper = min(costs_dcit.items(), key=operator.itemgetter(1))[0]
print(cheaper)
```


![Python 字典练习：遍历、累加与寻找最小值配图](/images/migrated/aa714e8208c426983701.png)

这里导入了operator, 利用itemgetter()方法进行选择比较的元素，itemgetter(1)就是比较第二个元素，也就是花费的钱数。如果itemgetter(0),就是比较交通工具了，这里也就是按照首字母的顺序来比较了。

![Python 字典练习：遍历、累加与寻找最小值配图](/images/migrated/3c721a64fa15b76328a3.png)

特别注意：这里min（）返回的是一个tuple类型：   
![Python 字典练习：遍历、累加与寻找最小值配图](/images/migrated/52a8ceed2ad6c3708f5a.png)   
好了，程序员回家了，故事也就讲完了！

---
title: Python 列表 sort 与 sorted 的区别
date: '2018-04-16 12:58:43'
updated: '2024-04-22 21:41:05'
abbrlink: 6230851d
categories:
- 软件
- 编程
tags:
- Python
- 开发
description: 通过示例对照列表 sort 方法和 sorted 函数，观察原列表是否改变，以及 reverse 参数的倒序用法。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/79959089
source_title: python列表 sort和sorted的区别
---

[Python 编程与环境笔记：系列目录](/series/python/)


对于一个指定的列表，如果想要对它进行排序，python内置了sort和sorted方法，那么这两者又有什么区别呢？

准确的说，sorted是个函数，sort是方法。  
 下边看下python的[官方文档](html)。

***sort():***


```
a = [1,4,5,6,7,123,4,5]
print(a)
a.sort()
print(a)
```


![sort()运行结果](/images/migrated/f9f9ce988f09f2e41989.png)  
 ***sorted():***


```
b = [1,4,5,6,7,123,4,5]
print(sorted(b))
print(b)
```


![sort()](/images/migrated/a715a62d70399361e614.png)

---

由此可知，sorted(b)的排序是临时的，如果不用变量接受就会被系统回收掉。而a.sort()则是永久的，此时的sort()是对象a的一个方法。

另外，sorted(b)有个默认的参数，reverse=False，如果使用reverse=True则会实现倒序输出。  
 ![这里写图片描述](/images/migrated/a715a62d70399361e614.png)

好了，今天的分享就到这里！！

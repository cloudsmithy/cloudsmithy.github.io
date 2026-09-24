---
title: Python zip 与星号表达式：打包、解包和版本差异
date: '2018-04-17 07:45:43'
updated: '2018-04-17 07:45:43'
abbrlink: a00c01cd
categories:
- 软件
- 编程
tags:
- Python
- 开发
description: 记录 zip 的打包与解包、星号表达式的参数接收，以及 Python 2 和 Python 3 中 zip 返回结果的区别。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/79969124
source_title: python 中zip() 不同版本之间的差异， *表达式
---

[Python 编程与环境笔记：系列目录](/series/python/)


***1. zip()***

之前练习的时候写过这样的代码：


```
items = ["bananas", "mattress", "dog kennels", "machine", "cheeses"]
weights = [15, 34, 42, 120, 5]
totals = zip(items, weights)
for total in totals:
    print(total, end=' ')
```


zip是从每个参数列表中去一个元素，然后打包成新的元组，另外zip在python3中也是一种新的数据结构。

![jupyter中py3的结果](/images/migrated/2022567a35c5d216356c.png)

1. zip()拆分元组

既然有打包，就一定有解包，就像文件的压缩与解压缩一样，那么python里面的解压用的是\*表达式。


```
ma = [('bananas', 15), ('mattress', 34), ('dog kennels', 42), ('machine', 120), ('cheeses', 5)]
item, weight = zip(*ma)

print(item)
print(weight)
```


我们再来看下这个例子的结果，同样使用的是py3：

![解包](/images/migrated/b897d67ae4cb7f8f3cc7.png)

1. \*表达式

   *表达式提供了放方便的方法，可以理解为shell里面的通配符(\**），用来匹配多个参数或者对象（这里的对象不一定指面向对象里的对象，我本意是指所有文件名），在shell里面，我们想要同时对多个文件进行操作，这时候通配符就有很大的作用了。比如同时编译多个文件，我们可以


```
gcc *.c  或者 java *.java
```


那么在python中的\*表达式也是相近的用法，举个例子：   
“`   
def drop_first_last(a):   
first, \*middle, last = a   
return middle

print(drop_first_last([1, 3, 4, 5, 5, 5 , 5]))   
print(drop_first_last([1,2]))   
“`   
![*表达式](/images/migrated/20add485eab5b0e323cb.png)

如果不用\*表达式的话，默认形参数是3个，那么试着传入多个参数就会出错，\*middle 相对于middle的好处就是可以用来接受多个参数，在print(drop_first_last([1, 3, 4, 5, 5, 5 , 5]))就是[3, 4, 5, 5, 5]，当然传进去两个参数也可以的，不过这时候\*middle就是空的了。但是，只是传入一个参数的话，python解释器会报一个’function’ object is not subscriptable的错误。

![Python zip 与星号表达式：打包、解包和版本差异配图](/images/migrated/673c59353430a91fec9d.png)

1. zip()在python不同版本的区别   
   python2


```
#python2

a = [1, 2, 3]
b = [4, 5, 6]
c = [4, 5, 6, 7, 8]

zipped = zip(a, c)
print(zip(a, c))
print(zip(a, b))
print(type(zipped))

l = ['a', 'b', 'c', 'd', 'e', 'f']
print l
print(zip(l[:-1], l[1:]))
```


![python2](/images/migrated/47a128ef9ec3b8df5664.png)

python3


```

#python3

a = [1, 2, 3]
b = [4, 5, 6]
c = [4, 5, 6, 7, 8]

zipped = zip(a, c)
print(zip(a, c))
print(zip(a, b))
print(type(zipped))

l = ['a', 'b', 'c', 'd', 'e', 'f']
print(l)
# print(l[:-1])
print(zip(l[:-1], l[1:]))

print(list(zip(a, b)))
print(list(zip(a, c)))
print(list(zip(l[:-1],l[1:])))
```


![python3](/images/migrated/c89b28f7f340534f4184.png)

由此可见，python2在zip的过程中自动把zip(a, b)转化成了list，python则需要显示转化。

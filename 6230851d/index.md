# Python 列表 sort 与 sorted 的区别

- URL: https://blog.no-claw.com/6230851d/
- 日期: 2018-04-16
- 分类: 软件 / 编程
- 标签: 开发, Python

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

[图：sort()运行结果]
 ***sorted():***

```
b = [1,4,5,6,7,123,4,5]
print(sorted(b))
print(b)
```

[图：sort()]

---

由此可知，sorted(b)的排序是临时的，如果不用变量接受就会被系统回收掉。而a.sort()则是永久的，此时的sort()是对象a的一个方法。

另外，sorted(b)有个默认的参数，reverse=False，如果使用reverse=True则会实现倒序输出。
 [图：这里写图片描述]

好了，今天的分享就到这里！！

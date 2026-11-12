# Python 容器笔记：list、dict、set 与 tuple

- URL: https://blog.no-claw.com/dae402df/
- 日期: 2018-04-24
- 分类: 软件 / 编程
- 标签: 开发, Python

[Python 编程与环境笔记：系列目录](/series/python/)

[图：Python 容器笔记：list、dict、set 与 tuple配图]

[图：summary]

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

[图：Python 容器笔记：list、dict、set 与 tuple配图]
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

[图：Python 容器笔记：list、dict、set 与 tuple配图]

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

[图：Python 容器笔记：list、dict、set 与 tuple配图]

[图：Python 容器笔记：list、dict、set 与 tuple配图]

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

#### tuple

1.赋值

```
a = 2, 3
print(a)
print(type(a)
```

[图：Python 容器笔记：list、dict、set 与 tuple配图]

2.元组解包

```
demension = 52, 40, 100
length, width, height = demension
print("The dimensions are {} x {} x {}".format(length, width, height))
print("The dimensions are {} x {} x {}".format(*demension))
```

[图：Python 容器笔记：list、dict、set 与 tuple配图]

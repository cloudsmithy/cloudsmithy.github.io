# Python 小语法：链式比较、ASCII 与科学计数法

- URL: https://blog.no-claw.com/2e034e73/
- 日期: 2018-05-02
- 分类: 软件 / 编程
- 标签: 开发, Python

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

[图：Python 小语法：链式比较、ASCII 与科学计数法配图]

2. python 查看ASCII（美国信息交换标准代码）

```
print(ord('0'))
print(ord('a'))
print((ord('A')))
```

[图：Python 小语法：链式比较、ASCII 与科学计数法配图]

3.科学技术法 type()

```
type(1e-7)
```

[图：Python 小语法：链式比较、ASCII 与科学计数法配图]

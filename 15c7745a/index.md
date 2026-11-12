# Python 函数笔记：参数、global 与 lambda

- URL: https://blog.no-claw.com/15c7745a/
- 日期: 2018-05-02
- 分类: 软件 / 编程
- 标签: 开发, Python

[Python 编程与环境笔记：系列目录](/series/python/)

##### 1.函数关键字

一般的函数调用

```
import math
def get_cylinder(height, radian):
    return height*math.pi*radian**2

print(get_cylinder(1,1))
```

[图：Python 函数笔记：参数、global 与 lambda配图]

含有默认值的参数

```
import math
def get_cylinder(height, radian=1):
    return height*math.pi*radian**2

print(get_cylinder(1))
```

[图：Python 函数笔记：参数、global 与 lambda配图]

```
import math
def get_cylinder(height=1, radian=1):
    return height*math.pi*radian**2

print(get_cylinder())
```

[图：Python 函数笔记：参数、global 与 lambda配图]
指定关键字，当然修改关键字默认值只能放在后边啦，放在前边报错的啊！

```
import math
def get_cylinder(height=1, radian=1):
    return height*math.pi*radian**2

print(get_clinder(2, radian=3))
```

[图：Python 函数笔记：参数、global 与 lambda配图]

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

[图：Python 函数笔记：参数、global 与 lambda配图]

##### 3.lambda 表达式

```
import math
get_cylinder = lambda height, radian: height*math.pi*radian**2

print(get_cylinder(1,1))
```

[图：image.png]

如果lambda表达式使用函数参数默认值的话，默认值要放在最后

[图：Python 函数笔记：参数、global 与 lambda配图]

一旦指定了关键字，参数顺序就不那么重要了。

```
import math

get_cylinder = lambda height=1, radian=1: height*math.pi*radian**2
print(get_cylinder(radian=2, height=3))
```

[图：Python 函数笔记：参数、global 与 lambda配图]

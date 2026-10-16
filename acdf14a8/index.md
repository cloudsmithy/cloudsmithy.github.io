# Python 字符串笔记：换行与 format 格式化

- URL: https://blog.no-claw.com/acdf14a8/
- 日期: 2018-05-03
- 分类: 软件 / 编程
- 标签: 开发, Python

[Python 编程与环境笔记：系列目录](/series/python/)

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

[图：Python 字符串笔记：换行与 format 格式化配图]

##### format的格式化

```
a = .5
print(a)
print("a={}".format(a))
print("a={:2%}".format(a))
```

[图：format的格式化]

##### format与dict

```
dict = {'name': 'juno', 'color': 'blue', 'age': 'unknown'}
print(dict)
print("name={name}, color={color}, age={age}".format(**dict))
```

[图：Python 字符串笔记：换行与 format 格式化配图]

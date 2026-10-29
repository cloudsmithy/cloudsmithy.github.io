---
title: 在 Jupyter Notebook 中使用 Matplotlib 画图
date: '2018-05-16 16:36:31'
updated: '2018-05-16 16:36:31'
abbrlink: aee2a967
categories:
- 软件
- 编程
tags:
- Python
- Jupyter
description: 保留使用 Matplotlib 绘制折线图和条形图的示例代码与结果，作为 Jupyter Notebook 绘图练习笔记。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/80339114
source_title: ipython notebook  使用 matplotlib画图
---

[Python 编程与环境笔记：系列目录](/series/python/)


<a id="matplotlib-绘制折线图"></a>

##### matplotlib 绘制折线图


```
from matplotlib import pyplot as plt
%pylab inline#jupyter 要加这句


x = [1,2,3,4,5]
y = [num**2 for num in x]
plt.plot(x, y, color='green', marker='o', linestyle='solid')
plt.title('x**2')
plt.xlabel('x value')
plt.ylabel('y value')
plt.show()
# plt.savefig('plot')
```


![在 Jupyter Notebook 中使用 Matplotlib 画图配图](/images/migrated/a613b763f00840ded8cf.png)

<a id="matplot绘制条形图"></a>

##### matplot绘制条形图


```
name = ['Amy', 'Sam', 'Bob', 'Tom']
salary = [100, 200, 30, 491]

plt.xlabel('names')
plt.ylabel('salary')
plt.title('all money money go my home')

plt.bar(name, salary)
plt.savefig("money.png")
```


![在 Jupyter Notebook 中使用 Matplotlib 画图配图](/images/migrated/375a82c1cb358a1159bf.png)

![在 Jupyter Notebook 中使用 Matplotlib 画图配图](/images/migrated/ed6db572e552dea4a6db.png)

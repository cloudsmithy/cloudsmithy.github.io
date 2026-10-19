---
title: 测试 Python 程序运行时间
date: '2018-04-30 09:51:55'
updated: '2018-04-30 09:51:55'
abbrlink: 5360c45b
categories:
- 软件
- 编程
tags:
- Python
- 开发
description: 保留一次 Python 计时实验的代码和结果，对照输出操作以及整数、Decimal 运算的时间开销。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/80147447
source_title: 测试python程序运行时间
---

[Python 编程与环境笔记：系列目录](/series/python/)



```
import time
import decimal

# text decimal_sum
print("decimal:")
start =time.time()

sum = decimal.Decimal('0')
for x in range(100):
    sum += decimal.Decimal(x)

end = time.time()
# print('Running time: %s Seconds'%(end-start))

print('Running time: {} Seconds'.format(end-start))
print("===============================")
#text_int
print("sum_text")
start =time.time()
sum = 0

for x in range(100):
    sum += x

end = time.time()
print('Running time: {} Seconds'.format(end-start))
print("===============================")
#print("int")
print("int")
start =  time.time()

print(4.0)
end = time.time()
print('Running time: {} Seconds'.format(end-start))
print("===============================")

print("str")
start =  time.time()

print("sdfgh")
end = time.time()
print('Running time: {} Seconds'.format(end-start))
print("===============================")
```


![text code](/images/migrated/357856b07b96aac76f5c.png)

经由测试，print()花费时间大约是1e-6s,decimal运行花费的时间大约是int的三倍。

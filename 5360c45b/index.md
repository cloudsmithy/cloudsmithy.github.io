# 测试 Python 程序运行时间

- URL: https://blog.no-claw.com/5360c45b/
- 日期: 2018-04-30
- 分类: 软件 / 编程
- 标签: 开发, Python

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

[图：text code]

经由测试，print()花费时间大约是1e-6s,decimal运行花费的时间大约是int的三倍。

---
title: C++ 数组遍历：范围 for 与下标循环
date: '2018-12-27 16:04:39'
updated: '2026-09-23'
abbrlink: 'ea2bf9d8'
categories:
  - 软件
  - 编程
tags:
  - C++
description: 用一个整型数组对照 C++11 范围 for 和下标循环，补齐可编译示例，并说明按值遍历、引用和数组长度的区别。
source_platform: 简书
source_url: https://www.jianshu.com/p/49a8f6ebd673
source_title: c++的两种循环遍历
---

同一个数组，可以直接遍历每个元素，也可以通过下标访问。下面是原来两段循环补齐头文件和 `main()` 后的完整示例：

```cpp
#include <cstddef>
#include <iostream>

int main()
{
    int a[5] = {1, 2, 3, 4, 5};

    // 范围 for：依次取出元素
    for (int i : a) {
        std::cout << i << '\n';
    }

    // 普通 for：通过下标访问元素
    for (std::size_t i = 0; i < sizeof(a) / sizeof(a[0]); ++i) {
        std::cout << a[i] << '\n';
    }

    return 0;
}
```

两段循环都会依次输出 1 到 5。范围 for 从 C++11 开始支持；用 GCC 编译时，可以显式指定标准：

```bash
g++ -std=c++11 -Wall -Wextra array-loop.cpp -o array-loop
./array-loop
```

只需要元素值时，`for (int i : a)` 比较直接。这里的 `i` 是元素的副本，在循环里修改 `i` 不会修改数组；如果确实要改原数组，可以写成 `for (int& i : a)`。

需要用到位置，或者同时访问相邻元素时，下标循环更方便。`sizeof(a) / sizeof(a[0])` 在这里能得到数组长度，是因为 `a` 仍然是完整数组；如果数组作为函数参数退化成了指针，就不能再用这个表达式计算元素数量。

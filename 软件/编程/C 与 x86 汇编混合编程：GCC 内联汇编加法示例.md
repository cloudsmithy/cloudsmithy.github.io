---
title: C 与 x86 汇编混合编程：GCC 内联汇编加法示例
date: '2018-08-29 16:30:21'
updated: '2026-09-23 10:28:25'
abbrlink: '37c707fa'
categories:
- 软件
- 编程
tags:
- C语言
- 开发
description: 保留一次在 C 程序中调用 x86 内联汇编的加法练习，说明 AT&T 语法、输入输出操作数与 GCC 约束的关系。
source_platform: 简书
source_url: https://www.jianshu.com/p/018c6e68b0ee
source_title: C与汇编混合编程（汇编语言环境配置）
---

之前想在双系统上配置汇编环境，最后采用了 C 与汇编混合编程。

下面的 `addl` 示例使用 **x86 的 AT&T 汇编语法**和 GCC 扩展内联汇编。原笔记把 AT&T 语法和 ARM 架构混在了一起，这里修正：Intel 与 AT&T 是 x86 汇编的两种语法风格，ARM 是另一种指令集架构。

```cpp
#include<stdio.h>
 
int main()
{
    int a = 10;
    int b = 20;
    int c = 0;
 
    __asm__ ("addl %1, %0\n\t"
             : "=r"(c)
             : "r"(a), "0"(b));
    printf("%d\n", c);
 
    return 0;
}
```

`%0` 对应输出变量 `c`，`%1` 对应输入变量 `a`；`"0"(b)` 让 `b` 与第 0 个输出使用同一位置，因此这条加法得到 `a + b`。

这段代码应在 x86 目标环境下编译。GCC 的 [扩展内联汇编说明](https://gcc.gnu.org/onlinedocs/gcc/Extended-Asm.html)介绍了操作数和约束；扩展示例时，还需要考虑指令对标志寄存器等状态的影响。

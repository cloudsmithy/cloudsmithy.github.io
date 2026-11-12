# 51 单片机学习笔记：常用库函数

- URL: https://blog.no-claw.com/a73de94/
- 日期: 2017-12-25
- 分类: 电子产品 / 嵌入式 / 51 单片机
- 标签: 单片机, 51 单片机

> 这是一篇 2017–2018 年的嵌入式学习笔记，保留当时的工具、代码和实验过程。 [查看系列目录](/series/embedded/)。

main.h

```c
#ifndef  _MAIN_H
#define _MAIN_H

#define uint unsigned int
#define uchar unsigned char

#endif
```

delay.c

```c
void delay(uint timer)
{
    uchar j = 124;
    while(timer--)
    {
        while(j--);
    }
}
```

delay.h

```c
#ifndef  _DELAY_H
#define _DELAY_H

void delay(uint timer);

#endif
```

display.c

```c
void display(uint k)
{
    uchar i;
    for(i=0; i<segN; i++)
    {
        int result=1;
        num[segN-i-1]=k/result%10;
        result*=10;
        k/=10;
        P2 = segW[i];
        P0 = segD[num[segN-i-1]];
        delay(1);
    }
}
```

display.h

```c
#ifndef _DISPLAY_H
#define _DISPLAY_H

void display(uint k);
#endif
```

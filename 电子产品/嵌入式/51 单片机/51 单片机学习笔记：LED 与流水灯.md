---
title: 51 单片机学习笔记：LED 与流水灯
date: '2017-12-25 14:05:50'
updated: '2017-12-26 16:27:05'
abbrlink: fc49a1f5
description: 在 Proteus 与 Keil C 中练习 LED 点亮、闪烁和心形流水灯，记录端口控制与延时写法。
categories:
- 电子产品
- 嵌入式
- 51 单片机
tags:
- 单片机
- 51 单片机
toc: true
source_platform: jianshu
source_url: https://www.jianshu.com/p/058d005dba43
source_title: led
series: 单片机与嵌入式学习笔记
---

> 这是一篇 2017–2018 年的嵌入式学习笔记，保留当时的工具、代码和实验过程。 [查看系列目录](/series/embedded/)。

```c
科普：LED的开启电压是2V，反向击穿电压是5v，工作电压约为3v，通常正向电流为10~20mA，当电流在3~10mA时，led亮度与电压成反比。电流超过30mA的时候，led会烧毁，一般串联300欧姆左右的电阻。
```



## windows下仿真程序（proteus+keilc）

## 点亮一个灯

proteus的仿真图：

  

[原图（暂不可用）](https://upload-images.jianshu.io/upload_images/5415189-0db72b33d60bf73e.png)

点亮一个灯

keilc的代码如下：



```c
#include <reg51.h>
void main()
{
    P1 = 0;
    while(1);
}
```



## led闪烁

[原图（暂不可用）](https://upload-images.jianshu.io/upload_images/5415189-158abcae59f81db9.png)

led闪烁



```c
#include <reg51.h>

#define uint unsigned int
#define uchar unsigned char

sbit led P1^0

void delay(uint timer)
{
    uchar j = 124;
    while(timer--)
    {
        while(j--);
    }
}

void main()
{
    while(1)
    {
        led = ~led;
        delay(100);
    }
}
```



## 心形流水灯

[原图（暂不可用）](https://upload-images.jianshu.io/upload_images/5415189-b9cdd94160d74374.png)

心形流水灯



```c
//version 1
#include <reg51.h>

#define uint unsigned int
#define uchar unsigned char

uchar code led[] = {
                    0xfe, 0xfd,0xfb,0xf7,
                    0xef, 0xdf,0xbf,0x7f};

void delay(uint timer)
{
    uchar j = 124;
    while(timer--)
    {
        while(j--);
    }
}



void main()
{
    uchar i=0 ;
    while(1)
    {
    P1 = led[i];
    i = (i+1)%8;
    delay(50);
    }   
}
```




```c
//version 2
#include <reg51.h>

#define uint unsigned int
#define uchar unsigned char

uchar code led[] = {
                    0xfe, 0xfd,0xfb,0xf7,
                    0xef, 0xdf,0xbf,0x7f};

void delay(uint timer)
{
    uchar j = 124;
    while(timer--)
    {
        while(j--);
    }
}



void main()
{
    uchar i=0 ;
    while(1)
    {
        for(i = 0; i<8;i++)
        {
            P1 = led[i];
            delay(70);
        }
    }   
}
    
```




```c
//version 3
#include <reg51.h>

#define uint unsigned int
#define uchar unsigned char

void delay(uint timer)
{
    uchar j = 124;
    while(timer--)
    {
        while(j--);
    }
}

void main()
{
    uchar i;
    while(1)
    {
        for(i = 0;i<8;i++)
        {
            P1 = ~(1<<i);
            delay(200);
        }
    }
}
```



[原图（暂不可用）](https://upload-images.jianshu.io/upload_images/5415189-a96c89127ecc86ca.png)

---
title: 51 单片机学习笔记：PWM
date: '2017-12-30 18:00:20'
updated: '2017-12-30 18:00:20'
abbrlink: 9e7d6ad0
description: 51 单片机 PWM 学习笔记，记录脉宽调制与输出控制的 C 语言实验代码。
categories:
- 电子产品
- 嵌入式
- 51 单片机
tags:
- 单片机
- 51 单片机
toc: true
source_platform: jianshu
source_url: https://www.jianshu.com/p/fd529509a372
source_title: PWM
series: 单片机与嵌入式学习笔记
---

> 这是一篇 2017–2018 年的嵌入式学习笔记，保留当时的工具、代码和实验过程。 [查看系列目录](/series/embedded/)。

```c
#include <reg52.h>

#define uint unsigned int
#define uchar unsigned char
    
sbit k1 = P3^4;
sbit k2 = P3^5;
sbit beep = P2^3;
sbit DLW = P2^6;
sbit WLW = P2^7;

uchar code SEG[] = {       0x3f,0x06,0x5b,0x4f,0x66,
                           0x6d,0x7d,0x07,0x7f,0x6f,
                           0x00};


uint PWM;
uint INTNUM;

void delay(uint timer)
{
    uchar j = 124;
    while(timer--)
    {
        while(j--);
    }
}

void bee()
{
        beep = 0;
        delay(50);
        beep = 1;
        delay(50);
}


void display(uchar k)
{
            DLW = 1;
            P0 = SEG[k/10];
            DLW = 0;
            P0 =0xff;
            WLW = 1;
            P0 = 0xef;
            WLW = 0;
            delay(5);
    
            DLW = 1;
            P0 = SEG[k%10];
            DLW = 0;
            P0 =0xff;
            WLW = 1;
            P0 = 0xdf;
            WLW = 0;
            delay(5);
}

void key_scan()
{
            if(k1==0)
            {
                    delay(10);
                    if(k1==0)
                    {
                            if(PWM < 100)
                            {
                                    PWM+=10;
                                    delay(10);
                            } else 
                            {
                                bee();
                            }
                    }
                    while(!k1);
            }
            if(k2==0)
            {
                    delay(10);
                    if(k2==0)
                    {
                            if(PWM > 0)
                            {
                                    PWM -=10;
                                    delay(10);
                            } else
                            {
                                bee();
                            }
                    }
                    while(!k2);
    }
}

void interrupt_init()
{           
            TH0 = (65535-100)/256;
            TL0 = (65535-100)%256;  
            TMOD = 0x01;    
            EA = 1;
            ET0 = 1;
            TR0 = 1;
}

void t0() interrupt 1
{
        TR0 = 0;
        TH0 = (65535-100)/256;
        TL0 = (65535-100)%256;      
        
        INTNUM++;
        
        if(INTNUM>100)
        {
                INTNUM = 0;
        }
        
        if(INTNUM < PWM)
        {
            P1 = 0x00;
        }else
        {
            P1 = 0xff;
        }
        TR0 = 1;
}

void main()
{   
        interrupt_init();
        PWM = 0;
        while(1)
        {
            display(100-PWM);
            key_scan();
        }
}
```

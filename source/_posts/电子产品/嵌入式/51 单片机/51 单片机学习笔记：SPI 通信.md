---
title: 51 单片机学习笔记：SPI 通信
date: '2018-01-03 11:14:19'
updated: '2018-01-03 11:14:19'
abbrlink: 84abc641
description: 整理 51 单片机 SPI 通信的实验代码，按延时模块、通信模块和主程序拆分文件。
categories:
- 电子产品
- 嵌入式
- 51 单片机
tags:
- 单片机
- 51 单片机
toc: true
source_platform: jianshu
source_url: https://www.jianshu.com/p/53ec4b8db567
source_title: SPI
series: 单片机与嵌入式学习笔记
---

> 这是一篇 2017–2018 年的嵌入式学习笔记，保留当时的工具、代码和实验过程。 [查看系列目录](/series/embedded/)。

[原图（暂不可用）](https://upload-images.jianshu.io/upload_images/5415189-dd69eab83f8ec4c6.png)

SPI

## delay.h



```c
#include <main.h>

#ifndef  _DELAY_H
#define _DELAY_H

void delay_ms(uint timer);

#endif
```



## delay.c



```c
#include "main.h"

void delay_ms(uint timer)
{
    uchar j = 124;
    while(timer--)
    {
        while(j--);
    }
}
```



## spi.h



```c
#ifndef _SPI_H
#define _SPI_H 

#include <reg51.h>
#include "main.h"

sbit SCK = P2^4;
sbit SDO = P2^5;
sbit SDI = P2^6;
sbit CS = P2^7;

void init_SPI();
uchar read_SPI_SR();
void write_SPI_SR(uchar rs);
uchar read_SPI(uchar addr);
void write_SPI(uchar dat, uchar addr);

#endif
```



## spi.c



```c
#include <intrins.h>
#include "main.h"
#include "spi.h"

#define READ 0x03
#define WRITE 0x02
#define WREN 0x06
#define WRDI 0x04
#define RDSR 0x05
#define WRSR 0x01

void delay()
{
    uchar i;
    for(i = 0; i < 4; i++)
    {
        _nop_();
    }
}

void init_SPI()
{
    CS = 1;
    delay();
    SCK = 1;
    delay();
    SDO = 1;
    delay();
    SDI = 1;
    delay();
}

uchar SPI_read_byte()
{
    uchar i;
    uchar dat = 0x00;
    SCK = 0;
    for (i = 0; i < 8; ++i)
    {
        SCK = 0;
        delay();
        SCK = 1;
        delay();
        dat <<= 1;
        dat |= (uchar)SDI;
    }
    return dat;
}

void SPI_write_byte(uchar dat)
{
    uchar i;
    SCK = 0;
    for (i = 0; i < 8; ++i)
    {
        SCK = 0;
        SDO = (bit)(dat&0x80);
        delay();
        SCK = 1;
        delay();
        dat<<=1;
    }

}

void write_SPI(uchar dat, uchar addr)
{
    SCK = 0;
    CS = 0;
    delay();
    SPI_write_byte(WREN);
    CS = 1;
    delay();
    CS = 0;
    delay();
    SPI_write_byte(WRITE);
    SPI_write_byte(addr);
    SPI_write_byte(dat);
    CS = 1;
    SCK = 0;
}

uchar read_SPI(uchar addr)
{
    uchar dat;
    SCK = 0;
    delay();
    CS = 0;
    delay();
    SPI_write_byte(READ);
    SPI_write_byte(addr);
    dat = SPI_read_byte();
    CS = 1;
    delay();
    SCK = 0;
    delay();
    return dat;
}

void write_SPI_SR(uchar sReg)
{
    CS = 0;
    delay();
    SPI_write_byte(WREN);
    CS = 1;
    delay();
    CS = 0;
    delay();
    SPI_write_byte(WRSR);
    SPI_write_byte(sReg);
    CS = 1;
    delay();
}

uchar read_SPI_SR()
{
    uchar sReg = 0;
    CS = 0;
    delay();
    SPI_write_byte(RDSR);
    sReg = SPI_read_byte();
    CS = 1;
    delay();

    return sReg;
}
```



## main.h



```c
#ifndef _SPI_H
#define _SPI_H 

#include <reg51.h>
#include "main.h"

sbit SCK = P2^4;
sbit SDO = P2^5;
sbit SDI = P2^6;
sbit CS = P2^7;

void init_SPI();
uchar read_SPI_SR();
void write_SPI_SR(uchar rs);
uchar read_SPI(uchar addr);
void write_SPI(uchar dat, uchar addr);

#endif
```



## main.c



```c
#include <reg51.h>
#include "main.h"
#include "delay.h"
#include "SPI.h"

#define DAT_ADDR 0X03

sbit LED1 = P2^0;
sbit LED2 = P2^1;

uchar g_ucDat;

void display(uchar dat)
{
    LED1 = 0;
    LED2 = 1;
    P0 = (dat%10);
    delay_ms(5);
    LED2 = 0;
    LED1 = 1;
    P0 = (dat/10);
    delay_ms(5);
}

void int0_init()
{
    EX0 = 1;
    IT0 = 1;
    EA = 1;
}

void int0_inter() interrupt 0
{
    g_ucDat++;
}

void main()
{
    uchar tmp = 0;
    
    g_ucDat = 0;
    int0_init();
    init_SPI();
    
    write_SPI_SR(0x00);
    delay_ms(10);
    tmp = read_SPI_SR();

    tmp = read_SPI(DAT_ADDR);
    if (tmp == 0xff)
    {
        tmp = 0;
        write_SPI(tmp, DAT_ADDR);
        delay_ms(10);
    }
    g_ucDat = tmp;

    while(1)
    {
        if(tmp != g_ucDat)
        {
            if(g_ucDat > 99)
            {
                g_ucDat = 1;
            }
            tmp = g_ucDat;
            write_SPI(tmp, DAT_ADDR);
            delay_ms(10);
        }
        display(tmp);
    }
}
```

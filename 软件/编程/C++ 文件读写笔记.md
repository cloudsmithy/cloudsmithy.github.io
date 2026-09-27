---
title: C++ 文件读写笔记
date: '2018-12-27 16:32:08'
updated: '2018-12-27 16:32:08'
abbrlink: 8163462d
categories:
- 软件
- 编程
tags:
- C++
- 开发
description: 使用 fstream、ifstream 和 ofstream 练习 C++ 文件读写，记录创建文件、追加内容和完整读写示例。
source_platform: 简书
source_url: https://www.jianshu.com/p/df38a29ec6ef
source_title: c++文件读写
---

c++的文件读写，其实要导入一个新的头文件，差不多每实现一个新的功能就要导入一个新的头文件，从这个角度来看，还是现用先查吧。

废话不多说，关于读写的头文件fstream，

> ifstream 创建一个读文件的对象  
> ofstream 创建一个写文件的对象  
> fstream 创建一个读或者写文件的对象

下边是向文件里写一些文字；  
c++还是有些万物皆是对象的意味，严格按照c++创建对象的语法来写。参数就是文件名和操作（读还事写，还是append）


```cpp
#include <iostream>
#include <fstream>

using namespace std;

int main()
{
    fstream myFile("in.txt", ios::app);
    if (myFile.is_open())
    {
        myFile << "happy" << endl;
        myFile << "new year" << endl;
        myFile.close();
    }
    else {
        cout << "uneable to write" << endl;
    }
    return 0;
}
```


和大多数的文件IO一样，如果这个你想保存的文件不存在的话，那么系统会在你的当前目录下创建一个同名的文件，如果存在的话，那么直接写入，注意我这里的app是追加。

##### 完整的c++文件读写


```cpp
#include <iostream>
#include <fstream>
#include <string>
#include <Windows.h>

using namespace std;

int main()
{
    string line;

    ofstream fileWriter("today.txt", ios::app);

    if (fileWriter.is_open())
    {
        fileWriter << "i am writing" << endl;
        fileWriter << "I am writing again" << endl;
        fileWriter.close();
    }
    else {
        cout << "write error" << endl;
    }


    //ifstream fileReader("today.txt", ios::in);
    ifstream fileReader("today.txt");
    if (fileReader.is_open())
    {
        while(getline(fileReader, line))
        {
            cout << line << endl;
        }
        fileReader.close();
    }
    else {
        cout << "can not read!!" << endl;
    }
    system("pause");
    return 0;
} 
```

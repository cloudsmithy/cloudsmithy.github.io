---
title: Windows 配置 C 开发环境：MinGW、Sublime 与终端
date: '2017-12-20 08:22:54'
updated: '2017-12-20 08:22:54'
abbrlink: 1cd8b984
categories:
- 软件
- 编程
tags:
- Windows
- 开发
description: 记录在 Windows 中安装 MinGW、为 Sublime Text 配置 C 编译与运行命令，以及从当前目录打开终端的方法。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/78849107
source_title: 如何把windows打造成类linux
---

如果你乐于写代码，又苦于windows的环境配置，同时又不想安装linux的双系统或者虚拟机，又或者你的电脑不是win10，没有linux的子系统。那么这篇文章就是为你准备的。因为大家都知道，在windows下开发超级麻烦，许多人因此抛弃了Windows转入linux的行业，但是由于现在微软占有了90%以上的市场，所以现在大多数软件都是EXE格式的，所以对大多数人来说，还是抛弃不了windows，那么文章会教你如何在winows下找到linux初学时的感觉。

### <a id="1____2"></a>1. 集成开发环境，编译器和文本编辑器

我是大一开始接触c语言的，也与此同时接触了Ubuntu， 并且开始了terminal跑代码的生涯，还好当时电脑安装vc++6.0出了好多岔子，不要然我也不会尝试linux，vim,sublime,可能会在没有高亮的屏幕上写一辈子的代码。先介绍一点基础知识吧，因为好多新手都是从集成开发环境（IDE）开始接触编程的，因为有些IDE太过于庞大，对于新手来说也很不好上手，所以我打算从文本编辑器讲起，其实用MS office自带的word也可以编写程序，不过我这里介绍的是一款大家比较喜欢的sublime text，因为它的语法高亮，自动补全，界面美观等优点一直被大家所喜欢。所以强烈推荐大家使用。(请自行百度下载)

因为windows没有默认安装c的编译器，而在linux下有gcc , 这个可以编译c，c++, object-c ,go，java等一系列的语言，万幸的是在windows下有个编译器叫MinGW，号称是win版的gcc ,去官网下载即可，点击右上角的下载然后安装就好了。

#####先一路默认安装，然后安装下边四个插件，否则无法正常使用。

![Windows 配置 C 开发环境：MinGW、Sublime 与终端配图](/images/migrated/f57fc00b01a4882aba44.png)

#####然后点击左上角的Installation,apply changes即可。

接下来要把wingw添加到环境变量中去，把mingw目录下的bin ，include ， lib 三个文件及直接添加到环境变量即可。（环境变量的添加自行百度）

然后打开cmd ,win+r ,输入cmd，输入gcc -v,查看gcc 的版本 -v 就是version的意思。  
出现如下图片说明安装成功。

![Windows 配置 C 开发环境：MinGW、Sublime 与终端配图](/images/migrated/97dde8ac489400ccbd51.png)

关于gcc的使用我就不在这里多说了，因为下一步需要用sublime调用gcc .

### <a id="2_sublime_24"></a>2. 关于sublime

说了sublime的若干好处，下面就开始使用吧。因为sublime默认了Python的配置，所以Ctrl+s保存，Ctrl+b编译即可。我强烈建议使用python入门，但是好多学校直接开c语言的课，而且对于零基础的同学，想在初学时候自己配好环境是非常困难的，所以我也希望有人看过这篇文档可以少走一些弯路。

好，接下来用sublime调用gcc，按照下图操作：

##### <a id="new_build_system_29"></a>点击new build system

![Windows 配置 C 开发环境：MinGW、Sublime 与终端配图](/images/migrated/50f3cba6d8e48b91bb56.png)

####把下面一段代码粘贴进去

![Windows 配置 C 开发环境：MinGW、Sublime 与终端配图](/images/migrated/2bb5e3e8a2aa66b226b6.png)

####具体在这里：


```
> {
"working_dir": "$file_path",
"cmd": "gcc -Wall \"$file_name\" -o \"$file_base_name\"",
"file_regex": "^(..[^:]*):([0-9]+):?([0-9]+)?:? (.*)$",
"selector": "source.c",
"variants":
[
{
"name": "Run",
        	"shell_cmd": "gcc -Wall \"$file\" -o \"$file_base_name\" && start cmd /c \"${file_path}/${file_base_name} & pause\""
}
]
}
```


####Ctr+保存名称为c即可（实际上全名是c.sublime-build）

接下来你打开tool-build system，你会发现这个多出了一个c的选项。如果只使用sublime写c语言的话，点击c就可以了，如果想用它写不同的语言，那么还要配置一下：  
点击右下角的从c,你的电脑可能是别的字母，因为sublime默认把c当做c++文件  
，所以要把右下角的改成c。  
![Windows 配置 C 开发环境：MinGW、Sublime 与终端配图](/images/migrated/f5638e8c47de180d850e.png)

然后回到tool-bulid system，改成Atuomatic就行了，之后sublime就会把你的c文件默认gcc编译了。

对于喜欢终端的朋友，这里还可以在编译之后调用cmd，选择tool- bulid  
with ，然后会弹出如下的窗口，选择c-run 即可。

![Windows 配置 C 开发环境：MinGW、Sublime 与终端配图](/images/migrated/b3edbf074fcbaacc8673.png)

随便写一段c的代码，保存（Ctrl+s），编译(ctrl+b),你会发现cmd输出了你想要的结果。

![Windows 配置 C 开发环境：MinGW、Sublime 与终端配图](/images/migrated/03085be98452a4e0201a.png)

至此，sublime调用gcc编译c语言完毕。

### <a id="3_cmd_76"></a>3. 右键直接打开cmd

大家有没有想过window也同linux一样直接在当前目录打开终端呢？不必win+r cmd在加上各种cd ，只需要在注册表添加一段代码即可解决。

---


```
Windows Registry Editor Version 5.00  
  
[-HKEY_CLASSES_ROOT\Directory\shell\runas]  
  
[HKEY_CLASSES_ROOT\Directory\shell\runas]  
  
@="Open cmd here as Admin"  
  
"HasLUAShield"=""  
  
[HKEY_CLASSES_ROOT\Directory\shell\runas\command]  
  
@="cmd.exe /s /k pushd \"%V\""  
  
[-HKEY_CLASSES_ROOT\Directory\Background\shell\runas]  
  
[HKEY_CLASSES_ROOT\Directory\Background\shell\runas]  
  
@="Open cmd here as Admin"  
  
"HasLUAShield"=""  
  
[HKEY_CLASSES_ROOT\Directory\Background\shell\runas\command]  
  
@="cmd.exe /s /k pushd \"%V\""  
  
[-HKEY_CLASSES_ROOT\Drive\shell\runas]  
  
[HKEY_CLASSES_ROOT\Drive\shell\runas]  
  
@="Open cmd here as Admin"  
  
"HasLUAShield"=""  
  
[HKEY_CLASSES_ROOT\Drive\shell\runas\command]  
  
@="cmd.exe /s /k pushd \"%V\""  
***
```


把上边的代码保存到文档里，再把后缀改成reg就可以了，改完之后就是注册表的格式了，不要在乎期间的各种警告。

导入之后，你会发现右键桌面会有一个“open cmd here as admin ” 的选项。这样就可以在任意目录打开cmd了。

###写下最后

本人大一，在学习c语言的时候走了各种弯路，所以才不断尝试，不断折腾。

如果觉得上边的教程有些难的话，那么我推荐 Dev-cpp 这个也是很好的IDE，最起码在初学足够了，以后还会用到 visual studio。还是那句话，强烈推荐Python入门。

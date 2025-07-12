---
title: ventoy引导wtg
tags: 外设
categories: 装机
abbrlink: 874b576b
date: 2023-02-10 00:00:00
---

## ventoy

ventoy 是一个可以支持启动很多镜像的工具，可以理解为 win + linux 的版本的 PE。现在也兼容了 openwrt，chromeOS， EXSI 这些系统了，虽然还不支持 MacOS 哈哈哈哈

## WTG

现在民间有萝卜头的 Windows To Go 辅助工具|WTG 辅助工具 v5.6，可以轻松的安装系统到 U 盘。

https://bbs.luobotou.org/thread-761-1-1.html

我的系统是 CZ880 的 256G 版本,读写均可达到 400MB/S 左右，这个速度已经很接近 Sata3 固态硬盘了。

<!--more-->

![Disk mark](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/image-20230210161015798.png)

![atto benchmark](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/image-20230210160038389.png)

## WTG + ventoy

1. 按照下图设置好，vhdx 容量选择 64G。然后选好 U 盘和对应镜像，写盘完成之后从 U 盘启动完成初始化，进入一次系统，不然据说 ventoy 进去的时候会导致系统起不来。（动态存储，64G，实际安装完只有 8G，随着使用会慢慢增大）

![启动方式](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/image-20230210160343597.png)

![设置64G](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/image-20230210160428464.png)

2. 备份刚才安装好了 vhdx，然后安装 ventoy，这次会格式化所有的分区，而且默认分区是 EXFAT，如果想使用 WTG 的话需要把系统格式化 NTFS，这样才能运行 windows。不格式化的话，就会....Any way 就是花式错误
3. 把一开始 vhdx 拷贝回来就行啦。（需要安装个插件 新建 ventoy 目录里 ventoy_vhdboot.img

![](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/image-20230210161420893.png)

![image-20230210161504316](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/image-20230210161504316.png)

![](https://raw.githubusercontent.com/Xu-Hardy/image-host/master/image-20230210161504316.png)

## 白名单

有时候不想让 ventoy 显示其他的东西，比如黑苹果的 EFI，office 的 ISO，这样就需要设置显示 image_list 的白名单。

就是在 ventoy 目录下 ventoy.json 这个格式，而且只会显示这里的镜像。

```json
{
  "image_list": [
    "/ventoy/OS/win10wtg.vhdx",
    "/ventoy/OS/linux/archlinux-2023.02.01-x86_64.iso",
    "/ventoy/OS/linux/CentOS-7-x86_64-DVD-2009.iso",
    "/ventoy/OS/linux/chromeos_15117.112.0_reven_recovery_stable-channel_mp-v2.bin",
    "/ventoy/OS/linux/Fedora-Workstation-Live-x86_64-37-1.7.iso",
    "/ventoy/OS/linux/FydeOS_for_PC_iris_v16.0-stable",
    "/ventoy/OS/linux/kali-linux-2022.4-installer-amd64.iso",
    "/ventoy/OS/linux/linuxmint-21.1-xfce-64bit.iso",
    "/ventoy/OS/linux/manjaro-gnome-22.0.2-230203-linux61.iso",
    "/ventoy/OS/linux/pop-os_22.04_amd64_intel_22.iso",
    "/ventoy/OS/linux/pop-os_22.04_amd64_nvidia_22.iso",
    "/ventoy/OS/linux/ubuntu-22.04.1-desktop-amd64.iso",
    "/ventoy/OS/windows/cn_windows_10_enterprise_ltsc_2019_x64_dvd_9c09ff24.iso",
    "/ventoy/OS/windows/win7.iso",
    "/ventoy/OS/windows/zh-cn_windows_11_business_editions_version_22h2_updated_jan_2023_x64_dvd_82450200.iso",
    "/ventoy/OS/windows/zh-cn_windows_server_2022_updated_oct_2022_x64_dvd_884ce1ea.iso"
  ]
}
```

PS：找 chatgpt 要了一份自动生成 json 文件的代码：

```python
import os
import json

dir_name = os.path.basename(os.getcwd())

def convert_to_unix_path(windows_path):
    return windows_path.replace('\\', '/')

def get_files_in_directory(path):
    files = []
    for root, _, filenames in os.walk(path):
        for filename in filenames:
            file_path = os.path.join(root, filename)
            relative_path = f"\{dir_name}\{path}\{os.path.relpath(file_path, path)}"
            files.append(convert_to_unix_path(relative_path))
    return files

ventoy_json = {
    "image_list": get_files_in_directory("OS")
}

with open('ventoy.json', 'w') as f:
    json.dump(ventoy_json, f, indent=4)
```

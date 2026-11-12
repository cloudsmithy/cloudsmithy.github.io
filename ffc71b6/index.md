# 懒猫微服实战入门（十七）：把 Steam 游戏存到懒猫网盘

- URL: https://blog.no-claw.com/ffc71b6/
- 日期: 2025-07-01
- 分类: 懒猫微服 / 入门
- 标签: 懒猫微服

懒猫微服的网盘基本可以替代一部分公有网盘，还有一个好处是支持自动挂载：只要打开懒猫微服客户端，网盘就会自动出现在 Finder 中，十分方便。

[图：image-20250627201448767]

网盘支持 WebDAV 和 SMB，这是两种常见的文件访问协议。

**WebDAV（Web Distributed Authoring and Versioning）**基于 HTTP/HTTPS，常用于远程文件访问和云存储。是否能直接通过浏览器查看文件，取决于服务端和浏览器的具体实现。

**SMB（Server Message Block）**主要用于局域网文件共享，例如 Windows 共享文件夹、NAS 和企业内网存储；Samba 是 SMB 的常见开源实现。

[图：image-20250627211645046]

通过 `mount` 命令可以看到，懒猫微服客户端默认使用 SMB 协议挂载：

```
//xu-automount@file.micro.heiyu.space/xu-automount on /Users/xu/lazycat_automount/micro (smbfs, nodev, nosuid, mounted by xu)
//xu-automount@file.micro.heiyu.space/xu on /Volumes/xu (smbfs, nodev, nosuid, mounted by xu)
```

默认有两个文件夹，其实都是指向网盘根目录的软连接。两者内容完全一样。

> <用户名>-automount：这个应该不是自动挂载到文件管理器的目录
>
> <用户名>: 这个是网盘多租户的目录

所以在 Steam 里我们直接添加驱动器就好：

[图：a1a7bbcb4236bc63c91151d9dc3a53b6]

然后可以选择这两个文件目录，就像前面介绍的，这两个选择哪个都行：

[图：ff20f0dc7b36ba7e27ad18ce45b2c378]

然后这个时候会弹出来这个提示。我们选择允许。这样 Steam 才能有写入懒猫网盘的权限。

[图：b90bea03eed9f716a64f52ae16a2526f]

然后选择下载之后，我们发现网盘里多了一个 SteamLibrary 的目录。所有的游戏都存在这里。

[图：7733bdd613320011b0de6ad55032cc19]

如果你比较习惯网盘页面，也可以在网盘里找到 SteamLibrary 目录。

[图：image-20250627202118461]

如果哪天不再需要写入懒猫网盘，用这个办法删除。网上吐槽挺多的。

[图：788d94c0cb77ec7c66aa3de73f414462]

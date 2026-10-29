# 追忆青春 - 黑群晖

- URL: https://blog.no-claw.com/795ed575/
- 日期: 2025-02-15
- 分类: 电子产品
- 标签: 家庭网络, 群晖

那么现在有一个叫做 RR 的项目简化了这一切，我把这些记录下来。他们提供了 release 文件，如下：

https://github.com/RROrg/rr/releases/

用 Etcher 来写盘，需要 U 盘引导的系统不适合用 Ventoy 启动，因为没办法保存，除非把系统安装在其他的磁盘上。

1. 从 U 盘启动页面，rr 会启动一个 web server，端口是 7681

2. 然后就是更换语言，选择机型，系统版本，下载 PAT 文件，以及编译引导（图片来自参考链接）

1. 选择的是 DS918+，没有额外编译任何插件

使用 web 版本的 findsnoloy 没有搜到机器，最后使用手机 app 搜到了局域网的安装好的群晖，之前安装在 ec2 上的黑群晖无法启动可能也是这个原因。

存储池信息：

手机 APP 连接的信息：

虚拟机也很好用，不输 EXSI（除了删除机器的时候强制输入密码）：

对于 VirtIO Block 控制器，官方只建议安装 Linux，实测也可以安装 Windows。

需要把官方的 guest agent 换成 VirtIO 的 ISO，对就是 fedora 那个：https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/archive-virtio/virtio-win-0.1.266-1/

参考：

https://www.wanjiachupin.com/1314.html

https://www.mspace.cc/archives/1002

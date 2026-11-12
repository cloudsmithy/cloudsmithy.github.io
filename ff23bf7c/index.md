# 懒猫微服实战入门（三十三）：网络设置中不显示我的 Wi-Fi 怎么办？

- URL: https://blog.no-claw.com/ff23bf7c/
- 日期: 2025-11-22
- 分类: 懒猫微服 / 入门
- 标签: 懒猫微服

折腾网络这件事，有时候比修电脑还玄学。

前几天测试家里的网络，顺手重置了一下路由器。结果没想到，懒猫微服的 Wi-Fi 设置也跟着丢了。

打开网络设置一看，满屏都是邻居家的热点，就是没有我自己的。

[图：bda486f6b774171f01e24490a13e58b3]

没关系，懒猫毕竟是 Linux 系统，只要能够 开启 SSH，命令行就是万能钥匙。反正有分层文件系统，真要捣鼓坏了，重启也能恢复。

这次的主角是 `nmcli`，全称 **NetworkManager Command Line Interface**，它是 Linux 自带的网络管理命令行工具。
通俗点说，它是前端界面的“幕后操控者”——我们在图形界面上点击的“网络连接”“Wi-Fi 设置”，其实都在底层调用它。

有了 `nmcli`，我们几乎可以用命令完成所有网络操作：

| 功能                | 命令示例                                               |
| ------------------- | ------------------------------------------------------ |
| 列出可用 Wi-Fi 热点 | `nmcli device wifi list`                               |
| 连接 Wi-Fi          | `nmcli device wifi connect "SSID" password "12345678"` |
| 查看当前网络状态    | `nmcli connection show --active`                       |
| 启用/禁用网卡       | `nmcli device set wlan0 managed yes/no`                |
| 断开网络连接        | `nmcli connection down id "MyWiFi"`                    |

### 扫描 Wi-Fi

先 SSH 登录懒猫微服，直接使用 `nmcli` 扫描周边的 Wi-Fi：

```bash
nmcli device wifi list
```

这条命令会列出当前设备能检测到的所有 Wi-Fi 热点。
果然，我的 Wi-Fi 就静静地躺在输出列表里，只是前端页面没显示出来而已。

[图：cb38944751cdb5fe1c553c464e608ec9]

### 手动连接 Wi-Fi

既然能看到 SSID，那就直接连接：

```bash
sudo nmcli device wifi connect "MyWiFi" password "12345678"
```

几秒钟后，终端提示：

```
Device 'wlp129s0' successfully activated with 'xxxx-xxxx-xxxx'
```

说明 Wi-Fi 已成功连接，懒猫顺利回到网络世界。

[图：5e9b1f293b62ac92a6f440a9b64e5ec1]

### 隐藏密码的连接方式

前面的命令会在命令行里明文显示密码。
其实 `nmcli` 也支持交互式连接，输入命令后系统会自动提示输入密码：

```bash
sudo nmcli --ask device wifi connect "MyWiFi"
```

这种方式既安全又方便，命令行历史不会留下明文密码。

[图：b206ea2903667c423391fe27466e2843]

### 确认连接状态

连接成功后，可以用以下命令验证当前网络状态：

```bash
nmcli connection show --active
```

输出会显示所有活跃连接，包括 Wi-Fi、以太网、Docker 桥接等：

```
NAME                  UUID                                  TYPE      DEVICE
Wired connection 1    14c5aa14-82e5-33f6-be2b-04c6de5bfe58  ethernet  enp2s0
GL-MT3600BE-236-5G 1  a2b7d70d-09f5-459f-9903-dd140b1e0d33  wifi      wlp129s0
```

[图：image-20251114212547502]

回到懒猫网络设置页面，就能看到熟悉的 Wi-Fi 已经连接上啦。

[图：93a9d7b39562233d38747bf4148f8a33]

### 一键断开 Wi-Fi（真·命令行版）

想断开连接也很简单，只要执行：

```bash
nmcli connection down id "GL-MT3600BE-236-5G 1"
```

系统会返回：

```
Connection 'GL-MT3600BE-236-5G 1' successfully deactivated (D-Bus active path: /org/freedesktop/NetworkManager/ActiveConnection/17)
```

轻松优雅，不需要点来点去。

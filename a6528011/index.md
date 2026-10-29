# 使用 systemd 设置 Python 程序开机启动

- URL: https://blog.no-claw.com/a6528011/
- 日期: 2024-05-20
- 分类: 软件 / 编程
- 标签: Python, Linux

[Python 编程与环境笔记：系列目录](/series/python/)

在 Linux 系统中设置Python 脚本开机启动，通常可以通过以下几种方式实现：

#### 1. 使用 systemd（推荐方式）

`systemd` 是大多数现代 Linux 发行版使用的初始化系统和服务管理器。你可以为Python 脚本创建一个 `systemd` 服务文件，让它们作为服务在启动时自动运行。

##### 创建服务文件

1. **创建服务文件**：假设你的 Python 脚本位于 `/home/user/my_script.py`，可以创建一个名为 `my_script.service` 的服务文件在 `/etc/systemd/system/` 目录下。

```bash
sudo vim /etc/systemd/system/my_script.service
```

2. **编辑服务文件**：在编辑器中添加以下内容：

```
[Unit]
Description=My Python Script Service
After=network.target

[Service]
ExecStart=/usr/bin/python3 /home/user/my_script.py
Restart=always
User=username
Group=username

[Install]
WantedBy=multi-user.target
```

请将 `/usr/bin/python3` 替换为你系统中 Python 解释器的正确路径，也确保替换脚本路径和用户名。

[图：使用 systemd 设置 Python 程序开机启动配图]

3. **启用和启动服务**：

```bash
sudo systemctl enable my_script.service
sudo systemctl start my_script.service
```

这将确保你的脚本在每次启动时运行，并在脚本崩溃时重启。

#### 2. 使用 `crontab`（对于简单任务）

如果你不需要全功能的服务管理，可以使用 `cron` 的 `@reboot` 功能来运行脚本。

##### 编辑 crontab

```bash
crontab -e
```

##### 添加启动任务

对于 Python 脚本，添加：

```bash
@reboot /usr/bin/python3 /home/user/my_script.py
```

确保替换为正确的解释器路径和脚本路径。

这两种方法可以根据你的具体需要和喜好来选择。`systemd` 提供更强的功能和更好的管理选项，而 `cron` 更适合简单的任务。

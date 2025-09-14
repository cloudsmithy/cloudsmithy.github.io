---
title: 再也不用拼手速！一条命令直接进 BIOS（Windows/Linux/macOS 全攻略)
tags: 外设
categories: 外设
abbrlink: a0b67926
date: 2025-07-27 14:43:24
---

> 看了大狸子的教程, 尝试了一下，顺便补充了其他平台的命令。

很多朋友在装系统、改启动项、开虚拟化（VT-x）、关闭安全启动的时候，都需要进入 BIOS/UEFI。但平时开机要拼命按 **DEL/F2/F10/ESC** 等快捷键，手速还要够快，稍微慢一点就错过了。

<!--more-->

其实在 Windows 和 Linux 系统里，都有“命令行直达 BIOS”的办法，简单又优雅。今天给大家写个全攻略。

---

#### 一、Windows 系统

##### 1. 命令行进入 BIOS

在 Windows 10/11 打开 **命令提示符（管理员）** 或 PowerShell（管理员），输入：

```bash
shutdown /r /fw /t 0
```

参数说明：

- `/r` → 重启
- `/fw` → 重启后进入 BIOS/UEFI 固件设置
- `/t 0` → 立即执行（默认是 30 秒倒计时）

执行后，电脑会立刻重启并直接进入 BIOS。

⚠️ 注意：

- 必须是 **UEFI 启动模式**才支持 `/fw`，如果是 Legacy BIOS 会报错 “找不到环境选项(203)”。
- 可以在命令行里输入 `msinfo32`，检查 “BIOS 模式” 是否为 UEFI。

##### 2. 系统设置进入

如果命令报错，可以这样操作：

1. 打开 **设置 → 更新和安全 → 恢复**
2. 在 “高级启动” 点击 **立即重新启动**
3. 依次选择 **疑难解答 → 高级选项 → UEFI 固件设置 → 重启**

---

#### 二、Linux 系统

Linux 用户也能一键进入固件设置：

```bash
systemctl reboot --firmware-setup
```

这个命令支持大多数基于 `systemd` 的发行版（Ubuntu、Debian、Fedora、Arch 等）。

如果提示不支持，那就只能用开机热键进入。

---

#### 三、macOS 系统

Mac 没有传统 BIOS，只有 EFI 设置。

- **Intel Mac**：

  - 开机时长按 **Option (⌥)** 进入启动磁盘选择界面。
  - 长按 **Command + Option + P + R** → 重置 NVRAM/PRAM，相当于恢复固件设置。

- **Apple Silicon (M1/M2/M3)**：

  1. 完全关机
  2. 长按 **电源键**，直到出现“启动选项”
  3. 点击 “选项” 进入恢复模式，在里面可以修改启动安全策略等。

---

#### 四、常见品牌 BIOS 快捷键速查表

| 品牌          | 快捷键          |
| ------------- | --------------- |
| 联想 ThinkPad | F1              |
| 联想 IdeaPad  | F2              |
| 华硕 ASUS     | F2 或 DEL       |
| 惠普 HP       | ESC 或 F10      |
| 戴尔 Dell     | F2              |
| 宏碁 Acer     | F2 或 DEL       |
| 微星 MSI      | DEL             |
| 技嘉 GIGABYTE | DEL             |
| 微软 Surface  | 音量加 + 电源键 |

---

#### 总结

- **Windows 用户**：最推荐 `shutdown /r /fw /t 0`，前提是 UEFI 模式。
- **Linux 用户**：推荐 `systemctl reboot --firmware-setup`。
- **Mac 用户**：通过开机组合键进入固件设置。

以后再也不用拼手速狂按 F2/DEL 了，直接用命令行一键进 BIOS，优雅又高效。

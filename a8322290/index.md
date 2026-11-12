# 记录mokee刷机

- URL: https://blog.no-claw.com/a8322290/
- 日期: 2021-01-22
- 分类: 软件
- 标签: 手机

## How does flash mokee as Android System?

如果你的系统是稳定版的话，可能需要先降级回到开发版

### 0. unlock and image zip download

You can use SD card or OTG USB as your image zip storage.

- [ ] mokee MK-${version}.zip (system zip)
- [ ] Magisk-v21.0.zip (ROOT solution & Universal Systemless Interface provided by John Wu)
- [ ] open_gapps (GSM services)

### 1. [twrp](https://twrp.me/xiaomi/xiaomimi8.html)

###### find your android device

```
adb device
```

###### reboot into fastboot

```
adb reboot bootloader
```

###### flash twrp into fastboot

```
fastboot flash recovery twrp.img
```

after flash twrp rec

```
fastboot reboot
```

### 2. use image to flash device

```bash
fastboot flash recovery twrp-x.x.x-x-x.img
```

2023 年 mokee 已经停更了

[图：image-20230124204514395]

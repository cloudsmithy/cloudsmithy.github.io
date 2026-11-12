# MacOS安装的软件无法打开

- URL: https://blog.no-claw.com/3ab0fe4d/
- 日期: 2024-02-02
- 分类: 电子产品 / 电脑 / 苹果
- 标签: Apple

[图：image.png]

因为 PicGo 没有签名，所以会被 macOS 的安全检查所拦下。

1. 安装后打开遇到「文件已损坏」的情况，请按如下方式操作：

信任开发者，会要求输入密码:

```
sudo spctl --master-disable
```

然后放行 PicGo :

```
xattr -cr /Applications/PicGo.app
```

然后就能正常打开。

https://github.com/Molunerfinn/PicGo/blob/dev/FAQ.md

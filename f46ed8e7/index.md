# 懒猫微服实战入门（二十五）：有了懒猫微服之后，我用 Vaultwarden 平替了 1Password 订阅，附送迁移方案

- URL: https://blog.no-claw.com/f46ed8e7/
- 日期: 2025-09-11
- 分类: 懒猫微服 / 入门
- 标签: 懒猫微服

之前用的 1Password 会员快到期了，价格也不便宜。正好在懒猫微服商店看到了 Vaultwarden，就顺势换成了这个“平替”。

相信很多人听过 Bitwarden。**Vaultwarden** 是社区开发的 **Bitwarden 服务端轻量实现**，最初叫 bitwarden_rs，后来改名为 Vaultwarden。它用 Rust 编写，资源占用小，兼容 Bitwarden 官方客户端，适合个人用户或小团队自建。

在懒猫商店可以直接下载这个应用，安装和使用指南可以参考社区的帖子：[玩机攻略:一个开源的密码管理器 Vaultwarden](https://lazycat.cloud/playground/guideline/489)

[图：image-20250910212133032]

### 从 1Password 迁移到 Vaultwarden

我在 Bitwarden 的 Wiki 中找到了一份迁移指南：先从 1Password 导出数据，再在 Vaultwarden/Bitwarden 中完成导入。

[图：54a1b64d1bd3ad9a6d4a6b732b3e2ab0]

在 1Password 中依次选择“文件 → 导出 → 项目名称”。我这里选择导出 1PUX 格式的文件并保存到本地，这样之前保存的密码、SSH Key 等信息都可以一起导出。

> **安全提示**
>
> 1PUX 导出文件包含明文或可直接导入的敏感数据。不要上传到网盘、聊天工具或代码仓库；确认 Vaultwarden 导入成功后，应及时删除导出文件和其他临时副本。

[图：02c48f7d830178e91fa279781e4d7706]

然后在 Vaultwarden 网页端导入刚才的 1PUX 文件（需要提前新建一个文件夹）。

[图：b8f1e2c12763a073dd86d4dda81be6cc]

操作很简单，导入后数据就都同步过来了。

[图：952f35379701a54ca65baa4017735103]

### 客户端体验

如果习惯使用客户端，也可以直接在 App Store 下载桌面端。

[图：b966acec27e5696a3129bb209fd86869]

除了 macOS，Vaultwarden 同样支持 Windows 和 Linux。

[图：311468d69514f2eeafce67972754f04a]

在客户端最下面可以切换服务器地址，我这里填写的是 `https://vaultwarden.name.heiyu.space/`。

[图：Vaultwarden 自托管服务器地址设置]

这样在 App 里就能直接看到刚刚导入的数据，不需要再手动复制粘贴。

[图：bd4e8aeab8a07847fc7a206e0f56e0ba]

### 浏览器插件

除了 App，还可以使用浏览器插件。Vaultwarden 支持大多数主流浏览器。

[图：167944375459d4d66c56df40d0ff3fd2]

我平时用 Chrome 最多，所以直接在 Chrome 商店下载了插件。

[图：e03a62f507d4dc885f786a93d9fca1b0]

和桌面客户端一样，需要先设置好自己部署的服务器地址。

[图：aac98d84a80e062b58f6148fcf422f33]

登录流程和桌面端一致。

[图：caa659cb3482e34cded425905394f589]

#### 自动填充与使用体验

我在设置里打开了自动填充功能，这样日常使用方便了不少。

[图：1e399c43c98fba6f3a8729bff106cea8]

例如登录路由器后台时，Vaultwarden 就能自动填充密码，点击登录即可。

[图：57404d0fc28408777bfeff503fde0c84]

#### 总结

整体体验下来，Vaultwarden 已经完全替代了我之前的 1Password：功能齐全、部署轻量，还能节省一笔订阅费用。对于个人或小团队来说，确实是一个非常值得的平替方案。

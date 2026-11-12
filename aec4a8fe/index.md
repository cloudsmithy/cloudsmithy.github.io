# Home Assistant 实现米家设备接入 HomeKit，圆梦苹果全家桶

- URL: https://blog.no-claw.com/aec4a8fe/
- 日期: 2024-01-02
- 分类: 电子产品 / 外设
- 标签: 外设

最近终于把软路由搞定，群晖上也顺利安装好了 Docker，于是立马安排上迟到了好几年的 Home Assistant（简称 HA）。这篇文章就分享一下如何用 HA 把米家设备接入 Apple 的 HomeKit，真正实现“苹果家庭全自动”的梦想！

##

## Step 1：用 Docker 部署 Home Assistant

先直接上命令。建议使用 `host` 网络模式，不然后面 iPhone 添加 HomeKit 的时候经常找不到设备。

```bash
sudo docker run -d --name="home-assistants" --net=host homeassistant/home-assistant
```

> 小提示：我图省事没做目录映射，但大家正式部署还是建议把 `config` 映射出来，便于备份和迁移。

启动完成后，默认监听在 `8123` 端口。浏览器访问 `http://群晖IP:8123` 即可进入 HA 初始界面。

[图：初始界面]

---

## Step 2：初次配置 Home Assistant

第一次访问会提示你创建账户。

[图：创建用户]

接着可以选择你的地理位置，后面用于推送天气等信息。

[图：位置设置]

---

## Step 3：安装米家插件，让 HA 支持 Xiaomi 生态

参考的是小米官方的 Home Assistant 插件项目：

🔗 项目地址：https://github.com/XiaoMi/ha_xiaomi_home

先进入 HA 容器内部，然后安装插件。

```bash
cd config
git clone https://github.com/XiaoMi/ha_xiaomi_home.git
cd ha_xiaomi_home
./install.sh /config
```

完成后重启 HA 容器，重新登录到 UI 界面。

点击左下角“设置” → “设备与服务”，进入集成页面：

[图：进入设备与服务]

点击“添加集成”，选择 **Xiaomi Home**：

[图：添加米家集成]

会先看到免责声明，点继续。

[图：免责声明]

---

## Step 4：通过 OAuth 登录小米账号

插件采用 OAuth 登录小米账号，这一步会打开小米官方的登录授权页面。

[图：授权页面]

登录成功后返回回调地址：

[图：登录页面]

> ⚠️ 注意：默认回调地址是 `http://homeassistant.local`，很多时候解析不了。可以手动把浏览器地址栏改成 `http://你的HA局域网IP:8123`，再回车，就能完成回调流程。

[图：手动改回调地址]

成功登录后会同步你米家账号下所有的设备：

[图：导入设备]

数量感人！

[图：米家设备清单]

---

## Step 5：添加 HomeKit 支持

进入“设置” → “设备与服务”，右下角点击“添加集成”，选择 HomeKit：

[图：添加 HomeKit 集成]

接着选择 HomeKit Bridge：

[图：选择 Bridge 模式]

添加完成后左侧会出现一个 HomeKit 的二维码，使用 iPhone 上的“家庭”App 扫码配对即可。

[图：生成配对码]

添加过程中，如果出现以下提示，说明网络设置有问题，大概率是 HomeKit 无法找到设备。

[图：超时错误]

---

## Step 6：排查 HomeKit 配对失败的问题

如果 iPhone 迟迟找不到 Home Assistant 设备，务必检查网络配置：

1. 进入“设置” → “系统” → “网络”，找到 HA 的网络适配器；
2. 确保它和你手机所在的 Wi-Fi 是在同一个网段；
3. 如果是 Docker + 群晖用户，确保容器是 `host` 网络模式；
4. 没看到网卡配置？记得开启高级选项！

[图：网络配置页面]

左下角点击头像，开启高级：

[图：image-20250322151740390]

没开高级的话是这样的：

[图：开启高级设置]

---

## Step 7：设备全部导入 HomeKit！

终于圆梦！所有米家设备都顺利接入了 HomeKit，iPhone 上可以直接语音控制开灯、调温度，真正体验到苹果生态下的丝滑体验。

[图：导入成功]

---

## 尾巴

从部署 HA 到米家设备接入，再到 HomeKit 配对，中间有点小坑，但整体体验还是很不错的。如果你也想让米家秒变 HomeKit 原生设备，不妨试试这个方法。让智能家居真正融入 iOS 生态，丝滑又稳定！

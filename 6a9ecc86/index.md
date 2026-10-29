# Coco-AI 集成语雀作为语料库进行检索

- URL: https://blog.no-claw.com/6a9ecc86/
- 日期: 2025-04-17
- 分类: 极限科技 / Coco AI
- 标签: 极限科技, Coco AI, AI

## coco-AI 把语雀当作语料库做检索

说在前面，这个功能需要在语雀后台申请 Personal Access Token。使用的需要超级会员的（不是邀请新用户给的专业会员），所以需要付费使用。

[图：image-20250417184514581]

然后在语雀后台，也就是https://www.yuque.com/settings/tokens处可以看见申请token的地方，如果你没有超级会员，这个是没办法用的。

[图：image-20250417184608457]

点击新建，创建 token 分发权限，我这边给了所以的权限，语雀和 Notion 不同，这里给了权限就够了，其他地方无需在给权限。（手动@Notion 还要在文档或者文件夹授权）

[图：image-20250417184731432]

点击查看详情可以看到 token，这里的 token 是可以反复查看的，由此语雀这一侧的设置完毕。

[图：image-20250417184902299]

回到 coco-AI,我这边使用的是这个镜像，这里添加了对个人版本语雀的支持。

```bash
infinilabs/coco:0.3.2_NIGHTLY-20250417
```

启动命令如下：

```
docker run -d --name cocoserver -p 9000:9000 infinilabs/coco:0.3.2_NIGHTLY-20250417
```

然后进入后台初始化模型，我这里使用的本地部署的 deepseek：

[图：image-20250417185219148]

点击数据源，选择 yuque connector

[图：**image-20250417185638555**]

配置的地方很简单，填入数据源名称和 Token 和刷新时间。

[图：image-20250417185517578]

然后我们就可以看到刷新的数据了

[图：image-20250417190023214]

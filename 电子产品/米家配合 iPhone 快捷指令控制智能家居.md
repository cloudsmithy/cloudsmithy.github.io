---
title: 米家配合 iPhone 快捷指令控制智能家居
date: '2024-10-28 17:33:30'
updated: '2024-10-28 17:33:30'
abbrlink: '85170954'
categories:
- 电子产品
tags:
- Apple
- 家庭网络
description: 以空调伴侣为例，在米家创建手动场景并加入 Siri 快捷指令，记录通过 iPhone 和 HomePod 控制设备的过程。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/142033886
source_title: 米家 + iphone 快捷指令 ≈ HomeKit
---

依我看，现在的智能家居分两个大的阵营， 小米生态（米家）以及Apple 生态（HomeKit）。二者都是目前市场上较为流行的智能家居生态系统。

**米家**是小米公司推出的智能家居品牌，它以高性价比和丰富的产品线著称。米家生态的产品覆盖了从基础家居设备到高端智能产品，用户可以通过米家App来控制和联动各种智能设备。米家生态的一个显著特点是它的开放性，它不仅支持小米自家的产品，也支持第三方品牌的智能设备，这使得用户在选择产品时有着较大的灵活性，也能够更加方便的集成其他品牌的智能设备。如果你是开发者，那么也可以选择使用第三方的SDK让自己的嵌入式平台能够接入米家。

Apple生态，特别是**HomeKit**，是苹果公司推出的智能家居平台。它以安全性、隐私保护和高品质体验为卖点。HomeKit生态的产品需要通过苹果的严格审核，确保了产品的质量和用户体验。用户可以通过iPhone、iPad、Mac或Apple Watch等苹果设备来控制HomeKit兼容的智能设备，实现家居自动化。Apple生态的一个优势是其设备间的无缝连接和协同工作，例如，Siri可以跨设备使用，iCloud可以同步不同设备上的数据。此外，苹果生态的隐私保护措施较为严格，用户的智能家居数据主要存储在本地设备上，而不是云端，这为注重隐私的用户提供了额外的安全保障。

当然，两种群体不一样。体验智能家居一般会从米家开始，

对于HomeKit总会给人一种轻奢的感觉，如果你看中了Aquara的全屋定制，那一定是一笔不小的消费。

### <a id="_12"></a>配置米家

这里是我目前的部分智能设备，使用了空调伴侣来控制空调，这样就可以使用手机APP来替代传统的遥控器，同时也可以使用语音来执行这个动作。

![米家配合 iPhone 快捷指令控制智能家居配图](/images/migrated/b591f8de16dc8f2afd3b.png)

首先在米家中创建手动控制，这里是为了编辑指令名称以及指令对应的动作。  
![米家配合 iPhone 快捷指令控制智能家居配图](/images/migrated/ea5b6c79065f49c449a2.png)

我这里以打开空调为例，设置控制的名称：

![米家配合 iPhone 快捷指令控制智能家居配图](/images/migrated/9a7f551c48d7d80c91a2.png)  
在添加执行动作地方我们选择设备，也就是我们在前面看到的那些智能硬件。  
![米家配合 iPhone 快捷指令控制智能家居配图](/images/migrated/33b7ff36d2de918f65c1.png)  
我购买的是智能的空调伴侣，当接入米家APP的时候，就可以使用手机替代空调遥控器进行操作，十分方便。  
![米家配合 iPhone 快捷指令控制智能家居配图](/images/migrated/a603f20ff68bc2be65c9.png)

这时候我们可以对开/关进行控制，或者开到特定的档位。（需要分别设置）

![米家配合 iPhone 快捷指令控制智能家居配图](/images/migrated/3d482e85281c8ea978f2.png)  
![米家配合 iPhone 快捷指令控制智能家居配图](/images/migrated/f0f17bcb542fe2c03d29.png)  
这个步骤添加之后，就可以在“我的智能”这里发现刚刚添加的步骤了。然后点击右上角的添加到Siri，就可以和Iphone 进行联动。  
![米家配合 iPhone 快捷指令控制智能家居配图](/images/migrated/cd80c47fe8fb788a37ea.png)  
在这里录制控制指令：  
![米家配合 iPhone 快捷指令控制智能家居配图](/images/migrated/48fc34a41f6df60c3839.png)

### <a id="Apple__41"></a>Apple 快捷指令

这个是添加好的所有快捷指令，我们可以如法炮制来添加每个设备的开和关。  
![米家配合 iPhone 快捷指令控制智能家居配图](/images/migrated/524c1748686725ef9966.png)

所有的设置都在快捷指令中完成，我的Homekit中就仅仅接入了一个HomePod。

![米家配合 iPhone 快捷指令控制智能家居配图](/images/migrated/56992278db4ee6257e9a.png)

### <a id="_50"></a>效果展示

回到家喊一句“Siri 打开空调”， HomePod就会自动寻找我的Iphone（局域网），然后通过iphone执行快捷指令，最后唤起米家执行对应的指令。

如果，你刚好有Home Assistant，那就是另外的故事了。

![米家配合 iPhone 快捷指令控制智能家居配图](/images/migrated/afc35fbd1806aa0e2c04.png)

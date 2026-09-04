---
title: '自带内网穿透，懒猫微服治好了我的 NAS 焦虑'
description: 懒猫微服自带内网穿透功能，彻底解决 NAS 远程访问焦虑
tags:
  - NAS
  - 懒猫微服
toc: true
categories:
  - 懒猫微服
  - 番外
abbrlink: b1e8232f
date: 2025-05-04 00:00:00
---

一两年前就知道懒猫微服，最初的印象是极客机甲风格，有颜值也有性能。最近入手是因为朋友推荐，主要还是喜欢它自带的内网穿透功能。虽然家里有公网 IP，但运营商会不定时封端口，而且不只封常用端口。询问运营商也没有明确结论，倒不如选一个商业产品，省下自己折腾的时间。

虽然我一直很想 DIY 这样一款产品，但开源方案大多基于 KVM，商业方案里则有 ESXi。毕竟个人精力有限，这个想法一直搁置到现在。后来事情越来越多，我干脆购买一台来玩，也换个身份当甲方提需求。官网如下：https://lazycat.cloud/

![image-20250504201210064](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250504201210064.png)

机器就是这样，带着浓浓的机甲风格。连续运行几天也一点都不烫，之前还担心会有“炒豆子”一样的硬盘噪音，实际在白天几乎听不到。

- i5-1135G7，现在来看不算最新的，不过也比很多 NAS 强很多了，手动@群晖

- 32G 内存（只能一个盘位，所以加满了）

- 2.5 寸 2T 原装 HDD（预算有限，目前还在测试阶段，自带的盘是叠瓦盘，介意的话可以自己买盘替换）

![image-20250504200345665](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250504200345665.png)

从 neofetch 可以看到系统基于 Debian 12。开发团队在上层构建了自己的应用体系，SSH 权限需要额外申请，不过很快就批了。

![image-20250504202608288](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250504202608288.png)

提供全平台的客户端，该有的都有了，这里开发适配应该花了不少时间吧。

![image-20250504195908460](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250504195908460.png)

macOS 客户端的界面如下。通过 Web 访问时也是这种服务导向的界面，和传统群晖的主页不太一样。对于小白来说，只需要按照 SaaS 的方式使用，比如文件备份、Time Machine、异地组网。而对于技术人员来说，我个人觉得反而更费脑子：要搞清楚每个服务怎么启动、怎么保证网络传输、怎么保证 HA。尽管懒猫团队已经实现了这些，但出于职业习惯，我还是希望抽丝剥茧，搞清楚从 IaaS 到 SaaS 的原理，理解背后的设计思路，再尝试往懒猫商店上架自己的应用，把应用接入懒猫的 SSO 系统。

![image-20250504171611929](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250504171611929.png)

关于服务，是大多数玩家最喜欢的地方。有专门的 N 对 1 答疑，7×18 服务比 7×24 听起来反而靠谱很多，只能说专业，太专业了。团队来自 deepin 的二次创业，都是技术流，所以懂用户，在群里可以做深入的技术答疑。以前我的感受是，NAS 玩家大多是爱好者，很多人不懂 Linux 和开发；有些懂技术的人又偏理论，对自己的主机和应用没有兴趣。以前的同事也会因为这些话题结缘，但由于彼此方向不同，讨论更多集中在 IaaS 和网络层面，端到端的解决方案很少。

但是懒猫让我看到了未来 NAS 进化的方向：从硬件、IaaS、PaaS 到 SaaS 做了整套定制，也完成了我一直想做却没有做完的事情。最早我的想法是在 CentOS 上用 Docker 跑很多服务，用 NFS 做共享，用 KVM 做虚拟化层，再用商业方案做异地组网。整个过程十分坎坷，遇到了硬盘噪音、纯开源项目支持不到位、商业方案售后不专业等问题，最后只能留在内网使用，走了很多弯路。

相信懒猫的这个价格，如果用 AWS 的话，最多半年就烧光 credit 了。有如此专业的团队来支持，治好了我的 NAS 焦虑。

![image-20250504201658519](https://raw.githubusercontent.com/cloudsmithy/picgo-imh/master/image-20250504201658519.png)

文章来源：

![image.png](https://lzc-playground-1301583638.cos.ap-chengdu.myqcloud.com/guidelines/459/c24bffd1-eb1f-40fa-9dc6-bc5dc9337601.png "image.png")

---

<!-- wangjishanren-qrcode:start -->
<p align="center">
  <a href="https://developer.lazycat.cloud/assets/wangjishanren-qrcode.Bx4A1xuG.jpg">
    <img src="https://developer.lazycat.cloud/assets/wangjishanren-qrcode.Bx4A1xuG.jpg" alt="忘机山人二维码" width="240">
  </a>
</p>
<p align="center">扫码关注「忘机山人」</p>
<!-- wangjishanren-qrcode:end -->

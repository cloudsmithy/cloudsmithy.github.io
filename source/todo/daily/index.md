---
title: 日记
date: 2026-04-29 10:00:00
sitemap: false
---

每天一句话，按月倒序。在这里[编辑日报](https://github.com/cloudsmithy/cloudsmithy.github.io/blob/master/source/todo/daily/index.md)。想看阶段性复盘请移步 [月报](/todo/monthly/)。


{% timeline 2026-05 %}

<!-- timeline 05-26 -->
配置了SAML集成Amazon Grafana，SAML果然是技术债，不同的软件的SAML断言字段都不一样，这是一个不通用的情况，如果断言不对，那么就是SSO登陆过了但是cookie种不到后端Service，然后401报错。看了Grafana for beginner。基本就是链接数据源，然后画图，使用SQL过滤，然后监控警报，RBAC。
<!-- endtimeline -->

<!-- timeline 05-25 -->
配置了飞书ws 链接Claude Code。当商业APP用吧。
<!-- endtimeline -->

<!-- timeline 05-24 -->
1. 汽锅鱼挺好吃的，好像有点少，汤很好喝。
2. 换房子看房子依旧很让人崩溃。
<!-- endtimeline -->

<!-- timeline 05-23 -->
针灸拔针的时候小护士落下一根针就让我起来，我直接告诉她左风池没拔。
<!-- endtimeline --> 

<!-- timeline 05-20 -->
人家过520 我跑医院，早上针灸，下午其他科室花20元被骂了一顿。收到医院的问卷评价，算了，没法写。
<!-- endtimeline -->


<!-- timeline 05-19 -->
今天十点半就早睡了，睡了八小时第二天6点半起来还没睡够。
<!-- endtimeline -->

<!-- timeline 05-18 -->
开始Wagas吃轻食，晚上尽量不吃饭。
<!-- endtimeline -->

<!-- timeline 05-16 -->
本来打算去医院针对之前的不好好看病的场景撕，一方面起不来，另一方面感觉没有必要了。我已经找到答案了，没必要徒增烦恼，这不是复盘。所谓的不要和猪打架，就是这个意思吧。
<!-- endtimeline -->

<!-- timeline 05-16 -->
没事用手多按压期门穴，因为离肺太近了，所以就不留针自己按吧。
<!-- endtimeline -->

<!-- timeline 05-15 -->
日出拉面搬迁到望京之后还是第一次来吃，汤感觉不像原来那么糊嘴了，汤不错不过面煮软了之后会影响汤。望京小街跟上几年前比有些烟火气了，但是也仅仅是那些热门的店。
<!-- endtimeline -->

<!-- timeline 05-14 -->
优化了blog的sitemap，整理了之前[CRC32的哈希碰撞的情况](https://blog.no-claw.com/428cc28c/)，也是比较活久见。
<!-- endtimeline -->

<!-- timeline 05-13 -->
这个季节的藕汤感觉没有冬天那么好喝了，粉藕也没有那么软糯了，应该是到时候了，等冬天吧。
<!-- endtimeline -->

<!-- timeline 05-12 -->
接了cloudflare的AI Gateway，有OpenAI的，也有CF SDK。
<!-- endtimeline -->

<!-- timeline 05-11 -->
好好学英语是一本万利，你技术不差，后面再学都来得及，不能让英语成为绊脚石，这个不是技术债。

<!-- endtimeline -->

<!-- timeline 05-10 -->
时隔十年，一个下午在西西弗书店，一口气终于看完了张纯如大陆版的《南京大屠杀》，前半部分讲述日本的暴行，后半部分对38-45年在日本统治下的人民的生活描写也比较客观，结尾收集了大量事实阐述了日本官方不认账但是民间有忏悔的行为。个人感觉她写作的初心和营销号的宣传不同，或者说营销号在刻意制造宿命论，不是张纯如因为缘分选择了这个话题，而是刚好到这里，不小心名声大噪，然后树大招风，人在海外因为写政治而被卷入政治。
她老公写的后记，然后在里面毫不避讳自己再娶以及孩子的精神疾病，好渣。

<!-- endtimeline -->


<!-- timeline 05-09 -->
被AI开启了新大门。Web部署在Cloudflare上，Page + Woker使用不同的域名，所以没办法使用反向代替，就需要自己解决CORS问题，这是一个因为前端多带了X-Client倒是CORS，然后无法种Cookiee的排查。
后端接入Google Oauth的时候还能直接Set Cookie，然后前端直接herf跳转就行，走完登录流程之后会给后端域名set Cookie，然后前段请求用户信息的时候会带这个头，解决完CORS问题之后，会把你前端的Cookie 显示在前端域名的Cookie下。


1. style.ootira.com 页面里
2. fetch('https://api.ootira.com/auth/me',{ credentials:'include'})
3. 浏览器看请求目标是 api.ootira.com
4. 查自己 cookie jar,找到 api.ootira.com 下的 token cookie，需要credentials:include' 
5. 自动附到请求头里发出去
6. 后端收到 cookie,验证,返回 user
7. 前端收到 user.对象,渲染
8. 前段回显Cookie


调试这里可以取消Google 授权：https://myaccount.google.com/permissions

需要补一补网络安全了：https://portswigger.net/web-security 这就是黑客攻防技术宝典：Web实战篇（第2版）这个系列
朋友也推荐了这个：https://www.securecodewarrior.com/zh


----
后端的放在cloudflare worker上的时候，前端主页不要直接检测Oauth的URL 联通是否报错，有时候会因为Serverless冷启动直接报错。所以，先call一下个healthy的API再检测登录吧。

<!-- endtimeline -->


<!-- timeline 05-08 -->
感受了早起的美好。给博客加了llm.txt和llms-full.txt，自己的todo项目终于上线了Cloudflare Page + Worker + D1，还集成了Google 登陆。
<!-- endtimeline -->

<!-- timeline 05-07 -->
Git page迁移到了Cloudflare Page, 接了Google SEO，终于抓到sitemap了（看来之前抓不到是github.io的反爬机制）
<!-- endtimeline -->

<!-- timeline 05-06 -->
跑通了Nginx + Oauth2-proxy + flask，后面需要deep dive
<!-- endtimeline -->

<!-- timeline 05-05 -->
温榆河公园初探，真是太大了，看到了满眼的油菜花
<!-- endtimeline -->

<!-- timeline 05-01 -->
尝试了Cloudflare worker的部署和微服务

<!-- endtimeline -->
{% endtimeline %}

{% timeline 2026-04 %}

<!-- timeline 04-30 -->

接通了Google Oauth, 还有Firebase

<!-- endtimeline -->

<!-- timeline 04-29 -->

✍️ 折腾博客记录体系，把日历、周报、日记揉成 timeline。

<!-- endtimeline -->


<!-- timeline 04-28 -->

大概看完五种时间，自己需要的是给每种时间留出来时间，而不是盲目的焦虑。这些焦虑不属于其中任何一种，但是很影响心情。

留好睡觉的时间，培养身心的时间，好好打扮的时间。

<!-- endtimeline -->



{% endtimeline %}

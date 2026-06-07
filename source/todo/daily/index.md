---
title: 日记
date: 2026-04-29 10:00:00
sitemap: false
---

每天一句话，按月倒序。在这里[编辑日报](https://github.com/cloudsmithy/cloudsmithy.github.io/blob/master/source/todo/daily/index.md)。想看阶段性复盘请移步 [月报](/todo/monthly/)。


{% timeline 2026-06 %}

<!-- timeline 06-07 -->
1. 网站重构，RDS serverless 竟然比RDS t4g还贵，DDB不支持聚合查询是一个很痛的点，给关系型数据库的迁移带来很大的麻烦。
2. 吃了清水亭（国贸店）。现在脆藕的时节藕汤没有那么好喝，店里用了鸡油压了下，真是一个好主意。
<!-- endtimeline -->

<!-- timeline 06-06 -->
1. 第6次针灸，雨天也很多人。考虑除了针灸之外用冥想辅助。针灸只是外物，需要调整的还是自己的日常行为模式。尝试从老的行为模式中解脱出来，这些习惯可能来自童年，原生家庭，以及吸收了太多人性的弱点。
2. 复习了下socket连接

<!-- endtimeline -->

<!-- timeline 06-05 -->
1. 当办公室的噪音堪比菜市场的时候只有降噪才能耳机压得住，普通会议耳机音量开多大都无效。这个时候还是找个会议室躲起来吧。
2. 见识到了HK人的WLB，周五晚上让他补充信息，对方直接说，我要休息。
3. 心情烦躁两大罪魁祸首，厌蠢和聒噪。
<!-- endtimeline -->


<!-- timeline 06-04 -->

1. 搬家。搬家的小孩还挺能干的，这么实诚的孩子不多了。
2. 重新看了浏览器访问网站的时候DNS的解析的流程。之前面试SA的时候答的不好。
应该是本地先找DNS的缓存（浏览器 - OS cache - Host 文件 - 上级DNS（路由器））
没有缓存的话就从最近的DNS（运营商给的，也可以直接改114）先找到根域名（也就是.）,然后. 会跳转到com.，然后google.com.

<!-- endtimeline -->


<!-- timeline 06-03 -->
在使用 AWS IAM Role 短期凭证的情况下，可以接入了Claude Desktop和[Codex](https://blog.no-claw.com/e7117226/)。

另外吐槽Gitee：真是草台班子，提完PR之后，才想起来忘记了拉起其他文件的更新了。然后拉了一下更新防止对方合并有冲突。Sync之后任何更新都找不到了，Code commit改动没了，pr也没了。

<!-- endtimeline -->

<!-- timeline 06-02 -->
使用Cohere Embed v3 和 v4 做了 Embedding 把向量写到OpenSearch OSS Serverless里，使用语义搜索，做了文本RAG和以文搜图。
OpenSearch OSS 不支持 ML pipeline（也就是神经搜索），甚至大多数Milvus的使用也是用脚本做向量化之后再做RAG，然后ES里存图片的地址。
Recall 常用的是Bi-encoder，粗筛，Rerank 是 cross-encoder，然后每个召回的结果都要和query做一个排序。（cross-encoder 是文本对文本的,搜不了图）
base64 是"运输包装",用完即弃;存储要存"地址"(path/URL),不是存"包装后的货物本身"。

<!-- endtimeline -->

<!-- timeline 06-01 -->
胡思乱想一天。饿着肚子忍住了只要去酒仙桥就去颐堤港吃饭的flag。
<!-- endtimeline -->

{% endtimeline %}

{% timeline 2026-05 %}

<!-- timeline 05-31 -->
1.吃了苏帮袁，葱油拌面，盐水鸭，but 蟹粉小笼包有点闹着玩。
2.睡觉的时候把注意力放在关元，还能睡好一点。
<!-- endtimeline -->

<!-- timeline 05-30 -->
1. 针灸第5次
2. 也是胆子大起来了，敢找小姑娘要微信了。应该是把这么多年的情商都用完了。
3. 晚上吃了麻六记，太久晚上不吃饭了，吃不动了。
<!-- endtimeline -->

<!-- timeline 05-29 -->
找公司电工问了跳闸几种极端情况，火线裸露有水汽可能短路，铁片松动导致短接，零火接反也能偶发，后面待验证。
之前家里的经常跳闸，重新接了厨房的3排插座，给热水器加了漏保插头，目前算是控制住了。（零火线接反可能导致线路过热么？）
<!-- endtimeline -->

<!-- timeline 05-28 -->
看了Datawhale的Langgraph教程，很清晰。用state在图中流转，然后还有save point啥的。后面A2A的范式估计还得找AgentCore的workshop了。
<!-- endtimeline -->

<!-- timeline 05-27 -->
看了一晚倪海厦的人纪 - 针灸大成，正好最近也在中医院针灸，主要看了内脏和五行的关系，以及和颜色的关系。然后针灸穴位导论。
<!-- endtimeline -->

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
针灸拔针的时候小护士落下一根针就让我起来，我直接告诉她左风池没拔，她很惊讶我懂穴位。
<!-- endtimeline --> 

<!-- timeline 05-20 -->
人家过520我跑两趟医院，早上针灸时间有点来不及上班，下午其他科室花20元被骂了一顿。收到下午医院的问卷评价，算了，没法写。
<!-- endtimeline -->


<!-- timeline 05-19 -->
今天十点半就早睡了，睡了八小时第二天6点半起来还没睡够。
<!-- endtimeline -->

<!-- timeline 05-18 -->
开始Wagas吃轻食，晚上尽量不吃饭。
<!-- endtimeline -->

<!-- timeline 05-17 -->
本来打算去医院针对之前的不好好看病的场景撕，一方面起不来，另一方面感觉没有必要了。我已经找到答案了，没必要徒增烦恼，这不是复盘。所谓的不要和猪打架，就是这个意思吧。
<!-- endtimeline -->

<!-- timeline 05-16 -->
1. 没事用手多按压期门穴，因为离肺太近了，所以就不留针自己按吧。
2. 针灸完去吃烤鸡，还送了拔丝地瓜，很糯=。

<!-- endtimeline -->

<!-- timeline 05-15 -->
日出拉面搬迁到望京之后还是第一次来吃，汤感觉不像原来那么糊嘴了，汤不错不过面煮软了之后会影响汤。望京小街跟上几年前比有些烟火气了，但是也仅仅是那些热门的店。
<!-- endtimeline -->

<!-- timeline 05-14 -->
优化了blog的sitemap，整理了之前[CRC32的哈希碰撞的情况](https://blog.no-claw.com/428cc28c/)，也是比较活久见。
晚上去颐堤港吃了烧肉Like。
<!-- endtimeline -->

<!-- timeline 05-13 -->
去清水亭吃了小龙虾，这个季节的藕汤感觉没有冬天那么好喝了，粉藕也没有那么软糯了，应该是到时候了，等冬天吧。
<!-- endtimeline -->

<!-- timeline 05-12 -->
接了cloudflare的AI Gateway，有OpenAI的，也有CF SDK。
<!-- endtimeline -->

<!-- timeline 05-11 -->
好好学英语是一本万利，你技术不差，后面再学都来得及，不能让英语成为绊脚石，这个不是技术债。

<!-- endtimeline -->

<!-- timeline 05-10 -->
吃完麻六记，下午在西西弗书店，时隔十年，一口气终于看完了张纯如大陆版的《南京大屠杀》，前半部分讲述日本的暴行，后半部分对38-45年在日本统治下的人民的生活描写也比较客观，结尾收集了大量事实阐述了日本官方不认账但是民间有忏悔的行为。个人感觉她写作的初心和营销号的宣传不同，或者说营销号在刻意制造宿命论，不是张纯如因为缘分选择了这个话题，而是刚好到这里，不小心名声大噪，然后树大招风，人在海外因为写政治而被卷入政治。
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
尝试了Cloudflare worker的部署和微服务。
吃了烤兔子 + 地三鲜（兔兔那么可爱，要配地三鲜吃）

<!-- endtimeline -->
{% endtimeline %}

{% timeline 2026-04 %}

<!-- timeline 04-30 -->

接通了Google Oauth, 还有Firebase

<!-- endtimeline -->

<!-- timeline 04-29 -->

✍️ 折腾博客记录体系，把日历、周报、日记揉成 timeline。
晚上去王府井步行街散步，吃了金掌勺的锅包肉。

<!-- endtimeline -->


<!-- timeline 04-28 -->

大概看完五种时间，自己需要的是给每种时间留出来时间，而不是盲目的焦虑。这些焦虑不属于其中任何一种，但是很影响心情。

留好睡觉的时间，培养身心的时间，好好打扮的时间。

<!-- endtimeline -->

<!-- timeline 04-26 -->
宜宾驻京办重新开店，点了李庄白肉和辣子鸡。
<!-- endtimeline -->

<!-- timeline 04-25 -->
在牛街吃爆肚粉，电烤串，涮羊肉，喝酸梅汤。打卡国贸颠倒世界，骑行20KM。
<!-- endtimeline -->

<!-- timeline 04-23 -->
世界读书日，深夜竟沉迷一本女性文学 —— 王潇十三年前出版的《三观易碎》。凭着残存的记忆找到这本书，差不多一口气读完了，的确讲了很多现实中不得不面对的东西，最后简直在说，不主动，你就找不到女朋友。
<!-- endtimeline -->

<!-- timeline 04-19 -->
《雨中游南中轴线》
永定门外步御道，正阳门前登箭楼。
雨天漫步中轴线，​闲时俯瞰北京城。
<!-- endtimeline -->

<!-- timeline 04-19 -->
参加ES中国峰会，吃牛杂煲，鸟巢外场听张杰演唱会，全损音质。
<!-- endtimeline -->

<!-- timeline 04-12 -->
先吃了成都驻京办，蒜泥白肉不如望京，逛了景山公园，走了北中轴线，写了游记。太原驻京办收尾。驻京办+6
<!-- endtimeline -->

{% endtimeline %}

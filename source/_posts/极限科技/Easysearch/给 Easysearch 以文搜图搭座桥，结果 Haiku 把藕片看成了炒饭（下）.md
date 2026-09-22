---
title: 给 Easysearch 以文搜图搭座桥，结果 Haiku 把藕片看成了炒饭（下）
date: '2026-07-12 11:44:47'
updated: '2026-07-12 11:44:47'
abbrlink: f90f59cd
description: 为图片生成描述和食材标签，结合向量与关键词检索改善局部细节召回，记录标注模型的误判与对照测试。
categories:
- 极限科技
- Easysearch
tags:
- Easysearch
- 搜索引擎
- AI
- AWS
- Bedrock
- Python
toc: true
source_platform: csdn
source_url: https://blog.csdn.net/weixin_38781498/article/details/162810552
source_title: 给Easysearch以文搜图搭座桥，结果 Haiku 把藕片看成了炒饭 （下）
---

上一篇（《我用 Easysearch 搭了个「以文搜图」，然后被一盘藕片上了一课》）结尾我立了个 flag：

> 整图语义和局部细节之间那道坎，模型自己迈不过去，得靠工程手段搭桥。下一篇，就来搭这座桥。

这篇就来还债。桥搭成了，「藕片」也终于排到了第一——但中间被一个模型摆了一道，那段值得单拎出来讲。

先把上回的病情复述一句：搜「海鲜汤」准得不行，搜「藕片」却翻车。根子在于 Cohere Embed v4 给整张图只生成**一个**向量，代表的是**整盘菜是什么**；藕片只是小龙虾里的配菜，占画面一成，语义被稀释了，向量根本指不到它。

---

### <a id="t0"></a><a id="_Hybrid__10"></a>一、这座桥叫 Hybrid 检索

思路其实朴素得很：**向量看不清的，让文字来补。**

- **向量检索**管「语义相似」——你搜「红烧的炖菜」，它能捞回一堆你没提过具体名字的菜。这是它的长处，得留着兜底。
- **关键词检索（BM25）**管「精确命中」——你搜「藕片」，只要哪张图的描述里**明明白白写着「藕片」两个字**，它就能一把揪出来。这正是向量的短板。

两路一起打分、融合排序，就叫 **Hybrid 检索**。向量兜住语义的下限，关键词捞回精确的漏网之鱼。

可问题来了：图片本身没有文字啊，BM25 拿什么去 match？

所以搭桥的第一根桩，是**给每张图先配上一段文字**——让一个能看图的多模态大模型，替每张图写句描述、列一串食材标签，存进 Easysearch 的全文字段里。这样「藕片」这个词，就从「藏在像素里」变成了「白纸黑字」，BM25 才够得着。

说白了，就是**花钱请个模型，把图翻译成话**。那，请谁呢？

---

### <a id="t1"></a><a id="_Haiku__27"></a>二、请 Haiku 来打标签，结果它把小龙虾看成了炒饭

图便宜活不重，我第一反应是叫最轻的 **Claude Haiku 4.5**——快、便宜，标注这种粗活它该够了。

提示词写得也算讲究：让它输出严格 JSON，`caption` 一句话，`tags` 逐一列出画面里每种食材，**尤其是配菜**。特意强调了配菜，就怕它漏掉藕片。

跑第一张（就是那张惹事的小龙虾藕片），Haiku 张口就来：



```json
{
  "caption": "一道色香味俱全的海鲜炒饭，鲜红的龙虾与嫩滑的牛肉块混合，配以葱段和香油调味。",
  "tags": ["龙虾", "牛肉", "炒饭", "葱段", "海鲜", "米饭", "油炸", "中式料理", "荤菜"]
}
```



我盯着这段看了三秒——**炒饭？牛肉？** 那明明是盘小龙虾配藕片，哪来的炒饭，哪来的牛肉，藕片更是提都没提。它不光没认出配菜，连主菜都看岔了，还煞有介事地脑补出「香油调味」。

主打一个一本正经地胡说八道。

这下问题就尖锐了：**桥能不能承重，取决于用什么料造。** 如果连负责打标签的模型都把菜看错，那关键词字段里存的全是错话，Hybrid 检索反而会把人往沟里带——你搜「牛肉」它给你端上盘小龙虾。省这点钱，等于把桥墩浇成了豆腐渣。

得换料。

---

### <a id="t2"></a><a id="_Opus__52"></a>三、换 Opus 上来，藕片终于被看见了

同一张图、同一段提示词，我把模型从 Haiku 换成 Sonnet 4.5，又换成 Opus 4.8，做了组横评：

| 模型 | 认出藕片了吗 | 它说这是什么 |
| --- | --- | --- |
| **Haiku 4.5** | ❌ | 「海鲜炒饭，龙虾配牛肉」——主配菜全错 |
| **Sonnet 4.5** | ✅ | 「小龙虾配藕片和蔬菜」，tags 里有「莲藕」 |
| **Opus 4.8** | ✅ | 「蒜蓉小龙虾配藕片、黄瓜和青椒」，tags 直接是「藕片」二字 |

高下立判。

Sonnet 已经能认出藕片了，标签写的是「莲藕」；Opus 更狠，caption 通顺不说，tags 里干脆就是**「藕片」**两个字——和用户会打进搜索框的词一模一样。对 BM25 来说，这种「字面精确对上」是顶好的料。

> 一句题外话，也是我一直挺认的：**贵模型未必哪儿都值那个价，但在「看清细节」这种硬骨头上，参数量的差距是实打实的。** 标个葱姜蒜，Haiku 绰绰有余；可要在一盘红油浓酱里把半掩着的藕片给拎出来，还得是 Opus。选型这事，得看你这一步到底在为什么买单。

那就 Opus 了。`caption_images.py` 的核心，就是让它看图吐 JSON：



```python
CAPTION_MODEL = "global.anthropic.claude-opus-4-8"

PROMPT = ("你是专业的中餐美食标注助手。仔细看这张图，用中文输出严格 JSON："
          '{"caption":"一句话描述这道菜","tags":["标签"]}。'
          "tags 必须逐一列出你在画面里认出的每种食材，包括配菜和不显眼的。"
          "只输出 JSON，不要解释、不要 markdown 代码块。")

def caption(path):
    b64 = base64.b64encode(open(path, "rb").read()).decode()
    body = {
        "anthropic_version": "bedrock-2023-05-31", "max_tokens": 500,
        "messages": [{"role": "user", "content": [
            {"type": "image", "source": {"type": "base64",
                                         "media_type": "image/jpeg", "data": b64}},
            {"type": "text", "text": PROMPT},
        ]}],
    }
    txt = json.loads(bedrock.invoke_model(modelId=CAPTION_MODEL,
                     body=json.dumps(body))["body"].read())["content"][0]["text"]
    obj = json.loads(re.search(r"\{.*\}", txt, re.S).group(0))   # 容错：从回复里抠出 JSON
    return {"caption": obj.get("caption", ""), "tags": obj.get("tags", [])}
```


> ⚠️ 一个真会踩的坑：Bedrock 上的 Claude 4.x 系列**不支持按需直调**，`modelId` 得带区域前缀（`us.anthropic.claude-...` 或 `global.anthropic.claude-...`）走 inference profile，否则甩你一句 `Invocation ... with on-demand throughput isn't supported`。我第一发就撞上了。

给 10 张图挨个打完标签，Opus 的表现相当稳——两碗汤认出了「海参鲍鱼花胶」，越南沙拉认出了「香茅蘸酱」，连那张混进来的高楼照片，它都老老实实标了句「并非中餐美食，tags 为空」。诚实得可爱。

---

### <a id="t3"></a><a id="_Easysearch__100"></a>四、字段要落地，得先教 Easysearch 断中文词

标签生成好了，得有地方存。给已有的 `image_search` 索引加三个字段：



```bash
curl -sk -u "admin:$ES_PASS" -XPUT "$ES_URL/image_search/_mapping" \
  -H 'Content-Type: application/json' -d '{
  "properties": {
    "caption":      { "type": "text",    "analyzer": "ik_max_word" },
    "tags":         { "type": "keyword" },
    "caption_text": { "type": "text",    "analyzer": "ik_max_word",
                                         "search_analyzer": "ik_smart" }
  }
}'
```



这里的关键是 `analyzer` 用了 **`ik_max_word`**——IK 中文分词器。

为什么非它不可？说到底，Easysearch（同 ES 一系）默认的分词器**不认中文词**，会把「小龙虾配藕片」按字母/空格切，中文一整句被当成一个不可分的整块，你搜「藕片」根本 match 不上。IK 分词器才能把「蒜蓉小龙虾配藕片黄瓜青椒」切成「蒜蓉 / 小龙虾 / 藕片 / 黄瓜 / 青椒」这样一颗颗独立的词——藕片这才成了一个能被单独命中的 token。

好在这套 Easysearch 自带了 `analysis-ik` 插件，拿来即用。`caption_text` 这个字段，我把 caption 和 tags 拼在一起塞进去，专门喂给 BM25。

灌标签就一句：



```bash
python3 caption_images.py
```



它用 `_update` 局部更新——向量是上一篇 `index_images.py` 写好的，这回只往每篇文档补 caption/tags，不动向量。各司其职。

---

### <a id="t4"></a><a id="_132"></a>五、把两路拧成一股绳

材料齐了，改查询。上一篇是光秃秃一个 `knn_nearest_neighbors`，这回用 `bool` 把它和关键词 `match` 拧到一起：



```python
knn = {"knn_nearest_neighbors": {
    "field": "embedding", "vec": {"values": vec},
    "model": "exact", "similarity": "cosine",
}}

if hybrid:
    # must 里放 knn 兜底语义召回; should 里放关键词, boost 让命中标签的图显著提分
    query = {"bool": {"must":   [knn],
                      "should": [{"match": {"caption_text": {"query": text, "boost": 4.0}}}]}}
else:
    query = knn        # 退回纯向量, 用于对照
```



拆开看这个 `bool`：

- **`must` 放 knn**——向量语义是地基，保证哪怕关键词一个没中，也有语义相似的图垫底，不至于开天窗。
- **`should` 放 match**——关键词是加分项。哪张图的 `caption_text` 里出现了「藕片」，BM25 就给它加一大笔分。
- **`boost: 4.0`**——这是个手感活。向量分在 1~2 之间，BM25 分天生比它大一截，再乘个 4，就是明明白白告诉引擎：**关键词字面命中这件事，我很看重。** 命中标签的图，分数会被顶得断层领先。

`boost` 具体给多少没有标准答案，得看你更信语义还是更信字面，调着看效果。我这儿给 4，是想让「藕片」这种精确查询的效果最扎眼。

---

### <a id="t5"></a><a id="_160"></a>六、见桥

改完重启，搜「藕片」，纯向量和 Hybrid 各来一发对照：

**纯向量**（`?hybrid=0`）——老样子，藕片图淹在第五，前排全是汤：



```
#1  1.246  海参鲍鱼花胶汤
#2  1.244  海参鲍鱼汤
#3  1.239  川味红烧牛肉面
 ...
#5  1.200  蒜蓉小龙虾配藕片    ← 那张真有藕片的，还是沉着
```



**Hybrid**——关键词一介入，藕片图直接被顶穿天花板：



```
#1  9.129  蒜蓉小龙虾配藕片    ← 从 1.2 飙到 9.13，断层第一
#2  1.246  海参鲍鱼花胶汤
#3  1.244  海参鲍鱼汤
```



## <a id="t6"></a><a id="_Haiku__182"></a>外一篇：给以文搜图搭座桥，结果 Haiku 把藕片看成了炒饭

上一篇（《我用 Easysearch 搭了个「以文搜图」，然后被一盘藕片上了一课》）结尾我立了个 flag：

> 整图语义和局部细节之间那道坎，模型自己迈不过去，得靠工程手段搭桥。下一篇，就来搭这座桥。

这篇就来还债。桥搭成了，「藕片」也终于排到了第一——但中间被一个模型摆了一道，那段值得单拎出来讲。

先把上回的病情复述一句：搜「海鲜汤」准得不行，搜「藕片」却翻车。根子在于 Cohere Embed v4 给整张图只生成**一个**向量，代表的是**整盘菜是什么**；藕片只是小龙虾里的配菜，占画面一成，语义被稀释了，向量根本指不到它。

---

### <a id="t7"></a><a id="_Hybrid__194"></a>一、这座桥叫 Hybrid 检索

思路其实朴素得很：**向量看不清的，让文字来补。**

- **向量检索**管「语义相似」——你搜「红烧的炖菜」，它能捞回一堆你没提过具体名字的菜。这是它的长处，得留着兜底。
- **关键词检索（BM25）**管「精确命中」——你搜「藕片」，只要哪张图的描述里**明明白白写着「藕片」两个字**，它就能一把揪出来。这正是向量的短板。

两路一起打分、融合排序，就叫 **Hybrid 检索**。向量兜住语义的下限，关键词捞回精确的漏网之鱼。

可问题来了：图片本身没有文字啊，BM25 拿什么去 match？

所以搭桥的第一根桩，是**给每张图先配上一段文字**——让一个能看图的多模态大模型，替每张图写句描述、列一串食材标签，存进 Easysearch 的全文字段里。这样「藕片」这个词，就从「藏在像素里」变成了「白纸黑字」，BM25 才够得着。

说白了，就是**花钱请个模型，把图翻译成话**。那，请谁呢？

---

### <a id="t8"></a><a id="_Haiku__211"></a>二、请 Haiku 来打标签，结果它把小龙虾看成了炒饭

图便宜活不重，我第一反应是叫最轻的 **Claude Haiku 4.5**——快、便宜，标注这种粗活它该够了。

提示词写得也算讲究：让它输出严格 JSON，`caption` 一句话，`tags` 逐一列出画面里每种食材，**尤其是配菜**。特意强调了配菜，就怕它漏掉藕片。

跑第一张（就是那张惹事的小龙虾藕片），Haiku 张口就来：



```json
{
  "caption": "一道色香味俱全的海鲜炒饭，鲜红的龙虾与嫩滑的牛肉块混合，配以葱段和香油调味。",
  "tags": ["龙虾", "牛肉", "炒饭", "葱段", "海鲜", "米饭", "油炸", "中式料理", "荤菜"]
}
```



我盯着这段看了三秒——**炒饭？牛肉？** 那明明是盘小龙虾配藕片，哪来的炒饭，哪来的牛肉，藕片更是提都没提。它不光没认出配菜，连主菜都看岔了，还煞有介事地脑补出「香油调味」。

主打一个一本正经地胡说八道。

这下问题就尖锐了：**桥能不能承重，取决于用什么料造。** 如果连负责打标签的模型都把菜看错，那关键词字段里存的全是错话，Hybrid 检索反而会把人往沟里带——你搜「牛肉」它给你端上盘小龙虾。省这点钱，等于把桥墩浇成了豆腐渣。

得换料。

---

### <a id="t9"></a><a id="_Opus__236"></a>三、换 Opus 上来，藕片终于被看见了

同一张图、同一段提示词，我把模型从 Haiku 换成 Sonnet 4.5，又换成 Opus 4.8，做了组横评：

| 模型 | 认出藕片了吗 | 它说这是什么 |
| --- | --- | --- |
| **Haiku 4.5** | ❌ | 「海鲜炒饭，龙虾配牛肉」——主配菜全错 |
| **Sonnet 4.5** | ✅ | 「小龙虾配藕片和蔬菜」，tags 里有「莲藕」 |
| **Opus 4.8** | ✅ | 「蒜蓉小龙虾配藕片、黄瓜和青椒」，tags 直接是「藕片」二字 |

高下立判。

Sonnet 已经能认出藕片了，标签写的是「莲藕」；Opus 更狠，caption 通顺不说，tags 里干脆就是**「藕片」**两个字——和用户会打进搜索框的词一模一样。对 BM25 来说，这种「字面精确对上」是顶好的料。

> 一句题外话，也是我一直挺认的：**贵模型未必哪儿都值那个价，但在「看清细节」这种硬骨头上，参数量的差距是实打实的。** 标个葱姜蒜，Haiku 绰绰有余；可要在一盘红油浓酱里把半掩着的藕片给拎出来，还得是 Opus。选型这事，得看你这一步到底在为什么买单。

那就 Opus 了。`caption_images.py` 的核心，就是让它看图吐 JSON：



```python
CAPTION_MODEL = "global.anthropic.claude-opus-4-8"

PROMPT = ("你是专业的中餐美食标注助手。仔细看这张图，用中文输出严格 JSON："
          '{"caption":"一句话描述这道菜","tags":["标签"]}。'
          "tags 必须逐一列出你在画面里认出的每种食材，包括配菜和不显眼的。"
          "只输出 JSON，不要解释、不要 markdown 代码块。")

def caption(path):
    b64 = base64.b64encode(open(path, "rb").read()).decode()
    body = {
        "anthropic_version": "bedrock-2023-05-31", "max_tokens": 500,
        "messages": [{"role": "user", "content": [
            {"type": "image", "source": {"type": "base64",
                                         "media_type": "image/jpeg", "data": b64}},
            {"type": "text", "text": PROMPT},
        ]}],
    }
    txt = json.loads(bedrock.invoke_model(modelId=CAPTION_MODEL,
                     body=json.dumps(body))["body"].read())["content"][0]["text"]
    obj = json.loads(re.search(r"\{.*\}", txt, re.S).group(0))   # 容错：从回复里抠出 JSON
    return {"caption": obj.get("caption", ""), "tags": obj.get("tags", [])}
```


> ⚠️ 一个真会踩的坑：Bedrock 上的 Claude 4.x 系列**不支持按需直调**，`modelId` 得带区域前缀（`us.anthropic.claude-...` 或 `global.anthropic.claude-...`）走 inference profile，否则甩你一句 `Invocation ... with on-demand throughput isn't supported`。我第一发就撞上了。

给 10 张图挨个打完标签，Opus 的表现相当稳——两碗汤认出了「海参鲍鱼花胶」，越南沙拉认出了「香茅蘸酱」，连那张混进来的高楼照片，它都老老实实标了句「并非中餐美食，tags 为空」。诚实得可爱。

---

### <a id="t10"></a><a id="_Easysearch__284"></a>四、字段要落地，得先教 Easysearch 断中文词

标签生成好了，得有地方存。给已有的 `image_search` 索引加三个字段：



```bash
curl -sk -u "admin:$ES_PASS" -XPUT "$ES_URL/image_search/_mapping" \
  -H 'Content-Type: application/json' -d '{
  "properties": {
    "caption":      { "type": "text",    "analyzer": "ik_max_word" },
    "tags":         { "type": "keyword" },
    "caption_text": { "type": "text",    "analyzer": "ik_max_word",
                                         "search_analyzer": "ik_smart" }
  }
}'
```



这里的关键是 `analyzer` 用了 **`ik_max_word`**——IK 中文分词器。

为什么非它不可？说到底，Easysearch（同 ES 一系）默认的分词器**不认中文词**，会把「小龙虾配藕片」按字母/空格切，中文一整句被当成一个不可分的整块，你搜「藕片」根本 match 不上。IK 分词器才能把「蒜蓉小龙虾配藕片黄瓜青椒」切成「蒜蓉 / 小龙虾 / 藕片 / 黄瓜 / 青椒」这样一颗颗独立的词——藕片这才成了一个能被单独命中的 token。

好在这套 Easysearch 自带了 `analysis-ik` 插件，拿来即用。`caption_text` 这个字段，我把 caption 和 tags 拼在一起塞进去，专门喂给 BM25。

灌标签就一句：



```bash
python3 caption_images.py
```



它用 `_update` 局部更新——向量是上一篇 `index_images.py` 写好的，这回只往每篇文档补 caption/tags，不动向量。各司其职。

---

### <a id="t11"></a><a id="_316"></a>五、把两路拧成一股绳

材料齐了，改查询。上一篇是光秃秃一个 `knn_nearest_neighbors`，这回用 `bool` 把它和关键词 `match` 拧到一起：



```python
knn = {"knn_nearest_neighbors": {
    "field": "embedding", "vec": {"values": vec},
    "model": "exact", "similarity": "cosine",
}}

if hybrid:
    # must 里放 knn 兜底语义召回; should 里放关键词, boost 让命中标签的图显著提分
    query = {"bool": {"must":   [knn],
                      "should": [{"match": {"caption_text": {"query": text, "boost": 4.0}}}]}}
else:
    query = knn        # 退回纯向量, 用于对照
```



拆开看这个 `bool`：

- **`must` 放 knn**——向量语义是地基，保证哪怕关键词一个没中，也有语义相似的图垫底，不至于开天窗。
- **`should` 放 match**——关键词是加分项。哪张图的 `caption_text` 里出现了「藕片」，BM25 就给它加一大笔分。
- **`boost: 4.0`**——这是个手感活。向量分在 1~2 之间，BM25 分天生比它大一截，再乘个 4，就是明明白白告诉引擎：**关键词字面命中这件事，我很看重。** 命中标签的图，分数会被顶得断层领先。

`boost` 具体给多少没有标准答案，得看你更信语义还是更信字面，调着看效果。我这儿给 4，是想让「藕片」这种精确查询的效果最扎眼。

---

### <a id="t12"></a><a id="_344"></a>六、见桥

改完重启，搜「藕片」，纯向量和 Hybrid 各来一发对照：

**纯向量**（`?hybrid=0`）——老样子，藕片图淹在第五，前排全是汤：



```
#1  1.246  海参鲍鱼花胶汤
#2  1.244  海参鲍鱼汤
#3  1.239  川味红烧牛肉面
 ...
#5  1.200  蒜蓉小龙虾配藕片    ← 那张真有藕片的，还是沉着
```



**Hybrid**——关键词一介入，藕片图直接被顶穿天花板：



```
#1  9.129  蒜蓉小龙虾配藕片    ← 从 1.2 飙到 9.13，断层第一
#2  1.246  海参鲍鱼花胶汤
#3  1.244  海参鲍鱼汤
```



![在这里插入图片描述](/images/migrated/ad994da5c121a8944a5f.png)

从「沉在第五」到「9.13 断层第一」，桥就这么架通了。截图里每张卡片底下那句描述、那串标签，全是 Opus 标的——你能看见 `1000016167.jpg` 挂着「小龙虾 / 莲藕 / 黄瓜 / 青椒」，「藕片」这个词，如今是捞得起来的实词，不再是沉在像素里的一团模糊语义。

顺手验了另外几个精确词，一个道理：「鲍鱼」两碗鲍鱼汤 9.6 / 9.1 领跑，「橙汁」那杯橙汁 13.4 断层第一。凡是**能被说清、能被打进标签**的东西，Hybrid 都能精确捞回。

前端也加了个开关，勾掉 Hybrid 就退回纯向量，同一个查询左右横跳，那道坎迈没迈过去，一眼就看得出来。

---

### <a id="t13"></a><a id="_377"></a>附：新增文件与复现

在上一篇的基础上，这一篇多了一个脚本、改了一处查询：

| 文件 | 变化 |
| --- | --- |
| `caption_images.py` | **新增**：用 Opus 给每张图生成 caption/tags，`_update` 进索引 |
| `server.py` | `search_images` 加 `hybrid` 开关，查询改 `bool{knn + match}` |
| `index.html` | 加 Hybrid 开关，卡片展示 caption/tags |



```bash
export AWS_REGION=us-east-1
export ES_PASS='你的-Easysearch-admin-密码'

# 1. 给索引加文本字段(IK 中文分词)
curl -sk -u "admin:$ES_PASS" -XPUT "https://localhost:9200/image_search/_mapping" \
  -H 'Content-Type: application/json' -d '{"properties":{
    "caption":{"type":"text","analyzer":"ik_max_word"},
    "tags":{"type":"keyword"},
    "caption_text":{"type":"text","analyzer":"ik_max_word","search_analyzer":"ik_smart"}}}'

# 2. 用 Opus 打标签(需先跑过上一篇的 index_images.py 建好向量)
python3 caption_images.py

# 3. 重启服务, 打开 http://localhost:8080, 搜「藕片」, 勾选/取消 Hybrid 对照
python3 server.py
```



---

两篇下来，这盘藕片总算是搜出来了。回头看，真正的功夫没花在向量、也没花在那个 `bool` 查询上——花在了**逼着自己承认「模型会看错」这件事**上。Haiku 那句「海鲜炒饭配牛肉」要是没多看两眼、顺手就灌进了库，这座桥架起来照样是歪的，还歪得你浑然不觉。

工程里最贵的从来不是搭桥，是**验桥**。下次再有人跟你说「上个多模态模型自动打标签就行了」，你可以反问一句：**你验过它认得出藕片吗？**

> 技术栈：INFINI Labs Easysearch 2.3.0（`bool` + `knn_nearest_neighbors` + IK 分词 `match`）· Amazon Bedrock Cohere Embed v4（向量）+ Claude Opus 4.8（图片标注）· Python 标准库 HTTP 服务

从「沉在第五」到「9.13 断层第一」，桥就这么架通了。截图里每张卡片底下那句描述、那串标签，全是 Opus 标的——你能看见 `1000016167.jpg` 挂着「小龙虾 / 莲藕 / 黄瓜 / 青椒」，「藕片」这个词，如今是捞得起来的实词，不再是沉在像素里的一团模糊语义。

顺手验了另外几个精确词，一个道理：「鲍鱼」两碗鲍鱼汤 9.6 / 9.1 领跑，「橙汁」那杯橙汁 13.4 断层第一。凡是**能被说清、能被打进标签**的东西，Hybrid 都能精确捞回。

前端也加了个开关，勾掉 Hybrid 就退回纯向量，同一个查询左右横跳，那道坎迈没迈过去，一眼就看得出来。

---

### <a id="t14"></a><a id="_422"></a>附：新增文件与复现

在上一篇的基础上，这一篇多了一个脚本、改了一处查询：

| 文件 | 变化 |
| --- | --- |
| `caption_images.py` | **新增**：用 Opus 给每张图生成 caption/tags，`_update` 进索引 |
| `server.py` | `search_images` 加 `hybrid` 开关，查询改 `bool{knn + match}` |
| `index.html` | 加 Hybrid 开关，卡片展示 caption/tags |



```bash
export AWS_REGION=us-east-1
export ES_PASS='你的-Easysearch-admin-密码'

# 1. 给索引加文本字段(IK 中文分词)
curl -sk -u "admin:$ES_PASS" -XPUT "https://localhost:9200/image_search/_mapping" \
  -H 'Content-Type: application/json' -d '{"properties":{
    "caption":{"type":"text","analyzer":"ik_max_word"},
    "tags":{"type":"keyword"},
    "caption_text":{"type":"text","analyzer":"ik_max_word","search_analyzer":"ik_smart"}}}'

# 2. 用 Opus 打标签(需先跑过上一篇的 index_images.py 建好向量)
python3 caption_images.py

# 3. 重启服务, 打开 http://localhost:8080, 搜「藕片」, 勾选/取消 Hybrid 对照
python3 server.py
```



---

两篇下来，这盘藕片总算是搜出来了。回头看，真正的功夫没花在向量、也没花在那个 `bool` 查询上——花在了**逼着自己承认「模型会看错」这件事**上。Haiku 那句「海鲜炒饭配牛肉」要是没多看两眼、顺手就灌进了库，这座桥架起来照样是歪的，还歪得你浑然不觉。

工程里最贵的从来不是搭桥，是**验桥**。下次再有人跟你说「上个多模态模型自动打标签就行了」，你可以反问一句：**你验过它认得出藕片吗？**

> 技术栈：INFINI Labs Easysearch 2.3.0（`bool` + `knn_nearest_neighbors` + IK 分词 `match`）· Amazon Bedrock Cohere Embed v4（向量）+ Claude Opus 4.8（图片标注）· Python 标准库 HTTP 服务

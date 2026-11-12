---
title: Console 粘不进代码，allow pasting 反手一个语法错误
description: DevTools 的自我 XSS 防护把粘贴拦下来了，而那句口令敲早一步就会被当成 JS 执行，报 Unexpected identifier。顺手记一下正确的敲法、彻底关掉的启动参数，以及另一条更阴的岔路——剪贴板里的全角引号。
tags: 浏览器
toc: true
categories: 软件
abbrlink: 89a4924
date: 2026-11-12 00:00:00
---

手里有段脚本要往 Console 里贴，Cmd+V 下去，输入框跟没收到一样。同一段代码，敲能跑，粘不行。

## 第一条：自我 XSS 防护

Chrome 从 113 起加了这玩意，往 Console 粘代码就拦，Firefox 也跟上了。我这台三个浏览器都在射程内：

| 浏览器 | 版本 |
|---|---|
| Google Chrome | 157.0.8103.51 |
| Microsoft Edge | 152.0.4191.66 |
| Firefox | 156.0.1 |

它的意思是怕你被人骗着把一段来路不明的东西贴进自己的登录态里，所以只让手动敲 —— 门槛低到可笑，但确实挡住了大部分复制粘贴型社工。想解锁，得手动输入 `allow pasting`。

于是我敲了。。。。然后它回我：

```
VM811:1 Uncaught SyntaxError: Unexpected identifier
```

**口令不是命令，是暗号。** 警告弹出来的那一刻，输入框被接管，这时候打进去的字不走 JS 解析；没有警告的时候，Console 还是 Console，`allow pasting` 就是两个挨着的 identifier，中间连个运算符都没有，V8 在第二个词上翻脸，完全合理。（我是先敲口令、再去粘贴的，顺序反了，等于白敲 hhh）

正确的顺序只有一个：

1. 先 Cmd+V，让它拦
2. 等警告出现
3. 这时候敲 `allow pasting`，回车
4. 再 Cmd+V

解锁按 DevTools 会话记，关掉重开有时候还要再来一遍。嫌烦就从启动参数上掀桌子：

```bash
open -na "Google Chrome" --args --unsafely-disable-devtools-self-xss-warnings
```

这个 flag 我在 Chrome 157 的 framework 二进制里 grep 到了，字符串确实在；但没专门起一个干净 profile 去验效果，**不确定在 157 上有没有被改名或者加别的前置条件**。

## 第二条：剪贴板里的全角引号

如果 Cmd+V 之后压根没弹警告，代码老老实实进去了，回车却报语法错误，那就跟防护没关系了，是剪贴板的事。

从微信、飞书、Word、网页里复制的代码，引号经常已经是全角的 `“ ”`，空格可能是 U+00A0 的不换行空格，行尾还可能挂着零宽字符或者 BOM。手敲的时候键盘给的是直引号，所以敲能跑；粘进去的是另一套码位，V8 不认。

最阴的是报错位置：它指向的那个地方看起来完全正常 —— 不可见字符本来就看不见。

复制完先过一道清洗再粘：

```bash
pbpaste | python3 -I -c 'import sys
t=sys.stdin.read()
for a,b in [("“",chr(34)),("”",chr(34)),("‘","\x27"),("’","\x27"),("\xa0"," "),("　"," "),("​",""),("﻿",""),("–","-"),("—","-")]:
    t=t.replace(a,b)
sys.stdout.write(t)' | pbcopy
```

全角引号转直引号，不换行空格和全角空格转普通空格，零宽字符和 BOM 删掉，顺手把 en dash、em dash 也掰回 ASCII 的减号。本机跑过，有效。

## 第三条：页面 CSP 禁了 eval

```
Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of script
```

这是页面自己的 Content-Security-Policy 不许 eval，Console 的执行也走 eval，所以一起被拦。排除法很简单：**这种情况手敲也跑不了**，跟"敲能跑、粘不行"的现象对不上。

## 按报错分诊

- 粘不进去，输入框像没收到 → 自我 XSS 防护，走上面那四步
- 粘进去了，报 `Unexpected identifier` 或 `Invalid or unexpected token` → 剪贴板里的全角引号和不可见字符
- 报 `Refused to evaluate a string as JavaScript` → 页面 CSP，手敲也一样

折腾半天，根因是我把暗号当命令敲了。主打一个顺序不能反。

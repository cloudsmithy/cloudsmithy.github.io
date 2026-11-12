---
title: Python 项目如何忽略和清理 __pycache__
date: '2025-03-26 12:22:32'
updated: '2025-03-26 12:22:32'
abbrlink: 2eb9cbc6
categories:
- 软件
- 编程
tags:
- Python
- Git
- 开发
description: 解释 __pycache__ 和 pyc 文件的来源，记录 .gitignore 配置、取消 Git 跟踪和清理本地缓存的操作。
source_platform: CSDN
source_url: https://blog.csdn.net/weixin_38781498/article/details/146525879
source_title: 别再把 `__pycache__` 提交到 Git 了！一文搞懂正确处理方式
---

[Python 编程与环境笔记：系列目录](/series/python/)


在使用 Python 开发时，你是否遇到过 Git 仓库中突然多出一堆 `__pycache__` 文件夹？  
这些奇怪的 `.pyc` 文件不仅无用，还会污染项目结构，甚至拖慢 Git 操作。

今天我们就来系统讲讲：

- `__pycache__` 是什么？
- 为什么它会出现在项目里？
- 如何正确忽略并彻底删除它？

---

### <a id="___pycache____12"></a>🧠 `__pycache__` 是什么？

在你运行 Python 脚本时，解释器会自动把 `.py` 源码编译成 `.pyc` 字节码文件，以提高下一次运行的速度。

这些 `.pyc` 文件默认保存在一个叫 `__pycache__` 的目录里。例如：


```
your_project/
├── app.py
└── __pycache__/
    └── app.cpython-311.pyc
```


对开发来说，这些文件完全不需要**提交到 Git 仓库**，只会造成污染。

---

### <a id="____pycache____29"></a>🚫 不小心提交了 `__pycache__` 怎么办？

1. **先添加到 `.gitignore` 中：**


```
# 忽略 Python 缓存文件
__pycache__/
*.py[cod]
```


2. **强制从 Git 中移除缓存目录：**


```bash
git rm -r --cached __pycache__
```


3. **提交并推送变更：**


```bash
git commit -m "Remove __pycache__ from version control"
git push
```


4. **可选：清除本地缓存文件夹（不会影响代码）**


```bash
find . -name "__pycache__" -type d -exec rm -r {} +
```


---

### <a id="__60"></a>🧼 项目初期就该这样做

建议每个 Python 项目的 `.gitignore` 文件中都包含以下内容：


```
# Python bytecode & cache
__pycache__/
*.py[cod]
*$py.class
```


如果你用 VSCode 或 PyCharm 等 IDE，也建议添加：


```
.vscode/
.idea/
```


---

### <a id="__80"></a>✅ 最佳实践总结

| 步骤 | 说明 |
| --- | --- |
| 加 `.gitignore` | 防止后续再次被提交 |
| `git rm --cached` | 从当前版本的跟踪记录中移除（不会清除旧提交） |
| 本地清除 | 可选，保持工作区干净 |

---

### <a id="__90"></a>📌 结语

开发者应当保持仓库“干净整洁”，只提交对项目有意义的源代码。  
像 `__pycache__`、日志、虚拟环境、数据库等中间产物，应通过 `.gitignore` 管理好。

从现在开始，把“清理 pycache”作为你的日常操作之一吧！

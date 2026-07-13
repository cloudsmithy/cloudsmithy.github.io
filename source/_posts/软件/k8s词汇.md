---
title: Kubernetes 系列课程 · 术语去重词典（按课程 > 节 分组）
description: Kubernetes 系列课程 · 术语去重词典（按课程 > 节 分组）
tags: Kubernetes
toc: true
categories: 软件
date: 2026-07-13 00:00:00
---


> 从「术语表汇总.md」去重而来：跨全局去重，一个词只出现在它首次登场的那一节下（忽略大小写）。
> 共 765 条唯一术语。本文件由 `gen-glossary-dedup.sh` 自动生成；含出处重复的完整版见「术语表汇总.md」。

## 第一门课-Kubernetes入门

### Lesson 00 — Course Introduction

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| orchestration | /ˌɔːrkɪˈstreɪʃn/ n. | 编排 | 容器编排系统 |
| production grade | 词组 | 生产级的 | 生产级编排系统 |
| containerized | /kənˈteɪnəraɪzd/ adj. | 容器化的 | 容器化应用 |
| site reliability engineer (SRE) | 词组 | 站点可靠性工程师 | 相关岗位之一 |
| enthusiast | /ɪnˈθuːziæst/ n. | 爱好者、热衷者 | 容器爱好者 |
| spin up | 词组 | 启动、开起来 | spin up lab |
| learning objective | 词组 | 学习目标 | 具体学习目标 |
| persistent data | 词组 | 持久化数据 | 控制持久化数据 |
| prerequisite | /ˌpriːˈrɛkwəzɪt/ n. | 先修要求、前提 | 课程先修要求 |
| pick it up | 习语 | 学会、上手 | YAML 边学边上手 |
| beef up | 习语 | 加强、增强 | 加强编排技能 |
| enough's enough | 习语 | 够了、废话不多说 | 开始上课 |

### Lesson 01 — Deploying Kubernetes

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| ephemeral | /ɪˈfemərəl/ adj. | 短暂的、临时的 | 指 CI 中即用即弃、快速启动的临时集群。 |
| pristine | /ˈprɪstiːn/ adj. | 原始洁净的、全新的 | 每次测试都需要一个干净如初的集群状态。 |
| horizontal scaling | 词组 | 水平扩展 | 通过增加节点数量来扩展能力。 |
| tolerate node failures | 词组 | 容忍节点故障 | 多节点集群可在个别节点宕机时继续运行。 |
| fully-managed | /ˈfʊli ˈmænɪdʒd/ adj. | 全托管的 | 全托管方案免去日常运维，但版本通常滞后。 |
| lag | /læɡ/ v. | 落后、滞后 | 全托管服务的版本往往落后最新版几个版本号。 |
| tightly integrate | 词组 | 紧密集成 | 云厂商的托管 K8s 与其云上其他服务深度整合。 |
| friction | /ˈfrɪkʃən/ n. | 阻力、摩擦 | 沿用熟悉的云平台可以减少上手阻力。 |
| vendor lock-in | 词组 | 厂商锁定 | 担心被某家厂商绑定时应选开源方案。 |
| on-prem (on-premise) | 词组 | 本地部署、私有环境 | 集群可部署在本地、云端或两者混合。 |
| abstraction | /æbˈstrækʃən/ n. | 抽象（层） | K8s 向用户屏蔽底层节点差异，提供资源抽象。 |
| has you covered | 习语 | 已经帮你安排妥当 | 课程已为你准备好可跟练的真实多节点集群。 |
| follow along | 习语 | 跟着一起做、跟练 | 鼓励学员用 playground 实验环境边学边练。 |

### Lesson 02 — Kubernetes Architecture

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| distributed system | 词组 | 分布式系统 | 本课指出 Kubernetes 本身就是一个分布式系统。 |
| dialect | /ˈdaɪəlekt/ n. | 方言、术语体系 | 比喻 K8s 在编排领域引入了自己一套"行话"。 |
| vernacular | /vərˈnækjələr/ n. | 行话、本土语汇 | 掌握这套术语是用好 K8s 的关键一环。 |
| internalize | /ɪnˈtɜːrnəlaɪz/ v. | 内化、消化吸收 | 强调要把这些术语真正内化成自己的理解。 |
| glossary | /ˈɡlɑːsəri/ n. | 术语表、词汇表 | 提到官方维护了一份可供参考的 K8s 术语表。 |
| comprehensive | /ˌkɑːmprɪˈhensɪv/ adj. | 全面的、详尽的 | 形容 Kubernetes 维护的那份更详尽的术语表。 |
| under the hood | 习语 | 在底层、在幕后 | 指理解架构才能明白功能"底层"是怎么运作的。 |
| master components | 词组 | 主控组件 | 控制平面上这些 API 与软件的统称。 |
| schedule | /ˈskedʒuːl/ v. | 调度、编排放置 | 此处不指时间，而指把容器放置到节点上的决策。 |
| scheduler | /ˈskedʒuːlər/ n. | 调度器 | 尽力保证每个容器都能被调度运行的组件。 |
| quality of service | 词组 | 服务质量（QoS） | 不同进程/容器有不同的服务质量规则。 |
| rollout and rollback | 词组 | 发布与回滚 | Deployment 控制 Pod 的上线发布与回退。 |
| I cannot overstate | 习语 | 我怎么强调都不为过 | 用来强调这些术语的重要性。 |
| sink in | 习语 | （信息）被理解吸收 | 建议反复回看直到内容真正被吸收。 |

### Lesson 03 — Interacting with Kubernetes Clusters

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| retrieve | /rɪˈtriːv/ v. | 检索；取回 | 指从集群中"取回"状态信息。 |
| tedium | /ˈtiːdiəm/ n. | 繁琐乏味之事 | 指客户端库能替你处理认证与逐个 REST 请求的繁琐工作。 |
| correlate | /ˈkɔːrəleɪt/ v. | 相关联；正相关 | 你的 Kubernetes 熟练度与 kubectl 技能直接正相关。 |
| introspection | /ˌɪntrəˈspekʃn/ n. | 内省；自省查看 | kubectl 提供的调试与"内省"（查看内部状态）功能。 |
| design pattern | 词组 | 设计模式 | kubectl 遵循一套易懂的设计模式，学会管一种资源就会管所有资源。 |
| get the hang of it | 习语 | 掌握它的窍门；上手 | 形容 kubectl 上手并不需要很久。 |
| get one's hands dirty | 习语 | 亲自动手实践 | 表示准备开始动手操作 Kubernetes。 |
| kickstart | /ˈkɪkstɑːrt/ v. | 快速启动；助你入门 | 这些内容足以为下一课做好铺垫。 |

### Lesson 04 — Pods / Deploy Your First Application

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| building block | 词组 | 基本构成单元 / 基石 | 反复强调 Pod 是 Kubernetes 的 basic building block |
| heavy lifting | 习语 | 繁重的活儿 / 苦力活 | do all the heavy lifting 指 K8s 替你处理复杂的网络实现 |
| declaration | /ˌdekləˈreɪʃn/ n. | 声明 | Pod 的 declaration 包含镜像、端口、重启策略等属性 |
| specification / spec | /ˌspesɪfɪˈkeɪʃn/ n. | 规格 / 规约 | 每种资源特有的配置称为 spec，是 manifest 里"放干货"的地方 |
| get a taste for | 习语 | 初步体验一下 / 尝个鲜 | 从最小 Pod manifest 例子 get a taste for manifests |
| eviction / evict | /ɪˈvɪkʃn/, /ɪˈvɪkt/ n./v. | 驱逐（回收 Pod） | 节点资源紧张时，best-effort Pod 最先被 evict |
| under pressure | 习语 | 处于压力下 / 资源吃紧 | 节点 under pressure 时需释放资源、驱逐 Pod |
| starved (of) | /stɑːvd/ adj. | 被饿死的 / 极度缺乏的 | starved of resources 指节点资源被耗尽 |
| quality of service (QoS) | 词组 | 服务质量等级 | best effort / guaranteed 是两种 QoS 级别 |
| resource contention | 词组 | 资源争用 | best effort Pod 可能与同节点其他 Pod 产生资源争用 |
| ephemeral storage | /ɪˈfemərəl/ 词组 | 临时存储 | 可用 ephemeral storage 请求本地磁盘资源 |
| benchmarking | /ˈbentʃmɑːkɪŋ/ n. | 基准测试 / 压测 | 需做 benchmarking 才能配出合理的 request 与 limit |
| Bastion (host) | /ˈbæstiən/ 专有名词 | 堡垒机 | 连接到配置好 kubectl 的 Bastion 主机来操作集群 |

### Lesson 05 — Services

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| reschedule | /ˌriːˈskedʒuːl/ v. | 重新调度 | 节点故障时 K8s 会把 Pod 重新调度到其他节点 |
| pool of addresses | 词组 | 地址池 | Pod 重建后会从可用地址池里分配到新的 IP |
| selector | /sɪˈlektər/ n. | 选择器 | spec 里最关键的字段，用标签匹配目标 Pod |
| distribute | /dɪˈstrɪbjuːt/ v. | 分发、分配 | 把进来的请求分发到各个 Pod 以均衡负载 |
| port mapping | 词组 | 端口映射 | Service 必须定义端口映射，本例指向 80 端口 |
| expose | /ɪkˈspoʊz/ v. | 暴露、对外开放 | type 字段决定如何把 Service 暴露出去 |
| allocate | /ˈæləkeɪt/ v. | 分配 | K8s 从可用端口中为 NodePort 分配端口 |
| designated port | 词组 | 指定的（约定的）端口 | 可向任一节点的指定端口发请求以到达 Service |
| Endpoint | /ˈendpɔɪnt/ n. | 端点 | describe 输出里显示被选中每个 Pod 的地址 |
| debugging information | 词组 | 调试信息 | describe 命令会给出一堆有用的调试信息 |
| pipe | /paɪp/ v. | 用管道传递（命令输出） | 把 describe nodes 的输出用管道传给 grep |
| grep for | 词组 | 用 grep 检索 | grep -i address -A 1 过滤出节点地址 |

### Lesson 06 — Multi-Container Pods

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| increment | /ˈɪŋkrɪmənt/ v. | 递增，累加 | 服务器容器把计数器的值递增 |
| poller | /ˈpoʊlər/ n. | 轮询器 | 支持层容器持续向服务器发 GET 请求取值 |
| environment variable | 词组 | 环境变量 | 所有容器都用环境变量做配置（如 REDIS_URL） |
| standard out / standard error | 词组 | 标准输出 / 标准错误 | 日志本质就是容器写到 stdout/stderr 的内容 |
| tab completion | 词组 | Tab 键自动补全 | 把 -n 放前面便于补全目标 namespace |
| scale out | 习语 | 横向扩容 | Kubernetes 只能靠增加 Pod 数量来扩容 |
| tightly coupled | 词组 | 紧耦合的 | 容器是否紧耦合决定要不要当作单一单元看待 |
| unit of work | 词组 | 工作单元 | Pod 是 Kubernetes 最小的工作单元 |
| go awry | 习语 | 出岔子，出问题 | 若某处 go awry，应查看 event log 排查 |
| behind the scenes | 习语 | 幕后，背后 | 查看事件日志了解幕后发生了什么 |
| hit the good stuff | 习语 | 进入精彩/关键部分 | 学多容器 Pod 时"真正开始进入精彩内容" |
| leverage | /ˈlevərɪdʒ/ v. | 利用，借助 | 下一课将 leverage services 拆分紧耦合设计 |

### Lesson 07 — Service Discovery

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| naming convention | 词组 | 命名约定 | 环境变量按固定规则命名，知道服务名就能拼出变量名 |
| SRV record | 词组 | SRV 记录 | 记录服务端口信息的 DNS 记录，manifest 里无法直接用 |
| resolve | /rɪˈzɒlv/ v. | 解析（域名到 IP） | 集群 DNS 把服务名解析成 Service 的 IP 地址 |
| refactor | /ˌriːˈfæktər/ v. | 重构 | 把多容器单 pod 应用重构成多层应用 |
| distribute load | 词组 | 分摊负载 | Service 把请求分发到一组 pod，实现横向扩展 |
| omit | /oʊˈmɪt/ v. | 省略 | 同命名空间下 DNS 可省略 namespace；cluster IP 是默认可省略 |
| cram | /kræm/ v. | 塞进、硬挤 | 可以把所有资源塞进一个文件，但按层分开更好管理 |
| plug away | 习语 | 埋头持续干活 | poller 日志显示应用一直在稳定运行 |
| glue together | 习语 | 拼凑、勉强粘合起来 | 用脚本把手动扩容的各部分勉强拼在一起 |

### Lesson 08 — Deployments

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| replica | /ˈrɛplɪkə/ n. | 副本、复制品 | 一个 Pod 的拷贝 |
| identical | /aɪˈdɛntɪkl/ adj. | 完全相同的 | Deployment 里的 Pod 彼此 identical |
| embed | /ɪmˈbɛd/ v. | 嵌入 | 在 manifest 里 embed 一个 pod template |
| desired state | 词组 | 期望状态 | 你声明的目标状态 |
| actual state | 词组 | 实际状态 | 集群当前的真实状态 |
| converge | /kənˈvɜːrdʒ/ v. | 收敛、趋于一致 | K8s 让实际状态 converge 到期望状态 |
| controller | /kənˈtroʊlər/ n. | 控制器 | deployment controller 负责管理部署 |
| overlap | /ˌoʊvərˈlæp/ v. | 重叠 | matchLabels 必须和模板 labels overlap |
| resurrect | /ˌrɛzəˈrɛkt/ v. | 使复活、重建 | K8s 能 resurrect 被删的 Pod |
| converge to desired state | 词组 | 收敛到期望状态 | Deployment 的核心机制 |
| a word of caution | 习语 | 一句提醒、注意事项 | 扩缩容时的告诫 |
| up its sleeve | 习语 | 暗藏（本领/招数） | K8s 在扩缩容上还有更多招数 |

### Lesson 09 — Autoscaling

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| autoscaling | /ˈɔːtoʊˌskeɪlɪŋ/ n. | 自动扩缩容 | 根据指标自动增减副本 |
| HorizontalPodAutoscaler (HPA) | 专有名词 | 水平 Pod 自动扩缩器 | `autoscaling/v1` 里的资源 |
| resource request | 词组 | 资源请求 | CPU 百分比是相对 CPU request 算的 |
| utilization | /ˌjuːtəlaɪˈzeɪʃn/ n. | 利用率 | CPU utilization percentage |
| milli (m) | /ˈmɪli/ 前缀 | 毫（千分之一） | 1000 milliCPU = 1 CPU |
| trickle in | 词组 | 陆续少量进来 | 指标一两分钟后才 trickle in |
| status quo | /ˌsteɪtəs ˈkwoʊ/ 拉丁短语 | 现状、维持原状 | CPU 适中时保持 status quo |
| vice versa | /ˌvaɪs ˈvɜːrsə/ 拉丁短语 | 反之亦然 | 高于目标扩、低于目标缩，vice versa |
| lower / upper bound | 词组 | 下界 / 上界 | min/max 是副本数的上下界 |
| shorthand notation | 词组 | 简写记法 | hpa 是 horizontalpodautoscalers 的简写 |
| benchmark | /ˈbɛntʃmɑːrk/ v. | 基准测试、评估 | 用 top 命令 benchmark Pod 资源使用 |
| kicks in | 习语 | 开始生效、启动起作用 | 等到 autoscaler kicks in |
| work their magic | 习语 | 施展神奇效果 | deployment work their magic |
| does not disappoint | 习语 | 不负所望 | Kubernetes does not disappoint |

### Lesson 10 — Rolling Updates & Rollbacks

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| rollout | /ˈroʊlaʊt/ n. | 上线、逐步发布 | 更新 Deployment 的过程 |
| rolling update | 词组 | 滚动更新 | 默认策略，分批替换副本 |
| recreate strategy | 词组 | 重建策略 | 先杀全部旧 Pod 再建新的（有停机） |
| strategy | /ˈstrætədʒi/ n. | 策略 | rollout 的更新策略 |
| replace | /rɪˈpleɪs/ v. | 替换 | 用新副本替换旧副本 |
| gracefully | /ˈɡreɪsfəli/ adv. | 优雅地、妥善地 | 应用要 gracefully 处理新旧共存 |
| incur | /ɪnˈkɜːr/ v. | 招致、带来 | recreate incurs downtime |
| orthogonal | /ɔːrˈθɒɡənl/ adj. | 正交的、互不相干的 | 扩缩容与滚动更新是 orthogonal 概念 |
| maxSurge | 专有字段 | 最大超量 | 允许超出期望总数的副本数 |
| maxUnavailable | 专有字段 | 最大不可用 | 可提前删除的旧 Pod 数 |
| surge | /sɜːrdʒ/ n./v. | 激增、涌出 | 更高的 surge 让新 Pod 更快创建 |
| trade off | 词组 | 权衡、取舍 | 在可用性/资源和速度间 trade off |
| revision | /rɪˈvɪʒn/ n. | 修订版本 | rollout 的一个版本 |
| roll back | 词组 | 回滚 | 退回上一个版本 |
| pause / resume | v. | 暂停 / 恢复 | 可暂停并恢复 rollout |
| mid-flight | 词组 | 进行中途 | 在 rollout 中途暂停 |
| terminal multiplexer | 词组 | 终端复用器 | tmux，可分屏 |
| probe | /proʊb/ n. | 探针 | 检测容器是否就绪/存活 |
| init container | 词组 | 初始化容器 | 在主容器前运行的准备容器 |
| in a nutshell | 习语 | 简而言之 | 概括 rollout 触发条件 |
| picks up where it left off | 习语 | 从中断处继续 | 恢复后 rollout 接着跑 |
| a large swath of | 习语 | 一大片、大量的 | 覆盖 a large swath of 用例 |
| come into the picture | 习语 | 登场、开始起作用 | probe 和 init 容器 come into the picture |

### Lesson 11 — Probes / Health Checks

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| readiness probe | 词组 | 就绪探针 | 探测 Pod 能否接收流量 |
| liveness probe | 词组 | 存活探针 | 探测 Pod 是否损坏需重启 |
| warm up | 词组 | 预热 | 容器启动后需预热 |
| non-responsive | adj. | 无响应的 | Pod 变得 non-responsive |
| deadlock | /ˈdɛdlɒk/ n. | 死锁 | 进入 deadlock 状态 |
| remedy | /ˈrɛmədi/ v. | 补救、纠正 | 探针 remedy 这两种场景 |
| serve traffic | 词组 | 提供服务、承接流量 | Pod 是否 ready to serve traffic |
| condition | /kənˈdɪʃn/ n. | 状态、条件 | Pod 的 ready condition |
| integrate with | 词组 | 与…集成 | 探针与 Service integrate |
| broken state | 词组 | 损坏状态 | Pod 进入 broken state |
| TCP socket | 词组 | TCP 套接字 | 一种探针类型 |
| crystallize | /ˈkrɪstəlaɪz/ v. | 使明确、具体化 | crystallize 这些概念 |
| initialDelaySeconds | 专有字段 | 初始延迟秒数 | 给容器启动时间 |
| failure threshold | 词组 | 失败阈值 | 连续几次失败才算失败 |
| dummy | /ˈdʌmi/ n./adj. | 假的、占位的 | 存活端点是个 dummy |
| kick in | 习语 | 开始生效 | 探针在容器启动后 kick in |
| come back to life | 习语 | 复活、恢复 | Pod won't come back to life |
| course of action | 习语 | 行动方案 | 决定探针失败后的 course of action |

### Lesson 12 — Init Containers

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| cram into | 词组 | 塞进、硬塞 | 把 setup 代码 cram 进主应用 |
| clean separation | 词组 | 清晰分离 | 主应用与辅助功能分离 |
| footprint | /ˈfʊtprɪnt/ n. | 占用体积、占用空间 | 让镜像保持最小 footprint |
| run to completion | 词组 | 运行至完成 | 每个 init 容器须 run to completion |
| in a sequence | 词组 | 按顺序、依次 | init 容器按声明顺序依次运行 |
| utility | /juːˈtɪləti/ n. | 工具（程序） | sed/awk/dig 等 utility |
| override | /ˌoʊvərˈraɪd/ v. | 覆盖、重写 | command 字段 override 默认入口点 |
| entry point | 词组 | 入口点 | 镜像默认的 entrypoint 命令 |
| pre-condition | 词组 | 前置条件 | 满足前置条件前延迟启动 |
| idempotent / unique | adj. | 幂等的 / 唯一的 | init 容器应幂等，多跑无副作用 |
| at least once | 词组 | 至少一次 | 假设 init 容器 at least once 运行 |

### Lesson 13 — ConfigMaps & Secrets

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| portable | /ˈpɔːrtəbl/ adj. | 可移植的 | manifest 更 portable |
| sensitive information | 词组 | 敏感信息 | 密码、API Key 等 |
| multiline string | 词组 | 多行字符串 | ConfigMap 值是多行字符串 |
| pipe symbol (\|) | 词组 | 竖线/管道符 | YAML 里开始多行字符串 |
| encryption | /ɪnˈkrɪpʃn/ n. | 加密 | base-64 不是 encryption |
| access control | 词组 | 访问控制 | 安全防护措施 |
| safeguard | /ˈseɪfɡɑːrd/ n. | 防护措施 | encryption 和 access control safeguards |
| shield | /ʃiːld/ v. | 屏蔽、保护 | describe 时屏蔽 Secret 值 |
| amid the wash of | 习语 | 在一大堆…之中 | 在一堆变量里找 API_KEY |
| on the fly | 习语 | 动态地、运行中 | 卷可 on the fly 更新，环境变量不行 |
| cross the finish line | 习语 | 冲过终点线 | 课程即将结束 |

### Lesson 14 — The Kubernetes Ecosystem

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| ecosystem | /ˈiːkoʊsɪstəm/ n. | 生态系统 | Kubernetes 生态系统 |
| vibrant | /ˈvaɪbrənt/ adj. | 有活力的、繁荣的 | 生态系统很 vibrant |
| package manager | 词组 | 包管理器 | Helm 的定位 |
| customize | /ˈkʌstəmaɪz/ v. | 定制 | 定制 manifest |
| overlay | /ˈoʊvərleɪ/ n. | 覆盖层 | base + overlay 定制 |
| patch | /pætʃ/ n./v. | 补丁；打补丁 | 给字段打 patch |
| annotation | /ˌænəˈteɪʃn/ n. | 注解 | 可设 namespace/labels/annotations |
| prefix / suffix | n. | 前缀 / 后缀 | 名字前缀后缀 |
| in sync | 词组 | 保持同步 | 配置文件与 ConfigMap 同步 |
| Prometheus | 专有名词 | 普罗米修斯（监控系统） | 开源监控告警系统 |
| monitoring / alerting | n. | 监控 / 告警 | Prometheus 的功能 |
| time series | 词组 | 时间序列 | 拉取时间序列指标 |
| de facto standard | 拉丁短语 | 事实标准 | 监控 K8s 的事实标准 |
| adapter | /əˈdæptər/ n. | 适配器 | 让 K8s 从 Prometheus 取指标 |
| Kubeflow | 专有名词 | Kubeflow | K8s 上的机器学习栈 |
| serving | /ˈsɜːrvɪŋ/ n. | （模型）服务/上线 | 端到端 ML 的一环 |
| momentum | /moʊˈmɛntəm/ n. | 势头、动力 | serverless 势头渐盛 |
| synonymous with | 词组 | 与…同义 | Lambda 是 serverless 代名词 |
| touch the surface | 习语 | 触及表面、浅尝 | 只触及这片海洋的表面 |
| roll your own | 习语 | 自己造（轮子） | 自己造方案前先看现成的 |
| not the only game in town | 习语 | 并非唯一选择 | Knative 不是唯一 serverless 方案 |
| heavyweight | /ˈhɛviweɪt/ n. | 重量级（人物/公司） | Google/IBM/SAP 等 heavyweights |
| round out | 习语 | 使圆满、收尾 | round out 工具讨论 |

### Lesson 15 — Course Summary

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| learning outcome | 词组 | 学习成果 | 达成的高层学习成果 |
| self-healing | 词组 | 自愈的 | 自愈的应用 |
| multi-tier | 词组 | 多层的 | 多层应用 |
| terminology | /ˌtɜːrmɪˈnɒlədʒi/ n. | 术语 | Kubernetes 术语 |
| liveness / readiness | n. | 存活 / 就绪 | 探针监控的两种状态 |
| persistent volume | 词组 | 持久卷 | 持久化数据存储 |
| persistent volume claim | 词组 | 持久卷声明 | PV 的申领 |
| foundation | /faʊnˈdeɪʃn/ n. | 基础 | 打好扎实基础 |
| learning path | 词组 | 学习路径 | CKA/CKAD 学习路径 |
| pursue | /pərˈsuː/ v. | 追求 | 追求的角色 |
| reinforce | /ˌriːɪnˈfɔːrs/ v. | 巩固、强化 | 巩固所学 |
| special interest group (SIG) | 词组 | 特别兴趣小组 | 社区组织方式 |
| flagship | /ˈflæɡʃɪp/ n./adj. | 旗舰（的） | KubeCon 是旗舰会议 |
| in person | 词组 | 线下、亲身 | 线下举办会议 |
| cover a lot of ground | 习语 | 涵盖大量内容 | 一起走过很多内容 |
| take a step back | 习语 | 退一步（看全局） | 上一课退后一步看生态 |

## 第二门课-CKAD应用开发者

### Lesson 00 — Course Introduction

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| pattern | /ˈpætərn/ n. | 模式 | Kubernetes 中的特定模式 |
| certification exam | 词组 | 认证考试 | CKAD 考试 |
| time limited | 词组 | 限时的 | 限时的考试环境 |
| appeal to | 词组 | 吸引、对…有吸引力 | 对更广泛受众有吸引力 |
| examinee | /ɪɡˌzæmɪˈniː/ n. | 考生 | 认证考生 |
| observability | /əbˌzɜːrvəˈbɪləti/ n. | 可观测性 | 应用开发者重要话题 |
| hands on | 词组 | 动手的、实操的 | lab 提供的动手环境 |
| make an appearance | 习语 | 出现、露面 | YAML 文件很快就会出现 |
| make the most out of | 习语 | 充分利用 | 充分利用多容器 |
| boost productivity | 词组 | 提升生产力 | 提升命令行生产力 |

### Lesson 01 — Multi-Container Patterns

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| sidecar | /ˈsaɪdkɑːr/ n. | 边车、挎斗 | 辅助主容器的模式 |
| ambassador | /æmˈbæsədər/ n. | 大使 | 代理通信的模式 |
| co-located | 词组 | 同处一地的 | 容器共置管理 |
| separation of concerns | 词组 | 关注点分离 | 更好的关注点分离 |
| reusability | /ˌriːjuːzəˈbɪləti/ n. | 复用性 | 提升镜像复用性 |
| helper container | 词组 | 辅助容器 | sidecar 是辅助容器 |
| logging agent | 词组 | 日志代理 | sidecar 常见例子 |
| aggregation | /ˌæɡrɪˈɡeɪʃn/ n. | 聚合 | 中心聚合系统 |
| burden | /ˈbɜːrdn/ v. | 加负担于 | 不给主容器加负担 |
| failure isolation | 词组 | 故障隔离 | sidecar 的好处 |
| sharded database | 词组 | 分片数据库 | ambassador 处理分片 |
| logical database | 词组 | 逻辑数据库 | 主容器只看单个逻辑库 |
| encapsulate | /ɪnˈkæpsjuleɪt/ v. | 封装 | ambassador 封装分片逻辑 |
| standardized interface | 词组 | 标准化接口 | adapter 对外呈现 |
| normalize | /ˈnɔːrməlaɪz/ v. | 规范化、归一化 | 规范化日志/监控数据 |
| outlive | /ˌaʊtˈlɪv/ v. | 比…活得久 | 持久卷能比 Pod 活得久 |
| come to the rescue | 习语 | 来救场、来解围 | adapter 来救场 |
| takeaway | /ˈteɪkəweɪ/ n. | 要点、收获 | 主要要点 |

### Lesson 02 — Kubernetes Networking

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| container network interface (CNI) | 词组 | 容器网络接口 | 插件实现的标准 |
| add-on | /ˈædɒn/ n. | 附加组件 | DNS 附加组件 |
| namespace qualified | 词组 | 命名空间限定的 | 命名空间限定的服务名 |
| kube-proxy | 专有名词 | kube-proxy 组件 | 每节点代理请求到 endpoint |
| node port | 词组 | 节点端口 | 一种 Service 类型 |
| connection draining | 词组 | 连接排空 | LB 特性之一 |
| caveat | /ˈkæviæt/ n. | 警告、注意事项 | 重要前提 |
| enforce | /ɪnˈfɔːrs/ v. | 执行、强制实施 | 无人执行策略 |
| isolated / non-isolated | adj. | 隔离的 / 非隔离的 | 两类 Pod |
| primitive | /ˈprɪmətɪv/ n. | 原语、基本单元 | label 是核心分组原语 |
| ingress / egress | n. | 入站 / 出站 | policyTypes 的取值 |
| enforce its job / doing its job | 习语 | 起作用、发挥作用 | 策略在起作用 |
| come as a surprise | 习语 | 令人意外 | client1 仍收到响应令人意外 |
| working our way down | 习语 | 从上往下逐一看 | 从上往下看策略 |

### Lesson 03 — Service Accounts

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| identity | /aɪˈdɛntəti/ n. | 身份 | 服务账号给 Pod 身份 |
| external identity system | 词组 | 外部身份系统 | 管理 User 的系统 |
| permission | /pərˈmɪʃn/ n. | 权限 | 角色关联的权限 |
| compromise | /ˈkɒmprəmaɪz/ v. | 危及、使受损 | 小错误危及整个集群 |
| authentication token | 词组 | 认证令牌 | 自动挂载进 Pod |
| default service account | 词组 | 默认服务账号 | 每命名空间都有 |
| authenticated user | 词组 | 已认证用户 | default 权限不超过它 |
| scoped to | 词组 | 限定于…范围 | ClusterRole 不限命名空间 |
| private container registry | 词组 | 私有镜像仓库 | image pull secret 场景 |
| separation of responsibilities | 词组 | 职责分离 | 用服务账号管 secret |
| touch on | 词组 | 简要提及 | 简要提及 image pull secret |
| come into play | 习语 | 开始起作用、登场 | 私有仓库时 secret 登场 |
| secured by default | 习语 | 默认即安全 | default 服务账号默认安全 |
| get the most out of | 习语 | 充分利用 | 充分发挥 kubectl |

### Lesson 04 — Getting the Most Out of kubectl

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| completion | /kəmˈpliːʃn/ n. | 补全 | 命令自动补全 |
| efficiency | /ɪˈfɪʃnsi/ n. | 效率 | 提升 kubectl 效率 |
| stand up (a cluster) | 词组 | 搭建（集群） | 搭起一个集群 |
| go-to command | 词组 | 首选命令 | get 是显示资源的首选 |
| short name | 词组 | 简写名 | 资源的简写（no/po/csr） |
| filter | /ˈfɪltər/ v. | 过滤 | 按标签过滤 |
| sort by | 词组 | 按…排序 | sort-by 选项 |
| output format | 词组 | 输出格式 | -o yaml/json/wide/jsonpath |
| wide format | 词组 | 宽格式 | 给额外信息（Pod 含 IP） |
| wildcard | /ˈwaɪldkɑːrd/ n. | 通配符 | `*` 表示数组所有项 |
| version control | 词组 | 版本控制 | manifest 可版本控制 |
| configuration as code | 词组 | 配置即代码 | 实践理念 |
| strip out | 词组 | 剥除、去掉 | 去掉集群特定字段 |
| schema | /ˈskiːmə/ n. | 模式、结构 | explain 给出字段 schema |
| recursive | /rɪˈkɜːrsɪv/ adj. | 递归的 | --recursive 选项 |
| traverse | /trəˈvɜːrs/ v. | 遍历 | 上下遍历字段 |
| hop over to | 习语 | 跳去（某处） | 忘了就想跳去搜索引擎 |
| come in handy | 习语 | 派上用场 | sort-by 派上用场 |
| taking it from the top | 习语 | 从头（回顾） | 从头回顾 |
| a whopping savings | 习语 | 惊人的节省 | 省 23 个字符 |

### Lesson 05 — Course Summary

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| multi-container pattern | 词组 | 多容器模式 | 本课第一主题 |
| sidecar / ambassador / adapter | n. | 边车 / 大使 / 适配器 | 三种模式 |
| extend functionality | 词组 | 扩展功能 | sidecar 扩展主容器功能 |
| ship logs | 词组 | 传送日志 | 把日志发往聚合系统 |
| proxy connections | 词组 | 代理连接 | ambassador 代理连接 |
| standardized view | 词组 | 标准化视图 | adapter 提供 |
| legacy application | 词组 | 遗留应用 | 写非标准格式指标的应用 |
| pitfall | /ˈpɪtfɔːl/ n. | 陷阱、坑 | 直接用 Pod IP 的坑 |
| productive | /prəˈdʌktɪv/ adj. | 高效多产的 | 用 kubectl 更高效 |
| self-sufficient | /ˌsɛlf səˈfɪʃnt/ adj. | 自足的、独立的 | 尽量高效自足 |
| the fun doesn't end here | 习语 | 乐趣不止于此 | 鼓励继续学习 |
| keep on going | 习语 | 继续下去 | 做完 lab 后继续 |

## 第三门课-Helm入门

### Lesson 00 — Course Introduction

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| enhance | /ɪnˈhæns/ v. | 增强 | 增强部署体验 |
| deployment experience | 词组 | 部署体验 | 简化部署体验 |
| agenda | /əˈdʒɛndə/ n. | 议程、大纲 | 课程大纲 |
| intended audience | 词组 | 目标受众 | 适合谁学 |
| rollback | /ˈroʊlbæk/ n. | 回滚 | 回滚 chart |
| software development lifecycle | 词组 | 软件开发生命周期 | 先修要求之一 |
| bring you up to speed | 习语 | 让你跟上进度、上手 | 让你上手 Helm 3 |
| build upon | 词组 | 建立在…之上 | Helm 3 建立在 Helm 2 上 |
| cover off | 词组 | 讲完、覆盖 | 讲完课程大纲 |

### Lesson 01 — Introduction to Helm

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| intricate | /ˈɪntrɪkət/ adj. | 复杂精细的 | 大型复杂部署 |
| simplify | /ˈsɪmplɪfaɪ/ v. | 简化 | 简化部署体验 |
| orchestrate | /ˈɔːrkɪstreɪt/ v. | 编排 | 编排容器化应用 |
| composed of | 词组 | 由…组成 | 应用由多个资源组成 |
| three-tiered | 词组 | 三层的 | 三层应用（前端/应用/数据库） |
| manifest file | 词组 | 清单文件 | 每个资源写进各自的 manifest |
| codify | /ˈkoʊdɪfaɪ/ v. | 编成（代码/条文） | 资源被编入 manifest |
| version controlled | 词组 | 做版本控制的 | manifest 做版本控制 |
| auditable | /ˈɔːdɪtəbl/ adj. | 可审计的 | 可审计的变更记录 |
| labor intensive | 词组 | 劳动密集的、费力的 | 多次 apply 很费力 |
| error prone | 词组 | 易错的 | 手动部署易错 |
| dependency | /dɪˈpɛndənsi/ n. | 依赖 | 依赖可能被遗忘 |
| remediate | /rɪˈmiːdieɪt/ v. | 补救、修正 | 返工修复 |
| parametrization | /pəˌræmɪtraɪˈzeɪʃn/ n. | 参数化 | manifest 不支持参数化 |
| proliferation | /prəˌlɪfəˈreɪʃn/ n. | 激增、泛滥 | manifest 泛滥 |
| lifecycle hooks | 词组 | 生命周期钩子 | 在资源创建前后做外部动作 |
| wire into | 词组 | 接入、挂接到 | 接入生命周期钩子 |
| sequenced order | 词组 | 有序、按顺序 | 按正确顺序部署资源 |
| come onto the scene | 习语 | 登场、出现 | Helm 出现之前 |
| pain point | 词组 | 痛点 | manifest 的痛点 |
| so what | 习语 | 那又怎样 | 反问为何需要 Helm |

### Lesson 02 — The Benefits of Helm

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| benefit | /ˈbɛnɪfɪt/ n. | 好处、益处 | Helm 提供的好处 |
| complexity | /kəmˈplɛksəti/ n. | 复杂度 | Helm 管理并抽象复杂度 |
| abstract away | 词组 | 抽象掉、屏蔽 | 抽象掉复杂度 |
| input values | 词组 | 输入值 | 用不同输入值定制 |
| track | /træk/ v. | 追踪、记录 | 追踪变更历史 |
| archive file | 词组 | 归档文件 | 打包生成的归档 |
| chart repository | 词组 | chart 仓库 | 托管 chart 的地方 |
| revision history | 词组 | 修订历史 | 每个 release 维护 |
| scaffolding | /ˈskæfəldɪŋ/ n. | 脚手架 | 生成骨架 chart 的命令 |
| skeleton chart | 词组 | 骨架 chart | 自带目录结构和示例文件 |
| directory structure | 词组 | 目录结构 | 骨架自带的结构 |
| starting point | 词组 | 起点 | 以骨架为定制起点 |
| dive deeper | 习语 | 深入探讨 | 深入 Helm 的好处 |
| suit your needs | 习语 | 满足你的需求 | 按需定制 |

### Lesson 03 — Helm Terminology

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| render | /ˈrɛndər/ v. | 渲染、生成 | 模板渲染成资源/manifest |
| centralized | /ˈsɛntrəlaɪzd/ adj. | 集中的 | 集中存储 chart 的位置 |
| akin to | 词组 | 类似于 | 类似 APT/RPM 仓库 |
| distro | /ˈdɪstroʊ/ n. | 发行版（distribution 简称） | Linux 发行版 |
| reusable | /ˌriːˈjuːzəbl/ adj. | 可复用的 | 让部署更通用可复用 |
| abstract into | 词组 | 抽象成 | 把 manifest 抽象成模板 |
| parametrize | /pəˈræmɪtraɪz/ v. | 参数化 | 参数化模板 |
| alter | /ˈɔːltər/ v. | 改变 | 改变所部署资源的行为 |
| manifest proliferation | 词组 | manifest 泛滥 | 模板化减少泛滥 |
| nothing more than | 习语 | 不过是、仅仅是 | 仓库不过是个 HTTP 服务器 |
| free to use | 习语 | 可随意使用 | 服务器技术随你选 |

### Lesson 04 — Helm Architecture

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| moving parts | 词组 | 各个部件、活动部分 | 理解各部件如何协同 |
| collectively | /kəˈlɛktɪvli/ adv. | 共同地、协同地 | 部件协同工作 |
| simplified | /ˈsɪmplɪfaɪd/ adj. | 简化的 | Helm 3 架构被简化 |
| secure | /sɪˈkjʊr/ adj. | 安全的 | 同时更安全 |
| Tiller | 专有名词 | Tiller（Helm 2 组件） | Helm 3 已移除 |
| permissions | /pərˈmɪʃnz/ n. | 权限 | 安装资源所需权限 |
| stem from | 词组 | 源自、起因于 | 变化源自 RBAC |
| credentials | /krəˈdɛnʃlz/ n. | 凭证 | 认证用的凭证 |
| govern | /ˈɡʌvərn/ v. | 管辖、支配 | RBAC 管辖所需权限 |
| modification | /ˌmɒdɪfɪˈkeɪʃn/ n. | 修改、变更 | chart 变更 |
| the good news is | 习语 | 好消息是 | 引出 Helm 3 的优点 |
| to be clear | 习语 | 说清楚、明确一点 | 强调认证机制 |

### Lesson 05 — Installing Helm

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| get up and running | 习语 | 上手运行、跑起来 | 上手 Helm 有多快 |
| client component | 词组 | 客户端组件 | Helm 3 只需装它 |
| pre-compiled | 词组 | 预编译的 | 预编译二进制发行版 |
| binary release | 词组 | 二进制发行版 | 下载的安装形式 |
| binary | /ˈbaɪnəri/ n. | 二进制（可执行文件） | 移进 PATH 的二进制 |
| symlink | /ˈsɪmlɪŋk/ v./n. | 符号链接；建符号链接 | 给二进制建 symlink |
| dedicated | /ˈdɛdɪkeɪtɪd/ adj. | 专用的 | 专用的 OS 安装器 |
| autocompletion | 词组 | 自动补全 | 帮浏览子命令和参数 |
| navigate | /ˈnævɪɡeɪt/ v. | 浏览、导航 | 浏览子命令和参数 |
| parameter | /pəˈræmɪtər/ n. | 参数 | 命令的参数 |
| permanent | /ˈpɜːrmənənt/ adj. | 永久的 | 让补全更持久 |
| and that's it | 习语 | 就这样、就完事了 | Helm 装好了 |
| ready to go | 习语 | 准备就绪 | Helm 可以用了 |

### Lesson 06 — Helm Commands

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| drill into | 词组 | 深入钻研 | 深入每个命令细节 |
| auto completion | 词组 | 自动补全 | 若启用可帮输入 |
| fuzzy-based search | 词组 | 模糊搜索 | search hub 的关键字可为部分 |
| publicly registered | 词组 | 公开注册的 | 公开注册的 chart |
| cryptographic verification | 词组 | 加密校验 | 对 chart 做加密校验 |
| argument | /ˈɑːrɡjumənt/ n. | 参数 | rollback 的两个参数 |
| reference | /ˈrɛfrəns/ v. | 引用 | 名字供后续引用 |
| notes / instructions | n. | 说明、指示 | chart 提供的访问说明 |
| end-to-end | 词组 | 端到端的 | 完整端到端的 manifest |
| scaffold out | 词组 | 脚手架生成 | helm create 生成结构 |
| versioned archive | 词组 | 带版本的归档 | package 生成 |
| tar gzipped | 词组 | tar+gzip 压缩的 | .tar.gz 归档 |
| lint | /lɪnt/ v. | 静态检查 | 验证 chart 格式良好 |
| well-formed | 词组 | 格式良好的 | chart 格式良好 |
| validate | /ˈvælɪdeɪt/ v. | 校验、验证 | 校验当前 chart |
| moving on | 习语 | 继续、往下讲 | 转到下一组命令 |
| become productive | 词组 | 变得高效 | 用 Helm 更高效 |

### Lesson 07 — Creating, Hosting and Installing a Chart

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| range in complexity | 词组 | 复杂度不一 | chart 复杂度差异大 |
| application stack | 词组 | 应用栈 | 多微服务/数据库等组成 |
| top-level metadata | 词组 | 顶层元数据 | Chart.yaml 的内容 |
| mandatory | /ˈmændətɔːri/ adj. | 必需的、强制的 | name/version 是必需字段 |
| optionally required | 词组 | 可选的 | description/type 等 |
| semantic versioning | 词组 | 语义化版本 | version 遵循的方案 |
| reusable functions | 词组 | 可复用函数 | library 型 chart 含 |
| dependent charts | 词组 | 依赖的 chart | charts 文件夹存放 |
| default values | 词组 | 默认值 | values.yaml 里的值 |
| dotted notation | 词组 | 点号表示法 | .Values.a.b 路径 |
| delimit | /dɪˈlɪmɪt/ v. | 界定、划定 | 双花括号界定求值区 |
| undergo | /ˌʌndərˈɡoʊ/ v. | 经历、经受 | 文件经历渲染过程 |
| template partial | 词组 | 模板片段 | 可复用的片段 |
| refactor out | 词组 | 重构抽出 | 把重复片段抽出 |
| snippet | /ˈsnɪpɪt/ n. | 代码片段 | _helpers.tpl 里的片段 |
| exercise | /ˈɛksərsaɪz/ v. | 演练、运行 | 测试演练 chart |
| annotate | /ˈænəteɪt/ v. | 加注解 | 加 helm.sh/hook 注解 |
| archive | /ˈɑːrkaɪv/ v./n. | 归档 | 打包成归档 |
| recursive scan | 词组 | 递归扫描 | repo index 递归扫描目录 |
| roll out | 词组 | 推出、发布 | 把应用推进集群 |
| straightforward | /ˌstreɪtˈfɔːrwərd/ adj. | 简单直接的 | 打包流程简单直接 |
| come across | 词组 | 遇到、碰到 | 遇到重复的模板片段 |

### Lesson 08 — Helm Template Syntax

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| template syntax | 词组 | 模板语法 | 本课主题 |
| from scratch | 习语 | 从零开始 | 从零写模板 |
| convert into | 词组 | 转换成 | 把 manifest 转成模板 |
| desired output | 词组 | 期望输出 | 先给期望输出再给模板 |
| extract out | 词组 | 抽取出来 | 把消息抽出 |
| substitute out | 词组 | 替换掉 | 硬编码值被替换 |
| built-in / inbuilt object | 词组 | 内置对象 | Release/Values 等 |
| template directive | 词组 | 模板指令 | 双花括号内的指令 |
| double curly braces | 词组 | 双花括号 | {{ }} |
| evaluate | /ɪˈvæljueɪt/ v. | 求值 | 引擎求值花括号内指令 |
| as is | 习语 | 原样地 | 花括号外原样渲染 |
| dot notation | 词组 | 点号表示法 | .Values.a.b |
| checksum | /ˈtʃɛksʌm/ n. | 校验和 | 对 ConfigMap 算校验和 |
| roll and replace | 词组 | 滚动替换 | 滚动替换 Pod |
| scattered throughout | 词组 | 散布各处 | 指令散布模板各处 |
| whitespace | /ˈwaɪtspeɪs/ n. | 空白（字符） | 花括号内外的空白 |
| include | /ɪnˈkluːd/ v./关键字 | 引入、包含 | include 引用模板片段 |
| scope | /skoʊp/ n. | 作用域 | 传入的作用域 |
| chomp | /tʃɒmp/ v. | 咬掉、吃掉 | dash 吃掉空白 |
| dash | /dæʃ/ n. | 短横线 | `-` 空白控制符 |
| pipe symbol | 词组 | 管道符 | `\|` 传递输出 |
| indent / nindent | 专有函数 | 缩进 / 带换行缩进 | 确保渲染缩进正确 |
| prepend | /ˌpriːˈpɛnd/ v. | 前置添加 | nindent 前加换行 |
| pipeline | /ˈpaɪplaɪn/ n. | 管线 | 复杂管线 |
| control structure | 词组 | 控制结构 | if/end 等 |
| global variable | 词组 | 全局变量 | `$` 全局变量 |
| root context | 词组 | 根上下文 | `$` 指向根上下文 |
| hang off | 词组 | 挂在…上 | Template 对象挂在根上下文 |
| self-explanatory | /ˌsɛlf ɪkˈsplænətɔːri/ adj. | 不言自明的 | 其余语法不言自明 |
| mismatching | /ˌmɪsˈmætʃɪŋ/ adj. | 不匹配的 | 避免 label 不匹配 |
| for starters | 习语 | 首先、先说 | 先看 ConfigMap |

## 第四门课-集群管理

### Lesson 00 — Course Introduction

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| administer | /ədˈmɪnɪstər/ v. | 管理 | 管理 Kubernetes 集群 |
| administration | /ədˌmɪnɪˈstreɪʃn/ n. | 管理 | 集群管理 |
| practitioner | /prækˈtɪʃənər/ n. | 从业者 | Kubernetes 从业者 |
| time-limited | 词组 | 限时的 | 限时的考试情境 |
| compliment | /ˈkɒmplɪmənt/ v. | 补充、配合（此处应为 complement） | 与其他内容互补 |
| pro-tip | 词组 | 专家小技巧 | kubectl 专家技巧 |
| attract / repel | v. | 吸引 / 排斥 | 把 Pod 吸引到或排斥出节点 |
| stateless | /ˈsteɪtləs/ adj. | 无状态的 | 无状态应用 lab |
| single-node / multi-node | 词组 | 单节点 / 多节点 | 集群类型 |
| get the most from | 习语 | 充分获益 | 充分从课程获益 |

### Lesson 01 — Getting the Most Out of kubectl

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| get hands on | 习语 | 动手实操 | 第一节动手管理集群 |
| first hand | 词组 | 亲身、第一手 | 亲身演示如何做任务 |
| iterate over | 词组 | 遍历 | 遍历 items 数组 |
| fleshed out | 词组 | 充实好的、完整的 | 编辑充实好的 manifest |

### Lesson 02 — Controlling Pod Scheduling

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| heterogeneous | /ˌhɛtərəˈdʒiːniəs/ adj. | 异构的、异质的 | 集群由异构节点组成 |
| blazing fast | 词组 | 极快的 | 极快的 SSD |
| solid state drive (SSD) | 词组 | 固态硬盘 | 节点硬件 |
| pod placement | 词组 | Pod 放置 | 控制 Pod 放置 |
| DaemonSet | 专有名词 | 守护进程集 | 每节点跑一个 Pod |
| long running process | 词组 | 长期运行的进程 | DaemonSet/Deployment 用途 |
| log aggregation | 词组 | 日志聚合 | Fluentd 日志聚合 |
| taint | /teɪnt/ n./v. | 污点；给…打污点 | 把 Pod 从节点排斥 |
| toleration | /ˌtɒləˈreɪʃn/ n. | 容忍 | 允许 Pod 调度到被 taint 的节点 |
| repel | /rɪˈpɛl/ v. | 排斥、驱离 | taint 排斥 Pod |
| eligible | /ˈɛlɪdʒəbl/ adj. | 有资格的 | Pod 有资格调度到某节点 |
| granularity | /ˌɡrænjəˈlærəti/ n. | 粒度 | 用值获得更细的调度粒度 |
| effect | /ɪˈfɛkt/ n. | 效果、作用 | taint 的 effect |
| NoSchedule / PreferNoSchedule / NoExecute | 专有值 | 三种 taint 效果 | 不调度/尽量不调度/不调度且驱逐 |
| evict | /ɪˈvɪkt/ v. | 驱逐 | NoExecute 驱逐已有 Pod |
| disk-pressure | 词组 | 磁盘压力 | 资源不足时的 taint |
| circumvent | /ˌsɜːrkəmˈvɛnt/ v. | 规避、绕开 | Pod 绕开某些条件 |
| reserve resources | 词组 | 预留资源 | 为高优先级负载预留 |
| nodeSelector | 专有字段 | 节点选择器 | 按 label 精确匹配调度 |
| affinity | /əˈfɪnəti/ n. | 亲和性 | 吸引 Pod 到节点 |
| anti-affinity | 词组 | 反亲和性 | 排斥 Pod |
| expressive | /ɪkˈsprɛsɪv/ adj. | 表达力强的 | affinity 比 selector 更有表达力 |
| deprecate | /ˈdɛprɪkeɪt/ v. | 弃用 | affinity 将取代 selector |
| operator | /ˈɒpəreɪtər/ n. | 操作符 | In/NotIn/DoesNotExist |
| strict requirement | 词组 | 严格要求 | 对比偏好 |
| matchExpressions | 专有字段 | 匹配表达式 | 表达 label 条件 |
| weight | /weɪt/ n. | 权重 | 偏好的相对重要性 |
| topology key | 词组 | 拓扑键 | 决定调度到哪个节点 |
| physical domain | 词组 | 物理域 | zone/机架/云区域 |
| server rack | 词组 | 服务器机架 | 物理域之一 |
| computationally expensive | 词组 | 计算开销大 | pod affinity 开销大 |
| implicitly | /ɪmˈplɪsɪtli/ adv. | 隐式地 | label 隐含命名空间 |
| resource requirements | 词组 | 资源需求 | limits/requests |
| mebibyte (Mi) | /ˈmɛbibaɪt/ n. | 兆字节（2^20） | 内存单位 |
| bootstrap | /ˈbuːtstræp/ v. | 引导、自举 | 引导集群 |
| custom scheduler | 词组 | 自定义调度器 | 内置不够时自建 |
| schedulerName | 专有字段 | 调度器名字段 | 指定用哪个调度器 |
| covered a lot of ground | 习语 | 讲了很多内容 | 本课涵盖很多 |
| the latest and greatest | 习语 | 最新最好的 | 最新 CPU/GPU |

### Lesson 03 — Resource Management Models

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| paradigm | /ˈpærədaɪm/ n. | 范式 | 三种资源管理范式 |
| imperative | /ɪmˈpɛrətɪv/ adj. | 命令式的 | 命令式范式 |
| declarative | /dɪˈklærətɪv/ adj. | 声明式的 | 声明式范式 |
| trade-off | 词组 | 取舍、权衡 | 范式之间的取舍 |
| specialized | /ˈspɛʃəlaɪzd/ adj. | 专用的 | 专用于特定资源 |
| named after verbs | 词组 | 以动词命名 | 命令式命令 |
| embedded | /ɪmˈbɛdɪd/ adj. | 内嵌的 | 无内嵌变更历史 |
| escape mechanism | 词组 | 逃生/回退机制 | 出错时无回退 |
| error-prone | 词组 | 易错的 | 命令冗长易错 |
| generic | /dʒəˈnɛrɪk/ adj. | 通用的 | 更通用的命令 |
| sinister | /ˈsɪnɪstər/ adj. | 隐患的、险恶的 | 更隐蔽的缺点 |
| partially managed | 词组 | 部分管理的 | 部分由 K8s 管理 |
| external IP | 词组 | 外部 IP | LoadBalancer 的 external IP |
| single source of truth | 词组 | 唯一事实来源 | 配置文件为准 |
| preserve | /prɪˈzɜːrv/ v. | 保留 | 保留文件未捕获的改动 |
| last applied configuration | 词组 | 上次应用的配置 | 声明式的关键注解 |
| three-way diff | 词组 | 三方差异 | apply 的核心机制 |
| primitive field | 词组 | 基本字段 | 如 replicas 字段 |
| default value | 词组 | 默认值 | 删字段后设回默认 |
| prune | /pruːn/ v. | 修剪、删除 | apply --prune 删资源 |
| maneuver | /məˈnuːvər/ n. | 操作、手段 | prune 是危险操作 |
| wipe out | 词组 | 抹除、清空 | 误删子目录外一切 |
| creep in | 习语 | 悄悄潜入 | 微妙问题潜入集群 |
| take my word | 习语 | 相信我的话 | 暂且相信注解是 JSON |
| stick with | 习语 | 坚持用 | 认准一种模型 |
| armed with | 习语 | 掌握了、带着 | 掌握了范式知识 |

### Lesson 04 — Kubernetes Networking

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| kube-controller-manager | 专有名词 | 控制器管理器 | 大多数控制器在此 |
| SSL termination | 词组 | SSL 终止 | Ingress 支持 |
| path-based routing | 词组 | 基于路径的路由 | 按路径分流 Service |
| controller agnostic | 词组 | 与控制器无关的 | spec 部分 |
| come in | 习语 | 登场、发挥作用 | Service 登场 |
| in place | 习语 | 就位、到位 | Ingress Controller 就位后 |
| wrap up | 词组 | 收尾、总结 | 下一课收尾课程 |

### Lesson 05 — Course Summary

| 单词 / 词组 | 音标 / 词性 | 中文意思 | 语境示例 |
|------------|-----------|---------|---------|
| completions | n. | 补全 | 启用 shell 补全 |
| become acquainted with | 词组 | 熟悉 | 熟悉控制调度的方法 |
| counteract | /ˌkaʊntərˈækt/ v. | 抵消、抗衡 | toleration 抵消 taint |
| node affinity | 词组 | 节点亲和性 | 吸引 Pod 到节点 |
| pod affinity / anti-affinity | 词组 | Pod 亲和 / 反亲和 | 基于已有 Pod label |
| spread pods | 词组 | 分散 Pod | 为高可用分散 |
| resource requests | 词组 | 资源请求 | 特殊话题 |
| imperative / declarative | adj. | 命令式 / 声明式 | 管理范式 |
| migrate | /ˈmaɪɡreɪt/ v. | 迁移 | 从一种模型迁移 |
| committed to | 词组 | 采用、坚持 | 你所采用的模型 |
| path based routing | 词组 | 基于路径的路由 | Ingress 用途 |

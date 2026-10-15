'use strict'

// Generate Markdown text for LLM / AI crawlers, from each post's Markdown source:
// - llms-full.txt: every post in one file
// - llms-full/<分类>.txt: posts split by top-level category
// - <abbrlink>/index.md: one file per post, linked from llms.txt
// Pairs with seo-llms-txt.js (index-only variant).

// 每篇 Markdown 与分类合集的路径，seo-llms-txt.js 也用
const llmsMdPath = (p) => String(p.path || '').replace(/index\.html$/, '').replace(/\/?$/, '/') + 'index.md'
const llmsCategoryPath = (cat) => `llms-full/${String(cat).replace(/[\\/:*?"<>|\s]+/g, '-')}.txt`
hexo.llmsPaths = { llmsMdPath, llmsCategoryPath }

hexo.extend.generator.register('llms_full_txt', function (locals) {
  const config = this.config
  const siteUrl = (config.url || '').replace(/\/$/, '')
  const title = config.title || ''
  const description = config.description || ''

  // 无信息量的图片 alt（CSDN / 公众号默认值）
  const GENERIC_ALT = /^\s*(图片|image|img|在这里插入图片描述|插入图片描述|请添加图片描述)?\s*$/i
  const FENCE = /^\s*(`{3,}|~{3,})/

  // CSDN 粘贴来的 KaTeX 渲染结果：katex-mathml 的最后一行是 TeX 源码，整块换回 $...$
  const KATEX_OPEN = /<span class="katex(--inline|-display)">/g
  const replaceKatex = (s) => {
    let out = ''
    let last = 0
    let m
    KATEX_OPEN.lastIndex = 0
    while ((m = KATEX_OPEN.exec(s))) {
      const tag = /<span\b[^>]*>|<\/span>/g
      tag.lastIndex = m.index
      let depth = 0
      let end = -1
      let t
      while ((t = tag.exec(s))) {
        depth += t[0][1] === '/' ? -1 : 1
        if (depth === 0) { end = tag.lastIndex; break }
      }
      if (end < 0) break
      const mathml = s.slice(m.index, end).match(/<span class="katex-mathml">([\s\S]*?)<\/span>/)
      const tex = mathml ? mathml[1].split('\n').map(l => l.trim()).filter(Boolean).pop() : ''
      out += s.slice(last, m.index) + (tex ? (m[1] === '-display' ? `\n$$\n${tex}\n$$\n` : `$${tex}$`) : '')
      last = KATEX_OPEN.lastIndex = end
    }
    return out + s.slice(last)
  }

  // 从 Markdown 源稿生成正文：保留代码围栏和标题层级，避免渲染后 HTML 里的行号混入
  // top：正文最高一级标题的级别（汇总文件里每篇标题占 ##，正文从 ### 起）
  const toMarkdown = (src, top) => {
    const text = replaceKatex(String(src || ''))
      .replace(/\r\n/g, '\n')
      .replace(/<!--\s*more\s*-->/gi, '')
      // 文末公众号二维码
      .replace(/<!--\s*wangjishanren-qrcode:start\s*-->[\s\S]*?<!--\s*wangjishanren-qrcode:end\s*-->/g, '')
      .replace(/\{%-?\s*mermaid\s*-?%\}([\s\S]*?)\{%-?\s*endmermaid\s*-?%\}/g, (_, b) => '```mermaid\n' + b.trim() + '\n```')
      .replace(/\{%-?\s*(end)?math\s*-?%\}/g, '$$$$')
      .replace(/\{%-?\s*(end)?raw\s*-?%\}/g, '')

    // 第一遍：找出代码块外的最小标题级别，整体下移到 top
    let fence = null
    let minLevel = 7
    const lines = text.split('\n')
    const inCode = lines.map(line => {
      const m = line.match(FENCE)
      if (fence) {
        if (m && m[1][0] === fence[0] && m[1].length >= fence.length && !line.trim().slice(m[1].length)) fence = null
        return true
      }
      if (m) { fence = m[1]; return true }
      const h = line.match(/^(#{1,6})\s/)
      if (h) minLevel = Math.min(minLevel, h[1].length)
      return false
    })
    const shift = minLevel < 7 ? Math.max(0, top - minLevel) : 0

    const out = lines.map((line, i) => {
      if (inCode[i]) return line
      if (shift) line = line.replace(/^(#{1,6})(?=\s)/, h => '#'.repeat(Math.min(6, h.length + shift)))
      return line
        // 图片地址对模型无用（含 data: 占位图、CSDN 图床），有意义的 alt 留作文字
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, (_, alt) => GENERIC_ALT.test(alt) ? '' : `[图：${alt.trim()}]`)
        // HTML 图片（文末二维码等）
        .replace(/<img\b[^>]*>/gi, '')
        // CSDN 目录锚点
        .replace(/<a\s+(id|name)="[^"]*"\s*><\/a>/gi, '')
    })
    // 源稿漏写的结束围栏，补上以免吞掉后面的文章
    if (fence) out.push(fence)

    return out.join('\n')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
      // 去掉文末分隔线，避免和文章之间的 --- 重复
      .replace(/\n+(-{3,}|\*{3,})$/, '')
  }

  const posts = locals.posts
    .filter(p => !p.hidden && p.published !== false)
    .sort('-date')
    .toArray()

  const header = (intro, count) => {
    const lines = [`# ${title}`, '']
    if (description) lines.push(`> ${description}`, '')
    lines.push(intro, '索引版本见 llms.txt。', '')
    lines.push(`- 站点: ${siteUrl}/`)
    lines.push(`- 作者: ${config.author || '忘机山人'}`)
    lines.push(`- 语言: ${config.language || 'zh-CN'}`)
    lines.push(`- 文章数: ${count}`)
    lines.push('', '---', '')
    return lines
  }

  const meta = (p) => {
    const lines = [`- URL: ${p.permalink || (siteUrl + '/' + (p.path || '')).replace(/([^:])\/{2,}/g, '$1/')}`]
    if (p.date) lines.push(`- 日期: ${p.date.format('YYYY-MM-DD')}`)
    if (p.categories && p.categories.length) lines.push(`- 分类: ${p.categories.toArray().map(c => c.name).join(' / ')}`)
    if (p.tags && p.tags.length) lines.push(`- 标签: ${p.tags.toArray().map(t => t.name).join(', ')}`)
    return lines
  }

  // 汇总文件里的一篇：## 标题 + 元数据 + 正文
  const section = (p) => {
    const lines = [`## ${p.title}`, '', ...meta(p), '']
    const body = toMarkdown(p._content, 3)
    if (body) lines.push(body, '')
    lines.push('---', '')
    return lines.join('\n')
  }

  const routes = []
  const full = header('本文件包含全站已发布文章的 Markdown 正文，按发布日期倒序排列，面向需要完整上下文的大语言模型与 AI 搜索引擎。', posts.length)
  const byCategory = new Map()

  for (const p of posts) {
    const text = section(p)
    full.push(text)

    const cats = p.categories ? p.categories.toArray() : []
    const top = (cats.find(c => !c.parent) || cats[0] || { name: '其他' }).name
    if (!byCategory.has(top)) byCategory.set(top, [])
    byCategory.get(top).push(text)

    const body = toMarkdown(p._content, 2)
    routes.push({
      path: llmsMdPath(p),
      data: [`# ${p.title}`, '', ...meta(p), '', body, ''].join('\n')
    })
  }

  routes.push({ path: 'llms-full.txt', data: '﻿' + full.join('\n') })
  for (const [cat, texts] of byCategory) {
    const lines = header(`本文件包含「${cat}」分类下已发布文章的 Markdown 正文，按发布日期倒序排列。全站合集见 llms-full.txt。`, texts.length)
    routes.push({ path: llmsCategoryPath(cat), data: '﻿' + lines.concat(texts).join('\n') })
  }
  return routes
})

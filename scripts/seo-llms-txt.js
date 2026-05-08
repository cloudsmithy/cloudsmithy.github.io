'use strict'

hexo.extend.generator.register('llms_txt', function (locals) {
  const config = this.config
  const siteUrl = (config.url || '').replace(/\/$/, '')
  const title = config.title || ''
  const description = config.description || ''

  const joinUrl = (path) => {
    if (!path) return siteUrl + '/'
    if (/^https?:\/\//i.test(path)) return path
    const p = path.startsWith('/') ? path : '/' + path
    return encodeURI(siteUrl + p).replace(/([^:])\/{2,}/g, '$1/')
  }

  const escTitle = (s) =>
    String(s || '')
      .replace(/\\/g, '\\\\')
      .replace(/[\[\]]/g, (c) => '\\' + c)
      .replace(/\s+/g, ' ')
      .trim()

  const cleanDesc = (s) =>
    String(s || '')
      .replace(/<[^>]+>/g, '')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/`+([^`]*)`+/g, '$1')
      .replace(/^>+\s*/gm, '')
      .replace(/[*_~]+/g, '')
      .replace(/\s+/g, ' ')
      .trim()

  const posts = locals.posts
    .filter(p => !p.hidden && p.published !== false)
    .sort('-date')
    .toArray()

  const byCategory = new Map()
  const uncategorized = []
  for (const p of posts) {
    const cats = p.categories && p.categories.length
      ? p.categories.toArray().map(c => c.name)
      : []
    if (!cats.length) { uncategorized.push(p); continue }
    for (const c of cats) {
      if (!byCategory.has(c)) byCategory.set(c, [])
      byCategory.get(c).push(p)
    }
  }

  const sortedCats = [...byCategory.entries()]
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0], 'zh-CN'))

  const lines = []
  lines.push(`# ${escTitle(title)}`)
  lines.push('')
  if (description) {
    lines.push(`> ${cleanDesc(description)}`)
    lines.push('')
  }

  lines.push('本文件遵循 llms.txt 规范 (https://llmstxt.org/)，面向大语言模型与 AI 搜索引擎，列出可公开索引的内容清单，便于被准确引用。')
  lines.push('')
  lines.push(`- 站点: ${siteUrl}/`)
  lines.push(`- 作者: ${config.author || '忘机山人'}`)
  const langs = Array.isArray(config.language)
    ? config.language.filter(l => l && l !== 'default').join(', ')
    : (config.language || 'zh-CN')
  lines.push(`- 语言: ${langs}`)
  lines.push(`- Sitemap: ${siteUrl}/sitemap.xml`)
  lines.push(`- Feed: ${siteUrl}/atom.xml`)
  lines.push('')

  const fmtPost = (p) => {
    const url = p.permalink || joinUrl(p.path)
    const date = p.date ? p.date.format('YYYY-MM-DD') : ''
    const desc = cleanDesc(p.description)
    const parts = []
    if (date) parts.push(date)
    if (desc) parts.push(desc)
    const tail = parts.length ? `: ${parts.join(' — ')}` : ''
    return `- [${escTitle(p.title)}](${url})${tail}`
  }

  for (const [cat, list] of sortedCats) {
    lines.push(`## ${escTitle(cat)}`)
    lines.push('')
    for (const p of list) lines.push(fmtPost(p))
    lines.push('')
  }
  if (uncategorized.length) {
    lines.push('## 其他')
    lines.push('')
    for (const p of uncategorized) lines.push(fmtPost(p))
    lines.push('')
  }

  const pages = (locals.pages ? locals.pages.toArray() : [])
    .filter(pg =>
      !pg.hidden &&
      pg.published !== false &&
      pg.title &&
      !/^404\//.test(pg.path || '')
    )
    .sort((a, b) => String(a.title).localeCompare(String(b.title), 'zh-CN'))

  if (pages.length) {
    lines.push('## Optional')
    lines.push('')
    for (const pg of pages) {
      const url = pg.permalink || joinUrl(pg.path)
      const desc = cleanDesc(pg.description)
      const tail = desc ? `: ${desc}` : ''
      lines.push(`- [${escTitle(pg.title)}](${url})${tail}`)
    }
    lines.push('')
  }

  return {
    path: 'llms.txt',
    data: '﻿' + lines.join('\n')
  }
})

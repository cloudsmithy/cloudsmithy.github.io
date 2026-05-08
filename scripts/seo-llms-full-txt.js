'use strict'

// Generate llms-full.txt: a single file containing every post's plain-text content,
// intended for LLM / AI crawlers that want full context in one request.
// Pairs with seo-llms-txt.js (index-only variant).

hexo.extend.generator.register('llms_full_txt', function (locals) {
  const config = this.config
  const siteUrl = (config.url || '').replace(/\/$/, '')
  const title = config.title || ''
  const description = config.description || ''

  const stripHtml = (s) =>
    String(s || '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()

  const posts = locals.posts
    .filter(p => !p.hidden && p.published !== false)
    .sort('-date')
    .toArray()

  const lines = []
  lines.push(`# ${title}`)
  lines.push('')
  if (description) {
    lines.push(`> ${description}`)
    lines.push('')
  }
  lines.push('本文件包含全站已发布文章的正文纯文本，按发布日期倒序排列，面向需要完整上下文的大语言模型与 AI 搜索引擎。')
  lines.push('索引版本见 llms.txt。')
  lines.push('')
  lines.push(`- 站点: ${siteUrl}/`)
  lines.push(`- 作者: ${config.author || '忘机山人'}`)
  lines.push(`- 语言: ${config.language || 'zh-CN'}`)
  lines.push(`- 文章数: ${posts.length}`)
  lines.push('')
  lines.push('---')
  lines.push('')

  for (const p of posts) {
    const url = p.permalink || (siteUrl + '/' + (p.path || '')).replace(/([^:])\/{2,}/g, '$1/')
    const date = p.date ? p.date.format('YYYY-MM-DD') : ''
    const cats = p.categories && p.categories.length
      ? p.categories.toArray().map(c => c.name).join(' / ')
      : ''
    const tags = p.tags && p.tags.length
      ? p.tags.toArray().map(t => t.name).join(', ')
      : ''
    const body = stripHtml(p.content)

    lines.push(`## ${p.title}`)
    lines.push('')
    lines.push(`- URL: ${url}`)
    if (date) lines.push(`- 日期: ${date}`)
    if (cats) lines.push(`- 分类: ${cats}`)
    if (tags) lines.push(`- 标签: ${tags}`)
    lines.push('')
    if (body) {
      lines.push(body)
      lines.push('')
    }
    lines.push('---')
    lines.push('')
  }

  return {
    path: 'llms-full.txt',
    data: '﻿' + lines.join('\n')
  }
})

'use strict'

const { escapeHTML, url_for } = require('hexo-util')
const { sectionOf } = require('../lib/content-sections')
const esc = value => escapeHTML(String(value || ''))
const href = value => esc(url_for.call(hexo, value))
const rootOrder = ['懒猫微服', '极限科技', '软件', '电子产品']
const lazycatOrder = ['入门', '进阶', '开发', '容器', '排查', '摄像头', '算力仓', '炫技', '故事', '番外']

// Render links at build time. Every article is reachable without pagination,
// JavaScript, or expanding an intermediate category archive.
hexo.extend.tag.register('article_index', ([scope = 'tech']) => {
  if (!['tech', 'lazycat'].includes(scope)) throw new Error(`Unknown article index: ${scope}`)
  const allCategories = hexo.locals.get('categories').toArray()
  const lazycat = allCategories.find(category => category.name === '懒猫微服' && !category.parent)
  const children = new Map(allCategories.filter(category => category.parent === lazycat?._id)
    .map(category => [category._id, category.name]))
  const groups = new Map()
  const seen = new Set()
  hexo.locals.get('posts').sort('-date').forEach(post => {
    if (post.published === false || sectionOf(post) !== 'tech' || seen.has(post.path)) return
    const categories = post.categories.toArray()
    const root = rootOrder.find(name => categories.some(category => category.name === name && !category.parent))
    if (scope === 'lazycat' && root !== '懒猫微服') return
    const group = scope === 'lazycat'
      ? categories.map(category => children.get(category._id)).find(Boolean) || '其他'
      : root || '其他技术'
    seen.add(post.path)
    if (!groups.has(group)) groups.set(group, [])
    groups.get(group).push(post)
  })
  const preferred = scope === 'lazycat' ? lazycatOrder : rootOrder
  const names = [...preferred.filter(name => groups.has(name)),
    ...[...groups.keys()].filter(name => !preferred.includes(name))]
  const id = scope === 'lazycat' ? 'lazycat-articles' : 'technical-articles'
  const heading = scope === 'lazycat' ? '懒猫微服完整目录' : '全部技术文章'
  const navigation = names.map((name, index) =>
    `<a href="#${id}-${index + 1}">${esc(name)}<span>${groups.get(name).length}</span></a>`
  ).join('')
  const sections = names.map((name, index) => {
    const posts = groups.get(name)
    if (scope === 'lazycat') {
      const number = post => Number(String(post.source || '').split('/').pop().match(/^(\d+)[.、\s]/)?.[1] || Infinity)
      posts.sort((a, b) => number(a) - number(b) || a.date.valueOf() - b.date.valueOf())
    }
    const links = posts.map(post =>
      `<li><a href="${href(post.path)}">${esc(post.title)}</a>` +
      `<time datetime="${post.date.format('YYYY-MM-DD')}">${post.date.format('YYYY-MM-DD')}</time></li>`
    ).join('')
    return `<section aria-labelledby="${id}-${index + 1}"><h3 id="${id}-${index + 1}">${esc(name)}` +
      `<span>${posts.length} 篇</span></h3><ol>${links}</ol></section>`
  }).join('')
  return `<div class="article-index" data-article-index="${scope}"><h2 id="${id}">${heading}</h2>` +
    `<p class="article-index-count">${seen.size} 篇文章，直接点击标题阅读全文。</p>` +
    `<nav class="article-index-nav" aria-label="${heading}分组">${navigation}</nav>${sections}</div>`
})

hexo.extend.filter.register('after_render:html', (html, data) => {
  if (!/^\/?index\.html$/.test(data?.path || '') || html.includes('id="home-intro"') || !hexo.config.home_intro) return html
  const intro = `<div class="home-intro" id="home-intro"><p>${esc(hexo.config.home_intro)}</p>` +
    `<a href="${href('/series/')}">全部技术文章 <span aria-hidden="true">→</span></a></div>`
  return html.replace(/(<div\b[^>]*\bid="recent-posts"[^>]*>)/i, (_, start) => start + intro)
}, 7)

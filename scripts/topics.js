'use strict'

const { escapeHTML, url_for } = require('hexo-util')

const esc = value => escapeHTML(String(value || ''))
const href = value => esc(url_for.call(hexo, value))
const topics = () => hexo.locals.get('data').topics || []
const categoryCount = item => `<span class="category-count">${item.posts.length} 篇</span>`

function topicCards(base) {
  return topics().map(topic =>
    `<a class="topic-card" href="${href(base + '#' + topic.id)}">` +
    `<i class="${esc(topic.icon)}" aria-hidden="true"></i>` +
    `<strong>${esc(topic.title)}</strong>` +
    `<span class="topic-card-summary">${esc(topic.summary)}</span></a>`
  ).join('')
}

function categoryGroups(rootNames, expanded = false) {
  const categories = hexo.locals.get('categories').toArray()
  const children = new Map()
  for (const category of categories) {
    if (!children.has(category.parent)) children.set(category.parent, [])
    children.get(category.parent).push(category)
  }
  const sortedChildren = category => (children.get(category._id) || [])
    .slice().sort((a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name, 'zh-CN'))
  const categoryLink = category =>
    `<a href="${href(category.path)}"><span>${esc(category.name)}</span>${categoryCount(category)}</a>`
  const branch = category => {
    const nested = sortedChildren(category)
    return `<li>${categoryLink(category)}` +
      (nested.length ? `<ul>${nested.map(branch).join('')}</ul>` : '') + '</li>'
  }
  return rootNames.map(name => {
    const root = categories.find(category => category.name === name && !category.parent)
    if (!root) throw new Error(`Category not found: ${name}`)
    if (!sortedChildren(root).length) {
      return `<a class="category-group category-leaf" href="${href(root.path)}">` +
        `<strong>${esc(root.name)}</strong>${categoryCount(root)}</a>`
    }
    return `<details class="category-group"${expanded ? ' open' : ''}>` +
      `<summary><strong>${esc(root.name)}</strong>${categoryCount(root)}</summary>` +
      `<ul class="category-tree">${sortedChildren(root).map(branch).join('')}</ul>` +
      `<a class="category-all" href="${href(root.path)}">浏览全部文章 <span aria-hidden="true">→</span></a></details>`
  }).join('')
}

// Override the theme helper after scripts load. Native details preserve keyboard
// access, and the optional limit applies to roots rather than consuming children.
hexo.on('generateBefore', () => {
  hexo.extend.helper.register('aside_categories', function (options = {}) {
    const categories = hexo.locals.get('categories').toArray()
    const preferred = hexo.locals.get('data').technical_categories?.roots || []
    const remaining = categories.filter(category => !category.parent && !preferred.includes(category.name))
      .sort((a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name, 'zh-CN'))
      .map(category => category.name)
    const roots = [...preferred, ...remaining]
    const shown = options.limit > 0 ? roots.slice(0, options.limit) : roots
    return '<div class="item-headline"><i class="fas fa-folder-open" aria-hidden="true"></i><span>分类</span></div>' +
      `<div class="category-groups sidebar-category-groups">${categoryGroups(shown, options.expand === true)}</div>` +
      `<a class="all-categories-link" href="${href('/categories/')}">全部 ${categories.length} 个分类 <span aria-hidden="true">→</span></a>`
  })
})

function technicalCategories() {
  const config = hexo.locals.get('data').technical_categories || {}
  const tags = hexo.locals.get('tags').toArray()
  const tagLinks = (config.tags || []).map(name => {
    const tag = tags.find(item => item.name === name)
    if (!tag) throw new Error(`Technical tag not found: ${name}`)
    return `<a href="${href(tag.path)}">${esc(tag.name)}${categoryCount(tag)}</a>`
  }).join('')
  return '<section class="technical-categories" aria-labelledby="technical-categories">' +
    '<h2 id="technical-categories">完整技术分类</h2>' +
    '<p>展开分类查看全部文章，或按下面的技术标签继续查找。</p>' +
    `<div class="category-groups">${categoryGroups(config.roots || [])}</div>` +
    `<nav class="technical-tags" aria-label="更多技术方向">${tagLinks}</nav></section>`
}

hexo.extend.tag.register('category_directory', () => {
  const categories = hexo.locals.get('categories').toArray()
  const technicalRoots = hexo.locals.get('data').technical_categories?.roots || []
  const otherRoots = categories.filter(category => !category.parent && !technicalRoots.includes(category.name))
    .sort((a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name, 'zh-CN'))
    .map(category => category.name)
  return '<div class="taxonomy-directory category-directory">' +
    '<div class="directory-toolbar"><nav class="directory-tabs" aria-label="内容目录">' +
    `<a href="${href('/categories/')}" aria-current="page">分类</a><a href="${href('/tags/')}">标签</a>` +
    `<a href="${href('/topics/')}">技术专题</a></nav>` +
    `<span class="directory-total">${categories.length} 个分类</span></div>` +
    '<p class="directory-intro">按内容归档查找文章。主分类的数量包含其子分类。</p>' +
    '<section aria-labelledby="categories-technical"><h2 id="categories-technical">技术与设备</h2>' +
    `<div class="category-groups">${categoryGroups(technicalRoots, true)}</div></section>` +
    '<section aria-labelledby="categories-life"><h2 id="categories-life">生活与阅读</h2>' +
    `<div class="category-groups">${categoryGroups(otherRoots)}</div></section></div>`
})

// Keep every topic accessible without a large block above the article list.
// Priority 6 runs before hexo-minify (10); only the first homepage gets this nav.
hexo.extend.filter.register('after_render:html', (html, data) => {
  if (!/^\/?index\.html$/.test(data?.path || '') || !topics().length) return html
  if (html.includes('id="home-topics"')) return html
  const links = topics().map(topic =>
    `<a class="home-topic-link" href="${href('/topics/#' + topic.id)}" aria-label="${esc(topic.title)}专题">` +
    `<span class="topic-bubble"><i class="${esc(topic.icon)}" aria-hidden="true"></i>` +
    `<span class="topic-bubble-label">${esc(topic.home_title || topic.title)}</span></span></a>`
  ).join('')
  const panel = '<nav class="home-topics" id="home-topics" aria-label="技术专题">' +
    '<div class="home-topics-heading">' +
    `<a class="home-topics-all" href="${href('/topics/')}" aria-label="All · 查看全部专题"><span lang="en">All</span> ` +
    '<span class="home-topics-arrow" aria-hidden="true">》</span></a></div>' +
    `<div class="home-topic-links">${links}</div></nav>`
  return html.replace(/(<div\b[^>]*\bid="recent-posts"[^>]*>)/i, (_, start) => start + panel)
}, 6)

hexo.extend.filter.register('after_render:html', (html, data) => {
  const post = data?.page
  if (post?.layout !== 'post' || html.includes('id="post-topic-nav"')) return html
  const tags = new Set(post.tags?.map(tag => tag.name) || [])
  const categories = new Set(post.categories?.map(category => category.name) || [])
  const currentPath = '/' + String(post.path || '').replace(/^\/+/, '').replace(/index\.html$/, '')
  const related = topics().filter(topic =>
    topic.match?.tags?.some(tag => tags.has(tag)) ||
    topic.match?.categories?.some(category => categories.has(category)) ||
    topic.steps.some(step => step.url === currentPath)
  )
  if (!related.length) return html
  const links = related.map(topic =>
    `<a href="${href('/topics/#' + topic.id)}">${esc(topic.title)}专题</a>`
  ).join('')
  const navigation = '<nav class="post-topic-nav" id="post-topic-nav" aria-label="文章相关专题">' +
    '<strong>继续按专题阅读</strong><div class="post-topic-links">' + links +
    `<a href="${href('/tags/')}">全部标签</a></div></nav>`
  return html.replace(/<\/article>/i, end => end + navigation)
}, 6)

hexo.extend.filter.register('after_render:html', (html, data) => {
  if (!data?.page?.category || html.includes('id="category-archive-nav"')) return html
  const categories = hexo.locals.get('categories').toArray()
  const current = categories.filter(category => data.path.startsWith(category.path))
    .sort((a, b) => b.path.length - a.path.length)[0]
  const ancestors = []
  let parent = current?.parent
  while (parent) {
    const category = categories.find(item => item._id === parent)
    if (!category) break
    ancestors.unshift(category)
    parent = category.parent
  }
  const parentLinks = ancestors.map(category =>
    `<a href="${href(category.path)}">${esc(category.name)}</a>`
  ).join('<span aria-hidden="true">›</span>')
  const navigation = '<nav class="category-archive-nav" id="category-archive-nav" aria-label="分类导航">' +
    `<a href="${href('/categories/')}">全部分类</a>` +
    (parentLinks ? '<span aria-hidden="true">›</span>' + parentLinks : '') +
    (current ? `<span aria-hidden="true">›</span><span aria-current="page">${esc(current.name)}</span>` : '') +
    '</nav>'
  return html.replace(/(<div\b[^>]*\bid="category"[^>]*>)/i, (_, start) => start + navigation)
}, 6)

hexo.extend.tag.register('topic_guide', () => {
  const sections = topics().map(topic => {
    const steps = topic.steps.map(step =>
      `<li><a class="topic-step" href="${href(step.url)}"><strong>${esc(step.title)}</strong>` +
      `<span>${esc(step.note)}</span></a></li>`
    ).join('')
    return `<section class="topic-section" aria-labelledby="${esc(topic.id)}">` +
      `<h2 id="${esc(topic.id)}">${esc(topic.title)}</h2><p>${esc(topic.intro)}</p>` +
      `<ol class="topic-steps">${steps}</ol>` +
      `<a class="topics-more" href="${href(topic.more.url)}">${esc(topic.more.label)} <span aria-hidden="true">→</span></a></section>`
  }).join('')
  return '<div class="topic-guide"><nav class="topic-grid" aria-label="跳转到专题">' +
    topicCards('') + '</nav>' + technicalCategories() + sections + '</div>'
})

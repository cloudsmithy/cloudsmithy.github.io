'use strict'

const { escapeHTML, url_for } = require('hexo-util')

const esc = value => escapeHTML(String(value || ''))
const href = value => esc(url_for.call(hexo, value))
const topics = () => hexo.locals.get('data').topics || []

function topicCards(base) {
  return topics().map(topic =>
    `<a class="topic-card" href="${href(base + '#' + topic.id)}">` +
    `<i class="${esc(topic.icon)}" aria-hidden="true"></i>` +
    `<strong>${esc(topic.title)}</strong>` +
    `<span class="topic-card-summary">${esc(topic.summary)}</span></a>`
  ).join('')
}

function technicalCategories() {
  const config = hexo.locals.get('data').technical_categories || {}
  const categories = hexo.locals.get('categories').toArray()
  const tags = hexo.locals.get('tags').toArray()
  const children = new Map()
  for (const category of categories) {
    if (!children.has(category.parent)) children.set(category.parent, [])
    children.get(category.parent).push(category)
  }
  const sortedChildren = category => (children.get(category._id) || [])
    .slice().sort((a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name, 'zh-CN'))
  const count = item => `<span class="category-count">${item.posts.length} 篇</span>`
  const categoryLink = category =>
    `<a href="${href(category.path)}"><span>${esc(category.name)}</span>${count(category)}</a>`
  const branch = category => {
    const nested = sortedChildren(category)
    return `<li>${categoryLink(category)}` +
      (nested.length ? `<ul>${nested.map(branch).join('')}</ul>` : '') + '</li>'
  }
  const groups = (config.roots || []).map(name => {
    const root = categories.find(category => category.name === name && !category.parent)
    if (!root) throw new Error(`Technical category not found: ${name}`)
    return '<details class="category-group">' +
      `<summary><strong>${esc(root.name)}</strong>${count(root)}</summary>` +
      `<a class="category-all" href="${href(root.path)}">浏览${esc(root.name)}全部文章</a>` +
      `<ul class="category-tree">${sortedChildren(root).map(branch).join('')}</ul></details>`
  }).join('')
  const tagLinks = (config.tags || []).map(name => {
    const tag = tags.find(item => item.name === name)
    if (!tag) throw new Error(`Technical tag not found: ${name}`)
    return `<a href="${href(tag.path)}">${esc(tag.name)}${count(tag)}</a>`
  }).join('')
  return '<section class="technical-categories" aria-labelledby="technical-categories">' +
    '<h2 id="technical-categories">完整技术分类</h2>' +
    '<p>展开分类查看全部文章，或按下面的技术标签继续查找。</p>' +
    `<div class="category-groups">${groups}</div>` +
    `<nav class="technical-tags" aria-label="更多技术方向">${tagLinks}</nav></section>`
}

// Keep the topic entry points in the rendered HTML, including on PJAX navigation.
// Priority 6 runs before hexo-minify (10); only the first homepage gets this panel.
hexo.extend.filter.register('after_render:html', (html, data) => {
  if (!/^\/?index\.html$/.test(data?.path || '') || !topics().length) return html
  if (html.includes('id="home-topics"')) return html
  const panel = '<section class="home-topics" id="home-topics" aria-labelledby="home-topics-title">' +
    '<div class="topics-heading"><div><h2 id="home-topics-title">按主题阅读</h2>' +
    '<p>从入门到实践，选一条阅读路线。</p></div>' +
    `<a class="topics-more" href="${href('/topics/')}">全部专题 <span aria-hidden="true">→</span></a></div>` +
    '<nav class="topic-grid" aria-label="技术专题">' + topicCards('/topics/') + '</nav></section>'
  return html.replace(/(<div\b[^>]*\bid="recent-posts"[^>]*>)/i, (_, start) => start + panel)
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

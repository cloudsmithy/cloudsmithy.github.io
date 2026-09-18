'use strict'

const { escapeHTML, url_for } = require('hexo-util')

const esc = value => escapeHTML(String(value || ''))
const href = value => esc(url_for.call(hexo, value))
const tagGroups = () => hexo.locals.get('data').tag_groups || []

hexo.extend.tag.register('tag_directory', () => {
  const tags = hexo.locals.get('tags').toArray().filter(tag => tag.posts.length)
  const byName = new Map(tags.map(tag => [tag.name, tag]))
  const seen = new Set()
  const groups = tagGroups().map(group => ({
    ...group,
    tags: group.tags.map(name => {
      if (seen.has(name)) throw new Error(`Tag appears in multiple groups: ${name}`)
      seen.add(name)
      return byName.get(name)
    }).filter(Boolean)
  })).filter(group => group.tags.length)
  const other = tags.filter(tag => !seen.has(tag.name))
    .sort((a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name, 'zh-CN'))
  if (other.length) groups.push({ id: 'other', title: '其他标签', tags: other })

  const jumpLinks = groups.map(group =>
    `<a href="#tags-${esc(group.id)}">${esc(group.title)}</a>`
  ).join('')
  const sections = groups.map(group => {
    const links = group.tags.map(tag =>
      `<li><a href="${href(tag.path)}"><span>${esc(tag.name)}</span>` +
      `<span class="tag-count">${tag.posts.length} 篇</span></a></li>`
    ).join('')
    return `<section class="tag-group" aria-labelledby="tags-${esc(group.id)}">` +
      `<h2 id="tags-${esc(group.id)}">${esc(group.title)}</h2>` +
      (group.description ? `<p>${esc(group.description)}</p>` : '') +
      `<ul class="tag-list">${links}</ul></section>`
  }).join('')
  return '<div class="tag-directory">' +
    `<p class="tag-directory-count">共 ${tags.length} 个标签</p>` +
    `<nav class="tag-group-nav" aria-label="跳转到标签分组">${jumpLinks}</nav>` +
    `<div class="tag-groups">${sections}</div></div>`
})

// Include navigation in the HTML so it also works after PJAX navigation.
hexo.extend.filter.register('after_render:html', (html, data) => {
  if (!html.includes('class="all-tags-link"')) {
    const count = hexo.locals.get('tags').length
    html = html.replace(/(<div class="card-tag-cloud">[\s\S]*?<\/div>)/i, cloud =>
      cloud + `<a class="all-tags-link" href="${href('/tags/')}">全部 ${count} 个标签 <span aria-hidden="true">→</span></a>`
    )
  }
  const currentTag = data?.page?.tag
  if (!currentTag || html.includes('id="tag-archive-nav"')) return html
  const relatedAI = currentTag !== 'AI' &&
    tagGroups().find(group => group.id === 'ai')?.tags.includes(currentTag)
  const ai = relatedAI && hexo.locals.get('tags').toArray().find(tag => tag.name === 'AI')
  const navigation = '<nav class="tag-archive-nav" id="tag-archive-nav" aria-label="标签导航">' +
    `<a href="${href('/tags/')}">全部标签</a>` +
    `<a href="${href('/topics/')}">技术专题</a>` +
    (ai ? `<a href="${href(ai.path)}">AI 相关文章</a>` : '') + '</nav>'
  return html.replace(/(<div\b[^>]*\bid="tag"[^>]*>)/i, (_, start) => start + navigation)
}, 6)

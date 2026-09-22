'use strict'

const { escapeHTML, url_for } = require('hexo-util')
const { sectionOf } = require('../lib/content-sections')
const esc = value => escapeHTML(String(value || ''))
const href = value => esc(url_for.call(hexo, value))
let streams

hexo.extend.helper.register('content_section', sectionOf)

hexo.on('generateBefore', () => {
  const generateIndex = require('hexo-generator-index/lib/generator')
  hexo.extend.generator.register('index', function (locals) {
    return generateIndex.call(this, {
      ...locals,
      posts: locals.posts.filter(post => sectionOf(post) === 'tech')
    })
  })
  streams = undefined
  const related = hexo.extend.helper.get('related_posts')
  if (related && !related.sectionAware) {
    const scopedRelated = function (post) {
      const scoped = Object.create(post)
      Object.defineProperty(scoped, 'tags', {
        value: (post.tags || []).map(tag => ({
          posts: tag.posts.filter(candidate => sectionOf(candidate) === sectionOf(post))
        }))
      })
      return related.call(this, scoped)
    }
    scopedRelated.sectionAware = true
    hexo.extend.helper.register('related_posts', scopedRelated)
  }
})

function postsBySection() {
  if (!streams) {
    streams = { tech: [], life: [] }
    hexo.locals.get('posts').sort('-date').forEach(post => streams[sectionOf(post)].push(post))
  }
  return streams
}

hexo.extend.tag.register('life_archive', () => {
  const posts = postsBySection().life
  let year
  let html = `<div class="life-archive"><p class="life-archive-count">${posts.length} 篇生活与阅读记录</p>`
  for (const post of posts) {
    const currentYear = post.date.format('YYYY')
    if (year !== currentYear) {
      if (year) html += '</ol>'
      html += `<h2>${currentYear}</h2><ol>`
      year = currentYear
    }
    html += `<li><time datetime="${post.date.format('YYYY-MM-DD')}">${post.date.format('MM-DD')}</time>` +
      `<a href="${href(post.path)}">${esc(post.title)}</a></li>`
  }
  return html + (year ? '</ol>' : '') + '</div>'
})

// Keep chronological links within the article's own section.
hexo.extend.filter.register('after_render:html', (html, data) => {
  const post = data?.page
  if (post?.layout !== 'post' || !html.includes('pagination-post')) return html
  const section = sectionOf(post)
  const list = postsBySection()[section]
  const index = list.findIndex(candidate => candidate.path === post.path)
  if (index < 0) return html
  const links = [
    { post: list[index + 1], label: '上一篇' },
    { post: list[index - 1], label: '下一篇' }
  ].filter(item => item.post).map(item =>
    `<a href="${href(item.post.path)}"><span>${item.label}</span><strong>${esc(item.post.title)}</strong></a>`
  ).join('')
  const directory = section === 'tech'
    ? `<a class="post-section-index" href="${href('/topics/')}">技术专题</a>`
    : `<a class="post-section-index" href="${href('/life/articles/')}">生活与阅读</a>`
  const navigation = `<nav class="post-section-nav" aria-label="${section === 'tech' ? '技术文章导航' : '生活文章导航'}">` +
    `<div class="post-section-neighbors">${links}</div>${directory}</nav>`
  return html.replace(/<nav\b[^>]*class="[^"]*pagination-post[^"]*"[^>]*>[\s\S]*?<\/nav>/i, () => navigation)
}, 6)

'use strict'

const { escapeHTML, url_for } = require('hexo-util')

const esc = value => escapeHTML(String(value || ''))
const href = value => esc(url_for.call(hexo, value))
const tagGroups = () => hexo.locals.get('data').tag_groups || []
const tagLandings = () => hexo.locals.get('data').tag_landings || []

// Let the installed sitemap generator keep handling posts, pages and categories,
// but pass only the tags that have a maintained landing page.
hexo.on('generateBefore', () => {
  const generateSitemap = require('hexo-generator-sitemap/lib/generator')
  hexo.extend.generator.register('sitemap', function (locals) {
    const allowed = new Set(tagLandings().map(item => item.tag))
    return generateSitemap.call(this, {
      ...locals,
      tags: { toArray: () => locals.tags.toArray().filter(tag => allowed.has(tag.name)) }
    })
  })
})

hexo.extend.tag.register('tag_directory', () => {
  const tags = hexo.locals.get('tags').toArray().filter(tag => tag.posts.length)
  const byName = new Map(tags.map(tag => [tag.name, tag]))
  const seen = new Set()
  const groups = tagGroups().map(group => {
    const inGroup = new Set()
    return {
      ...group,
      tags: group.tags.map(name => {
        if (inGroup.has(name)) throw new Error(`Tag appears twice in group ${group.id}: ${name}`)
        inGroup.add(name)
        seen.add(name)
        return byName.get(name)
      }).filter(Boolean)
    }
  }).filter(group => group.tags.length)
  const other = tags.filter(tag => !seen.has(tag.name))
    .sort((a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name, 'zh-CN'))
  if (other.length) groups.push({ id: 'other', title: '其他标签', tags: other })

  const jumpLinks = groups.map(group =>
    `<a href="#tags-${esc(group.id)}">${esc(group.title)}</a>`
  ).join('')
  const sections = groups.map(group => {
    const links = group.tags.map(tag =>
      `<li><a href="${href(tag.path)}"><span>${esc(tag.name)}</span>` +
      `<span class="tag-count" aria-label="${tag.posts.length} 篇文章">${tag.posts.length}</span></a></li>`
    ).join('')
    return `<section class="tag-group" aria-labelledby="tags-${esc(group.id)}">` +
      `<div class="tag-group-heading"><h2 id="tags-${esc(group.id)}">${esc(group.title)}</h2>` +
      (group.description ? `<p>${esc(group.description)}</p>` : '') + '</div>' +
      `<ul class="tag-list">${links}</ul></section>`
  }).join('')
  return '<div class="taxonomy-directory tag-directory">' +
    '<div class="directory-toolbar"><nav class="directory-tabs" aria-label="内容目录">' +
    `<a href="${href('/categories/')}">分类</a><a href="${href('/tags/')}" aria-current="page">标签</a>` +
    `<a href="${href('/topics/')}">技术专题</a></nav>` +
    `<span class="directory-total">${tags.length} 个标签</span></div>` +
    '<p class="directory-intro">按内容方向浏览标签，同一标签可出现在多个分组。数字表示该标签的文章数量。</p>' +
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
  const landing = Number(data.page.current || 1) === 1 && !/\/page\/\d+\//.test(data.path || '')
    ? tagLandings().find(item => item.tag === currentTag) : null
  const guide = landing ? '<section class="tag-landing" aria-labelledby="tag-landing-title">' +
    `<h2 id="tag-landing-title">${esc(landing.heading)}</h2>` +
    landing.paragraphs.map(paragraph => `<p>${esc(paragraph)}</p>`).join('') +
    '<h3>从这里开始读</h3><ol class="tag-landing-reads">' +
    landing.reads.map(item => `<li><a href="${href(item.url)}">${esc(item.title)}</a><span>${esc(item.note)}</span></li>`).join('') +
    '</ol></section>' : ''
  const groups = tagGroups().filter(group => group.tags.includes(currentTag))
  const navigation = '<nav class="tag-archive-nav" id="tag-archive-nav" aria-label="标签导航">' +
    `<a href="${href('/tags/')}">全部标签</a>` +
    `<span aria-hidden="true">›</span><span aria-current="page">${esc(currentTag)}</span>` +
    (groups.length ? '<span class="tag-archive-groups"><span>相关方向：</span>' +
      groups.map(group => `<a href="${href('/tags/#tags-' + group.id)}">${esc(group.title)}</a>`).join('') + '</span>' : '') +
    '</nav>'
  return html.replace(/(<div\b[^>]*\bid="tag"[^>]*>)/i, (_, start) => start + navigation + guide)
}, 6)

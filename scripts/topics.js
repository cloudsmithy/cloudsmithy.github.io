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

// This function runs in the browser; keeping it here ties the interaction to
// the generated homepage markup, including when PJAX returns to the homepage.
function initTopicBubbles() {
  const nav = document.getElementById('home-topics')
  if (!nav) {
    window.jinghuTopicBubblesCleanup?.()
    return
  }
  if (nav.dataset.bubblesReady) return
  window.jinghuTopicBubblesCleanup?.()
  nav.dataset.bubblesReady = 'true'
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const desktop = window.matchMedia('(min-width: 901px)')
  const articles = document.getElementById('recent-posts')
  const aside = document.getElementById('aside-content')
  const placeTopics = () => {
    const showInAside = desktop.matches && aside && getComputedStyle(aside).display !== 'none'
    const destination = showInAside ? aside : articles
    if (!destination || nav.parentElement === destination) return
    const author = showInAside && aside.querySelector('.card-info')
    if (author) author.after(nav)
    else destination.prepend(nav)
  }
  placeTopics()
  desktop.addEventListener('change', placeTopics)
  const observer = new MutationObserver(placeTopics)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  window.jinghuTopicBubblesCleanup = () => {
    desktop.removeEventListener('change', placeTopics)
    observer.disconnect()
  }

  nav.querySelectorAll('.topic-bubble-play').forEach(button => {
    const motion = button.closest('.topic-bubble-motion')
    let animation
    let pointer
    let frame
    let suppressClick = false
    let feedbackTimer

    const clearFrame = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = null
    }
    const settle = (x = 0, y = 0) => {
      clearFrame()
      animation?.cancel()
      motion.style.transform = ''
      motion.classList.remove('is-grabbed')
      if (reducedMotion.matches || !motion.animate) {
        motion.classList.add('is-tapped')
        clearTimeout(feedbackTimer)
        feedbackTimer = setTimeout(() => motion.classList.remove('is-tapped'), 180)
        return
      }
      motion.classList.add('is-playing')
      const current = motion.animate([
        { transform: `translate(${x}px, ${y}px) rotate(${x / 8}deg) scale(.95, 1.04)`, offset: 0 },
        { transform: `translate(${-x * .22}px, ${-y * .22 - 10}px) rotate(${-x / 12}deg) scale(1.04, .97)`, offset: .3 },
        { transform: `translate(${x * .1}px, ${y * .1 + 3}px) scale(.98, 1.02)`, offset: .56 },
        { transform: 'translate(0, -2px) scale(1.01, .99)', offset: .78 },
        { transform: 'translate(0, 0) rotate(0) scale(1)', offset: 1 }
      ], { duration: 520, easing: 'ease-out' })
      animation = current
      current.finished.catch(() => {}).finally(() => {
        if (animation === current) {
          motion.classList.remove('is-playing')
          animation = null
        }
      })
    }
    button.addEventListener('click', () => {
      if (suppressClick) {
        suppressClick = false
        return
      }
      settle()
    })
    button.addEventListener('pointerdown', event => {
      // Touch keeps native scrolling; tapping still plays the bounce.
      if (event.button !== 0 || event.pointerType === 'touch' || reducedMotion.matches) return
      animation?.cancel()
      motion.style.transform = ''
      const bounds = motion.getBoundingClientRect()
      const panelBounds = nav.getBoundingClientRect()
      pointer = {
        id: event.pointerId, startX: event.clientX, startY: event.clientY,
        x: 0, y: 0, moved: false,
        minX: Math.min(0, Math.max(-20, panelBounds.left + 8 - bounds.left)),
        maxX: Math.max(0, Math.min(20, panelBounds.right - bounds.right - 8))
      }
      suppressClick = false
      motion.classList.add('is-grabbed')
      button.setPointerCapture(event.pointerId)
      event.preventDefault()
    })
    button.addEventListener('pointermove', event => {
      if (!pointer || pointer.id !== event.pointerId) return
      const dx = event.clientX - pointer.startX
      const dy = event.clientY - pointer.startY
      if (Math.hypot(dx, dy) > 5) pointer.moved = true
      if (!pointer.moved) return
      pointer.x = Math.max(pointer.minX, Math.min(pointer.maxX, dx))
      pointer.y = Math.max(-16, Math.min(12, dy))
      if (!frame) frame = requestAnimationFrame(() => {
        frame = null
        if (pointer) motion.style.transform =
          `translate(${pointer.x}px, ${pointer.y}px) rotate(${pointer.x / 8}deg)`
      })
    })
    const release = event => {
      if (!pointer || pointer.id !== event.pointerId) return
      const drag = pointer
      pointer = null
      clearFrame()
      motion.classList.remove('is-grabbed')
      if (button.hasPointerCapture(event.pointerId)) button.releasePointerCapture(event.pointerId)
      if (drag.moved) {
        suppressClick = event.type === 'pointerup'
        if (suppressClick) setTimeout(() => { suppressClick = false }, 0)
        settle(drag.x, drag.y)
      }
    }
    button.addEventListener('pointerup', release)
    button.addEventListener('pointercancel', release)
    button.addEventListener('lostpointercapture', release)
  })
}

// Keep every topic accessible without a large block above the article list.
// Priority 6 runs before hexo-minify (10); only the first homepage gets this nav.
hexo.extend.filter.register('after_render:html', (html, data) => {
  if (!/^\/?index\.html$/.test(data?.path || '') || !topics().length) return html
  if (html.includes('id="home-topics"')) return html
  const links = topics().map(topic =>
    '<div class="home-topic-link"><div class="topic-bubble-motion"><div class="topic-bubble">' +
    `<button class="topic-bubble-play" type="button" aria-label="晃一晃${esc(topic.title)}气泡" ` +
    'aria-describedby="topic-play-hint" title="点击弹跳，拖动后回弹">' +
    `<i class="${esc(topic.icon)}" aria-hidden="true"></i></button></div></div>` +
    `<a class="topic-bubble-label" href="${href('/topics/#' + topic.id)}" aria-label="阅读${esc(topic.title)}专题">` +
    `${esc(topic.home_title || topic.title)}</a></div>`
  ).join('')
  const panel = '<nav class="home-topics" id="home-topics" aria-label="技术专题">' +
    '<div class="home-topics-heading">' +
    `<a class="home-topics-all" href="${href('/topics/')}" aria-label="查看全部专题"><span lang="en">All</span></a></div>` +
    '<p class="topic-play-hint" id="topic-play-hint">点气泡玩，点文字读</p>' +
    `<div class="home-topic-links">${links}</div></nav>`
  const script = `<script data-pjax>if(!window.jinghuTopicBubbles){window.jinghuTopicBubbles=${initTopicBubbles.toString()};` +
    "document.addEventListener('pjax:complete',window.jinghuTopicBubbles)}window.jinghuTopicBubbles();</script>"
  const result = html.replace(/(<div\b[^>]*\bid="recent-posts"[^>]*>)/i, (_, start) => start + panel)
  // Run after both columns are parsed, inside the container replaced by PJAX.
  const mainEnd = result.toLowerCase().lastIndexOf('</main>')
  const insertion = mainEnd < 0 ? result.toLowerCase().lastIndexOf('</body>') : mainEnd
  return insertion < 0 ? result + script : result.slice(0, insertion) + script + result.slice(insertion)
}, 6)

// Article listings only need directory entrances; the full trees live on their
// own pages. Keeping this static also makes the links work without JavaScript.
hexo.extend.filter.register('after_render:html', (html, data) => {
  if (!/^\/?(?:page\/\d+\/)?index\.html$/.test(data?.path || '') ||
      !html.includes('id="recent-posts"') || html.includes('id="home-directory"')) return html
  const links = [
    { path: '/categories/', label: '分类', icon: 'fas fa-folder-open', count: hexo.locals.get('categories').length, unit: '个' },
    { path: '/tags/', label: '标签', icon: 'fas fa-tags', count: hexo.locals.get('tags').length, unit: '个' },
    { path: '/archives/', label: '归档', icon: 'fas fa-archive', count: hexo.locals.get('posts').length, unit: '篇' }
  ].map(item =>
    `<a href="${href(item.path)}"><i class="${item.icon}" aria-hidden="true"></i>` +
    `<span>${item.label}</span><span class="home-directory-count">${item.count} ${item.unit}</span>` +
    '<span class="home-directory-arrow" aria-hidden="true">→</span></a>'
  ).join('')
  const directory = '<nav class="card-widget home-directory" id="home-directory" aria-label="文章目录">' + links + '</nav>'
  return html.replace(/(<div\b[^>]*\bclass="sticky_layout"[^>]*>)/i, (_, start) => start + directory)
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

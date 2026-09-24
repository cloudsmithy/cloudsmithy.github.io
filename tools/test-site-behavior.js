'use strict'

const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')
const vm = require('node:vm')

const root = path.resolve(__dirname, '..')
const origin = 'https://blog.no-claw.com'
const workerSource = fs.readFileSync(path.join(root, 'source/sw.js'), 'utf8')

test('math tags render accessible formulas at build time and reject malformed TeX', () => {
  let render
  vm.runInNewContext(fs.readFileSync(path.join(root, 'scripts/math.js'), 'utf8'), {
    require,
    hexo: { extend: { tag: { register(name, callback, options) {
      assert.equal(name, 'math')
      assert.equal(options.ends, true)
      render = callback
    } } } }
  })
  const block = render([], String.raw`\frac{n(n+1)}{2}`)
  assert.match(block, /class="katex-display"/)
  assert.match(block, /<math\b/)
  assert.match(block, /encoding="application\/x-tex"/)
  assert.doesNotMatch(render(['inline'], 'x^2'), /class="katex-display"/)
  assert.throws(() => render([], String.raw`\frac{1}{`), /ParseError/)
})

function worker({ network = async () => new Response('fresh'), storageFails = false } = {}) {
  const handlers = {}
  const stores = new Map()
  const deleted = []
  let fetchCount = 0
  const key = request => typeof request === 'string' ? request : request.url
  const caches = {
    async open(name) {
      if (storageFails) throw new Error('Storage unavailable')
      if (!stores.has(name)) stores.set(name, new Map())
      const store = stores.get(name)
      return {
        async match(request) { return store.get(key(request))?.clone() },
        async put(request, response) { store.set(key(request), response.clone()) },
        async addAll(urls) {
          for (const url of urls) store.set(origin + url, new Response('precache'))
        }
      }
    },
    async keys() { return [...stores.keys()] },
    async delete(name) { deleted.push(name); return stores.delete(name) }
  }
  vm.runInNewContext(workerSource, {
    self: {
      location: { origin },
      addEventListener(name, callback) { handlers[name] = callback },
      async skipWaiting() {},
      clients: { async claim() {} }
    },
    caches, URL, Response,
    async fetch(request) { fetchCount++; return network(request) }
  })
  return {
    caches, deleted,
    get fetchCount() { return fetchCount },
    async dispatch(name, request) {
      const pending = []
      let response
      handlers[name]({
        request,
        waitUntil(promise) { pending.push(promise) },
        respondWith(promise) { response = promise }
      })
      const result = await response
      await Promise.all(pending)
      return result
    },
    async seed(request, body) {
      await (await caches.open('jinghu-v2')).put(request, new Response(body))
    },
    async cached(request) {
      return (await (await caches.open('jinghu-v2')).match(request))?.text()
    }
  }
}

test('activation removes only old caches owned by the blog', async () => {
  const sw = worker()
  for (const name of ['jinghu-v1', 'jinghu-v2', 'another-app']) await sw.caches.open(name)
  await sw.dispatch('activate')
  assert.deepEqual(sw.deleted, ['jinghu-v1'])
})

test('a successful online response refreshes the offline copy', async () => {
  const sw = worker()
  const request = new Request(origin + '/post/')
  await sw.seed(request, 'old')
  assert.equal(await (await sw.dispatch('fetch', request)).text(), 'fresh')
  assert.equal(await sw.cached(request), 'fresh')
})

for (const [label, status, headers] of [
  ['404', 404, {}],
  ['partial content', 206, {}],
  ['no-store', 200, { 'Cache-Control': 'private, no-store' }]
]) {
  test(`${label} responses do not overwrite a good cached page`, async () => {
    const sw = worker({ network: async () => new Response('uncacheable', { status, headers }) })
    const request = new Request(origin + '/post/')
    await sw.seed(request, 'old')
    assert.equal((await sw.dispatch('fetch', request)).status, status)
    assert.equal(await sw.cached(request), 'old')
  })
}

test('a server error falls back to a previously cached page', async () => {
  const sw = worker({ network: async () => new Response('error', { status: 503 }) })
  const request = new Request(origin + '/post/')
  await sw.seed(request, 'old')
  assert.equal(await (await sw.dispatch('fetch', request)).text(), 'old')
  assert.equal(await sw.cached(request), 'old')
})

test('offline requests use a cached page or an explicit offline response', async () => {
  const sw = worker({ network: async () => { throw new Error('Offline') } })
  const request = new Request(origin + '/post/')
  await sw.seed(request, 'old')
  assert.equal(await (await sw.dispatch('fetch', request)).text(), 'old')
  const missing = new Request(origin + '/uncached/')
  const navigation = {
    url: missing.url, method: missing.method, headers: missing.headers, mode: 'navigate'
  }
  const response = await sw.dispatch('fetch', navigation)
  assert.equal(response.status, 503)
  assert.match(await response.text(), /这篇页面尚未缓存/)
  assert.equal((await sw.dispatch('fetch', missing)).type, 'error')
})

test('unavailable cache storage does not break an online response', async () => {
  const sw = worker({ storageFails: true })
  const response = await sw.dispatch('fetch', new Request(origin + '/post/'))
  assert.equal(await response.text(), 'fresh')
})

test('cached CDN resources avoid another network request', async () => {
  const sw = worker()
  const request = new Request('https://cdn.jsdelivr.net/npm/example@1.0.0/index.js')
  await sw.seed(request, 'asset')
  assert.equal(await (await sw.dispatch('fetch', request)).text(), 'asset')
  assert.equal(sw.fetchCount, 0)
})

test('third-party traffic, range requests and no-store requests bypass the worker', async () => {
  const sw = worker()
  for (const request of [
    new Request('https://example.com/analytics'),
    new Request(origin + '/video.mp4', { headers: { Range: 'bytes=0-99' } }),
    new Request(origin + '/fresh/', { cache: 'no-store' }),
    new Request(origin + '/form/', { method: 'POST' })
  ]) {
    assert.equal(await sw.dispatch('fetch', request), undefined)
  }
  assert.equal(sw.fetchCount, 0)
})

let renderMeta
vm.runInNewContext(fs.readFileSync(path.join(root, 'scripts/seo-meta-enhance.js'), 'utf8'), {
  require,
  hexo: { extend: { filter: { register(name, callback) { renderMeta = callback } } } }
})

const head = '<head><meta name="viewport" content="width=device-width">' +
  '<meta name="twitter:card" content="summary_large_image">'

function jsonLdNodes(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .flatMap(([, value]) => { const data = JSON.parse(value); return data['@graph'] || [data] })
}

test('404 variants are noindex while the homepage remains indexable', () => {
  for (const route of ['404', '/404', '404.html', '404/', '404/index.html']) {
    assert.match(renderMeta(head + '</head>', { path: route }), /content="noindex,follow"/)
  }
  const home = renderMeta(head + '</head>', { path: 'index.html' })
  assert.match(home, /content="index,follow"/)
  assert.doesNotMatch(home, /SearchAction/)
  assert.match(home, /"@type":"WebSite"/)
})

test('sharing metadata escapes entities once and JSON-LD contains readable text', () => {
  const html = head +
    '<meta name="description" content="聊聊 &quot;在吗&quot; 和 A &amp; B">' +
    '<meta property="og:title" content="A &amp; B">' +
    '<meta property="og:type" content="article">' +
    '<meta property="article:tag" content="A &amp; B">' +
    '<script type="application/ld+json">{"@type":"BlogPosting","url":"https://blog.no-claw.com/post/"}</script></head>'
  const result = renderMeta(html, { path: 'post/index.html' })
  assert.match(result, /name="twitter:title" content="A &amp; B"/)
  assert.match(result, /name="twitter:description" content="聊聊 &quot;在吗&quot; 和 A &amp; B"/)
  assert.doesNotMatch(result, /&amp;(?:quot|amp);/)
  const json = jsonLdNodes(result).find(node => node['@type'] === 'BlogPosting')
  assert.equal(json.description, '聊聊 "在吗" 和 A & B')
  assert.deepEqual(json.keywords, ['A & B'])
})

test('code examples in descriptions cannot close a JSON-LD script element', () => {
  const html = head +
    '<meta name="description" content="示例 &lt;/script&gt; 和 $&amp;">' +
    '<meta property="og:type" content="article">' +
    '<script type="application/ld+json">{"@type":"BlogPosting","url":"https://blog.no-claw.com/post/"}</script></head>'
  const result = renderMeta(html, { path: 'post/index.html' })
  assert.equal((result.match(/<\/script>/g) || []).length, 1)
  assert.ok(result.includes('name="twitter:description" content="示例 &lt;/script&gt; 和 $&amp;"'))
  const json = jsonLdNodes(result).find(node => node['@type'] === 'BlogPosting')
  assert.equal(json.description, '示例 </script> 和 $&')
})

test('home, profile and article identify the same author without claiming guest authorship', () => {
  const authorId = origin + '/about/#person'
  const home = jsonLdNodes(renderMeta(head + '</head>', { path: 'index.html' }))
  assert.equal(home.find(node => node['@type'] === 'WebSite').author['@id'], authorId)
  const profile = jsonLdNodes(renderMeta(head + '</head>', { path: 'about/index.html' }))
  assert.equal(profile.find(node => node['@type'] === 'ProfilePage').mainEntity['@id'], authorId)
  assert.equal(profile.find(node => node['@type'] === 'Person')['@id'], authorId)
  for (const name of ['忘机山人', 'Guest']) {
    const html = head + '<meta property="og:type" content="article">' +
      `<script type="application/ld+json">${JSON.stringify({
        '@type': 'BlogPosting', url: origin + '/post/', author: [{ '@type': 'Person', name, url: '/author/' }]
      })}</script></head>`
    const data = jsonLdNodes(renderMeta(html, { path: 'post/index.html' }))
    const article = data.find(node => node['@type'] === 'BlogPosting')
    assert.equal(article.author[0].name, name)
    assert.equal(article.author[0]['@id'], name === '忘机山人' ? authorId : undefined)
    assert.equal(article.publisher['@id'], authorId)
  }
})

test('technical and life sections use categories and honor explicit mixed-content overrides', () => {
  const { sectionOf } = require('../lib/content-sections')
  assert.equal(sectionOf({ categories: [{ name: '软件' }, { name: 'AWS' }] }), 'tech')
  assert.equal(sectionOf({ categories: ['懒猫微服', '故事'] }), 'tech')
  assert.equal(sectionOf({ categories: ['读书有感'], tags: ['Docker'] }), 'life')
  assert.equal(sectionOf({ categories: ['软件'], section: 'life' }), 'life')
  assert.equal(sectionOf({ categories: [], section: 'tech' }), 'tech')
})

test('homepage and related posts filter without removing life posts from shared locals', () => {
  const posts = [
    { path: 'tech/', title: 'Tech', categories: ['软件'] },
    { path: 'life/', title: 'Life', categories: ['散文随笔'] }
  ]
  let beforeGenerate, generateIndex
  const helpers = new Map([['related_posts', post => post.tags.flatMap(tag => tag.posts.map(item => item.path))]])
  vm.runInNewContext(fs.readFileSync(path.join(root, 'scripts/content-sections.js'), 'utf8'), {
    require(name) {
      if (name === 'hexo-generator-index/lib/generator') return locals => locals.posts
      return require(name)
    },
    hexo: {
      on(name, fn) { beforeGenerate = fn },
      extend: {
        helper: { get: name => helpers.get(name), register: (name, fn) => helpers.set(name, fn) },
        generator: { register(name, fn) { generateIndex = fn } },
        tag: { register() {} }, filter: { register() {} }
      }
    }
  })
  beforeGenerate()
  const selected = generateIndex({ posts })
  assert.equal(selected.length, 1)
  assert.equal(selected[0].path, 'tech/')
  assert.equal(posts.length, 2)
  for (const post of posts) {
    post.tags = [{ posts }]
    assert.deepEqual(helpers.get('related_posts')(post), [post.path])
  }
})

test('dropdown injection preserves HTML snippets inside existing scripts', () => {
  let renderNavigation
  vm.runInNewContext(fs.readFileSync(path.join(root, 'scripts/navigation.js'), 'utf8'), {
    hexo: { extend: { filter: { register(name, callback) { renderNavigation = callback } } } }
  })
  const existingScript = 'const viewer = "<html><body>SVG</body></html>"'
  const group = '<span class="site-page group"><i></i><span>生活</span><i class="fas fa-chevron-down"></i></span>' +
    '<ul class="menus_item_child"><li><a href="/life/">生活总览</a></li><li><a href="/reading/">书单</a></li></ul>'
  const html = '<html><body><div id="sidebar-menus">' + group + '</div><nav id="nav"><div class="menus_item">' + group +
    '</div></nav><script>' + existingScript + '</script></body></html>'
  const result = renderNavigation(html)
  assert.ok(result.includes('<script>' + existingScript + '</script>'))
  assert.match(result, /<details class="nav-dropdown"/)
  assert.equal((result.match(/class="nav-dropdown-link"/g) || []).length, 1)
  assert.match(result, /<a class="nav-dropdown-link" href="\/life\/"><i><\/i><span>生活<\/span><\/a><i class="fas fa-chevron-down">/)
  const scripts = [...result.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
  assert.equal(scripts.length, 2)
  scripts.forEach(([, source]) => assert.doesNotThrow(() => new vm.Script(source)))
  assert.equal(renderNavigation(result), result)
})

test('homepage bubbles separate play buttons from reading links and preserve HTML safety', () => {
  const filters = []
  vm.runInNewContext(fs.readFileSync(path.join(root, 'scripts/topics.js'), 'utf8'), {
    require,
    hexo: {
      config: { root: '/', url: origin },
      on() {},
      locals: { get() { return { topics: [
        { id: 'easysearch', title: 'Easysearch', icon: 'fas fa-database' },
        { id: 'example', title: 'A "quote" <tag> & B', icon: 'fas fa-code' }
      ] } } },
      extend: {
        helper: { register() {} },
        tag: { register() {} },
        filter: { register(name, callback) { filters.push(callback) } }
      }
    }
  })
  const html = '<html><body><main><div id="recent-posts"><div class="recent-post-item">Article</div></div>' +
    '<div id="aside-content">Author</div></main></body></html>'
  const render = filters.find(callback => callback(html, { path: 'index.html' }).includes('id="home-topics"'))
  assert.ok(render)
  const result = render(html, { path: 'index.html' })
  assert.equal((result.match(/class="topic-bubble-play"/g) || []).length, 2)
  assert.equal((result.match(/class="topic-bubble-label"/g) || []).length, 2)
  assert.match(result, /<button class="topic-bubble-play" type="button"/)
  assert.match(require('hexo-util').unescapeHTML(result), /class="topic-bubble-label" href="\/topics\/#easysearch"/)
  assert.ok(result.includes('A &quot;quote&quot; &lt;tag&gt; &amp; B'))
  assert.doesNotMatch(result, /<a\b[^>]*>[^<]*<button/)
  assert.doesNotMatch(result, /home-topics-all|home-topics-heading/)
  assert.match(result, /<\/button><\/div><\/div><a class="topic-bubble-label"/)
  assert.match(result, /<div id="aside-content">Author<\/div><script data-pjax>/)
  assert.match(result, /<\/script><\/main>/)
  const scripts = [...result.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
  assert.equal(scripts.length, 1)
  assert.doesNotThrow(() => new vm.Script(scripts[0][1]))
  assert.equal(render(result, { path: 'index.html' }), result)
  assert.equal(render(html, { path: 'page/2/index.html' }), html)
})

test('homepage topics follow the visible sidebar and clean up on PJAX navigation', () => {
  const desktop = {
    matches: true,
    listeners: new Set(),
    addEventListener(_, callback) { this.listeners.add(callback) },
    removeEventListener(_, callback) { this.listeners.delete(callback) },
    change(matches) { this.matches = matches; this.listeners.forEach(callback => callback()) }
  }
  const homeNotice = { after(node) { node.parentElement = articles; node.after = 'home-notice' } }
  const articles = {
    querySelector: () => homeNotice,
    prepend(node) { node.parentElement = this }
  }
  const author = { after(node) { node.parentElement = aside; node.after = 'author' } }
  const announcement = { after(node) { node.parentElement = aside; node.after = 'announcement' } }
  const aside = {
    visible: true,
    hasAnnouncement: true,
    querySelector(selector) { return selector === '.card-announcement' ? (this.hasAnnouncement ? announcement : null) : author },
    prepend(node) { node.parentElement = this }
  }
  let nav = { dataset: {}, parentElement: articles, querySelectorAll: () => [] }
  const observers = []
  const context = {
    require,
    window: { matchMedia: query => query.includes('min-width') ? desktop : { matches: false } },
    document: {
      documentElement: {},
      getElementById: id => ({ 'home-topics': nav, 'recent-posts': articles, 'aside-content': aside })[id]
    },
    getComputedStyle: element => ({ display: element.visible ? 'block' : 'none' }),
    MutationObserver: class {
      constructor(callback) { this.callback = callback; observers.push(this) }
      observe() {}
      disconnect() { this.disconnected = true }
    },
    hexo: { on() {}, extend: { tag: { register() {} }, filter: { register() {} } } }
  }
  vm.runInNewContext(fs.readFileSync(path.join(root, 'scripts/topics.js'), 'utf8'), context)
  context.initTopicBubbles()
  assert.equal(nav.parentElement, aside)
  assert.equal(nav.after, 'announcement')
  assert.equal(desktop.listeners.size, 1)

  desktop.change(false)
  assert.equal(nav.parentElement, articles)
  assert.equal(nav.after, 'home-notice')
  desktop.change(true)
  assert.equal(nav.parentElement, aside)
  aside.visible = false
  observers[0].callback()
  assert.equal(nav.parentElement, articles)
  aside.visible = true
  observers[0].callback()
  assert.equal(nav.parentElement, aside)
  assert.equal(nav.after, 'announcement')

  desktop.change(false)
  aside.hasAnnouncement = false
  desktop.change(true)
  assert.equal(nav.after, 'author')

  context.initTopicBubbles()
  assert.equal(desktop.listeners.size, 1)
  nav = null
  context.initTopicBubbles()
  assert.equal(desktop.listeners.size, 0)
  assert.equal(observers[0].disconnected, true)

  nav = { dataset: {}, parentElement: articles, querySelectorAll: () => [] }
  context.initTopicBubbles()
  assert.equal(nav.parentElement, aside)
  assert.equal(desktop.listeners.size, 1)
})

test('homepage moves one announcement before articles while preserving rich content and other pages', () => {
  const filters = []
  vm.runInNewContext(fs.readFileSync(path.join(root, 'scripts/topics.js'), 'utf8'), {
    require,
    hexo: {
      config: { root: '/', url: origin }, on() {},
      locals: { get() { return { topics: [] } } },
      extend: { tag: { register() {} }, filter: { register(_, callback) { filters.push(callback) } } }
    }
  })
  const content = '<div><p>欢迎来到镜湖</p><a href="/reading/">阅读书架</a></div>'
  const widget = '<div class="card-widget card-announcement"><div class="item-headline">公告</div>' +
    `<div class="announcement_content">${content}</div></div>`
  const html = '<main><div id="recent-posts"><article>Article</article></div>' +
    `<div id="aside-content">${widget}<div class="card-info">Author</div></div></main>`
  const render = filters.find(callback => callback(html, { path: 'index.html' }).includes('id="home-announcement"'))
  assert.ok(render)
  const result = render(html, { path: 'index.html' })
  assert.equal((result.match(/id="home-announcement"/g) || []).length, 1)
  assert.ok(result.includes(content))
  assert.match(result, /id="recent-posts"><aside class="home-announcement"/)
  assert.doesNotMatch(result, /card-announcement|home-intro|全部技术文章/)
  assert.match(result, /id="aside-content"><div class="card-info">Author<\/div>/)
  assert.equal(render(result, { path: 'index.html' }), result)
  for (const path of ['page/2/index.html', 'article/index.html', 'topics/index.html']) {
    assert.equal(render(html, { path }), html)
  }
  assert.equal(render(html.replace(widget, ''), { path: 'index.html' }), html.replace(widget, ''))
})

test('article listings preserve full categories and tag clouds below posts without changing other pages', () => {
  const filters = []
  const locals = { data: { topics: [] }, categories: { length: 34 }, tags: { length: 52 }, posts: { length: 357 } }
  vm.runInNewContext(fs.readFileSync(path.join(root, 'scripts/topics.js'), 'utf8'), {
    require,
    hexo: {
      config: { root: '/', url: origin },
      on() {},
      locals: { get: name => locals[name] },
      extend: { tag: { register() {} }, filter: { register(_, callback) { filters.push(callback) } } }
    }
  })
  const categories = '<div class="card-widget card-categories"><div class="item-headline">分类</div>' +
    '<div><details><summary>Original categories</summary><a href="/categories/tech/">Tech</a></details></div></div>'
  const tags = '<div class="card-widget card-tags"><div class="item-headline">标签</div>' +
    '<div class="card-tag-cloud"><a href="/tags/Docker/" style="font-size:1.4em">Docker</a>' +
    '<a href="/tags/AI/">AI</a></div><a class="all-tags-link" href="/tags/">全部标签</a></div>'
  const script = '<script>const example = "<div>example</div>"</script>'
  const html = '<main><div id="recent-posts">Articles' + script + '<nav id="pagination">Pages</nav></div>' +
    '<div id="aside-content"><div class="sticky_layout">' + categories + tags +
    '<div class="card-widget card-webinfo">Site information</div></div></div></main>'
  const render = filters.find(callback => callback(html, { path: 'index.html' }).includes('id="home-directory"'))
  assert.ok(render)
  for (const page of ['index.html', 'page/2/index.html', 'page/36/index.html']) {
    const result = render(html, { path: page })
    const decoded = require('hexo-util').unescapeHTML(result)
    assert.match(decoded, /href="\/categories\/"[\s\S]*?34 个/)
    assert.match(decoded, /href="\/tags\/"[\s\S]*?52 个/)
    assert.match(decoded, /href="\/archives\/"[\s\S]*?357 篇/)
    assert.ok(result.includes('Original categories'))
    assert.ok(result.includes(categories))
    assert.ok(result.includes(tags))
    assert.ok(result.includes(script))
    assert.equal((result.match(/class="card-widget card-categories"/g) || []).length, 1)
    assert.equal((result.match(/class="card-widget card-tags"/g) || []).length, 1)
    assert.ok(result.indexOf('class="home-discovery"') > result.indexOf('id="pagination"'))
    assert.ok(result.indexOf(tags) > result.indexOf('Site information'))
    assert.ok(result.indexOf(tags) < result.indexOf('</main>'))
    assert.ok(result.indexOf('Site information') > result.indexOf('id="aside-content"'))
    assert.equal(render(result, { path: page }), result)
  }
  for (const page of ['categories/index.html', 'tags/AI/index.html', 'fa9f211a/index.html']) {
    assert.equal(render(html, { path: page }), html)
  }
  assert.equal(render('<main>Without sidebar</main>', { path: 'index.html' }), '<main>Without sidebar</main>')
})

test('tags can belong to multiple groups while totals and article counts stay unique', () => {
  const tags = [
    { name: 'AgentCore', path: 'tags/AgentCore/', posts: { length: 3 } },
    { name: 'Bedrock', path: 'tags/Bedrock/', posts: { length: 8 } },
    { name: 'Docker', path: 'tags/Docker/', posts: { length: 32 } },
    { name: 'New', path: 'tags/New/', posts: { length: 1 } }
  ]
  const groups = [
    { id: 'ai', title: 'AI', tags: ['AgentCore', 'Bedrock'] },
    { id: 'cloud', title: 'AWS', tags: ['AgentCore', 'Bedrock', 'Docker'] }
  ]
  let renderDirectory
  let renderArchive
  vm.runInNewContext(fs.readFileSync(path.join(root, 'scripts/tag-directory.js'), 'utf8'), {
    require,
    hexo: {
      config: { root: '/', url: origin },
      on() {},
      locals: { get: name => name === 'data' ? { tag_groups: groups } : { length: tags.length, toArray: () => tags } },
      extend: {
        tag: { register(_, callback) { renderDirectory = callback } },
        filter: { register(_, callback) { renderArchive = callback } }
      }
    }
  })
  const decode = require('hexo-util').unescapeHTML
  const directory = decode(renderDirectory())
  assert.match(directory, /class="directory-total">4 个标签/)
  assert.equal((directory.match(/href="\/tags\/AgentCore\/"/g) || []).length, 2)
  assert.equal((directory.match(/href="\/tags\/Bedrock\/"/g) || []).length, 2)
  assert.equal((directory.match(/aria-label="3 篇文章">3/g) || []).length, 2)
  assert.equal((directory.match(/aria-label="8 篇文章">8/g) || []).length, 2)
  assert.equal((directory.match(/href="\/tags\/New\/"/g) || []).length, 1)
  assert.match(directory, /tags-other/)

  const archive = decode(renderArchive('<div id="tag">Posts</div>', { page: { tag: 'AgentCore' } }))
  assert.match(archive, /href="\/tags\/#tags-ai"/)
  assert.match(archive, /href="\/tags\/#tags-cloud"/)
  assert.equal((archive.match(/aria-current="page"/g) || []).length, 1)
  groups[0].tags.push('AgentCore')
  assert.throws(() => renderDirectory(), /twice in group ai/)
})

test('only maintained tag landings are indexed; other tags and every tag pagination are noindex', () => {
  const landings = require(require.resolve('js-yaml', { paths: [require.resolve('hexo')] })).load(fs.readFileSync(path.join(root, 'source/_data/tag_landings.yml'), 'utf8'))
  let render
  vm.runInNewContext(fs.readFileSync(path.join(root, 'scripts/seo-meta-enhance.js'), 'utf8'), {
    require,
    hexo: {
      locals: { get: () => ({ tag_landings: landings }) },
      extend: { filter: { register(_, callback) { render = callback } } }
    }
  })
  const html = head + '<title>镜湖</title><meta name="robots" content="index,follow">' +
    '<meta property="og:title" content="镜湖"><meta name="description" content="通用描述">' +
    '<meta property="og:description" content="通用描述"><meta name="twitter:description" content="通用描述"></head>'
  for (const landing of landings) {
    const result = render(html, { path: `tags/${landing.tag}/index.html`, page: { tag: landing.tag, current: 1 } })
    assert.match(result, /name="robots" content="index,follow"/)
    assert.ok(result.includes(`<title>${landing.title} - 镜湖</title>`))
    assert.equal((result.match(new RegExp(landing.description, 'g')) || []).length, 3)
    assert.doesNotMatch(result, /通用描述/)
    const paged = render(html, { path: `tags/${landing.tag}/page/2/index.html`, page: { tag: landing.tag, current: 2 } })
    assert.match(paged, /name="robots" content="noindex,follow"/)
    assert.match(paged, /第 2 页/)
  }
  for (const tag of ['AgentCore', '机器学习', 'STM32']) {
    const result = render(html, { path: `tags/${tag}/index.html`, page: { tag, current: 1 } })
    assert.match(result, /name="robots" content="noindex,follow"/)
    assert.ok(result.includes(`${tag} 标签归档`))
  }
  assert.match(render(html, { path: 'tags/index.html', page: {} }), /name="robots" content="noindex,follow"/)
  assert.match(render(html, { path: 'post/index.html', page: { layout: 'post' } }), /name="robots" content="index,follow"/)
})

test('sitemap allowlist and tag landing introductions use the same maintained data', () => {
  const landings = require(require.resolve('js-yaml', { paths: [require.resolve('hexo')] })).load(fs.readFileSync(path.join(root, 'source/_data/tag_landings.yml'), 'utf8'))
  const tags = [...landings.map(item => ({ name: item.tag })), { name: 'Other' }]
  let beforeGenerate
  let generate
  let renderArchive
  const config = { root: '/', url: origin }
  vm.runInNewContext(fs.readFileSync(path.join(root, 'scripts/tag-directory.js'), 'utf8'), {
    require: name => name === 'hexo-generator-sitemap/lib/generator'
      ? function (locals) { assert.equal(this.config, config); return locals }
      : require(name),
    hexo: {
      config,
      on(_, callback) { beforeGenerate = callback },
      locals: { get: name => name === 'data' ? { tag_landings: landings, tag_groups: [] } : { length: tags.length } },
      extend: {
        generator: { register(_, callback) { generate = callback } },
        tag: { register() {} },
        filter: { register(_, callback) { renderArchive = callback } }
      }
    }
  })
  beforeGenerate()
  const posts = { retained: true }
  const filtered = generate.call({ config }, { tags: { toArray: () => tags }, posts })
  assert.deepEqual(filtered.tags.toArray().map(item => item.name), ['Docker', 'AWS', 'NAS', '懒猫微服'])
  assert.equal(filtered.posts, posts)
  for (const landing of landings) {
    const first = renderArchive('<div id="tag">Articles</div>', { path: `tags/${landing.tag}/index.html`, page: { tag: landing.tag, current: 1 } })
    assert.ok(first.includes(landing.heading))
    assert.equal((first.match(/<li>/g) || []).length, 4)
    const next = renderArchive('<div id="tag">Articles</div>', { path: `tags/${landing.tag}/page/2/index.html`, page: { tag: landing.tag, current: 2 } })
    assert.doesNotMatch(next, /tag-landing-title/)
  }
})

test('homepage search, sharing and structured descriptions follow site configuration', () => {
  const config = { title: '镜湖', subtitle: '从云端到家庭机房', description: '前 AWS 技术支持，记录 A & B 的实践。' }
  let render
  vm.runInNewContext(fs.readFileSync(path.join(root, 'scripts/seo-meta-enhance.js'), 'utf8'), {
    require,
    hexo: { config, extend: { filter: { register(_, callback) { render = callback } } } }
  })
  const html = head + '<title>旧标题</title><meta property="og:title" content="旧标题">' +
    '<meta name="twitter:title" content="旧标题"><meta name="description" content="旧描述">' +
    '<meta property="og:description" content="旧描述"><meta name="twitter:description" content="旧描述">' +
    '</head><h1 class="title-seo">旧标题</h1>'
  const result = render(html, { path: 'index.html' })
  assert.match(result, /<title>镜湖 - 从云端到家庭机房<\/title>/)
  assert.doesNotMatch(result, /旧标题|旧描述/)
  assert.equal((result.match(/content="前 AWS 技术支持，记录 A &amp; B 的实践。"/g) || []).length, 3)
  assert.equal(jsonLdNodes(result).find(node => node['@type'] === 'WebSite').description, config.description)
  const article = render(html, { path: 'article/index.html' })
  assert.match(article, /<title>旧标题<\/title>/)
})

test('flat article indexes retain every technical article once and order the complete Lazycat series', () => {
  const categories = [
    { _id: 'lazy', name: '懒猫微服' }, { _id: 'intro', name: '入门', parent: 'lazy' },
    { _id: 'dev', name: '开发', parent: 'lazy' }, { _id: 'software', name: '软件' },
    { _id: 'life', name: '散文随笔' }
  ]
  const post = (id, group, number, extra = {}) => ({
    path: `${id}/`, title: `<${id}> & 笔记`, source: `_posts/${number}. article.md`,
    published: true, categories: { toArray: () => group, some: callback => group.some(callback) },
    date: { format: () => '2025-01-01', valueOf: () => number },
    ...extra
  })
  const first = post('first', categories.slice(0, 2), 2)
  const tenth = post('tenth', categories.slice(0, 2), 10)
  const dev = post('dev', [categories[0], categories[2]], 1)
  const software = post('software', [categories[3]], 1)
  const life = post('life', [categories[4]], 1)
  const unpublished = post('draft', categories.slice(0, 2), 3, { published: false })
  const explicit = post('explicit', [], 1, { section: 'tech' })
  const posts = [tenth, first, dev, software, life, unpublished, first, explicit]
  let render
  vm.runInNewContext(fs.readFileSync(path.join(root, 'scripts/series-directory.js'), 'utf8'), {
    require: name => name === '../lib/content-sections' ? require('../lib/content-sections') : require(name),
    hexo: {
      config: { root: '/', url: origin },
      locals: { get: name => name === 'categories' ? { toArray: () => categories } : { sort: () => posts } },
      extend: { tag: { register(_, callback) { render = callback } }, filter: { register() {} } }
    }
  })
  const decode = require('hexo-util').unescapeHTML
  const all = decode(render(['tech']))
  for (const item of [first, tenth, dev, software, explicit]) {
    assert.equal((all.match(new RegExp(`href="/${item.path}"`, 'g')) || []).length, 1)
  }
  assert.doesNotMatch(all, /href="\/(?:life|draft)\//)
  assert.match(all, /5 篇文章/)
  const lazycat = decode(render(['lazycat']))
  assert.match(lazycat, /3 篇文章/)
  assert.ok(lazycat.indexOf('href="/first/"') < lazycat.indexOf('href="/tenth/"'))
  assert.doesNotMatch(lazycat, /href="\/(?:software|explicit)\//)
  assert.throws(() => render(['unknown']), /Unknown article index/)
})

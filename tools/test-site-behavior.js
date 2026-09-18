'use strict'

const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')
const vm = require('node:vm')

const root = path.resolve(__dirname, '..')
const origin = 'https://blog.no-claw.com'
const workerSource = fs.readFileSync(path.join(root, 'source/sw.js'), 'utf8')

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
  const json = JSON.parse(result.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])
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
  const json = JSON.parse(result.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])
  assert.equal(json.description, '示例 </script> 和 $&')
})

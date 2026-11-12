const CACHE_PREFIX = 'jinghu-';
const CACHE_NAME = `${CACHE_PREFIX}v2`;
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/css/index.css',
];

// 安装：预缓存核心资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// 激活：清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names.filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// 存储异常不能中断在线访问，404/500、部分响应和 no-store 响应不写缓存。
async function cacheResponse(request, response) {
  if (!response.ok || response.status === 206 ||
      /\bno-store\b/i.test(response.headers.get('Cache-Control') || '')) return;
  const clone = response.clone();
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, clone);
  } catch (_) {
    // 配额不足或缓存不可用时，仍然返回网络响应。
  }
}

async function matchCache(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    return await cache.match(request);
  } catch (_) {
    return undefined;
  }
}

function offlineResponse(request) {
  if (request.mode !== 'navigate') return Response.error();
  return new Response(
    '<!doctype html><html lang="zh-CN"><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>暂时离线 | 镜湖</title><body><main><h1>暂时无法连接网络</h1>' +
    '<p>这篇页面尚未缓存，请联网后重试。</p><a href="/">回到首页</a></main></body></html>',
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

// 请求拦截：只缓存本站和明确允许的静态资源域名。
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || request.headers.has('Range') ||
      request.cache === 'no-store') return;

  const url = new URL(request.url);
  if (!['http:', 'https:'].includes(url.protocol)) return;

  const cacheFirst = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com']
    .includes(url.hostname);
  if (url.origin !== self.location.origin && !cacheFirst) return;

  event.respondWith((async () => {
    if (cacheFirst) {
      const cached = await matchCache(request);
      if (cached) return cached;
    }
    try {
      const response = await fetch(request);
      if (response.status >= 500) {
        const cached = await matchCache(request);
        if (cached) return cached;
      }
      event.waitUntil(cacheResponse(request, response));
      return response;
    } catch (_) {
      return await matchCache(request) || offlineResponse(request);
    }
  })());
});

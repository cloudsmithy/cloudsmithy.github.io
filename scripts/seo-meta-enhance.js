'use strict'

// Runs before hexo-minify (priority 10), so we operate on pretty HTML.
// Adjusts: <title>, homepage <h1>, JSON-LD blocks, twitter card, meta robots.

const SITE_URL = 'https://blog.no-claw.com'
const SITE_NAME = '镜湖'
const SITE_ALT = ['CloudSmithy Blog', '忘机山人']
const SITE_DESC = '忘机山人的个人博客，专注 AWS 云计算、Docker 容器、NAS 与懒猫微服、Easysearch、Python 后端开发、AI 部署与 Homelab 实践，记录技术、生活与思考'
const AUTHOR = '忘机山人'
const AUTHOR_URL = SITE_URL + '/about/'
const LOGO_URL = SITE_URL + '/images/me.png'
const HOME_H1 = '镜湖 — 忘机山人的云计算与 Homelab 笔记'
const HOME_OG_TITLE = '镜湖 — 忘机山人的云计算与 Homelab 笔记'

const FONTAWESOME_HREF = 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@7.1.0/css/all.min.css'

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  alternateName: SITE_ALT,
  url: SITE_URL + '/',
  description: SITE_DESC,
  inLanguage: 'zh-CN',
  copyrightYear: '2022',
  author: { '@type': 'Person', name: AUTHOR, url: AUTHOR_URL },
  publisher: {
    '@type': 'Person',
    name: AUTHOR,
    image: { '@type': 'ImageObject', url: LOGO_URL }
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: SITE_URL + '/?s={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
}

function isRootHome(path) {
  return path === 'index.html' || path === '/index.html'
}

function stripEmptyJsonLd(html) {
  return html.replace(
    /<script\s+type="application\/ld\+json">\s*<\/script>/gi,
    ''
  )
}

function ensureMetaRobots(html) {
  if (/<meta\s+name="robots"/i.test(html)) return html
  return html.replace(
    /(<meta\s+name="viewport"[^>]*>)/i,
    '$1<meta name="robots" content="index,follow">'
  )
}

function fillTwitterCard(html, { title, description }) {
  const inserts = []
  if (title && !/<meta\s+name="twitter:title"/i.test(html)) {
    inserts.push(`<meta name="twitter:title" content="${escapeAttr(title)}">`)
  }
  if (description && !/<meta\s+name="twitter:description"/i.test(html)) {
    inserts.push(`<meta name="twitter:description" content="${escapeAttr(description)}">`)
  }
  if (!inserts.length) return html
  return html.replace(
    /(<meta\s+name="twitter:card"[^>]*>)/i,
    '$1' + inserts.join('')
  )
}

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function pickMeta(html, names) {
  for (const n of names) {
    const re = new RegExp(`<meta\\s+(?:name|property)="${n}"\\s+content="([^"]*)"`, 'i')
    const m = html.match(re)
    if (m) return m[1]
  }
  return ''
}

function rewriteHomeJsonLd(html) {
  const next = `<script type="application/ld+json">${JSON.stringify(websiteJsonLd)}</script>`
  // Replace the first WebSite block if present; otherwise inject before </head>.
  const re = /<script\s+type="application\/ld\+json">\s*\{[^<]*?"@type"\s*:\s*"WebSite"[\s\S]*?<\/script>/i
  if (re.test(html)) return html.replace(re, next)
  return html.replace(/<\/head>/i, next + '</head>')
}

function rewriteHomeH1(html) {
  return html.replace(
    /<h1\s+class="title-seo">[^<]*<\/h1>/i,
    `<h1 class="title-seo">${escapeAttr(HOME_H1)}</h1>`
  )
}

function rewriteHomeOgTitle(html) {
  return html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*">/i,
    `<meta property="og:title" content="${escapeAttr(HOME_OG_TITLE)}">`
  )
}

function preloadFontAwesome(html) {
  if (html.indexOf('rel="preload"') !== -1 && html.indexOf(FONTAWESOME_HREF) !== -1 && /rel="preload"\s+as="style"\s+href="[^"]*fontawesome[^"]*"/i.test(html)) {
    return html
  }
  if (html.indexOf(FONTAWESOME_HREF) === -1) return html
  const tag = `<link rel="preload" as="style" href="${FONTAWESOME_HREF}" crossorigin>`
  return html.replace(/<\/head>/i, tag + '</head>')
}

function enrichPostJsonLd(html, ctx) {
  const re = /<script\s+type="application\/ld\+json">\s*(\{[\s\S]*?"@type"\s*:\s*"BlogPosting"[\s\S]*?\})\s*<\/script>/i
  const m = html.match(re)
  if (!m) return html

  let data
  try { data = JSON.parse(m[1]) } catch (e) { return html }

  if (ctx.description) data.description = ctx.description
  if (ctx.keywords && ctx.keywords.length) data.keywords = ctx.keywords
  data.inLanguage = 'zh-CN'
  data.mainEntityOfPage = { '@type': 'WebPage', '@id': data.url }
  data.publisher = {
    '@type': 'Organization',
    name: SITE_NAME,
    logo: { '@type': 'ImageObject', url: LOGO_URL }
  }

  return html.replace(re, `<script type="application/ld+json">${JSON.stringify(data)}</script>`)
}

hexo.extend.filter.register('after_render:html', function (html, data) {
  if (!html || typeof html !== 'string') return html
  if (!/<\/head>/i.test(html)) return html

  const path = data && data.path ? data.path : ''
  const isHome = isRootHome(path)

  // Read description/og:title from the rendered HTML, then mutate.
  const desc = pickMeta(html, ['description', 'og:description'])
  const ogTitle = pickMeta(html, ['og:title']) || (isHome ? SITE_NAME : '')

  let out = html
  out = stripEmptyJsonLd(out)
  out = ensureMetaRobots(out)
  out = preloadFontAwesome(out)

  if (isHome) {
    out = rewriteHomeOgTitle(out)
    out = rewriteHomeJsonLd(out)
    out = rewriteHomeH1(out)
  }

  // re-read og:title after potential rewrite, so twitter:title gets the rich version
  const finalOgTitle = pickMeta(out, ['og:title']) || ogTitle
  out = fillTwitterCard(out, { title: finalOgTitle, description: desc })

  if (!isHome && /property="og:type"\s+content="article"/.test(out)) {
    const tags = []
    const tagRe = /<meta\s+property="article:tag"\s+content="([^"]*)"/g
    let tm
    while ((tm = tagRe.exec(out)) !== null) tags.push(tm[1])
    out = enrichPostJsonLd(out, { description: desc, keywords: tags })
  }

  return out
}, 5)

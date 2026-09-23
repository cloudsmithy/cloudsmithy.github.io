'use strict'

const { unescapeHTML } = require('hexo-util')

// Runs before hexo-minify (priority 10), so we operate on pretty HTML.
// Adjusts: <title>, homepage <h1>, JSON-LD blocks, twitter card, meta robots.

const SITE_URL = 'https://blog.no-claw.com'
const SITE_NAME = '镜湖'
const SITE_ALT = ['CloudSmithy Blog', '忘机山人']
const SITE_DESC = '忘机山人的个人博客，记录 AWS 云计算、Docker、NAS、懒猫微服、搜索引擎与 AI 部署的实践，也分享阅读和日常生活。'
const AUTHOR = '忘机山人'
const AUTHOR_URL = SITE_URL + '/about/'
const AUTHOR_ID = AUTHOR_URL + '#person'
const LOGO_URL = SITE_URL + '/images/icon-512.png'
const homeTitle = () => `${hexo.config?.title || SITE_NAME} - ${hexo.config?.subtitle || '忘机山人的技术随手记'}`
const homeDescription = () => hexo.config?.description || SITE_DESC

const FONTAWESOME_HREF = 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@7.1.0/css/all.min.css'

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': SITE_URL + '/#website',
  name: SITE_NAME,
  alternateName: SITE_ALT,
  url: SITE_URL + '/',
  description: SITE_DESC,
  inLanguage: 'zh-CN',
  copyrightYear: '2016',
  author: { '@id': AUTHOR_ID },
  publisher: { '@id': AUTHOR_ID }
}

function personJsonLd() {
  const profile = hexo.locals?.get('data')?.author || {}
  return {
    '@type': 'Person',
    '@id': AUTHOR_ID,
    name: AUTHOR,
    url: AUTHOR_URL,
    ...Object.fromEntries(['alternateName', 'jobTitle', 'description', 'knowsAbout', 'sameAs']
      .filter(key => profile[key]).map(key => [key, profile[key]]))
  }
}

function graphScript(entities) {
  return '<script type="application/ld+json">' +
    JSON.stringify({ '@context': 'https://schema.org', '@graph': entities })
      .replace(/</g, '\\u003c') + '</script>'
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

function ensureMetaRobots(html, noindex) {
  const robots = /<meta\s+name="robots"[^>]*>/i
  const tag = `<meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow'}">`
  if (robots.test(html)) return noindex ? html.replace(robots, tag) : html
  return html.replace(
    /(<meta\s+name="viewport"[^>]*>)/i,
    '$1' + tag
  )
}

function setMeta(html, attribute, name, content) {
  const tag = `<meta ${attribute}="${name}" content="${escapeAttr(content)}">`
  const pattern = new RegExp(`<meta\\s+${attribute}="${name}"[^>]*>`, 'i')
  return pattern.test(html) ? html.replace(pattern, () => tag) : html.replace(/<\/head>/i, tag + '</head>')
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
    (_, card) => card + inserts.join('')
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
    if (m) return unescapeHTML(m[1])
  }
  return ''
}

function rewriteHomeJsonLd(html) {
  const { '@context': context, ...website } = websiteJsonLd
  website.description = homeDescription()
  const next = graphScript([website, personJsonLd()])
  // Replace the first WebSite block if present; otherwise inject before </head>.
  const re = /<script\s+type="application\/ld\+json">\s*\{[^<]*?"@type"\s*:\s*"WebSite"[\s\S]*?<\/script>/i
  if (re.test(html)) return html.replace(re, next)
  return html.replace(/<\/head>/i, next + '</head>')
}

function rewriteHomeH1(html) {
  return html.replace(
    /<h1\s+class="title-seo">[^<]*<\/h1>/i,
    `<h1 class="title-seo">${escapeAttr(homeTitle())}</h1>`
  )
}

function rewriteHomeMetadata(html) {
  let result = html.replace(/<title>[\s\S]*?<\/title>/i, () => `<title>${escapeAttr(homeTitle())}</title>`)
  for (const [attribute, name, value] of [
    ['property', 'og:title', homeTitle()], ['name', 'twitter:title', homeTitle()],
    ['name', 'description', homeDescription()], ['property', 'og:description', homeDescription()],
    ['name', 'twitter:description', homeDescription()]
  ]) result = setMeta(result, attribute, name, value)
  return result
}

function preloadFontAwesome(html) {
  if (html.indexOf('rel="preload"') !== -1 && html.indexOf(FONTAWESOME_HREF) !== -1 && /rel="preload"\s+as="style"\s+href="[^"]*fontawesome[^"]*"/i.test(html)) {
    return html
  }
  if (html.indexOf(FONTAWESOME_HREF) === -1) return html
  const tag = `<link rel="preload" as="style" href="${FONTAWESOME_HREF}">`
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
  data.publisher = { '@id': AUTHOR_ID }
  const authors = data.author ? [].concat(data.author) : [{ name: AUTHOR }]
  data.author = authors.map(author => author.name === AUTHOR
    ? { '@type': 'Person', '@id': AUTHOR_ID, name: AUTHOR, url: AUTHOR_URL }
    : author)
  delete data['@context']
  return html.replace(re, () => graphScript([data, personJsonLd()]))
}

function enrichProfileJsonLd(html) {
  return html.replace(/<\/head>/i, () => graphScript([{
    '@type': 'ProfilePage',
    '@id': AUTHOR_URL + '#profile',
    url: AUTHOR_URL,
    name: '关于忘机山人',
    mainEntity: { '@id': AUTHOR_ID },
    isPartOf: { '@id': SITE_URL + '/#website' }
  }, personJsonLd()]) + '</head>')
}

hexo.extend.filter.register('after_render:html', function (html, data) {
  if (!html || typeof html !== 'string') return html
  if (!/<\/head>/i.test(html)) return html

  const path = data && data.path ? data.path : ''
  const isHome = isRootHome(path)
  const isNotFound = /^\/?404(?:\.html|\/(?:index\.html)?)?$/.test(path)
  const isTagRoute = /^\/?tags(?:\/|$)/.test(path)
  const currentTag = data?.page?.tag
  const tagPage = Number(data?.page?.current || 1)
  const isTagPagination = tagPage > 1 || /\/page\/\d+\//.test(path)
  const landing = currentTag && (hexo.locals?.get('data')?.tag_landings || [])
    .find(item => item.tag === currentTag)
  const indexableTag = Boolean(landing && !isTagPagination)
  const noindex = isNotFound || (isTagRoute && !indexableTag)

  // Read description/og:title from the rendered HTML, then mutate.
  const desc = pickMeta(html, ['description', 'og:description'])
  const ogTitle = pickMeta(html, ['og:title']) || (isHome ? SITE_NAME : '')

  let out = html
  out = stripEmptyJsonLd(out)
  out = ensureMetaRobots(out, noindex)
  out = preloadFontAwesome(out)

  if (currentTag) {
    const pageSuffix = isTagPagination ? ` · 第 ${tagPage} 页` : ''
    const title = `${landing?.title || currentTag + ' 标签归档'}${pageSuffix} - ${SITE_NAME}`
    const description = isTagPagination
      ? `${currentTag} 标签的第 ${tagPage} 页文章归档，继续查阅镜湖的相关记录。`
      : landing?.description || `镜湖博客中与 ${currentTag} 相关的文章归档，按发表时间查找实践记录与笔记。`
    out = out.replace(/<title>[\s\S]*?<\/title>/i, () => `<title>${escapeAttr(title)}</title>`)
    for (const [attribute, name, value] of [
      ['name', 'description', description], ['property', 'og:title', title],
      ['property', 'og:description', description], ['name', 'twitter:title', title],
      ['name', 'twitter:description', description]
    ]) out = setMeta(out, attribute, name, value)
  }

  if (isHome) {
    out = rewriteHomeMetadata(out)
    out = rewriteHomeJsonLd(out)
    out = rewriteHomeH1(out)
  }
  if (/^\/?about\/(?:index\.html)?$/.test(path)) out = enrichProfileJsonLd(out)

  // re-read og:title after potential rewrite, so twitter:title gets the rich version
  const finalOgTitle = pickMeta(out, ['og:title']) || ogTitle
  out = fillTwitterCard(out, { title: finalOgTitle, description: desc })

  if (!isHome && /property="og:type"\s+content="article"/.test(out)) {
    const tags = []
    const tagRe = /<meta\s+property="article:tag"\s+content="([^"]*)"/g
    let tm
    while ((tm = tagRe.exec(out)) !== null) tags.push(unescapeHTML(tm[1]))
    out = enrichPostJsonLd(out, { description: desc, keywords: tags })
  }

  return out
}, 5)

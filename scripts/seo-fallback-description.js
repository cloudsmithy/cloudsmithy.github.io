'use strict'

hexo.extend.filter.register('after_post_render', function (data) {
  const description = String(data.description || '').trim()
  const title = String(data.title || '').trim()
  if (description.length >= 15 && description !== title) return data
  const raw = (data.excerpt || data.content || '')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<\/(?:p|div|h[1-6]|li|pre)>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (raw) data.description = raw.slice(0, 150)
  return data
}, 10)

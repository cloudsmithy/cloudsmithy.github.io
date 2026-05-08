'use strict'

hexo.extend.filter.register('after_post_render', function (data) {
  if (data.description && String(data.description).trim()) return data
  const raw = (data.excerpt || data.content || '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (raw) data.description = raw.slice(0, 150)
  return data
}, 10)

'use strict'

const { createHash } = require('node:crypto')
const { readFileSync } = require('node:fs')
const { join } = require('node:path')

let topicsStyleVersion

// Recompute on each generation, including CSS edits while hexo server is running.
hexo.on('generateBefore', () => {
  topicsStyleVersion = createHash('sha256')
    .update(readFileSync(join(hexo.source_dir, 'css/topics.css')))
    .digest('hex').slice(0, 12)
})

hexo.extend.filter.register('after_render:html', html => {
  if (!topicsStyleVersion) return html
  return html.replace(
    'href="/css/topics.css"',
    `href="/css/topics.css?v=${topicsStyleVersion}"`
  )
}, 6)

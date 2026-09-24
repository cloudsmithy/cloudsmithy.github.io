'use strict'

const katex = require('katex')

// Render formulas during the build; the theme supplies the matching KaTeX CSS.
// Usage: {% math %} ... {% endmath %}, or {% math inline %} ... {% endmath %}.
hexo.extend.tag.register('math', (args, content) => katex.renderToString(content.trim(), {
  displayMode: args[0] !== 'inline',
  output: 'htmlAndMathml',
  throwOnError: true,
  trust: false,
  strict: 'error'
}), { ends: true })

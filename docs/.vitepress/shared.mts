import type { UserConfig } from 'vitepress'

// HTML 标签集合，用于 markdown 处理
const HTML_TAGS = new Set(['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'slot', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'])

// 共享配置
export const sharedConfig: Partial<UserConfig> = {
  base: '/',
  appearance: true,

  markdown: {
    config: (md) => {
      const defaultRender = md.render.bind(md)
      md.render = (src, env) => {
        // 移除 <!-- more -->
        src = src.replace(/<!--\s*more\s*-->/gi, '')
        
        // 保护代码块
        const codeBlocks: string[] = []
        src = src.replace(/```[\s\S]*?```|`[^`]+`/g, (match) => {
          codeBlocks.push(match)
          return `__CODE_BLOCK_${codeBlocks.length - 1}__`
        })
        
        // 转义非标准 HTML 标签
        src = src.replace(/<([a-zA-Z_][a-zA-Z0-9_-]*)>/g, (match, tag) => {
          if (HTML_TAGS.has(tag.toLowerCase())) {
            return match
          }
          return `&lt;${tag}&gt;`
        })
        
        // 恢复代码块
        src = src.replace(/__CODE_BLOCK_(\d+)__/g, (_, i) => codeBlocks[parseInt(i)])
        
        return defaultRender(src, env)
      }
    }
  },

  async transformPageData(pageData) {
    if (pageData.frontmatter?.title) {
      pageData.title = pageData.frontmatter.title
    }
  }
}

// 共享主题配置
export const sharedThemeConfig = {
  socialLinks: [
    { icon: 'github', link: 'https://github.com/cloudsmithy' }
  ],
  search: {
    provider: 'local' as const
  },
  outline: {
    level: [2, 3] as [number, number],
    label: '目录'
  },
  docFooter: {
    prev: '上一篇',
    next: '下一篇'
  }
}

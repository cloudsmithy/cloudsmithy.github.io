import { defineConfig } from 'vitepress'
import { generateSidebar } from './sidebar.mjs'

export default defineConfig({
  // 直接读取懒猫微服文章目录
  srcDir: '../source/_posts/懒猫微服',
  
  title: '懒猫微服专栏',
  description: '懒猫微服实战教程与进阶心得',
  
  // 部署到 Cloudflare Pages 时的 base 路径
  base: '/',

  // 自动从 frontmatter 生成 h1 标题
  appearance: true,
  
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '入门', link: '/入门/0. 懒猫微服入门篇（零）：开箱初探，硬件亮相' },
      { text: '容器', link: '/容器/1. 写给懒猫微服玩家的容器小书 Docker篇（一）：《无法部署的诅咒》' },
      { text: '进阶', link: '/进阶/1. 懒猫微服进阶心得（一）：M芯片移植懒猫应用构建Docker镜像的常见问题排查及解决方案' },
      { text: '开发', link: '/开发/0.懒猫微服开发篇（零）：上架应用需要哪些知识' },
      { text: '博客', link: 'https://cloudsmithy.github.io' }
    ],

    sidebar: generateSidebar(),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/cloudsmithy' }
    ],

    search: {
      provider: 'local'
    },

    outline: {
      level: [2, 3],
      label: '目录'
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    }
  },

  markdown: {
    config: (md) => {
      const defaultRender = md.render.bind(md)
      md.render = (src, env) => {
        // 移除 <!-- more -->
        src = src.replace(/<!--\s*more\s*-->/gi, '')
        
        // 在代码块外转义可能被误解析的尖括号
        // 先保护代码块
        const codeBlocks: string[] = []
        src = src.replace(/```[\s\S]*?```|`[^`]+`/g, (match) => {
          codeBlocks.push(match)
          return `__CODE_BLOCK_${codeBlocks.length - 1}__`
        })
        
        // 转义非标准 HTML 标签（如 <name>, <MAC>, <command> 等）
        src = src.replace(/<([a-zA-Z_][a-zA-Z0-9_-]*)>/g, (match, tag) => {
          const htmlTags = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'slot', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr']
          if (htmlTags.includes(tag.toLowerCase())) {
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

  // 不需要额外的 vue 配置

  // 在页面内容前插入标题
  async transformPageData(pageData) {
    // 设置页面标题
    if (pageData.frontmatter?.title) {
      pageData.title = pageData.frontmatter.title
    }
  }
})

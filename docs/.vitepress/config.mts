import { defineConfig } from 'vitepress'
import { generateSidebar } from './sidebar.mjs'

export default defineConfig({
  // 直接读取懒猫微服文章目录
  srcDir: '../source/_posts/懒猫微服',
  
  title: '懒猫微服指南',
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
      // 过滤 Hexo 的 <!-- more --> 标记
      const defaultRender = md.render.bind(md)
      md.render = (src, env) => {
        // 移除 <!-- more -->
        src = src.replace(/<!--\s*more\s*-->/gi, '')
        return defaultRender(src, env)
      }
    }
  },

  // 在页面内容前插入标题
  async transformPageData(pageData) {
    // 设置页面标题
    if (pageData.frontmatter?.title) {
      pageData.title = pageData.frontmatter.title
    }
  }
})

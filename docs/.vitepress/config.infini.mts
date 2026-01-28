import { defineConfig } from 'vitepress'
import { generateSidebar } from './sidebar.infini.mjs'
import { sharedConfig, sharedThemeConfig } from './shared.mts'

export default defineConfig({
  ...sharedConfig,
  
  srcDir: '../source/_posts/极限科技',
  srcExclude: ['极限科技稿件数据.md'],
  title: '极限科技专栏',
  description: 'Easysearch 与 Coco AI 实战教程',
  
  themeConfig: {
    ...sharedThemeConfig,
    
    nav: [
      { text: '首页', link: '/' },
      { text: 'Easysearch', link: '/Easysearch/1. INFINI Easysearch尝鲜Hands on' },
      { text: 'Coco AI', link: '/coco/1. CoCo AI APP 初体验：开启智能知识管理新篇章' },
      { text: '博客', link: 'https://cloudsmithy.github.io' }
    ],
    sidebar: generateSidebar()
  }
})

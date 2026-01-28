import { defineConfig } from 'vitepress'
import { generateSidebar } from './sidebar.lazycat.mjs'
import { sharedConfig, sharedThemeConfig } from './shared.mts'

export default defineConfig({
  ...sharedConfig,
  
  srcDir: '../source/_posts/懒猫微服',
  title: '懒猫微服专栏',
  description: '懒猫微服实战教程与进阶心得',
  
  themeConfig: {
    ...sharedThemeConfig,
    
    nav: [
      { text: '首页', link: '/' },
      { text: '入门', link: '/入门/0. 懒猫微服入门篇（零）：开箱初探，硬件亮相' },
      { text: '容器', link: '/容器/1. 写给懒猫微服玩家的容器小书 Docker篇（一）：《无法部署的诅咒》' },
      { text: '进阶', link: '/进阶/1. 懒猫微服进阶心得（一）：M芯片移植懒猫应用构建Docker镜像的常见问题排查及解决方案' },
      { text: '开发', link: '/开发/0.懒猫微服开发篇（零）：上架应用需要哪些知识' },
      { text: '博客', link: 'https://cloudsmithy.github.io' }
    ],
    sidebar: generateSidebar()
  }
})

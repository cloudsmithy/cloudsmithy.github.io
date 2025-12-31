import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import type { Theme } from 'vitepress'
import { useData } from 'vitepress'
import './style.css'
import ArticleFooter from './ArticleFooter.vue'

// 自定义 Layout，在内容前显示标题，内容后显示关注/打赏
const CustomLayout = () => {
  const { frontmatter } = useData()
  
  return h(DefaultTheme.Layout, null, {
    'doc-before': () => {
      if (frontmatter.value?.title && frontmatter.value?.layout !== 'home') {
        return h('h1', { class: 'doc-title' }, frontmatter.value.title)
      }
      return null
    },
    'doc-after': () => {
      // 只在文章页显示，首页不显示
      if (frontmatter.value?.layout !== 'home') {
        return h(ArticleFooter)
      }
      return null
    }
  })
}

export default {
  extends: DefaultTheme,
  Layout: CustomLayout
} satisfies Theme

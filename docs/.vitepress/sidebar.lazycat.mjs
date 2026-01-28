import path from 'path'
import { fileURLToPath } from 'url'
import { createSidebarGenerator } from './sidebar.shared.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const docsRoot = path.resolve(__dirname, '../../source/_posts/懒猫微服')

const categoryOrder = [
  { dir: '入门', name: '入门篇' },
  { dir: '进阶', name: '进阶篇' },
  { dir: '开发', name: '开发篇' },
  { dir: '炫技', name: '炫技篇' },
  { dir: '故事', name: '故事篇' },
  { dir: '番外', name: '番外篇' },
  { dir: '算力仓', name: '算力仓' },
  { dir: '容器', name: '容器篇' },
  { dir: '排查', name: '排查篇' },
]

export const generateSidebar = createSidebarGenerator(docsRoot, categoryOrder, {
  preface: { text: '📖 缘起', link: '/序' },
  epilogue: { text: '📝 后记', link: '/后记' }
})

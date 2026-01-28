import path from 'path'
import { fileURLToPath } from 'url'
import { createSidebarGenerator } from './sidebar.shared.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const docsRoot = path.resolve(__dirname, '../../source/_posts/极限科技')

const categoryOrder = [
  { dir: 'Easysearch', name: 'Easysearch' },
  { dir: 'coco', name: 'Coco AI' },
]

export const generateSidebar = createSidebarGenerator(docsRoot, categoryOrder, {
  preface: { text: '📖 缘起', link: '/序' },
  epilogue: { text: '📝 后记', link: '/后记' }
})

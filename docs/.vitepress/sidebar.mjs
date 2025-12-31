import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const docsRoot = path.resolve(__dirname, '../../source/_posts/懒猫微服')

// 目录显示顺序和显示名称
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

// 从文件名提取序号用于排序
function extractOrder(filename) {
  const match = filename.match(/^(\d+)[\.\s、]/)
  return match ? parseInt(match[1], 10) : 999
}

// 中文数字映射
const numMap = { '零': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10 }

// 从 frontmatter 或文件名提取标题，并简化显示
function extractTitle(filePath, filename) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const match = content.match(/^---\s*\n[\s\S]*?title:\s*(.+?)\s*\n[\s\S]*?---/)
    if (match && match[1]) {
      let title = match[1].replace(/^['"]|['"]$/g, '')
      // 简化标题：提取括号后的内容作为短标题
      const shortMatch = title.match(/[（(]([^）)]+)[）)][：:]\s*(.+)/)
      if (shortMatch) {
        const numStr = shortMatch[1]
        // 转换中文数字
        const num = numMap[numStr] !== undefined ? numMap[numStr] : numStr
        return `${num}. ${shortMatch[2]}`
      }
      return title
    }
  } catch {}
  return filename.replace(/\.md$/, '').replace(/^\d+[\.\s、]*/, '')
}

// 生成单个目录的侧边栏项
function generateCategorySidebar(category) {
  const categoryPath = path.join(docsRoot, category)
  
  if (!fs.existsSync(categoryPath) || !fs.statSync(categoryPath).isDirectory()) {
    return []
  }

  const files = fs.readdirSync(categoryPath)
    .filter(f => f.endsWith('.md') && f !== 'Readme.md' && f !== 'index.md')
    .map(f => ({
      filename: f,
      order: extractOrder(f),
      title: extractTitle(path.join(categoryPath, f), f),
      link: `/${category}/${f.replace(/\.md$/, '')}`
    }))
    .sort((a, b) => a.order - b.order)

  return files.map(f => ({
    text: f.title,
    link: f.link
  }))
}

// 生成完整侧边栏 - 所有分类都显示
export function generateSidebar() {
  const allCategories = []

  for (const { dir, name } of categoryOrder) {
    const items = generateCategorySidebar(dir)
    if (items.length > 0) {
      allCategories.push({
        text: name,
        collapsed: true,  // 默认折叠
        items
      })
    }
  }

  // 所有页面都显示完整侧边栏
  return allCategories
}

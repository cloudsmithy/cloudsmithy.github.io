import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const docsRoot = path.resolve(__dirname, '../../source/_posts/极限科技')

// 目录显示顺序和显示名称
const categoryOrder = [
  { dir: 'Easysearch', name: 'Easysearch' },
  { dir: 'coco', name: 'Coco AI' },
]

// 从文件名提取序号用于排序
function extractOrder(filename) {
  const match = filename.match(/^(\d+)[\.\s、]/)
  return match ? parseInt(match[1], 10) : 999
}

// 从 frontmatter 或文件名提取标题
function extractTitle(filePath, filename) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const match = content.match(/^---\s*\n[\s\S]*?title:\s*(.+?)\s*\n[\s\S]*?---/)
    if (match && match[1]) {
      return match[1].replace(/^['"]|['"]$/g, '')
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

// 生成完整侧边栏
export function generateSidebar() {
  const allCategories = []

  for (const { dir, name } of categoryOrder) {
    const items = generateCategorySidebar(dir)
    if (items.length > 0) {
      allCategories.push({
        text: name,
        link: `/${dir}/`,
        collapsed: true,
        items
      })
    }
  }

  return allCategories
}

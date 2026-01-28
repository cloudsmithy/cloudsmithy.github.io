import fs from 'fs'
import path from 'path'

// 从文件名提取序号用于排序
export function extractOrder(filename) {
  const match = filename.match(/^(\d+)[\.\s、]/)
  return match ? parseInt(match[1], 10) : 999
}

// 中文数字转阿拉伯数字
export function chineseToNumber(str) {
  const numMap = { '零': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10 }
  
  if (/^\d+$/.test(str)) return parseInt(str, 10)
  if (numMap[str] !== undefined) return numMap[str]
  
  if (str.includes('十')) {
    const parts = str.split('十')
    const tens = parts[0] ? (numMap[parts[0]] || 1) : 1
    const ones = parts[1] ? (numMap[parts[1]] || 0) : 0
    return tens * 10 + ones
  }
  
  return str
}

// 从 frontmatter 或文件名提取标题
export function extractTitle(filePath, filename) {
  const order = extractOrder(filename)
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const match = content.match(/^---\s*\n[\s\S]*?title:\s*(.+?)\s*\n[\s\S]*?---/)
    if (match && match[1]) {
      let title = match[1].replace(/^['"]|['"]$/g, '')
      const shortMatch = title.match(/[（(]([^）)]+)[）)][：:]\s*(.+)/)
      if (shortMatch) {
        const num = chineseToNumber(shortMatch[1])
        return `${num}. ${shortMatch[2]}`
      }
      if (order !== 999 && !/^\d+[\.\s、]/.test(title)) {
        return `${order}. ${title}`
      }
      return title
    }
  } catch {}
  return filename.replace(/\.md$/, '')
}

// 生成单个目录的侧边栏项
export function generateCategorySidebar(docsRoot, category) {
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
export function createSidebarGenerator(docsRoot, categoryOrder, options = {}) {
  const { preface = null, epilogue = null } = options
  
  return function generateSidebar() {
    const allCategories = []

    if (preface) {
      allCategories.push(preface)
    }

    for (const { dir, name } of categoryOrder) {
      const items = generateCategorySidebar(docsRoot, dir)
      if (items.length > 0) {
        allCategories.push({
          text: name,
          link: `/${dir}/`,
          collapsed: true,
          items
        })
      }
    }

    if (epilogue) {
      allCategories.push(epilogue)
    }

    return allCategories
  }
}

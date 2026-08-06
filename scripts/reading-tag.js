'use strict'

// {% reading %} 标签：从 source/_data/reading.yml 单一数据源，自动渲染
//   ① 概览（总数 / 各状态 / 各分类计数 / 各月计数）
//   ② 分类书架（按 CATEGORY_ORDER 分组）
//   ③ 月度时间线（按记录时间倒序分组）
// 加书或改状态只需改 reading.yml 一处，三块视图与计数全部同步。

const STATUS = {
  done: { icon: '✅', label: '读完' },
  reading: { icon: '📚', label: '在读' },
  half: { icon: '📖', label: '读了一半' },
  want: { icon: '📖', label: '想读' }
}

// 分类展示顺序（数据里出现但未列出的分类会追加到末尾）
const CATEGORY_ORDER = ['技术', '哲学·道家', '中医·养生', '人文社科', '成长·自我', '文学']
const CATEGORY_ICON = {
  技术: '💻',
  '哲学·道家': '🧘',
  '中医·养生': '🩺',
  人文社科: '🌍',
  '成长·自我': '🌱',
  文学: '📖'
}

function esc (s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function statusCell (status) {
  const s = STATUS[status] || { icon: '❓', label: esc(status) }
  return `${s.icon} ${s.label}`
}

function notesCell (notes) {
  if (!Array.isArray(notes) || !notes.length) return '-'
  return notes
    .filter(n => n && n.url)
    .map(n => `<a href="${esc(n.url)}" target="_blank" rel="noopener">${esc(n.label || '笔记')}</a>`)
    .join(' · ')
}

function bookRows (books) {
  return books
    .map(
      b =>
        `<tr><td>《${esc(b.title)}》</td><td>${statusCell(b.status)}</td>` +
        `<td>${esc(b.date)}</td><td>${esc(b.reason)}</td><td>${notesCell(b.notes)}</td></tr>`
    )
    .join('')
}

function bookTable (books) {
  return (
    '<table class="reading-table"><thead><tr>' +
    '<th>书名</th><th>状态</th><th>记录时间</th><th>理由</th><th>感悟</th>' +
    `</tr></thead><tbody>${bookRows(books)}</tbody></table>`
  )
}

hexo.extend.tag.register('reading', function () {
  const data = (this.site && this.site.data) || (hexo.locals.get('data') || {})
  const books = (data.reading || []).slice()
  if (!books.length) return '<p>书单数据缺失（source/_data/reading.yml）。</p>'

  // 记录时间倒序：新读的排前面
  books.sort((a, b) => String(b.date).localeCompare(String(a.date)))

  const out = []

  // ① 概览
  const total = books.length
  const byStatus = {}
  books.forEach(b => {
    byStatus[b.status] = (byStatus[b.status] || 0) + 1
  })
  const statusChips = ['done', 'reading', 'half', 'want']
    .filter(k => byStatus[k])
    .map(k => `${STATUS[k].icon} ${STATUS[k].label} ${byStatus[k]}`)
    .join(' · ')

  // 分类计数（按展示顺序）
  const byCat = {}
  books.forEach(b => {
    ;(byCat[b.category] = byCat[b.category] || []).push(b)
  })
  const cats = CATEGORY_ORDER.filter(c => byCat[c]).concat(
    Object.keys(byCat).filter(c => !CATEGORY_ORDER.includes(c))
  )
  const catChips = cats
    .map(c => `${CATEGORY_ICON[c] || '📚'} ${esc(c)} ${byCat[c].length}`)
    .join(' · ')

  // 月份计数（YYYY-MM，倒序）
  const byMonth = {}
  books.forEach(b => {
    const m = String(b.date).slice(0, 7)
    ;(byMonth[m] = byMonth[m] || []).push(b)
  })
  const months = Object.keys(byMonth).sort((a, b) => b.localeCompare(a))
  const monthChips = months.map(m => `${esc(m)} ${byMonth[m].length} 本`).join(' · ')

  out.push('<h3>📊 概览</h3>')
  out.push(
    `<p>共 <strong>${total}</strong> 本 · ${statusChips}</p>` +
      `<p><strong>按分类</strong>：${catChips}</p>` +
      `<p><strong>按月份</strong>：${monthChips}</p>`
  )

  // ② 分类书架
  out.push('<h3>📚 分类书架</h3>')
  cats.forEach(c => {
    const list = byCat[c].slice().sort((a, b) => String(b.date).localeCompare(String(a.date)))
    out.push(`<h4>${CATEGORY_ICON[c] || '📚'} ${esc(c)}（${list.length}）</h4>`)
    out.push(bookTable(list))
  })

  // ③ 月度时间线
  out.push('<h3>🗓️ 月度时间线</h3>')
  months.forEach(m => {
    const list = byMonth[m]
    out.push(`<h4>${esc(m)}（${list.length} 本）</h4>`)
    out.push(bookTable(list))
  })

  return out.join('\n')
})

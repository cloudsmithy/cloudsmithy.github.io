'use strict'

// {% reading %} 标签：从 source/_data/reading.yml 单一数据源，自动渲染
//   ① 概览（总数 / 各状态 / 各分类计数 / 各月计数，分类与月份可点击跳转）
//   ② 分类书架（按 CATEGORY_ORDER 分组，带锚点）
//   ③ 月度时间线（按记录时间倒序分组，带锚点）
// 加书或改状态只需改 reading.yml 一处，三块视图与计数全部同步。

const STATUS = {
  done: { icon: '✅', label: '读完', cls: 'done' },
  reading: { icon: '📚', label: '在读', cls: 'reading' },
  half: { icon: '📖', label: '读了一半', cls: 'half' },
  want: { icon: '📖', label: '想读', cls: 'want' }
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

const STYLE = `<style>
.reading-overview{margin:1rem 0 1.6rem}
.reading-overview .reading-line{display:flex;flex-wrap:wrap;align-items:center;gap:.55rem .7rem;margin:.7rem 0}
.reading-overview .reading-label{font-weight:600;opacity:.7;margin-right:.15rem}
.reading-overview .reading-total{font-size:1.05rem;font-weight:600;margin-right:.35rem}
.reading-overview .reading-total b{font-size:1.35rem;color:var(--btn-bg,#49b1f5)}
.reading-chip{display:inline-flex;align-items:baseline;padding:.2rem .8rem;border-radius:999px;
  background:rgba(128,128,128,.12);font-size:.85rem;line-height:1.7;white-space:nowrap;
  text-decoration:none;color:inherit;transition:all .2s ease}
a.reading-chip:hover{background:var(--btn-bg,#49b1f5);color:var(--btn-color,#fff);transform:translateY(-2px);
  box-shadow:0 4px 10px rgba(0,0,0,.12)}
.reading-chip .reading-num{margin-left:.55em;font-weight:700;opacity:.7}
a.reading-chip:hover .reading-num{opacity:.95}
.reading-chip.st-done{background:rgba(76,175,80,.16)}
.reading-chip.st-reading{background:rgba(73,177,245,.16)}
.reading-chip.st-half{background:rgba(255,152,0,.16)}
.reading-chip.st-want{background:rgba(158,158,158,.18)}
.reading-h{scroll-margin-top:80px;margin-top:1.4rem}
.reading-table{width:100%;display:table}
</style>`

function esc (s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// 分类锚点用序号（中文/间隔号做 id 不稳）；年份、月份本身安全
function catId (i) {
  return `reading-cat-${i}`
}
function yearId (y) {
  return `reading-year-${y}`
}
function monthId (m) {
  return `reading-month-${m}`
}

// 药丸里的计数：读完 / 在读 分开显示（读了一半并入在读侧，想读不计）。
// 只显示非零项，避免出现 ✅0 或 📚0。
function countBadge (list) {
  const done = list.filter(b => b.status === 'done').length
  const reading = list.filter(b => b.status === 'reading' || b.status === 'half').length
  const parts = []
  if (done) parts.push(`✅ ${done}`)
  if (reading) parts.push(`📚 ${reading}`)
  if (!parts.length) parts.push(`📖 ${list.length}`) // 全是想读时，退化为想读数
  return `<span class="reading-num">${parts.join(' ')}</span>`
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

  // 分类分组（按展示顺序）
  const byCat = {}
  books.forEach(b => {
    ;(byCat[b.category] = byCat[b.category] || []).push(b)
  })
  const cats = CATEGORY_ORDER.filter(c => byCat[c]).concat(
    Object.keys(byCat).filter(c => !CATEGORY_ORDER.includes(c))
  )
  const catIndex = {}
  cats.forEach((c, i) => (catIndex[c] = i))

  // 月份分组（YYYY-MM，倒序）
  const byMonth = {}
  books.forEach(b => {
    const m = String(b.date).slice(0, 7)
    ;(byMonth[m] = byMonth[m] || []).push(b)
  })
  const months = Object.keys(byMonth).sort((a, b) => b.localeCompare(a))

  // 年份分组（YYYY，倒序）
  const byYear = {}
  books.forEach(b => {
    const y = String(b.date).slice(0, 4)
    ;(byYear[y] = byYear[y] || []).push(b)
  })
  const years = Object.keys(byYear).sort((a, b) => b.localeCompare(a))
  // 每年下的月份（倒序），供嵌套时间线使用
  const monthsOfYear = {}
  months.forEach(m => {
    const y = m.slice(0, 4)
    ;(monthsOfYear[y] = monthsOfYear[y] || []).push(m)
  })

  // 各状态计数
  const byStatus = {}
  books.forEach(b => {
    byStatus[b.status] = (byStatus[b.status] || 0) + 1
  })

  const out = [STYLE]

  // ① 概览
  out.push('<h3 class="reading-h">📊 概览</h3>')
  out.push('<div class="reading-overview">')

  const statusChips = ['done', 'reading', 'half', 'want']
    .filter(k => byStatus[k])
    .map(
      k =>
        `<span class="reading-chip st-${STATUS[k].cls}">${STATUS[k].icon} ${STATUS[k].label}` +
        `<span class="reading-num">（${byStatus[k]}）</span></span>`
    )
    .join('')
  out.push(
    `<div class="reading-line"><span class="reading-total">共 <b>${books.length}</b> 本</span>${statusChips}</div>`
  )

  const catChips = cats
    .map(
      c =>
        `<a class="reading-chip" href="#${catId(catIndex[c])}">${CATEGORY_ICON[c] || '📚'} ${esc(c)}` +
        countBadge(byCat[c]) +
        '</a>'
    )
    .join('')
  out.push(`<div class="reading-line"><span class="reading-label">按分类</span>${catChips}</div>`)

  const yearChips = years
    .map(
      y =>
        `<a class="reading-chip" href="#${yearId(y)}">${esc(y)} 年` +
        countBadge(byYear[y]) +
        '</a>'
    )
    .join('')
  out.push(`<div class="reading-line"><span class="reading-label">按年份</span>${yearChips}</div>`)

  const monthChips = months
    .map(
      m =>
        `<a class="reading-chip" href="#${monthId(m)}">${esc(m)}` +
        countBadge(byMonth[m]) +
        '</a>'
    )
    .join('')
  out.push(`<div class="reading-line"><span class="reading-label">按月份</span>${monthChips}</div>`)
  out.push('</div>')

  // ② 分类书架
  out.push('<h3 class="reading-h">📚 分类书架</h3>')
  cats.forEach(c => {
    const list = byCat[c].slice().sort((a, b) => String(b.date).localeCompare(String(a.date)))
    out.push(`<h4 id="${catId(catIndex[c])}" class="reading-h">${CATEGORY_ICON[c] || '📚'} ${esc(c)}（${list.length}）</h4>`)
    out.push(bookTable(list))
  })

  // ③ 时间线（年 → 月 嵌套，一套表格同时承载「按年份」「按月份」两种跳转）
  out.push('<h3 class="reading-h">🗓️ 时间线</h3>')
  years.forEach(y => {
    out.push(`<h4 id="${yearId(y)}" class="reading-h">${esc(y)} 年（${byYear[y].length} 本）</h4>`)
    ;(monthsOfYear[y] || []).forEach(m => {
      const list = byMonth[m]
      out.push(`<h5 id="${monthId(m)}" class="reading-h">${esc(m)}（${list.length} 本）</h5>`)
      out.push(bookTable(list))
    })
  })

  return out.join('\n')
})

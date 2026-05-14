#!/usr/bin/env node
'use strict'

// Lint post descriptions: find posts missing or with low-quality descriptions.
// Usage: node scripts/lint-description.js [--verbose]
//
// This script is NOT loaded by Hexo (filename starts with "lint-", and we
// don't register any hexo hooks). Run it manually.

const fs = require('fs')
const path = require('path')

const POSTS_DIR = path.join(__dirname, '..', 'source', '_posts')
const VERBOSE = process.argv.includes('--verbose')

// Phrases that look like fallback/filler openings rather than a real summary
const FILLER_PATTERNS = [
  /^最近/,
  /^今天/,
  /^前几天/,
  /^前段时间/,
  /^上次/,
  /^有一天/,
  /^本文(将|主要|介绍|记录|会|从|会|讲)/,
  /^本篇/,
  /^这篇文章/,
  /^今儿/,
  /^前几年/,
  /^去年/,
  /^这次/,
  /^笔者/,
  /^博主/,
  /^各位/,
  /^大家/
]

const MIN_LEN = 15
const MAX_LEN = 200

function walk(dir) {
  const out = []
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const st = fs.statSync(p)
    if (st.isDirectory()) out.push(...walk(p))
    else if (st.isFile() && p.endsWith('.md')) out.push(p)
  }
  return out
}

function parseFrontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return null
  const out = {}
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/)
    if (!kv) continue
    let v = kv[2].trim()
    if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) {
      v = v.slice(1, -1)
    }
    out[kv[1]] = v
  }
  return out
}

function classify(desc, title) {
  if (desc == null || desc === '') return { level: 'MISSING', reason: 'no description field' }
  const d = String(desc).trim()
  if (!d) return { level: 'MISSING', reason: 'description is empty' }
  if (d === title) return { level: 'BAD', reason: 'description equals title' }
  if (d.length < MIN_LEN) return { level: 'BAD', reason: `too short (${d.length} chars)` }
  if (d.length > MAX_LEN) return { level: 'WARN', reason: `too long (${d.length} chars)` }
  for (const re of FILLER_PATTERNS) {
    if (re.test(d)) return { level: 'WARN', reason: `filler opening: ${re}` }
  }
  return { level: 'OK', reason: '' }
}

function main() {
  const files = walk(POSTS_DIR).sort()
  const buckets = { MISSING: [], BAD: [], WARN: [], OK: [] }

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8')
    const fm = parseFrontMatter(raw)
    if (!fm) continue
    if (fm.published === 'false' || fm.hidden === 'true') continue
    const title = fm.title || path.basename(file, '.md')
    const { level, reason } = classify(fm.description, title)
    buckets[level].push({ file: path.relative(path.join(__dirname, '..'), file), title, desc: fm.description || '', reason })
  }

  const total = Object.values(buckets).reduce((s, b) => s + b.length, 0)
  console.log(`\nScanned ${total} posts`)
  console.log(`  MISSING: ${buckets.MISSING.length}`)
  console.log(`  BAD:     ${buckets.BAD.length}`)
  console.log(`  WARN:    ${buckets.WARN.length}`)
  console.log(`  OK:      ${buckets.OK.length}\n`)

  for (const level of ['MISSING', 'BAD', 'WARN']) {
    if (!buckets[level].length) continue
    console.log(`\n=== ${level} (${buckets[level].length}) ===`)
    for (const item of buckets[level]) {
      console.log(`\n  ${item.title}`)
      console.log(`    file:   ${item.file}`)
      console.log(`    reason: ${item.reason}`)
      if (VERBOSE && item.desc) console.log(`    desc:   ${item.desc.slice(0, 120)}`)
    }
  }
}

main()

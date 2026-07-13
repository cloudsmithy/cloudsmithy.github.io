'use strict';
/*
 * 一次性整合 taxonomy（标签 + 分类）。中度力度：合同义 + 清/上提单例碎片。
 * 用法：
 *   node tools/consolidate-taxonomy.js          # dry-run，只报告
 *   node tools/consolidate-taxonomy.js --apply   # 实际写入
 * 仅改写 tags / categories 两个字段，其余 front-matter 原样保留；只重写有变化的文件。
 */
const fs = require('fs');
const cp = require('child_process');

const APPLY = process.argv.includes('--apply');

// ---- 路径映射：完整分类路径精确匹配 → 替换为新路径，可附带补标签 ----
// （2026-07 第二轮清洗：统一多层级重复节点、拆掉单篇碎片叶子）
const CAT_PATH_MAP = [
  { from: ['苹果'],                            to: ['电子产品', '电脑', '苹果'] },
  { from: ['AWS'],                             to: ['软件', 'AWS'] },
  { from: ['AWS', 'OpenSearch'],               to: ['软件', 'AWS'], addTags: ['OpenSearch'] },
  { from: ['OpenSearch'],                      to: ['软件'], addTags: ['OpenSearch'] },
  { from: ['电子产品', 'NAS'],                 to: ['电子产品', '电脑', 'NAS'] },
  { from: ['电子产品', '电脑', 'NAS', '群晖'], to: ['电子产品', '电脑', 'NAS'], addTags: ['群晖'] },
  { from: ['电子产品', '电脑', 'NAS', 'QNAP'], to: ['电子产品', '电脑', 'NAS'], addTags: ['NAS'] },
  { from: ['电子产品', '电脑', '装机'],        to: ['电子产品', '电脑'] },
  { from: ['电子产品', '软件技巧'],            to: ['软件'] },
];

// ---- 分类映射：单个分类名替换（不影响层级）----
const CAT_MAP = {
  'Coco': 'Coco AI',
};

// ---- 标签映射 ----
const TAG_MAP = {
  'MacOS': 'Apple',
  'SAML': 'SSO',
  'OIDC': 'SSO',
};
// 删除这些标签：与分类重复（摘抄/读书有感/路由器/打印机），或只出现一次且标题已含关键词
const TAG_DROP = new Set([
  '摘抄', '读书有感', '路由器', '打印机',
  'Socket', 'PDF', 'DNS', 'Nginx', 'Fluent Bit', 'Langfuse',
  'Go', '1Password', 'Vaultwarden', 'Grafana', 'Hexo',
]);

function parseField(lines, startIdx, key) {
  const m = lines[startIdx].match(new RegExp('^' + key + ':\\s*(.*)$'));
  if (!m) return null;
  const inline = m[1].trim();
  let end = startIdx;
  let vals = [];
  if (inline) {
    if (inline.startsWith('[')) vals = inline.replace(/[\[\]]/g, '').split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
    else vals = [inline];
  } else {
    for (let i = startIdx + 1; i < lines.length; i++) {
      if (/^\s*-\s+/.test(lines[i])) { vals.push(lines[i].replace(/^\s*-\s+/, '').trim()); end = i; }
      else if (lines[i].trim() === '') { end = i; }
      else break;
    }
  }
  return { vals, start: startIdx, end };
}

function uniq(arr) { return [...new Set(arr)]; }

const files = cp.execSync('find source/_posts -name "*.md" ! -name Readme.md ! -name index.md ! -name 序.md ! -name 后记.md', { encoding: 'utf8' }).trim().split('\n');

let changed = 0;
const log = [];

for (const f of files) {
  const raw = fs.readFileSync(f, 'utf8');
  const mm = raw.match(/^(---\r?\n)([\s\S]*?)(\r?\n---)/);
  if (!mm) continue;
  const head = mm[2];
  const lines = head.split(/\r?\n/);

  let catBlock = null, tagBlock = null;
  for (let i = 0; i < lines.length; i++) {
    if (/^categories:/.test(lines[i]) && !catBlock) catBlock = parseField(lines, i, 'categories');
    if (/^tags:/.test(lines[i]) && !tagBlock) tagBlock = parseField(lines, i, 'tags');
  }

  let cats = catBlock ? catBlock.vals.slice() : [];
  let tags = tagBlock ? tagBlock.vals.slice() : [];
  const origCats = cats.slice(), origTags = tags.slice();

  // 路径精确替换
  for (const { from, to, addTags } of CAT_PATH_MAP) {
    if (cats.length === from.length && cats.every((c, i) => c === from[i])) {
      cats = to.slice();
      if (addTags) tags.push(...addTags);
      break;
    }
  }
  // 分类同义合并
  cats = uniq(cats.map(c => CAT_MAP[c] || c));
  // 标签同义合并 + 删除碎片
  tags = uniq(tags.map(t => TAG_MAP[t] || t).filter(t => !TAG_DROP.has(t)));

  const catChanged = JSON.stringify(cats) !== JSON.stringify(uniq(origCats));
  const tagChanged = JSON.stringify(tags) !== JSON.stringify(uniq(origTags));
  if (!catChanged && !tagChanged) continue;

  changed++;
  log.push(`${f.replace('source/_posts/', '')}\n   cat: [${origCats.join(', ')}] -> [${cats.join(', ')}]\n   tag: [${origTags.join(', ')}] -> [${tags.join(', ')}]`);

  if (!APPLY) continue;

  // 重建 front-matter：替换 cat / tag 两个块，其余行原样
  const newLines = [];
  const skip = new Set();
  for (const b of [catBlock, tagBlock]) if (b) for (let i = b.start; i <= b.end; i++) skip.add(i);
  for (let i = 0; i < lines.length; i++) {
    if (skip.has(i)) {
      if (catBlock && i === catBlock.start) {
        newLines.push('categories:');
        cats.forEach(c => newLines.push('  - ' + c));
      } else if (tagBlock && i === tagBlock.start) {
        newLines.push('tags:');
        tags.forEach(t => newLines.push('  - ' + t));
      }
      continue;
    }
    newLines.push(lines[i]);
  }
  const newHead = newLines.join('\n');
  const out = raw.replace(mm[2], newHead);
  fs.writeFileSync(f, out, 'utf8');
}

console.log(log.join('\n\n'));
console.log(`\n${APPLY ? '已修改' : '将修改'} ${changed} 个文件。` + (APPLY ? '' : '  （加 --apply 实际写入）'));

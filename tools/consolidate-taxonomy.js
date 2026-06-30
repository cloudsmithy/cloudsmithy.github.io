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

// ---- 分类映射：把 key 替换为 value（value 可为多值数组，用于降级为父类）----
const CAT_MAP = {
  '随笔': '散文随笔',
  '零碎': '零碎生活',
  '碎碎念': '零碎生活',
  'Apple': '苹果',
  'MacOS': '苹果',
};
// 这些分类“降级”为标签：从 categories 移除，并保证作为 tag 存在；同时给文章补上父分类（避免孤儿）
const CAT_DEMOTE = {
  '双拼':       { parent: '软件',  tag: '双拼' },
  'Kubernetes': { parent: '软件',  tag: 'Kubernetes' },
  'Grafana':    { parent: '软件',  tag: 'Grafana' },
  'Blog':       { parent: '软件',  tag: 'Blog' },
  'Bedrock':    { parent: 'AWS',   tag: 'Bedrock' },
  '网络':       { parent: 'AWS',   tag: '网络' },
  'MCP':        { parent: 'AWS',   tag: 'MCP' },
  'SSO':        { parent: 'AWS',   tag: 'SSO' },
};

// ---- 标签映射 ----
const TAG_MAP = {
  'Coco-AI': 'Coco AI',
  '电脑外设': '外设',
  '硬件': '外设',
  '网络': '家庭网络',
  '组网': '家庭网络',
  '单点登录': 'SSO',
  '读书': '读书有感',
};
// 删除这些碎片标签（只出现一次、且无体系价值）
const TAG_DROP = new Set([
  '飞牛OS','软件','车载','装修日记','ADB','POE','显示器','Tuya','装机',
  '电视盒子','Cloudflared','LWScreenShot','网关','APM','ELK','Filebeat',
  'Isaac','梦','诗','龙珠','RDP','远程开发','随笔','KVM','POE','Tuya',
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

  // 分类降级
  for (const [k, info] of Object.entries(CAT_DEMOTE)) {
    if (cats.includes(k)) {
      cats = cats.filter(c => c !== k);
      if (info.parent && !cats.includes(info.parent)) cats.push(info.parent);
      if (info.tag) tags.push(info.tag);
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

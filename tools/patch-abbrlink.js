'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

// --- Patch 1: hexo-abbrlink CRC32 -> MD5 ---

const abbrlinkCandidates = [
  'node_modules/hexo-abbrlink/lib/logic.js',
  'node_modules/.pnpm/hexo-abbrlink@2.2.1/node_modules/hexo-abbrlink/lib/logic.js'
];

let abbrlinkFile;
for (const c of abbrlinkCandidates) {
  const p = path.join(root, c);
  if (fs.existsSync(p)) {
    abbrlinkFile = p;
    break;
  }
}

if (abbrlinkFile) {
  let content = fs.readFileSync(abbrlinkFile, 'utf8');
  if (content.includes("require('crypto')")) {
    console.log('[patch] hexo-abbrlink: already patched, skipping.');
  } else {
    const oldLine = "let res = opt_alg == 'crc32' ? crc32.str(data.title) >>> 0 : crc16(data.title) >>> 0;";
    const newLine = "let res = parseInt(require('crypto').createHash('md5').update(data.title).digest('hex').slice(0, 8), 16) >>> 0;";
    if (content.includes(oldLine)) {
      content = content.replace(oldLine, newLine);
      fs.writeFileSync(abbrlinkFile, content, 'utf8');
      console.log('[patch] hexo-abbrlink: CRC32 -> MD5 (8 hex chars).');
    } else {
      console.log('[patch] hexo-abbrlink: source changed, patch may need update.');
    }
  }
} else {
  console.log('[patch] hexo-abbrlink: not found, skipping.');
}

// --- Patch 2: hexo-generator-sitemap remove priority/changefreq ---

const sitemapCandidates = [
  'node_modules/hexo-generator-sitemap/sitemap.xml',
  'node_modules/.pnpm/hexo-generator-sitemap@3.0.1_chokidar@3.6.0/node_modules/hexo-generator-sitemap/sitemap.xml'
];

let sitemapFile;
for (const c of sitemapCandidates) {
  const p = path.join(root, c);
  if (fs.existsSync(p)) {
    sitemapFile = p;
    break;
  }
}

if (sitemapFile) {
  let content = fs.readFileSync(sitemapFile, 'utf8');
  if (!content.includes('<changefreq>') && !content.includes('<priority>')) {
    console.log('[patch] hexo-generator-sitemap: already patched, skipping.');
  } else {
    content = content.replace(/\s*<changefreq>.*<\/changefreq>/g, '');
    content = content.replace(/\s*<priority>.*<\/priority>/g, '');
    fs.writeFileSync(sitemapFile, content, 'utf8');
    console.log('[patch] hexo-generator-sitemap: removed priority/changefreq.');
  }
} else {
  console.log('[patch] hexo-generator-sitemap: not found, skipping.');
}

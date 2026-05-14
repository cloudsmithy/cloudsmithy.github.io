'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

hexo.on('generateBefore', () => {
  const posts = hexo.locals.get('posts').toArray();
  const seen = new Map();
  const allLinks = new Set();
  const collisions = [];

  for (const post of posts) {
    const link = String(post.abbrlink || '');
    if (!link) continue;
    allLinks.add(link);
    if (seen.has(link)) {
      collisions.push(post);
    } else {
      seen.set(link, post);
    }
  }

  if (collisions.length === 0) return;

  for (const post of collisions) {
    let newLink;
    do {
      newLink = crypto.randomBytes(4).toString('hex');
    } while (allLinks.has(newLink));
    allLinks.add(newLink);

    const filePath = path.join(hexo.source_dir, post.source);
    const content = fs.readFileSync(filePath, 'utf8');
    const updated = content.replace(
      /^abbrlink:\s*.+$/m,
      `abbrlink: ${newLink}`
    );
    fs.writeFileSync(filePath, updated, 'utf8');

    hexo.log.warn(
      `Abbrlink collision fixed: ${post.source} "${post.abbrlink}" -> "${newLink}"`
    );
    post.abbrlink = newLink;
  }
});

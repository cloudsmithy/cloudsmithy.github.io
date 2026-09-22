'use strict'

const technicalRoots = new Set(['极限科技', '软件', '懒猫微服', '电子产品'])

// An explicit section resolves mixed-category posts without changing URLs.
function sectionOf(post) {
  if (post.section === 'tech' || post.section === 'life') return post.section
  const categories = post.categories || []
  return categories.some(category => technicalRoots.has(category.name || category)) ? 'tech' : 'life'
}

module.exports = { sectionOf }

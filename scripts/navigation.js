'use strict'

// Native details make the theme's dropdowns work with touch and the keyboard.
// Delegated listeners also cover navigation after PJAX replaces page content.
const interactions = `<script id="nav-dropdown-interactions">
(() => {
  if (window.blogDropdownsReady) return
  window.blogDropdownsReady = true
  const closeTimers = new WeakMap()
  const cancelClose = menu => clearTimeout(closeTimers.get(menu))
  const close = menu => {
    cancelClose(menu)
    menu.open = false
  }
  const hoverMenu = event => event.pointerType === 'mouse' &&
    matchMedia('(hover: hover) and (pointer: fine)').matches &&
    event.target.closest('#nav .nav-dropdown')
  document.addEventListener('pointerover', event => {
    const menu = hoverMenu(event)
    if (!menu) return
    cancelClose(menu)
    if (!menu.contains(event.relatedTarget)) menu.open = true
  })
  document.addEventListener('pointerout', event => {
    const menu = hoverMenu(event)
    if (!menu || menu.contains(event.relatedTarget)) return
    cancelClose(menu)
    closeTimers.set(menu, setTimeout(() => {
      if (!menu.matches(':hover') && !menu.contains(document.activeElement)) close(menu)
    }, 220))
  })
  document.addEventListener('click', event => {
    document.querySelectorAll('.nav-dropdown[open]').forEach(menu => {
      if (!menu.contains(event.target) || event.target.closest('a[href]')) close(menu)
    })
  })
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return
    document.querySelectorAll('.nav-dropdown[open]').forEach(menu => {
      const restoreFocus = menu.contains(document.activeElement)
      close(menu)
      if (restoreFocus) menu.querySelector('summary').focus()
    })
  })
})()
</script>`

hexo.extend.filter.register('after_render:html', html => {
  if (html.includes('class="nav-dropdown"')) return html
  let groups = 0
  const dropdowns = (fragment, linkTitles = false) => fragment.replace(
    /<span class="site-page group(?: hide)?">([\s\S]*?)<\/span>(\s*<ul class="menus_item_child">[\s\S]*?<\/ul>)/g,
    (_, label, links) => {
      groups++
      let title = label
      const destination = linkTitles && links.match(/<a\b[^>]*\bhref="([^"]+)"/)?.[1]
      if (destination) {
        const chevron = label.match(/<i\b[^>]*\bfa-chevron-down\b[^>]*><\/i>\s*$/)?.[0] || ''
        const text = chevron ? label.slice(0, -chevron.length) : label
        title = `<a class="nav-dropdown-link" href="${destination}">${text}</a>${chevron}`
      }
      return '<details class="nav-dropdown" name="site-navigation">' +
        `<summary class="site-page nav-dropdown-trigger">${title}</summary>${links}</details>`
    }
  )
  const desktop = html.replace(
    /(<nav\b[^>]*\bid="nav"[^>]*>)([\s\S]*?)(<\/nav>)/i,
    (_, start, navigation, end) => start + dropdowns(navigation, true) + end
  )
  const result = dropdowns(desktop)
  // Theme scripts contain literal "</body>" strings for generated SVG viewers.
  // Insert only at the document boundary, never inside one of those scripts.
  return groups ? result.replace(/<\/body>\s*<\/html>\s*$/i, ending => interactions + ending) : result
}, 6)

'use strict'

// Native details make the theme's dropdowns work with touch and the keyboard.
// Delegated listeners also cover navigation after PJAX replaces page content.
const interactions = `<script id="nav-dropdown-interactions">
(() => {
  if (window.blogDropdownsReady) return
  window.blogDropdownsReady = true
  document.addEventListener('click', event => {
    document.querySelectorAll('.nav-dropdown[open]').forEach(menu => {
      if (!menu.contains(event.target) || event.target.closest('a[href]')) menu.open = false
    })
  })
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return
    document.querySelectorAll('.nav-dropdown[open]').forEach(menu => {
      const restoreFocus = menu.contains(document.activeElement)
      menu.open = false
      if (restoreFocus) menu.querySelector('summary').focus()
    })
  })
})()
</script>`

hexo.extend.filter.register('after_render:html', html => {
  if (html.includes('class="nav-dropdown"')) return html
  let groups = 0
  const result = html.replace(
    /<span class="site-page group(?: hide)?">([\s\S]*?)<\/span>(\s*<ul class="menus_item_child">[\s\S]*?<\/ul>)/g,
    (_, label, links) => {
      groups++
      return '<details class="nav-dropdown" name="site-navigation">' +
        `<summary class="site-page nav-dropdown-trigger">${label}</summary>${links}</details>`
    }
  )
  // Theme scripts contain literal "</body>" strings for generated SVG viewers.
  // Insert only at the document boundary, never inside one of those scripts.
  return groups ? result.replace(/<\/body>\s*<\/html>\s*$/i, ending => interactions + ending) : result
}, 6)

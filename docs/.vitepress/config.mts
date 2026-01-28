// 根据环境变量选择配置
// SITE=infini pnpm docs:dev → 极限科技
// pnpm docs:dev → 懒猫微服（默认）

const site = process.env.SITE || 'lazycat'

const config = site === 'infini' 
  ? await import('./config.infini.mts')
  : await import('./config.lazycat.mts')

export default config.default

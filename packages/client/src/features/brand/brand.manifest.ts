import type { FeatureManifest } from '../../core/feature'

export default {
  id: 'brand',
  order: 15,
  contracts: ['shell.sidebar-logo-row', 'shell.sidebar-tabseat'],
  ungated: '只画读者自己提供的品牌名、标志图与强调色，并在侧栏顶行留出一个给其他插件放标签条的座位；什么都没提供时页面与所选品牌一致',
  stylesheets: [{ file: 'brand.css', rank: 115 }, { file: 'sidebar-row.css', rank: 118 }],
  cases: ['custom-brand']
} satisfies FeatureManifest

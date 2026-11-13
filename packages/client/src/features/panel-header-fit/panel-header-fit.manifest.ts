import type { FeatureManifest } from '../../core/feature'

export default {
  id: 'panelHeaderFit',
  order: 263,
  contracts: [],
  ungated: '把宿主插件页的折叠页头在页面缩放时改为静态排布：宿主按视口像素测量标题、简介、工具栏和页签，再由页面自己的缩放二次缩放，缩放下页签条会压到简介上；1 倍时什么都不写',
  stylesheets: [{ file: 'panel-header-fit.css', rank: 72 }],
  cases: [],
} satisfies FeatureManifest

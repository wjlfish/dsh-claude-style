import type { FeatureManifest } from '../../core/feature'

export default {
  id: 'panelHeaderFit',
  order: 268,
  contracts: [],
  ungated: '在页面缩放下把宿主插件页折叠页头按实际缩放还原：宿主按视口像素测量标题、简介、工具栏和页签并写成页面长度，页面自己的缩放再把它们缩放一次，0.8 时页签条会压到简介上；样式表把每一段的位移和页头高度除以页面缩放系数，1 倍时什么都不写',
  stylesheets: [{ file: 'panel-header-fit.css', rank: 72 }],
  cases: [],
} satisfies FeatureManifest

/*
 * @Description:
 * @Author: yoki
 * @Date: 2022-07-26 14:49:28
 * @LastEditors: yoki
 * @LastEditTime: 2022-07-26 15:57:04
 * @FilePath: /nuxt-typescript-template/plugins/vue/component.ts
 */
import Vue from 'vue'

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import CbLoading from '@/components/public/CbLoading'
import VueQr from 'vue-qr'

// 查询组件目录, 并引入注册

// 引入base库
// requireBaseComponentFunc('@/base')
// 引入组件库
const requireBaseComponent = require.context(
  // 组件目录
  '@/components',
  // 是否查询其子目录
  true,
  // 匹配基础组件文件名的正则表达式
  /index.(vue|tsx|js)$/
)

// 自动导入
requireBaseComponent.keys().forEach((fileName: any) => {
  // 获取组件配置
  const componentConfig = requireBaseComponent(fileName)
  // 通过路径获取组件名
  const componentName = fileName
    .split('/')
    .splice(-2)
    .shift()

  // 全局注册该组件
  Vue.component(
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，
    // 那么就会优先使用 `.default`，否则回退到使用模块的根。
    componentConfig.default || componentConfig
  )
})

// 图片预览组件
Vue.use(Viewer)
// 加载 loading 指示器服务
Vue.use(CbLoading)
// 二维码生成组件
Vue.component('VueQr', VueQr)

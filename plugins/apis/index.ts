/*
 * @Description: 此文件夹是为了配合spa页面发送请求
 * @Author: yoki
 * @Date: 2022-08-09 11:01:57
 * @LastEditors: yoki
 * @LastEditTime: 2022-08-25 15:34:05
 * @FilePath: /nuxt-typescript-template-ssr/plugins/apis/index.ts
 */
// import Vue from 'vue'

// // 先按照规范写好的模块 API 后再统一引入
// import aline from './aline'

// // 加入 API 集合
// const modules = [aline]

// export default ({ $axios }: { $axios: any }, inject: any) => {
//   let api = {}
//   modules.forEach(item => {
//     if (typeof item === 'function') {
//       api = { ...api, ...item($axios) }
//     }
//   })
//   Vue.prototype.$_api = api
//   inject('api', api)
// }
type TKeyAny = {
  [key: string]: any
}

// 先按照规范写好的模块 API 后再统一引入
export default ({ $axios }: any, inject: any) => {
  const api: TKeyAny = {}

  const requireApiModules = require.context(
    // 当前目录
    '.',
    // 是否查询其子目录
    false,
    // 匹配 API 模块文件名的正则表达式
    /\.\/(?!index).*\.ts$/
  )

  // 自动导入
  requireApiModules.keys().forEach((fileName: string) => {
    // 获取模块对象
    const module = requireApiModules(fileName)
    // 通过路径获取模块名
    const moduleName = fileName
      .split('/')
      .pop()
      ?.split('.')
      .shift()

    api[moduleName as string] = (module.default || module)($axios)
  })

  inject('api', api)

  return api
}

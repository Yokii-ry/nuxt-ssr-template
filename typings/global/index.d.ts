declare let $nuxt: any

declare module 'store' {
  // 定义当前项目可用的 localStorage 键名约束
  // 参考：https://ts.xcatliu.com/advanced/string-literal-types.html
  type KeyName = 'user_auth_info' | 'menu_map_config_hash' | 'menu_map_config'

  function addPlugin(plugin: any): any
  function get(keyName: KeyName): any
  function set(keyName: KeyName, value: any, expires_in?: number): any
  function remove(keyName: KeyName): any
}

declare module 'store/plugins/expire' {
  const expirePlugin: any
  export default expirePlugin
}

declare module 'ant-design-vue/lib/locale-provider/zh_CN' {
  const zhCN: any
  export default zhCN
}

// 保存文件的
// ? https://www.npmjs.com/package/file-saver
declare module 'file-saver' {
  const saveAs: any
  export default saveAs
}

// 粘贴板
//? https://www.npmjs.com/package/vue-clipboard2

// 二维码
// ? https://www.npmjs.com/package/vue-qr
declare module 'vue-qr' {
  const VueQr: any
  export default VueQr
}

/**
 * 菜单配置注意事项：
 *
 * 1. 每个一级菜单必须包含 name 和 icon 属性
 * 2. 菜单图标记得引入分别实底风格和线框风格
 * 3. module 属性用于标注其下子菜单项目所属的功能模块，目前作用主要是自动高亮主菜单，
 *    譬如当前路由 path 以 `/authorization/wechat/mina` 开头的话则高亮 “授权” 菜单，
 *    代码实现详见 `components\smart\CbSidebar\index.vue:L123`
 * 4. link 属性用于没有子菜单的项目，与 sub 属性互斥，即有 link 就不需要 sub 属性
 */

export default [
  {
    name: '概览',
    icon: 'home',
    module: '',
    link: '/'
  },
  {
    name: '授权',
    icon: 'api',
    module: 'authorization',
    link: '/authorization'
  },
  {
    name: '应用',
    icon: 'appstore',
    module: 'extension',
    link: '/extension'
  }
]

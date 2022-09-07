import { VuexModule, Module } from 'vuex-module-decorators'

@Module({ name: 'env', namespaced: true, stateFactory: true })
export default class Env extends VuexModule {
  // 定义变量

  hasLoaded: Boolean = false // 是否已经加载完毕
  qiniuDomain: string = 'https://cdn.haosailei.cn' // 七牛域名
  h5Domain: string = 'https://actv.haosailei.cn' // h5域名
  oem: Object = {
    name: '石方数链',
    main_logo: require('@/static/images/common/logo.png'),
    vice_logo:
      '//cdn.haosailei.cn/frontend/dashboard/resource/image/common/logo-with-word.png',
    copyright: '2020 深圳石方数链'
  }
}

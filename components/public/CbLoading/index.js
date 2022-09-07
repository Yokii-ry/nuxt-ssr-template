import directive from './directive'
import service from './service'

export default {
  install(Vue) {
    Vue.use(directive)
    Vue.prototype.$_loading = service
  }
}

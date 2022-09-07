import Vue from 'vue'
import './filters'
import VueClipboard from 'vue-clipboard2'
import directives from './directives'
import ExampleMixins from './mixins/example'

Vue.use(VueClipboard)
Vue.mixin(ExampleMixins)

export default (context: any) => {
  directives(context)
}

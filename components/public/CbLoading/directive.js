/**
 * 组件指令：v-loading 加载指示器
 *
 * 传入 boolean 值即可控制绑定元素的加载指示器现实与否
 */

import Vue from 'vue'
import _CbLoading from './_index.vue'

const insertDom = function(el, { value }) {
  // 组件实例
  let instance
  instance = el.querySelector(':scope > .cb-loading')
  instance = instance ? instance.__vue__ : undefined
  // 通过 DOM 取 __vue__ 取到的是 vue-component-transition 组件，需要继续往上追溯
  instance = instance && instance.$parent ? instance.$parent : instance

  // 如果不存在实例，则创建并挂载
  if (!instance) {
    // 生成组件构造函数
    const CbLoadingConstructor = Vue.extend(_CbLoading)
    instance = new CbLoadingConstructor()
    instance.$mount()

    // 父元素要求有定位定义，以便让 loading 定位正常
    const position = el.style.position
    if (!['absolute', 'fixed'].includes(position)) {
      el.style.position = 'relative'
    }

    el.appendChild(instance.$el)
  }

  instance.visible = value
}

export default {
  install() {
    Vue.directive('loading', {
      inserted: insertDom,
      update: insertDom
    })
  }
}

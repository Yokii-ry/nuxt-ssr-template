/**
 * 组件服务：加载指示器
 *
 * @param {string} target - 挂载加载指示器的 dom 的选择器字符串
 * @return {object} 指示器实例，能调用实例上的方法，如 hide()
 */

import Vue from 'vue'
import _CbLoading from './_index.vue'

// 生成组件构造函数
const CbLoadingConstructor = Vue.extend(_CbLoading)

const CbLoading = (target = 'body') => {
  // 组件实例
  let instance
  // 挂载的目标 DOM
  const targetDom = document.querySelector(target)

  if (targetDom instanceof HTMLElement) {
    instance = targetDom.querySelector(':scope > .cb-loading')
    // 通过 DOM 取 __vue__ 取到的是 vue-component-transition 组件，需要继续往上追溯
    instance = instance ? instance.__vue__.$parent : undefined

    // 如果不存在实例，则创建并挂载
    if (!instance) {
      instance = new CbLoadingConstructor()
      instance.$mount()

      // 父元素要求有定位定义，以便让 loading 定位正常
      const position = targetDom.style.position
      if (!['absolute', 'fixed'].includes(position)) {
        targetDom.style.position = 'relative'
      }

      targetDom.appendChild(instance.$el)
    }

    instance.visible = true
  }

  return instance
}

export default CbLoading

/**
 * 自动聚焦指令
 *
 * 默认情况下直接使用 v-focus 即可，但如果需要聚自动聚焦的目标是输入框的组件，因为渲染
 * 到 DOM 上时 input 元素在其内部，此时指令获取到的 el 并非目标 input 所以可以进一步
 * 通过 element.querySelector() 来获得目标元素
 */

import Vue from 'vue'

export default (_context: any) => {
  Vue.directive('focus', {
    // 当被绑定的元素插入到 DOM 中时
    inserted(el, { value }) {
      let target = el
      if (value) {
        target = el.querySelector(value) || el
      }

      // 聚焦元素
      target.focus()
    }
  })
}

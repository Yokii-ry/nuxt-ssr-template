/**
 * 数字格式化过滤器
 *
 * @param {string} rawStr - 原始字符串
 * @param {string} type - 格式化类型，有 separate - 逢三位以逗号分隔，currency - 货币格式
 * @return {string} 格式化后的字符串
 */

import Vue from 'vue'

Vue.filter('NumberFormat', (rawStr = '', type = 'separate') => {
  const numberStr: string = String(rawStr)

  // 逢三位以逗号断开
  // 也可以用 Number(number).toLocaleString('en') 替代
  const separator = (number: string) =>
    number.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')

  // 空字符串或者不是数字的字符串直接返回空字符串
  if (!numberStr || isNaN(parseFloat(numberStr))) {
    return ''
  }

  switch (type) {
    case 'separate':
      return separator(numberStr)

    case 'currency':
      return (
        '¥ ' +
        separator(numberStr.split('.')[0]) +
        '.' +
        parseFloat(numberStr)
          .toFixed(2)
          .split('.')[1]
      )

    default:
      return ''
  }
})

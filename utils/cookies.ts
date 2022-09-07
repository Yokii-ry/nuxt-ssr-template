import { $cookies } from './api'

// 文档 https://www.npmjs.com/package/cookie-universal-nuxt

// 加密
export function compile(code: any) {
  let c = String.fromCharCode(code.charCodeAt(0) + code.length)
  for (let i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1))
  }
  return escape(c)
}

// 解密
export function uncompile(code: any) {
  code = unescape(code)
  let c = String.fromCharCode(code.charCodeAt(0) - code.length)
  for (let i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1))
  }
  return c
}

/**
 * 封装好的cookie动作
 * @param action get, set, remove
 * @param key key值
 * @param value 值
 */

export const Cookies = (action: string, key: string, value: any = '') => {
  if (value) {
    return $cookies[action](key, value)
  }

  return $cookies[action](key)
}

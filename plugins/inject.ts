/*
 * @Description:
 * @Author: yoki
 * @Date: 2022-07-26 14:49:28
 * @LastEditors: yoki
 * @LastEditTime: 2022-07-26 15:10:23
 * @FilePath: /nuxt-typescript-template/plugins/inject.ts
 */
import { path } from '@/assets/js/utils'
import * as Utils from '@/assets/js/utils/misc'
import storage from 'store'

const utils = {
  storage,
  ...Utils
}

export default (context: any, inject: any) => {
  inject('path', path)
  inject('utils', utils)
}

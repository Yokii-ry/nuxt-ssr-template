import { API } from '@/typings/api'
import Vue from 'vue'
import VueRouter from 'vue-router'

declare module 'vue/types/vue' {
  // 扩展 vue 实例属性
  interface Vue {
    $moment: any
    $storage: any
    $router: VueRouter

    $api: API
    $path: (target: object, path: string, defaultValue?: any) => any
    $utils: any
    $checkPermission: any
    $form: any
    $message: any
    $qrcode: any
    $g2: any
  }
}

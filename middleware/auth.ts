/*
 * @Description:
 * @Author: yoki
 * @Date: 2022-07-26 14:49:28
 * @LastEditors: yoki
 * @LastEditTime: 2022-07-26 15:12:34
 * @FilePath: /nuxt-typescript-template/middleware/auth.ts
 */
/**
 * 鉴权路由中间件
 */
import { Middleware } from '@nuxt/types'
import { UserModule } from '@/store'

// 免鉴权的页面白名单
const nonAuthList = ['/login', '/login/']
// 有令牌的情况下需要自动跳过的页面白名单
const autoRedirectList = ['/login', '/login/']

const auth: Middleware = ({ route, redirect }) => {
  // if (!UserModule.getAccessToken) {
  //   // 如果 state 中没有用户的令牌，则尝试从 localStorage 中加载
  //   UserModule.initUserState()

  //   // 重新判断这回是否还能获取到令牌
  //   if (!UserModule.getAccessToken) {
  //     // 如果不能获取到令牌且不是免登陆页面，则重定向到登录页面，并保存登录前的页面地址
  //     if (!nonAuthList.includes(route.path)) {
  //       redirect('/login', {
  //         // fe_router_callback: encodeURIComponent(window.location.href)
  //       })
  //     }
  //   }
  // }

  // // 如果用户的令牌存在，但是前往页面是有令牌时需要自动跳过的页面
  // if (UserModule.getAccessToken && autoRedirectList.includes(route.path)) {
  //   redirect('/')
  // }
  redirect('/')
}

export default auth

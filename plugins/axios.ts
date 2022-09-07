import Vue from 'vue'
import { AxiosResponse, AxiosRequestConfig } from 'axios'
import { UserModule } from '@/store'
import { processBaseUrl } from '@/assets/js/config'

// ! 这个页面根据实际情况更改

// 新增引入，使在非vue文件中可以使用$axios对象
import { initializeAxios, initializeCookies } from '@/utils/api'
// 文档: https://axios.nuxtjs.org/usage

// 如果返回是下载文件或者是Blob的话，就用这个判断
// ! 如果下载文件的话要在请求后加上 { responseType: 'blob' }
const BlobResponse = (response: AxiosResponse) => {
  return (
    response.headers['content-type'].includes('text/plain') ||
    response.headers['content-type'].includes('application/vnd.ms-excel') ||
    response.headers['content-type'].includes(
      'officedocument.spreadsheetml.sheet'
    ) ||
    response.data instanceof Blob
  )
}

export default function({ env, $axios, $cookies, redirect, route }: any) {
  initializeAxios($axios)
  initializeCookies($cookies)

  $axios.onRequest((config: AxiosRequestConfig) => {
    config.baseURL = processBaseUrl(env.BASE_URL)
    config.headers.common['X-Requested-With'] = 'XMLHttpRequest'
    config.headers.common.Authorization = 'Bearer ' + UserModule.getAccessToken
    return config
  })

  $axios.onResponse((response: AxiosResponse<any>) => {
    if (response.data.data || BlobResponse(response)) {
      return Promise.resolve(response.data)
    }
    // 把 response 嵌套一层是为了能让 onError 接收到和 axios 内部抛出的相同结构的 error 对象
    return Promise.reject({ response })
  })

  $axios.onError((error: any) => {
    // 非 HTTP 200 时 error.response 不为 undefined
    if (error.response) {
      switch (error.response.status) {
        case 200: {
          error.error_message = error.response.data.error_message
          break
        }
        // 令牌无效
        case 401: {
          // 退出登录
          UserModule.flushAuthInfo()

          // 重定向到登录页面，并保存登录前的页面地址
          // return redirect('/login', {
          //   fe_router_callback: encodeURIComponent(route.fullPath)
          // })
          break
        }

        case 404: {
          error.error_message = '资源不存在'
          break
        }

        default: {
          error.error_message = '服务器开小差了，稍后再试吧'
        }
      }
    } else if (typeof error.message === 'string') {
      // 如果错误类型是 Axios 请求流程抛出的错误
      if (error.message === 'Network Error') {
        error.error_message = '网络异常，稍后再试吧'
      } else if (error.message.indexOf('timeout') === 0) {
        error.error_message = '请求超时，稍后再试吧'
      }
    }

    const timer = setTimeout(() => {
      Vue.prototype.$message.error(
        error.error_message || '未知异常，稍后再试吧'
      )
    })

    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({
      error,
      // 用于在业务页面控制是否显示轻提示
      hideToast() {
        clearTimeout(timer)
      }
    })
  })
}

/*
 * @Description:
 * @Author: yoki
 * @Date: 2022-08-09 11:02:15
 * @LastEditors: yoki
 * @LastEditTime: 2022-08-09 11:02:16
 * @FilePath: /website-pc/plugins/api/aline.ts
 */
export default function(axios: any) {
  return {
    // 登录
    login: (data: any) => axios.post('/login', data),
    // 发送验证码
    smsCode: (data: any) => axios.post('/sms-code', data),
    // 注册
    register: (data: any) => axios.post('/register', data),
    // 获取菜单
    getPageMenu: (params: any) => axios.get('/web/menu', { params }),
    // 获取菜单详情
    getPageMenuInfo: (id: any) => axios.get(`/web/menu/${id}`),
    // 获取文章列表
    getPageArticleList: (params: any) => axios.get('/web/article', { params }),
    // 获取作品列表
    getExampleList: (params: any) => axios.get('/web/example', { params }),
    // 联系我们提交留言
    setContact: (params: any) => axios.post('/web/contact', params),
    // 素材详情
    getNews: (id: any) => axios.get(`/web/news/${id}`),
    // 图片
    getSource: (params: any) => axios.get('/web/source', { params })
  }
}

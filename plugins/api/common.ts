export default function(axios: any) {
  return {
    // 登录
    login: (data: any) => axios.post('/admin/login', data),

    // 发送验证码
    sendSmsCode: (data: any) => axios.post('/send-verify-sms', data),

    // 注册
    register: (data: any) => axios.post('/admin/register', data),

    // 重置密码
    resetPassword: (data: any) => axios.post('/admin/reset-password', data),

    // 获取七牛 token
    getQiniuToken: (data: any) => axios.get('/admin/qiniu/token', { data })
  }
}

export default function(axios: any) {
  return {
    // 登录
    login: (data: any) => axios.post('/login', data),
    // 发送验证码
    smsCode: (data: any) => axios.post('/sms-code', data),
    // 注册
    register: (data: any) => axios.post('/register', data)
  }
}

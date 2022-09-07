export interface Example {
  // 登录
  login: (data: { mobile: string; password: string }) => Promise<any>

  // 发送验证码
  smsCode: (data: { mobile: string }) => Promise<any>

  // 注册
  register: (data: {
    mobile: string
    password: string
    code: string
  }) => Promise<any>
}

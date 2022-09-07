export interface Common {
  // 登录
  login: (data: { mobile: string; password: string }) => Promise<any>

  // 发送验证码
  sendSmsCode: (data: { mobile: string }) => Promise<any>

  // 注册
  register: (data: {
    mobile: string
    password: string
    code: string
  }) => Promise<any>

  // 注册
  resetPassword: (data: {
    mobile: string
    password: string
    code: string
  }) => Promise<any>

  getQiniuToken: (data: any) => Promise<any>
}

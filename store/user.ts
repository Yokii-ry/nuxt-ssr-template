import storage from 'store'
import expirePlugin from 'store/plugins/expire'
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

storage.addPlugin(expirePlugin)

// 非自动登录时令牌将在最近一次使用后的 30 分钟后过期
const NON_AUTO_LOGIN_EXPIRES_IN = 30 * 60

interface Iauth {
  access_token?: string
  refresh_token?: string
  auto_login?: any
}

@Module({ name: 'user', namespaced: true, stateFactory: true })
export default class User extends VuexModule {
  // 定义变量
  auth: Iauth = {}

  // 是否提醒过不合适的浏览器版本
  hasPromptAboutBrowser: boolean = false

  // Getters
  get getAccessToken() {
    if (this.auth.auto_login === false) {
      // 当用户当初登录时没有勾选自动登录时，每次获取令牌都自动更新有效期到 NON_AUTO_LOGIN_EXPIRES_IN 秒后
      storage.remove('user_auth_info')
      storage.set(
        'user_auth_info',
        this.auth,
        Date.now() + NON_AUTO_LOGIN_EXPIRES_IN * 1000
      )
    }
    return this.auth.access_token
  }

  @Mutation
  private FLUSH_STATE(): void {
    this.auth = Object.create({})
  }

  @Mutation
  // 更新浏览器版本提醒状态
  UPDATE_BROWSER_PROMPT_STATUS() {
    this.hasPromptAboutBrowser = true
  }

  @Mutation
  INIT_AUTH_INFO(): void {
    this.auth = {
      access_token: '',
      refresh_token: '',
      auto_login: false
    }
  }

  @Mutation
  // 更新登录态
  UPDATE_AUTH_INFO(auth: Iauth): void {
    this.auth.access_token = auth.access_token
    this.auth.refresh_token = auth.refresh_token
    this.auth.auto_login = auth.auto_login
  }

  @Action({ rawError: true })
  // 初始化用户 State
  public initUserState() {
    this.FLUSH_STATE()
    this.INIT_AUTH_INFO()

    // 自动从 localStorage 加载令牌
    const authInfo = storage.get('user_auth_info')
    if (authInfo) {
      this.UPDATE_AUTH_INFO(authInfo)
    }
  }

  // 登录
  @Action({ rawError: true })
  saveAuthInfo({ authInfo, isEnableAutoLogin }: any) {
    const { expires_in = 7 * 24 * 3600, access_token, user } = authInfo
    const _authInfo = {
      access_token,
      user,
      auto_login: isEnableAutoLogin
    }

    this.UPDATE_AUTH_INFO(_authInfo)

    /**
     * 如果自动登录，则令牌将在本地保存服务器返回的时间长度（秒为单位），否则，将在本地
     * 保存 NON_AUTO_LOGIN_EXPIRES_IN 秒（注意；每次在本地通过 getter 获取一次令牌，
     * 有效期都会自动刷新到获取时的 NON_AUTO_LOGIN_EXPIRES_IN 秒之后）
     */
    const _expires_in = isEnableAutoLogin
      ? expires_in
      : NON_AUTO_LOGIN_EXPIRES_IN
    // 将令牌保存到 localStorage
    storage.set('user_auth_info', _authInfo, Date.now() + _expires_in * 1000)
  }

  // 清除登录态，包括 localStorage 和 State
  @Action({ rawError: true })
  flushAuthInfo() {
    // 注意代码有先后顺序，因为 initUserState 会从 localStorage 加载令牌，所以要先清除 localStorage
    storage.remove('user_auth_info')
    this.initUserState()
  }

  // 退出登录
  @Action({ rawError: true })
  logout() {
    this.flushAuthInfo()
    window.location.href = '/login'
  }
}

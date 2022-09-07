/*
 * @Description:
 * @Author: yoki
 * @Date: 2022-07-26 15:00:45
 * @LastEditors: yoki
 * @LastEditTime: 2022-07-26 15:55:53
 * @FilePath: /nuxt-typescript-template/utils/store.ts
 */
import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Example from '@/store/example'
import User from '@/store/user'
import Env from '@/store/env'

interface RootState {
  ExampleModule: Example
  UserModule: User
  EnvModule: Env
}

export const actions = {
  nuxtServerInit(_context: any, _server: { req: any; app: Vue }) {
    // eslint-disable-next-line no-console
    // console.log(_context)
    // UserModule.SetToken()
  }
}

// eslint-disable-next-line import/no-mutable-exports
let ExampleModule: Example
let UserModule: User
let EnvModule: Env

function initialiseStores(store: Store<any>): void {
  ExampleModule = getModule(Example, store)
  UserModule = getModule(User, store)
  EnvModule = getModule(Env, store)
}

export { initialiseStores, ExampleModule, UserModule, EnvModule }

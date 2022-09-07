import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

@Module({ name: 'example', namespaced: true, stateFactory: true })
export default class Example extends VuexModule {
  // 定义变量
  something: Array<number> = []

  // Getters
  get getSomething() {
    return this.something.slice(0)
  }

  @Mutation
  updatePosts(something: Array<number>) {
    this.something = something
  }

  @Action
  fetchPosts() {
    return '123'
  }
}

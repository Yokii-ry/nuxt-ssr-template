import { Component, Vue } from 'nuxt-property-decorator'
import { ExampleModule } from '@/store'

@Component
export default class ExampleMixins extends Vue {
  public example: string = 'exampleString'

  // 获取store里的某个变量，并挂在到全局
  get somethingInExampleModule() {
    return ExampleModule.something
  }
}

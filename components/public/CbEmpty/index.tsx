// 组件：无数据、空白提示

import { Component, Vue, Prop } from 'vue-property-decorator'
import './index.less'

@Component
export default class CbEmpty extends Vue {
  @Prop({ default: '暂无相关信息' }) hint!: string
  @Prop({ default: '0' }) top!: string

  get styleObj() {
    return {
      marginTop: this.top + 'px'
    }
  }

  render() {
    return (
      <div class="cb-empty" style={this.styleObj}>
        <cb-icon name="empty" />
        <div class="cb-empty__text" v-text={this.hint} />
      </div>
    )
  }
}

import { Component, Vue, Prop, Emit } from 'nuxt-property-decorator'

@Component({
  name: 'CbIcon'
})
export default class CbIcon extends Vue {
  @Prop({ default: '' }) name!: string

  @Emit('click')
  click() {}

  render() {
    return (
      <svg class="icon" aria-hidden="true" on-click={this.click}>
        <use xlinkHref={'#icon-' + this.name} />
      </svg>
    )
  }
}

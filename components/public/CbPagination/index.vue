<!--

组件：无总数的列表翻页器

注意：
1. 因为无法得知总页数，所以不知道什么时候翻到底，只能是靠父级组件来判断并通过调用本组件
   中的 enableNext 和 disableNextAndMinusOne 这两个实例方法来控制翻页按钮的可点击性

-->

<template>
  <div class="cb-pagination">
    <a-dropdown v-if="showSizeChanger">
      <a-menu slot="overlay">
        <a-menu-item
          v-for="(item, index) in pageSizeEnum"
          :key="index"
          @click="onPageSizeChange(index)"
          v-text="item"
        />
      </a-menu>
      <a-button> {{ currentPageSizeHint }} <a-icon type="down" /> </a-button>
    </a-dropdown>

    <a-icon
      type="left"
      title="上一页"
      :class="{ forbid: page < 2 }"
      @click="onJumperClick"
    />
    <a-icon
      type="right"
      title="下一页"
      :class="{ forbid: isDisableNext }"
      @click="onJumperClick('next')"
    />

    &nbsp;&nbsp;前往&nbsp;&nbsp;
    <a-input
      size="small"
      :value="page"
      @change="onPageNumberInput"
      @keyup.enter="onPageChange($event.target.value)"
    />
    &nbsp;&nbsp;页
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator'

@Component({})
export default class CbPagination extends Vue {
  // 父组件传进来的页码
  @Prop({ default: 1 })
  value?: number

  // 是否显示分页大小调整器
  @Prop({ default: false })
  showSizeChanger?: boolean

  // 分页大小
  @Prop({ default: 10 })
  pageSize?: number

  @Emit()
  sizeChange(pageSize: number) {
    return pageSize
  }

  @Emit()
  input(page: number) {
    return page
  }

  @Emit()
  change() {}

  // 分页大小枚举
  pageSizeEnum: any = {
    10: '10条/页',
    20: '20条/页',
    30: '30条/页',
    50: '50条/页',
    100: '100条/页'
  }

  isDisableNext: boolean = false // 是否禁用往后翻页
  currentPageSize: number = 10 // 当前分页大小
  page: number = 1 // 分页器内部页数状态

  // 返回当前分页大小文案
  get currentPageSizeHint() {
    return (
      this.pageSizeEnum[this.currentPageSize] || this.currentPageSize + '条/页'
    )
  }

  // 监听父组件页面变化
  @Watch('value')
  onValueChanged(newVal: number) {
    // 无论如何，只要页码变化就解禁向下翻页按钮
    this.enableNext()
    this.page = newVal
  }

  // 页码输入事件
  onPageNumberInput(e: any) {
    const { value } = e.target
    // 只允许输入非 0 开头的数字或者空
    if (/^(?!0)\d*$/.test(value) || value === '') {
      this.page = value ? +value : 1
    }
  }

  // 翻页按钮点击事件
  onJumperClick(type: string) {
    type === 'next' ? this.page++ : this.page--
    this.onPageChange(this.page)
  }

  // 分页大小改变事件
  onPageSizeChange(pageSize: number) {
    this.enableNext()
    this.currentPageSize = pageSize
    this.sizeChange(pageSize)
  }

  // 翻页事件
  onPageChange(page: number) {
    if (+page > 0) {
      this.enableNext()
      // 把当前页面通知到父组件
      this.input(+page)
      this.change()
    }
  }

  // prop：允许向下翻页
  enableNext() {
    this.isDisableNext = false
  }

  // prop：禁用向下翻页并将页码减回上一页
  disableNextAndMinusOne(needMinus: boolean = true) {
    this.isDisableNext = true

    // 如果需要把页面减回上一页
    if (needMinus) {
      this.page--
      // 把当前页码通知到父组件
      this.input(+this.page)
    }
  }
}
</script>

<style lang="less">
.cb-pagination {
  user-select: none;
  .flex(flex-end);

  .ant-dropdown-trigger {
    margin: 0 24px 0 8px;
    padding: 0 8px;
    height: 24px;

    i {
      transform-origin: 50% 40%;
      .transition(transform);
    }

    &:focus {
      i {
        transform: rotate(180deg);
      }
    }
  }

  input {
    width: 56px;
    text-align: center;

    &:focus {
      box-shadow: none;
    }
  }

  .anticon-left,
  .anticon-right {
    margin-right: 24px;
    font-size: 12px;
    cursor: pointer;
    .transition(color);
    .flex;

    &:hover {
      // color: @color-primary;
    }

    &.forbid {
      // color: @text-color-1;
      cursor: not-allowed;
      pointer-events: none;
    }
  }
}
</style>

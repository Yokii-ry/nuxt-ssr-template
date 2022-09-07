<!--
 * @Description:
 * @Author: yoki
 * @Date: 2022-07-26 14:49:28
 * @LastEditors: yoki
 * @LastEditTime: 2022-07-26 16:02:09
 * @FilePath: /nuxt-typescript-template/pages/index.vue
-->
<template>
  <div>首页</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  name: 'Index',
  meta: {
    title: '首页'
  },
  async asyncData({ $axios }) {}
})
export default class Index extends Vue {
  mounted() {}
}
</script>

<style lang="less" scoped></style>

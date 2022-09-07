<!--
 * @Description:
 * @Author: yoki
 * @Date: 2022-07-26 14:49:28
 * @LastEditors: yoki
 * @LastEditTime: 2022-08-04 15:48:30
 * @FilePath: /nuxt-typescript-template/layouts/default.vue
-->
<template>
  <div class="layout">
    <CbHeader />
    <nuxt />
    <CbFooter />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import CbHeader from '~/components/public/CbHeader/index.vue'
import CbFooter from '~/components/public/CbFooter/index.vue'

@Component({
  components: {
    CbHeader,
    CbFooter
  }
})
export default class LayoutDefault extends Vue {}
</script>

<style lang="less">
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
body {
  font-family: Arial, Helvetica, 'Microsoft JhengHei', sans-serif;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.layout {
  background: #f9f9f9;
  &__content {
    padding-top: 82px;
  }
}
</style>

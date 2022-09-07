<template>
  <a-config-provider :locale="locale">
    <nuxt />
  </a-config-provider>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

@Component
export default class LayoutEmpty extends Vue {
  // 国际化语言文件
  locale: any = zhCN
}
</script>

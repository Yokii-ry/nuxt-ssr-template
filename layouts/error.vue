<template>
  <div class="page-error">
    <div class="image">
      <img :src="errorConfig[errorCode].image" />
    </div>
    <div class="content">
      <h1>{{ errorConfig[errorCode].title }}</h1>
      <div class="description">
        {{ errorConfig[errorCode].description }}
      </div>
      <div class="action">
        <a-button type="primary" @click="$router.push('/')">
          返回首页
        </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

type error = {
  statusCode: number
}

@Component
export default class LayoutError extends Vue {
  // 框架注入 error 对象
  @Prop(Object)
  error!: error

  // 错误类型预设文案图标配置
  errorConfig = {
    403: {
      title: '403',
      image: '/images/common/403.svg',
      description: '抱歉，你无权访问该页面'
    },
    404: {
      title: '404',
      image: '/images/common/404.svg',
      description: '抱歉，你访问的页面不存在'
    },
    500: {
      title: '500',
      image: '/images/common/500.svg',
      description: '抱歉，内部发生异常'
    }
  }

  // 获取错误码的 computed 属性
  get errorCode() {
    return this.error.statusCode
  }
}
</script>

<style lang="less" scoped>
.page-error {
  margin-top: 120px;
  .flex;

  .image {
    padding-right: 80px;

    img {
      height: 320px;
      max-width: 400px;
    }
  }

  .content {
    h1 {
      margin-bottom: 24px;
      color: #434e59;
      font-size: 72px;
      font-weight: 600;
      line-height: 72px;
    }

    .description {
      margin-bottom: 24px;
      font-size: 20px;
      line-height: 28px;
      color: rgba(0, 0, 0, 0.45);
    }

    .action button {
      width: 120px;
    }
  }
}
</style>

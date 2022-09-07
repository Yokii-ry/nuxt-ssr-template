require('dotenv').config()
export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal', // 告诉nuxt需要ssr
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: process.env.PROJECT_NAME || process.env.npm_package_name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '//cdn.ruoyao.live/imgbz19.jpeg'
      }
    ],
    script: [
      { src: '//at.alicdn.com/t/font_1263107_ze1b3pe723f.js', async: 'async' }
    ]
  },
  /*
   ** Global CSS
   */
  css: ['ant-design-vue/dist/antd.css', '@/assets/less/main.less'],

  /**
   * StyleResources 模块配置
   */
  styleResources: {
    less: ['@/assets/less/variables.less', '@/assets/less/mixins.less']
  },

  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    'antd-ui',
    'antv-g2plot',
    'api',
    'inject',
    'axios',
    'antd/icons',
    'vue/config',
    'router'
  ].map(fileName => {
    return {
      src: '@/plugins/' + fileName,
      ssr: false // 当你的插件需要被捕捉时候，需要改为true
    }
  }),
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: false,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxt/typescript-build', 'nuxt-windicss'],

  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  transpileDependencies: ['vuex-module-decorators'],
  /**
   * 自定义加载指示器样式
   */
  loading: { color: '#4FB5F9' },
  loadingIndicator: {
    name: '@/static/custom-locading-indicator.html'
  },

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',

    // 文档: https://github.com/nuxt-community/proxy-module#readme
    '@nuxtjs/proxy',

    // 文档: https://zh.nuxtjs.org/api/configuration-build#styleresources
    '@nuxtjs/style-resources',

    // 文档 https://www.npmjs.com/package/@nuxtjs/moment
    '@nuxtjs/moment',

    // nuxt.js 框架构建配置
    '@/modules/build.ts',

    // 环境变量配置 云效流水线，可以直接覆盖环境变量
    '@nuxtjs/dotenv',

    // https://www.npmjs.com/package/cookie-universal-nuxt
    'cookie-universal-nuxt'
  ],

  /**
   * http-proxy 中间件解决方案配置
   */
  // proxy: {
  //   '/api': {
  //     target: 'http://dev-api.cblink.net',
  //     pathRewrite: {
  //       '^/api': '/'
  //     }
  //   }
  // },
  proxy: {
    '/api': {
      // http://test-manage.little-painter.haosailei.cn/
      target:
        process.env.NODE_ENV === 'production'
          ? 'https://dashboard.little-painter.towinos.com'
          : 'http://test-dashboard.little-painter.haosailei.cn'
    }
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */

  /**
   * 路由中间件
   */
  router: {
    middleware: []
  },

  build: {
    babel: {
      presets() {
        return [['@nuxt/babel-preset-app', { loose: true }]]
      }
    }
  },

  typescript: {
    typeCheck: {
      eslint: {
        files: './**/*.{ts,js,vue}'
      }
    }
  },

  moment: {
    defaultLocale: 'zh-cn',
    locales: ['zh-cn']
  }
}

### vue2-nuxt-ssr

### 该项目是基于 nuxtjs + typescript + ant-design-vue+ssr 的脚手架

## ssr

nuxt.config

- mode 改为'universal'。`模式选择-SPA/Universal`（告诉服务器为 ssr 渲染）

- 由于是第三方渲染，如果使用了第三方插件，默认 ssr 项为 true，需要手动更改。否则启动项目页面会变成 document is no defined 。

  ```js
  plugins: [
     'antd-ui',
     'antv-g2plot',
     'api',
     'inject',
     'axios',
     'antd/icons',
     'vue/component',
     'vue/config'
    ].map(*fileName* *=>* {
      return {
          src: '@/plugins/' + fileName,
          ssr: false // 重点，只在client被打包引用
          }
    })
  ```

* 在使用 ssr 渲染的时候如果使用的是 asyncData 方法，则要保存到本地，因为页面只会刷新的时候去请求接口，从客户端点击菜单路由跳转则是只读缓存的数据。（在 created 生命周期函数之前执行，所以拿不到 this 实例）

  ```js
      // 如果是在首次加载首页，则从服务器读取数据。
      if (process.server) {

      }else{
        // 读取本地缓存数据
      }

     mounted() {
      // 不论是从哪里获取的数据，都再次存一遍。
      if (this.baseInfo) localStorage.setItem('baseInfo', JSON.stringify(this.baseInfo))
     }
  ```

- 如果是使用 fetch 方法的话，每次进入页面都会执行这个方法，与 store 配合食用更佳。

## 缓存

在一次无聊之际我手贱狂刷新使用了 ssr 做的首页，突然发现与别的 spa 发送 network 请求的页面不一样，没有出现白的闪屏效果，再次感叹 ssr 的巅峰速度之后，快速按`command`+`R`不停刷新着，结果突然眼前一灰，出现了下图错误，然后一顿操作猛如虎排查，发现是 node 服务出问题了，与后端、产品、前端的小伙伴一讨论，决定采用页面缓存，减轻服务器的压力；在调研之后觉得页面缓存最适合目前我的需求，缓存时间为五分钟。

**当整个页面与用户数据无关，依赖的数据基本不变的情况下，可以对整个页面做缓存，减小页面获取时间**

http://cdn.ruoyao.live/life/wLu2EK4uoR.jpg

```js
middleware/page-cache.js
const LRU = require('lru-cache')
 d
let cachePage = new LRU({

 max: 100, // 缓存队列长度

 maxAge: 1000 * 60 // 缓存1分钟

})

export default function(req, res, next){


const LRU = require('lru-cache')

const cachePage = new LRU({
  max: 100, // 缓存队列长度

  maxAge: 1000 * 60 // 缓存1分钟
})

export default function(req: any, res: any, next: any) {
  const url = req._parsedOriginalUrl

  const pathname = url?.pathname

  // 通过路由判断，只有首页才进行缓存

  if (pathname === '/') {
    const existsHtml = cachePage.get('homeData')

    if (existsHtml) {
      return res.end(existsHtml.html, 'utf-8')
    }

    res.original_end = res.end

    // 重写res.end

    res.end = function(data: any) {
      if (res.statusCode === 200) {
        // 设置缓存

        cachePage.set('homeData', { html: data })
      }

      // 最终返回结果

      res.original_end(data, 'utf-8')
    }
  }

  next()
}

```

```js
nuxt.config.js配置项修改，引入服务端中间件
serverMiddleware: [
  { path: '/home', handler: '~/middleware/page-cache.js' },
]
```

## nuxt 文档

[Nuxt.js 官网](https://zh.nuxtjs.org/)

[Nuxt.js TS 官网](https://typescript.nuxtjs.org/)

[Nuxt.js 的实战和配置](https://segmentfault.com/a/1190000019972611)

[nuxt-property-decorator](https://www.npmjs.com/package/nuxt-property-decorator)  
vue-class-component + vue-property-decorator + vuex-class + vuex-module-decorators 的包

[@nuxtjs/dotenv](https://developer.aliyun.com/mirror/npm/package/@nuxtjs/dotenv)  
用于管理 env 的全局环境变量，配合后端，后端可以部署的时候覆盖 env 文件，达到正测服都用 BASE_URL 的变量的效果

### 其他第三方包

[v-viewer](https://www.npmjs.com/package/v-viewer) - 图片预览器

[cookie-universal-nuxt](https://www.npmjs.com/package/cookie-universal-nuxt) - nuxt 全局的 cookie, 已经暴露在 context 里了

[vue-clipboard2](https://www.npmjs.com/package/vue-clipboard2) - 复制到粘贴板
[vue-clipboard2 简书](https://www.npmjs.com/package/vue-clipboard2)

[vue-qr](https://www.npmjs.com/package/vue-qr) - 生成 qrcode

### 注意

使用该项目需要安装 vscode 依赖
vetur
vetur-wepy
prettier
eslint
vue 2 Snippets



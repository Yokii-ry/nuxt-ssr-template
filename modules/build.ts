/*
 * @Description:
 * @Author: yoki
 * @Date: 2022-07-26 14:49:28
 * @LastEditors: yoki
 * @LastEditTime: 2022-07-26 15:52:23
 * @FilePath: /nuxt-typescript-template/modules/build.ts
 */
import path from 'path'
import tsImportPluginFactory from 'ts-import-plugin'
import webpack from 'webpack'

export default function() {
  // 让 Nuxt 支持 .ts 和 .tsx 扩展名的文件
  this.nuxt.options.extensions.push('ts', 'tsx')

  // 扩展 webpack 配置
  this.extendBuild(config => {
    // 添加 TypeScript 解析支持
    config.module.rules.push({
      test: /\.tsx?$/,
      loader: 'ts-loader',
      options: {
        // 对 vue 文件追加 ts 文件后缀以便处理里面的的 Typescript
        appendTsSuffixTo: [/\.vue$/],

        /**
         * 提升编译速度，但是会失去类型检查能力
         * 参考：https://github.com/TypeStrong/ts-loader#loader-options
         */
        transpileOnly: true,

        // 增加 ts-import-plugin 按需加载 ant-design 组件
        getCustomTransformers: () => ({
          before: [
            tsImportPluginFactory({
              libraryName: 'ant-design-vue',
              style: true,
              libraryDirectory: 'es'
            })
          ]
        })
      },
      exclude: /node_modules/
    })

    // 增加 .ts 文件扩展名解析
    if (!config.resolve.extensions.includes('.ts')) {
      config.resolve.extensions.push('.ts')
    }

    // 增加 .tsx 文件扩展名解析
    if (!config.resolve.extensions.includes('.tsx')) {
      config.resolve.extensions.push('.tsx')
    }

    // 修改 Antd 的默认图标为按需加载以减小打包体积， 在使用图标之前需要先在 plugins/antd/icons.ts 文件中添加引用
    config.resolve.alias['@ant-design/icons/lib/dist$'] = path.resolve(
      __dirname,
      '../plugins/antd/icons.ts'
    )

    // 精简 moment 的语言文件，只保留中英文
    config.plugins.push(
      new webpack.ContextReplacementPlugin(
        /moment[\\/]locale$/,
        /^\.\/(zh-cn|en-us)$/
      )
    )
  })
}

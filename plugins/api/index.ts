type TKeyAny = {
  [key: string]: any
}

// 先按照规范写好的模块 API 后再统一引入
export default ({ $axios }: any, inject: any) => {
  const api: TKeyAny = {}

  const requireApiModules = require.context(
    // 当前目录
    '.',
    // 是否查询其子目录
    false,
    // 匹配 API 模块文件名的正则表达式
    /\.\/(?!index).*\.ts$/
  )

  // 自动导入
  requireApiModules.keys().forEach((fileName: string) => {
    // 获取模块对象
    const module = requireApiModules(fileName)
    // 通过路径获取模块名
    const moduleName = fileName
      .split('/')
      .pop()
      ?.split('.')
      .shift()

    api[moduleName as string] = (module.default || module)($axios)
  })

  inject('api', api)

  return api
}

// 模块自动化导入

const requireDirectives = require.context(
  // 当前目录
  '.',
  // 是否查询其子目录
  false,
  // 匹配模块文件名的正则表达式
  /\.\/(?!index).*\.ts$/
)

export default (context: any) => {
  requireDirectives.keys().forEach(fileName => {
    const func = requireDirectives(fileName).default
    typeof func === 'function' && func(context)
  })
}

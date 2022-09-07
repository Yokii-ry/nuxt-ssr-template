// 模块自动化导入

const requireFilters = require.context(
  // 当前目录
  '.',
  // 是否查询其子目录
  false,
  // 匹配模块文件名的正则表达式
  /\.\/(?!index).*\.ts$/
)

requireFilters.keys().forEach(fileName => {
  requireFilters(fileName)
})

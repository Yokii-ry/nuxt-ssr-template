/**
 * 安全地获取嵌套对象的属性
 */
import moment from 'moment'

export function path(
  target: [object, Array<any>],
  path: string,
  defaultValue?: any
) {
  return (
    path
      .split('.')
      .reduce(
        (last: any, key: any) =>
          key && last && last[key] ? last[key] : undefined,
        target
      ) || defaultValue
  )
}

/**
 * 1. 无法确认返回类型：这将损失 ts 最大的类型校验功能
 * 2.  无法对 key 做约束：可能会犯拼写错误的问题
 * @param target 目标对象
 * @param key 对象的key值
 */
export function get<Target extends object, Key extends keyof Target>(
  target: Target,
  key: Key
): Target[Key] {
  return target[key]
}

/**
 * 以 JSON 序列化方式克隆对象，注意 Function 和 Error 对象不能被克隆
 * @param {object} obj - 需要被克隆的对象
 * @return {object} 克隆后的新对象
 */
export function clonePlainObj(obj: object): object {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 七牛图片尺寸缩放
 * @param {string} url - 七牛链接
 * @param {number} width - 设置宽
 * @param {number} height - 设置高
 * @return {string} 瘦身后的 url
 */
export const imageSlim = (url: string, width = 1920, height?: number) => {
  // 不是七牛链接不瘦身
  if (!url || !url.includes('cdn.')) {
    return url
  }

  // 已经经过图片基础处理的不瘦身
  if (url.includes('imageView2')) {
    return url
  }

  // Data URL 不瘦身
  if (url.startsWith('data:')) {
    return url
  }

  // 判断参数追加方式
  if (url.includes('?')) {
    url = url + '&'
  } else {
    url = url + '?'
  }

  // 设置宽
  if (width && !height) {
    return url + `imageView2/2/w/${width}`
  }
  // 设置高
  if (!width && height) {
    return url + `imageView2/2/h/${height}`
  }
  // 设置宽高
  if (width && height) {
    return url + `imageView2/2/w/${width}/h/${height}`
  }
}

/**
 * 生成随机字符串
 * @param {boolean} numberOnly - 是否只生成纯数字
 * @param {boolean} randomLength - 是否任意长度，为 true 则生成长度区间为 [min, max] 的字符串，否则生成以 min 为固定长度的字符串
 * @param {number} min - 任意长度最小位（固定长度）
 * @param {number} max - 任意长度最大位
 * @return {string} 随机字符串
 */
export const randomString = (
  numberOnly = true,
  randomLength = true,
  min = 10,
  max = 16
) => {
  const arr = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    ...(!numberOnly
      ? [
          'a',
          'b',
          'c',
          'd',
          'e',
          'f',
          'g',
          'h',
          'i',
          'j',
          'k',
          'l',
          'm',
          'n',
          'o',
          'p',
          'q',
          'r',
          's',
          't',
          'u',
          'v',
          'w',
          'x',
          'y',
          'z',
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O',
          'P',
          'Q',
          'R',
          'S',
          'T',
          'U',
          'V',
          'W',
          'X',
          'Y',
          'Z'
        ]
      : [])
  ]

  let str = ''
  let pos: any = ''
  let range = min

  // 随机产生
  if (randomLength) {
    range = Math.round(Math.random() * (max - min)) + min
  }
  for (let i = 0; i < range; i++) {
    pos = Math.round(Math.random() * (arr.length - 1))
    str += arr[pos]
  }
  return str
}

/**
 * 低阶组件 props 合成
 * @param {object} sourceComponent - 低阶组件的 props
 * @param {object} currentInstance - 延迟时间，单位：ms
 * @param {boolean} isDeniedOuterProps - 是否阻止外部传进来的同名 prop
 * @return {object} 合并好的 props 集合
 */
export function propsMerge(
  sourceProps: object,
  currentInstance: any,
  isDeniedOuterProps = true
) {
  const props: any = {}
  /**
   * 获取当前组件实例 data 的所有属性名
   * 注意，所有要传到低阶组件的属性都要以 local 开头，并写在高阶组件实例的 data 上
   * 放在 data 里是为了降低与实例上其他字段重名的概率
   */
  const dataKeys = Object.keys(currentInstance.$data)

  Object.keys(sourceProps).forEach(key => {
    // 合成与低阶组件的 props 里以 `local` 开头的且同名的属性名
    const localDataKey = `local${key
      .substring(0, 1)
      .toUpperCase()}${key.substring(1)}`

    if (dataKeys.includes(localDataKey)) {
      props[key] = currentInstance[localDataKey]

      // 当为 true 时可以避免当前组件实例里定义的属性被外面传进来的 props 覆盖
      if (isDeniedOuterProps) {
        return
      }
    }

    /**
     * 因为组件挂载后 props 上所有属性都会自动地被挂载到当前组件实例下，所以可以通过
     * 当前组件实例来获取外部传进来的所有与 a-upload 的 props 同名的属性，并加入准
     * 备传入 a-upload 的 props 集合中
     */
    if (currentInstance[key] !== undefined) {
      props[key] = currentInstance[key]
    }
  })

  return props
}

/**
 * 格式化化 moment 对象
 * @param {object} momentObj - moment 实例对象
 * @return {string} 格式化后的字符串
 */
export function stringifyMoment(momentObj: moment.Moment) {
  return momentObj instanceof moment
    ? momentObj.format('YYYY-MM-DD HH:mm:ss')
    : ''
}
/**
 * 解决使用 moment.js 格式化本地时间戳时多出了 8 小时问题，这 8 小时是本地时间与格林威治标准时间 (GMT) 的时差
 * 例如：moment(5 * 60 * 1000)，将 5 分钟的本地时间戳转为日期，结果会多出 8 小时，就是解决此问题
 * @param {Number} time 本地时间戳
 */
export const fixTimezoneOffset = (time: any) => {
  const date = new Date(time)
  // 当前时间 = 包含时差的当前时间 + 时差时间，getTimezoneOffset() 获取时差（以分钟为单位），转为小时需要除以 60
  date.setHours(date.getHours() + date.getTimezoneOffset() / 60)
  return date.getTime()
}
/**

/**
 * 回车转为 HTML 换行
 * @param {String} str 字符串内容
 */
export const enterToNewline = (str: string) => str.replace(/\n/g, '<br>')

/**
 * 将 base64 的图片转换为 file 文件
 * @param {String} urlData base64
 */
export const base64ToBlob = (urlData: string) => {
  const bytes = window.atob(urlData.split(',')[1]) // 去掉 url 的头，并转换为 byte
  const ab = new ArrayBuffer(bytes.length)
  const ia = new Uint8Array(ab)

  // 处理异常,将 ascii 码小于 0 的转换为大于 0
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i)
  }
  return new Blob([ab], { type: 'image/jpeg' })
}

/**
 * 前面补 0，例：prefixZero(1127, 8) 结果为 00001127
 * @param num 被操作数
 * @param n 固定的总位数
 */
export const prefixZero = (num: any, n: any) => {
  return (
    Array(n)
      .fill(0)
      .join('') + num
  ).slice(-n)
}

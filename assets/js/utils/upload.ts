// 上传图片的api
import * as qiniuJS from 'qiniu-js'
import { EnvModule } from '@/store'

export default ({ $utils, $api, $moment }: any, file: any) => {
  return new Promise((resolve, reject) => {
    const uploadPath = 'neditor/image'
    // 自定义上传行为
    const date = $moment().format('YYYYMMDDhhmmss') // 当前日期
    const random = $utils.randomString() // 生成随机字符串
    const qiniuUploadPath =
      uploadPath + date + '-' + random + '-' + file.name.replace(/\s/g, '_') // 七牛上传路径

    $api.common
      .getQiniuToken()
      .then((res: any) => qiniuUpload(file, qiniuUploadPath, res.data.token))
      .then((res: any) => {
        let url = EnvModule.qiniuDomain + '/' + res.key

        // 优化图片链接
        if (file.type.indexOf('image') === 0) {
          url = $utils.imageSlim(url)
        }

        // 记得传出去，这样才能在 change 回调中的 file.response 找到这个信息
        resolve(url)
      })
      .catch((error: any) => {
        console.error(error)
      })
  })
}

const qiniuUpload = (
  file: any,
  key: any,
  token: any,
  progressCallBack?: any
) => {
  return new Promise((resolve, reject) => {
    qiniuJS.upload(file, key, token).subscribe({
      next(res) {
        progressCallBack && progressCallBack(res)
      },
      error(err) {
        reject(err)
      },
      complete(res) {
        resolve(res)
      }
    })
  })
}

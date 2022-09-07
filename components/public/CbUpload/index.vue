<!--

组件：文件上传

注意：
1.  官方文档中 https://vue.ant.design/components/upload-cn/#API 所有的 props 都可
    使用，但建议只用下方提供 props，因为已经能满足这套系统的业务。
2.  默认情况下文件列表在 mode 为 select 和 drag 时，分别为 picture 和 picture-card，
    这时如果是上传非图片的文件时就要注意把 list-type 置为 'text'。
3.  组件 data 中以 local 开头的同名 prop 将会优先传入 a-upload，所以这些同名 prop
    不会接收父组件传进来的值。
4. 该组件提供了 value 和 emit 了 change 事件好让 a-form 组件能够接管数据，所有的
    v-decorator 的行为都和 a-form 中定义的一致。
5.  a-upload 的受控属性 fileList 一定要是按照 ant-design-vue\es\upload\interface.js
    中定义的 UploadFile 对象构成的数组，即数组元素至少包含 uid、name、status 和 url。
    uid 建议用 $utils.randomString() 生成，name 则建议用 $utils.randomString(false)
    生成。

-->

<script>
import Upload from 'ant-design-vue/es/upload/Upload'
import * as qiniuJS from 'qiniu-js'

export default {
  props: Object.assign({}, Upload.props, {
    // 上传方式，可选值：select-选择、drag-拖拽，默认为选择上传
    mode: {
      type: String,
      default: 'select'
    },

    // 接受上传的文件类型，详见 https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept
    accept: {
      type: String,
      default: '.gif,.jpg,.jpeg,.png'
    },

    // 上传文件前回调，预留余地给外部进行控制
    beforeFileUpload: {
      type: Function,
      default() {}
    },

    // 上传列表的内建样式
    listType: {
      type: String,
      default: 'picture'
    },

    // 最小上传数量，仅做文案显示使用，可结合 Async Validator 完成校验
    minCountForCopywriting: {
      type: [String, Number],
      default: ''
    },

    // 最大上传数量，默认为 0，即无限制
    maxCount: {
      type: Number,
      default: 0
    },

    // 允许上传的最大文件大小，单位 MB，默认为 0，即无限制
    maxSize: {
      type: Number,
      default: 0
    },

    // 图片尺寸限制
    imageScaleLimit: {
      type: Object
    },

    // 自定义文案
    hint: {
      type: String
    },

    // 七牛上传路径
    uploadPath: {
      type: String,
      validator(value) {
        // 路径只能是不以 / 开头但以 / 结尾的字符串
        return value[0] !== '/' && value[value.length - 1] === '/'
      },
      default() {
        // 默认取当前路由路径作为七牛上传路径的前缀
        let path = this.context ? this.context.$route.path : this.$route.path

        if (path.length > 1) {
          // 七牛的路径第 1 个字符不允许是 “/” 符号
          path = path.substr(1)
          // 最后 1 个字符没 “/” 符号则加上它
          path = path[path.length - 1] !== '/' ? path + '/' : path
          return path
        }

        return '/'
      }
    },

    // 设置 value 这个 prop 是为了能被 Form 组件接管，即遵循约定中的 —— 提供受控属性（prop） value
    value: {
      type: Array
      /**
       * TODO: Antd Bug，先注释默认值，避免出现 “Warning: `getFieldDecorator` will
       * override `value`, so please don't set `value and v-model` directly and
       * use `setFieldsValue` to set it.” 的问题
       */
      // default() {
      //   return []
      // }
    }
  }),

  data() {
    return {
      localFileList: this.value || [], // 当前已上传的文件列表
      localBeforeUpload: (file, uploadList) => {
        // 自定义文件上传之前的钩子

        // 如果限制了最大上传文件数
        if (this.maxCount) {
          const currentCount = this.localFileList.length
          const totalFileCount = currentCount + uploadList.length

          // 文件总数量（已上传数量 + 待上传数量）大于指定的最大上传文件数
          if (totalFileCount > this.maxCount) {
            // 只在遍历到待上传文件列表中的最后一个时才显示 message，避免一次性显示很多 message 提示框
            const index = uploadList.indexOf(file)
            if (index === uploadList.length - 1) {
              this.$message.warning(
                `最多还能上传 ${this.maxCount - currentCount} 个文件`
              )
            }
            return Promise.reject(file)
          }
        }

        // 如果限制了最大上传文件的大小
        if (this.maxSize) {
          const fileSize = file.size / 1024 / 1024
          const isExceed = fileSize > this.maxSize

          if (isExceed) {
            this.customErrorNotification(
              '文件上传失败',
              `${file.name} 的文件大小为 ${fileSize.toFixed(
                2
              )} MB，超过了规定的 ${this.maxSize} MB。`
            )

            return Promise.reject(file)
          }
        }

        // 如果限制了上传图片的尺寸
        if (this.imageScaleLimit) {
          return this.getImageScale(file).then(({ width, height }) => {
            if (!width || !height) {
              this.customErrorNotification(
                '文件上传失败',
                `${file.name} 不是有效的图片。`
              )
              return Promise.reject(file)
            }

            switch (this.imageScaleLimit.type) {
              case 'ratio': {
                // 固定值
                const ratio = width / height
                if (ratio !== this.imageScaleLimit.value) {
                  this.customErrorNotification(
                    '文件上传失败',
                    `${file.name} 的宽高比例为 ${ratio.toFixed(
                      2
                    )}，与规定的宽高比例 ${this.imageScaleLimit.value.toFixed(
                      2
                    )} 不符。`
                  )
                  return Promise.reject(file)
                }

                break
              }

              case 'fixed': {
                // 固定尺寸
                const value = this.imageScaleLimit.value || {}

                if (width !== value.width || height !== value.height) {
                  this.customErrorNotification(
                    '文件上传失败',
                    `${
                      file.name
                    } 的宽高尺寸为 ${width} x ${height}，与规定的宽高尺寸 ${
                      value.width
                    } x ${value.height} 不符。`
                  )
                  return Promise.reject(file)
                }

                break
              }

              case 'max': {
                // 最大尺寸
                const value = this.imageScaleLimit.value || {}

                if (width > value.width || height > value.height) {
                  this.customErrorNotification(
                    '文件上传失败',
                    `${
                      file.name
                    } 的宽高尺寸为 ${width} x ${height}，超过规定的最大宽高尺寸 ${
                      value.width
                    } x ${value.height}。`
                  )
                  return Promise.reject(file)
                }

                break
              }
            }
          })
        }

        // 执行 props 中定义的上传文件前的钩子
        if (typeof this.beforeFileUpload === 'function') {
          return this.beforeFileUpload(file, uploadList)
        }
      },
      localCustomRequest: data => {
        // 自定义上传行为
        const file = data.file // 文件对象
        const date = this.$moment().format('YYYYMMDDhhmmss') // 当前日期
        const random = this.$utils.randomString() // 生成随机字符串
        const qiniuUploadPath =
          this.uploadPath +
          date +
          '-' +
          random +
          '-' +
          file.name.replace(/\s/g, '_') // 七牛上传路径

        this.$api.common
          .getQiniuToken()
          .then(res => {
            return this.qiniuUpload(
              file,
              qiniuUploadPath,
              res.data.uptoken,
              res => {
                // 更新上传进度
                data.onProgress({
                  percent: res.total.percent
                })
                this.$emit('uploading', res)
              }
            )
          })
          .then(res => {
            let url = this.$store.state.env.qiniuDomain + '/' + res.key

            // 优化图片链接
            if (file.type.indexOf('image') === 0) {
              url = this.$utils.imageSlim(url)
            }

            // 记得传出去，这样才能在 change 回调中的 file.response 找到这个信息
            data.onSuccess({ ...res, url })
          })
          .catch(error => {
            console.log(error)

            // 记得传出去，这样才能在 change 回调中的 file.error 找到这个信息
            data.onError(error)
          })
      }
    }
  },

  computed: {
    // 格式化后的文件类型字符串
    formattedAccept() {
      return this.accept.replace(/,/g, ', ')
    },

    // a-upload 实例
    aUploadInstance() {
      let uploadInstance = this.$refs['a-upload']

      // 刚开始渲染是取不到实例的，要先返回个空对象
      if (!uploadInstance) {
        return {}
      }

      // a-upload-dragger 和 a-upload 嵌套层数不一样，要区分
      if (this.mode === 'drag') {
        uploadInstance = uploadInstance.$children[0]
      }

      return uploadInstance
    },

    // 图片上传尺寸限制提示文案
    imageScaleLimitHint() {
      if (!this.imageScaleLimit) {
        return ''
      }

      const value = this.imageScaleLimit.value
      switch (this.imageScaleLimit.type) {
        case 'ratio': {
          return `，图片宽高比例为 ${value.toFixed(2)}`
        }

        case 'fixed': {
          return `，图片宽高尺寸为 ${value.width} x ${value.height}`
        }

        case 'max': {
          return `，图片最大宽高尺寸不超过 ${value.width} x ${value.height}`
        }

        default: {
          return ''
        }
      }
    }
  },

  watch: {
    value(newVal) {
      this.localFileList = Array.isArray(newVal) ? newVal : []
    }
  },

  methods: {
    // 自定义错误通知弹窗
    customErrorNotification(message, description) {
      // 等上一个 notification 实例渲染后才继续渲染
      setTimeout(() => {
        // 右上角通知弹窗提示用户
        this.$notification.error({
          message,
          description,
          duration: 0
        })
      }, 0)
    },

    // 获取图片尺寸
    getImageScale(file) {
      return new Promise((resolve, reject) => {
        if (!file.type.includes('image')) {
          // 如果不是图片文件则返回空对象
          resolve({})
        }

        const image = new Image()
        image.src = URL.createObjectURL(file)

        image.onload = function() {
          const width = image.width
          const height = image.height
          resolve({ width, height })
        }

        image.onerror = () => {
          resolve({})
        }
      })
    },

    // 上传到七牛云
    qiniuUpload: (file, key, token, progressCallBack) => {
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
    },

    // 上传列表改变回调，触发条件：uploading、done、error、removed
    onFileListChange({ file, fileList }) {
      if (file.status === 'done') {
        // 通知父组件
        this.$emit('success', this.hoistUrlToFileRoot(file))
      } else if (file.status === 'error') {
        this.customErrorNotification(
          '文件上传失败',
          `${file.name} 上传失败，建议稍后重试。`,
          'upload-notification'
        )

        // 失败的时候移除文件
        fileList.splice(fileList.indexOf(file), 1)

        // 通知父组件
        this.$emit('error', file)
      }

      // change 事件只传最新的列表状态，以便兼容 Form 组件数据接管逻辑
      const _fileList = this.processFileList(fileList)
      this.localFileList = _fileList
      this.$emit('change', _fileList)
    },

    // 处理文件列表数据结构
    processFileList(fileList) {
      return [...fileList].map(item => this.hoistUrlToFileRoot(item))
    },

    // 提取 file.response.url 到对象的根下
    hoistUrlToFileRoot(file) {
      if (!file.url) {
        file.url = this.$utils.path(file, 'response.url', '')
      }
      return file
    },

    // 预览已上传的图片
    onPreview(file) {
      if (
        file.originFileObj &&
        file.originFileObj.type.indexOf('video') === 0
      ) {
        return this.$videoPreview(URL.createObjectURL(file.originFileObj))
      } else if (/mp4|mov/.test(this.accept)) {
        // 视频文件直接通过 url 进行预览
        return this.$videoPreview(file.url)
      } else if (!file.originFileObj && /\.zip$/.test(file.url)) {
        // 如果是在编辑过程想浏览附件，则直接下载
        return window.open(file.url)
      }

      const index = this.localFileList.findIndex(item => item.uid === file.uid)

      // v-viewer 注入后，img 标签不能直接 click 到，所以只能手动去触发 img dom 的 click 事件以调用 v-viewer 的预览事件
      if (index !== undefined) {
        const imageDom = this.$el.querySelector(
          `.ant-upload-list .ant-upload-list-item-done:nth-child(${index +
            1}) img`
        )
        imageDom && imageDom.click && imageDom.click()
      }
    },

    // 清空上传列表
    clearFileList() {
      this.localFileList = []
      this.$emit('change', [])
    }
  },

  render() {
    // 准备传入 a-upload 的 props
    const aUploadProps = this.$utils.propsMerge(Upload.props, this)
    // 自动根据最大允许上传数设置 input file 是否支持多选
    aUploadProps.multiple = this.maxCount !== 1
    if (this.mode === 'drag') {
      // 拖拽上传模式
      return (
        <div class="cb-upload">
          <a-upload-dragger
            ref="a-upload"
            props={aUploadProps}
            onChange={this.onFileListChange}
            onPreview={() => {}}
            v-viewer
          >
            <p class="ant-upload-drag-icon">
              <a-icon type="cloud-upload" />
            </p>
            <p class="ant-upload-text">点击或将文件拖拽到这里上传</p>
            <p class="ant-upload-hint">
              支持文件类型：
              {this.formattedAccept}
              {this.minCountForCopywriting
                ? `，最少上传 ${this.minCountForCopywriting} 个`
                : ''}
              {this.maxCount ? `，最多上传 ${this.maxCount} 个` : ''}
              {this.maxSize ? `，且单个文件大小不超过 ${this.maxSize} MB` : ''}
            </p>
          </a-upload-dragger>
        </div>
      )
    }
    if (this.mode === 'button') {
      return (
        <div class="cb-upload">
          <a-upload
            ref="a-upload"
            props={aUploadProps}
            onChange={this.onFileListChange}
            onPreview={() => {}}
            v-viewer
          >
            <a-button icon="upload"> {this.$slots.default || '上传'} </a-button>
            {this.hint ? (
              <p class="ant-upload-select-hint">{this.hint}</p>
            ) : null}
          </a-upload>
        </div>
      )
    }
    // 修改上传列表的内建样式为图片墙
    aUploadProps.listType = 'picture-card'

    return (
      <div class="cb-upload cb-upload--picture-card">
        <a-upload
          ref="a-upload"
          props={aUploadProps}
          onChange={this.onFileListChange}
          onPreview={this.onPreview}
          v-viewer
        >
          {!this.maxCount || this.localFileList.length < this.maxCount ? (
            <a-icon type="plus" class="ant-upload-btn-icon" />
          ) : (
            ''
          )}
        </a-upload>
        <p class="ant-upload-select-hint">
          点击这里上传文件，支持文件类型：
          {this.formattedAccept}
          {this.minCountForCopywriting
            ? `，最少上传 ${this.minCountForCopywriting} 个`
            : null}
          {this.maxCount ? `，最多上传 ${this.maxCount} 个` : null}
          {this.maxSize ? `，单个文件大小不超过 ${this.maxSize} MB` : null}
          {this.imageScaleLimit ? this.imageScaleLimitHint : null}
        </p>
        {this.hint ? <p class="ant-upload-select-hint">{this.hint}</p> : null}
      </div>
    )
  }
}
</script>

<style lang="less" scoped>
.cb-upload {
  &--picture-card {
    & > span {
      display: block;
      min-height: 112px;
    }

 :deep( .ant-upload-list) {
      &-item-info {
        & > span {
          height: 100%;
        }
      }
    }

    .ant-upload-select {
      .ant-upload-btn-icon {
        font-size: 24px;
        color: @text-color-1;
      }

      &-hint {
        margin: 0;
        line-height: 1;
        clear: both;

        &:not(:first-child) {
          margin-top: 8px;
        }
      }
    }
  }

  .ant-upload-drag-icon {
    margin-bottom: 12px !important;
    i {
      font-size: 56px !important;
    }
  }
}
</style>

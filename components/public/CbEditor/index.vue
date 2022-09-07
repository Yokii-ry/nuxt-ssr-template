<!--

组件：富文本编辑器

注意：
1. 该组件提供了 value 和 emit 了 change 事件好让 a-form 组件能够接管数据，所有的
   v-decorator 的行为都和 a-form 中定义的一一致。
2. 如果外部组件在监听了 change 事件后直接通过 form.getFieldValue 来获取值则可能会
   出现取到的值并不是最新值的问题，可以在 $nextTick 中执行 form.getFieldValue，当然
   可以直接通过 change 事件回调函数参数 content 取得正确的最新值

-->

<script>
import uploadImage from '@/assets/js/utils/upload'
const SCRIPT_VERSION = 20191119152340 // JS 脚本版本，用于强制刷新浏览器缓存

// 一个简单的事件订阅发布的实现，取代原始 Event 对象,提升 IE 下的兼容性
class LoadEvent {
  constructor() {
    this.listeners = {}
  }

  on(eventName, callback) {
    this.listeners[eventName] === undefined
      ? (this.listeners[eventName] = [])
      : ''
    this.listeners[eventName].push(callback)
  }

  emit(eventName) {
    this.listeners[eventName] &&
      this.listeners[eventName].forEach(callback => callback())
  }
}

export default {
  props: {
    // UEditor 配置
    config: {
      type: Object,
      default: () => {}
    },

    // 编辑器初始高度
    initialHeight: {
      type: Number,
      default: 320
    },

    // 设置 value 这个 prop 是为了能被 Form 组件接管，即遵循约定中的 —— 提供受控属性（prop） value
    // eslint-disable-next-line vue/require-default-prop
    value: {
      type: String
      /**
       * TODO: Antd Bug，先注释默认值，避免出现 “Warning: `getFieldDecorator` will
       * override `value`, so please don't set `value and v-model` directly and
       * use `setFieldsValue` to set it.” 的问题
       */
      // default: ''
    },

    // 如果要自定义插入图片，该参数必须为true 详情请ctrl + f 搜索insert-image
    // 如果想插入图片。必须有七牛云配置，否则会报错
    customInsertImage: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      id:
        'editor' +
        Math.random()
          .toString()
          .slice(-10), // 编辑器 ID
      editor: null, // 编辑器实例
      isReady: false, // 实例是否已经挂载
      defaultConfig: {
        initialFrameWidth: '100%', // 初始容器宽度
        UEDITOR_HOME_URL: '/assets/js/NEditor/', // UEditor 资源路径
        enableAutoSave: false, // 关闭自动保存
        autoFloatEnabled: false, // 禁用工具栏悬浮
        toolbars: [
          // 工具栏定义
          [
            'fullscreen',
            'undo',
            'redo',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'formatmatch',
            'removeformat',
            'forecolor',
            'backcolor',
            'indent',
            'justifyleft',
            'justifycenter',
            'justifyright',
            'justifyjustify',
            'rowspacingtop',
            'rowspacingbottom',
            'lineheight',
            'insertorderedlist',
            'insertunorderedlist',
            'paragraph',
            'fontsize',
            'link',
            'unlink',
            'source',
            '135editor',
            'custominsert'
          ]
        ]
      }
    }
  },

  computed: {
    // 混合配置
    mixedConfig() {
      return {
        ...this.defaultConfig,
        initialFrameHeight: this.initialHeight
      }
    }
  },

  watch: {
    // v-model语法糖实现
    value: {
      handler(value) {
        this.editor ? this.setContent(value) : this.beforeInitEditor()
      },
      immediate: true
    }
  },

  mounted() {
    const hostname = window.location.hostname
    if (!['localhost', '127.0.0.1'].includes(hostname)) {
      // 规避跨域导致的 document 对象不能访问的问题
      const patterns = window.location.hostname.split('.')
      const topLevel = patterns.pop()
      const subLevel = patterns.pop()
      document.domain = subLevel + '.' + topLevel
    }
  },

  beforeDestroy() {
    // 退出前销毁编辑器实例，避免内存泄漏
    this.destroy && this.editor && this.editor.destroy && this.editor.destroy()
  },

  methods: {
    // 实例化编辑器之前进行 JS 依赖检测
    beforeInitEditor() {
      /**
       * 准确判断 neditor.config.js 和 neditor.all.js 是否均已加载，因为仅加载完
       * neditor.config.js 时 UE 对象和 UEDITOR_CONFIG 对象就会存在，仅加载完
       * neditor.all.js 时 UEDITOR_CONFIG 对象也存在，但为空对象。
       */

      !!window.UE &&
      !!window.UEDITOR_CONFIG &&
      Object.keys(window.UEDITOR_CONFIG).length !== 0 &&
      !!window.UE.getEditor
        ? this.initEditor()
        : this.loadScripts().then(() => this.initEditor())
    },

    // JS 依赖加载
    loadScripts() {
      // 确保多个实例同时渲染时不会重复创建 script 标签
      if (window.loadEnv) {
        return new Promise((resolve, reject) => {
          window.loadEnv.on('scriptsLoaded', resolve)
        })
      }
      window.loadEnv = new LoadEvent()

      return new Promise((resolve, reject) => {
        /**
         * 如果在其他地方只加载了 neditor.all.min.js，则此处仍需要在加载完
         * neditor.config.js 之后再重新加载一遍 neditor.all.min.js，
         * 以确保 neditor.config.js 的配置能被应用。
         */
        this.loadParse()
          .then(() => this.loadConfig())
          .then(() => this.loadCore())
          .then(() => this.loadService())
          .then(() => {
            window.loadEnv.emit('scriptsLoaded')
            resolve()
          })
          .catch(console.error)
      })
    },

    // 加载 NEditor 解析模块
    loadParse() {
      return new Promise((resolve, reject) => {
        const parseScript = document.createElement('script')
        parseScript.type = 'text/javascript'
        parseScript.src =
          this.mixedConfig.UEDITOR_HOME_URL + 'neditor.parse.min.js'
        document.getElementsByTagName('head')[0].appendChild(parseScript)
        parseScript.onload = resolve
      })
    },

    // 加载编辑器配置
    loadConfig() {
      return new Promise((resolve, reject) => {
        if (
          !!window.UE &&
          !!window.UEDITOR_CONFIG &&
          Object.keys(window.UEDITOR_CONFIG).length !== 0
        ) {
          return resolve()
        }

        const configScript = document.createElement('script')
        configScript.type = 'text/javascript'
        configScript.src =
          this.mixedConfig.UEDITOR_HOME_URL +
          'neditor.config.js?v=' +
          SCRIPT_VERSION
        document.getElementsByTagName('head')[0].appendChild(configScript)
        configScript.onload = resolve
      })
    },

    // 加载编辑器核心
    loadCore() {
      return new Promise((resolve, reject) => {
        if (!!window.UE && !!window.UE.getEditor) {
          return resolve()
        }

        const coreScript = document.createElement('script')
        coreScript.type = 'text/javascript'
        coreScript.src =
          this.mixedConfig.UEDITOR_HOME_URL +
          'neditor.all.js?v=' +
          SCRIPT_VERSION

        document.getElementsByTagName('head')[0].appendChild(coreScript)
        coreScript.onload = resolve
      })
    },

    // 加载 NEditor Service
    loadService() {
      return new Promise((resolve, reject) => {
        const serviceScript = document.createElement('script')
        serviceScript.type = 'text/javascript'
        serviceScript.src =
          this.mixedConfig.UEDITOR_HOME_URL + 'neditor.service.js'
        document.getElementsByTagName('head')[0].appendChild(serviceScript)
        serviceScript.onload = resolve
      })
    },

    // 实例化编辑器
    initEditor() {
      this.$nextTick(() => {
        this.editor = window.UE.getEditor(this.id, this.mixedConfig)
        // 注册 UI 相关部件
        this.$nextTick(() => {
          this.registerUIWidget()
        })

        this.editor.addListener('ready', () => {
          this.isReady = true
          this.$emit('ready', this.editor)
          this.editor.setContent(this.value || '')

          // 添加内容变化监听器
          this.editor.addListener('contentChange', () => {
            this.$emit('change', this.editor.getContent())
          })
        })
      })
    },

    // 设置内容
    setContent(value) {
      if (this.isReady && value !== this.editor.getContent()) {
        this.editor.setContent(value)
      }
    },

    // 添加自定义按钮
    registerButton: ({ name, title, handler, className, UE = window.UE }) => {
      UE.registerUI(name, (editor, name) => {
        editor.registerCommand(name, {
          execCommand: () => {
            handler(editor, name)
          }
        })

        const btn = new UE.ui.Button({
          name,
          title,
          className,
          onclick() {
            editor.execCommand(name)
          }
        })
        return btn
      })
    },

    // 注册 UI 相关部件
    registerUIWidget() {
      this.register135Editor()
      this.registerUploadImage()
    },

    // 注册 135 编辑器按钮
    register135Editor() {
      this.registerButton({
        name: '135editor',
        title: '图文编辑',
        className: 'edui-for-135editor',
        handler(editor, name) {
          const dialog = new window.UE.ui.Dialog({
            iframeUrl:
              editor.options.UEDITOR_HOME_URL +
              'dialogs/135editor/135editor.html',
            editor,
            name,
            title: '图文编辑',
            cssRules: `
                    width: ${parseInt(document.body.clientWidth * 0.85)}px;
                    height: ${parseInt(document.body.clientHeight * 0.85)}px;
                  `
          })
          dialog.render()
          dialog.open()
        }
      })
    },

    // 注册 上传图片 编辑器按钮
    // 如果想插入图片。必须有七牛云配置，否则会报错
    registerUploadImage() {
      const that = this.$refs.file

      this.registerButton({
        name: 'custominsert',
        title: '图文编辑',
        className: 'edui-for-insertimage',
        handler() {
          that.click()
        }
      })
    },

    // 选择文件
    pickImage(e) {
      const file = e.target.files[0]

      if (file && file instanceof File) {
        if (
          !(
            /^image\/gif$/.test(file.type) ||
            /^image\/jpeg$/.test(file.type) ||
            /^image\/png$/.test(file.type)
          )
        ) {
          this.$message.warning(
            '目前仅支持上传格式为 gif, jpg, png 格式的图片文件'
          )
          return
        }

        if (file.size / 1024 / 1024 > 2) {
          this.$message.warning('目前仅支持上传大小为 2 MB 以内的图片')
          return
        }

        // 插入图片
        this.customInsertImage
          ? this.$emit('insert-image', file)
          : this.insertImage(file)
      }
    },

    // 插入图片
    insertImage(file) {
      uploadImage(this, file).then(url => {
        this.editor.execCommand(
          'inserthtml',
          `<img src="${url}" style="max-width: 100%; height: auto;"/>`
        )
      })
    }
  },

  render() {
    return (
      <div class="cb-editor">
        <script id={this.id} />

        <input
          type="file"
          accept="image/gif, image/jpeg, image/png"
          on-change={this.pickImage}
          ref="file"
          style="display: none;"
        />
      </div>
    )
  }
}
</script>

<style lang="less">
.cb-editor {
  > div > div {
    z-index: 99 !important;

    .edui-button.edui-for-135editor {
      width: 80px !important;

      & > div.edui-notadd {
        &.edui-state-active {
          & > div.edui-notadd {
            background-color: #bbb;
          }
        }

        & > div.edui-notadd {
          &:before {
            content: '编辑器';
            position: absolute;
            padding-left: 30px;
            font-size: 14px;
            font-weight: bold;
            line-height: 2;
          }
        }
      }

      .edui-icon {
        background-image: url('//static.135editor.com/img/icons/editor-135-icon.png') !important;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 70%;
      }
    }
  }
}
</style>

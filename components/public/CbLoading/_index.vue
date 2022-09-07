<template>
  <transition name="cb-loading-fade">
    <div v-show="visible" class="cb-loading">
      <a-spin />
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      visible: false // loading 可见性
    }
  },

  methods: {
    // 隐藏 loading
    hide() {
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
.cb-loading {
  position: absolute;
  z-index: 999;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.85);
  .transition(opacity, 0.3s);
  .flex;
}
</style>

<style lang="less">
.cb-loading-fade-enter,
.cb-loading-fade-leave-to {
  opacity: 0;
}
</style>

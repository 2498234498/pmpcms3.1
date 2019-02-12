import resize from 'vue-resize-directive'
const minxinsResize = {
  data () {
    return {
      mixinHeight: '0',
      mixinShowAfterRenderClass: false,
      handleScrollX: null
    }
  },
  directives: {
    resize
  },
  mounted () {
    this.mixinResize()
  },
  updated () {
    this.mixinUpdatedTableHeight()
  },
  methods: {
    mixinResize () {
      this.$nextTick(() => {
        this.mixinHeight = this.$refs.container.offsetHeight - (this.$refs.queryContainer.offsetHeight || (
          // 针对形式是组件的
          this.$refs.queryContainer.$el ? this.$refs.queryContainer.$el.offsetHeight || 0 : 0
        ))
      })
    },
    mixinUpdatedTableHeight () {
      /**
       * 用于隐藏固定高度时显示不必要的scrollX的定时器
       * 这是el-table初次渲染时宽度计算的bug，可在渲染后通过重新赋予overflow: auto调整
      */
      this.handleScrollX = setInterval(() => {
        // 检测是否已经生成table节点，如果不是就每隔0.5s检测一次
        // 只有生成了真实节点才能够通过修改overflow属性让浏览器重新计算
        if (this.$refs.configurationTable) {
          this.mixinShowAfterRenderClass = true
          clearInterval(this.handleScrollX)
        }
      }, 500)
    }
  },
  destroyed () {
    this.handleScrollX && clearInterval(this.handleScrollX)
  }
}
export default minxinsResize

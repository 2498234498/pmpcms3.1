const cache = {
  beforeRouteLeave (to, from, next) {
    if (!from.meta.isFirst && from.name) {
      from.meta.isFirst = true
    }
    next()
  },
  methods: {
    // 第一次进入页面
    firstView (fn) {
      if (!this.$route.meta.isFirst) {
        fn && fn()
      }
    },
    // 判断不是第一次进入页面的回调
    notFirstView (fn) {
      if (this.$route.meta.isFirst) {
        fn && fn()
      }
    }
  }
}

export default cache

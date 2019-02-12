export default {
  props: {
    load: {
      type: Object,
      default () {
        return {
          isShow: false,
          isLoad: false
        }
      }
    }
  },
  watch: {
    load: {
      deep: true,
      handler (val) {
        if (!val.isLoad && val.isShow) {
          console.log('加载')
          this.initQuery && this.initQuery()
          val.isLoad = true
        }
      }
    }
  }
}

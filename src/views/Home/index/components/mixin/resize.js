export default {
  data () {
    return {
      interval: null
    }
  },
  watch: {
    '$store.state.app.sidebar.opened' () {
      clearTimeout(this.interval)
      this.interval = setTimeout(() => {
        this.pie && this.pie.resize()
      }, 800)
    }
  },
  computed: {
    pie () {
      return this.$refs.pie
    }
  },
  beforeDestroy () {
    this.interval && clearTimeout(this.interval)
  }
}

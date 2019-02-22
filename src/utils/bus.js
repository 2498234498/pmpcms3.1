const install = (Vue) => {
  const Bus = new Vue({
    methods: {
      emit (event, ...args) {
        this.$emit(event, ...args)
      },
      on (event, callback) {
        this.$on(event, callback)
      },
      off (event) {
        this.$off(event)
      }
    }
  })

  Vue.prototype.$bus = Bus
}

export default install

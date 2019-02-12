const tableScrollHeight = {
  methods: {
    handleTableScrollHeight (table) {
      try {
        this.$refs[table].$refs.bodyWrapper.scrollTop = 0
      } catch (error) {
        console.error(error)
      }
    }
  }
}

export default tableScrollHeight

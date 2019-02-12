
export default {
  data () {
    return {
      isPoll: true, // 开启/关闭轮训
      pollNum: 60000, // 轮询时间60s
      interval: 3000, // 轮询的间隔时间
      only: {} // 正在进行中的反控 { btnType: 'add', loading: false, event: '事件名', title: '名称' }
    }
  },
  methods: {
    // 分发反控事件
    btnEvent (e) {
      if (!this.$store.getters.pointCheck.id) {
        this.$message('暂无监控点')
        return false
      }
      if (!this.only.loading) {
        this.only = e
        this.only.fn = ''
        this[e.event] && this[e.event]()
      } else {
        this.$message.warning(`${this.only.title}，正在发送中，请稍后`)
      }
    },
    // 统一处理结果
    async processResult ({ api, params = {}, time = this.pollNum, fnEvent } = {}) {
      let { title } = this.only
      try {
        params = { ...params, pointId: this.$store.getters.pointCheck.id }
        let res = await this.$api[api](params)
        this.only.loading = true
        if (res.state === 0) {
          this.$message.info(`${title}，正在发送中...`)
          params = {
            cn: params.command,
            qn: res.data
          }
          await this.poll(params, time)
          setTimeout(() => {
            Array.isArray(fnEvent) ? fnEvent.map(e => this[e]()) : this[fnEvent]()
          }, 1500)
        } else {
          this.$message.error(`${title}，${res.msg}`)
        }
      } catch (err) {
        console.log(err)
      }
      this.only.loading = false
    },
    async poll (params, time, start = new Date().getTime()) {
      let res = null
      try {
        res = await this.$api.counterControlPoll(params)
        if (res.state === 0) {
          let { reverseControlState: state } = res.data
          let str = (this.only.fn && this.only.fn(res.data)) || ''
          if (state === '0') {
            await this.sleep()
            if (!this.isPoll) {
              console.log('切换监控点，终止轮询---')
            } else if (new Date().getTime() - start < time) {
              res = await this.poll(params, time, start)
            } else {
              console.log('超时---')
              this.$message.closeAll()
              this.$message.error(str || `${this.only.title}，发送超时`)
            }
          } else {
            if (state === '1') {
              console.log('反控成功---')
              this.$message.closeAll()
              this.$message.success(str || `${this.only.title}，发送成功`)
            } else {
              console.log('反控失败---')
              this.$message.closeAll()
              this.$message.error(str || `${this.only.title}，发送失败`)
            }
          }
        }
      } catch (err) {
        res = err
      }
      return res
    },
    // 睡眠
    sleep (interval = this.interval) {
      return new Promise(resolve => {
        setTimeout(resolve, interval)
      })
    }
  }
}

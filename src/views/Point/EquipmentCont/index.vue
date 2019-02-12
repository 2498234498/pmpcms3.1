<template>
  <div class="equipment-cont WH">
    <div class="equipment-left WH w220 lf">
      <Point @check="check"></Point>
    </div>
    <div class="equipment-right WH w100-220 lf">
      <el-tabs type="border-card"
        class="WH tabs">
        <el-tab-pane label="05国标反控"
          v-if="$store.getters.pointCheck.reportType === '05'"
          class="tab-child WH">
          <cus-table :Head="tableHead"
            :Data="tableData05"
            type="tableData05"
            @click="distribution"></cus-table>
        </el-tab-pane>
        <el-tab-pane label="17国标反控"
          v-if="$store.getters.pointCheck.reportType === '17'"
          class="tab-child WH">
          <cus-table :Head="tableHead"
            :Data="tableData17"
            type="tableData17"
            @click="distribution"></cus-table>
        </el-tab-pane>
        <!-- <el-tab-pane label="博控协议反控"
          class="tab-child WH">
          <cus-table :Head="tableHead"
            :Data="tableDataBcn"
            type="tableDataBcn"
            @click="distribution"></cus-table>
        </el-tab-pane> -->
      </el-tabs>
      <cus-form ref="cusForm"
        :show.sync="form.show"
        :title.sync="form.title"
        :values.sync="form.values"
        :inputs.sync="form.inputs"
        :rules.sync="form.rules"
        :contaminant-loading="contaminantLoading"
        :infoid-loading="infoidLoading"
        @submit="submit" />
    </div>
  </div>
</template>

<script>
import Point from '@/components/Point'
import cusTable from './components/cusTable'
import cusForm from './components/cusForm'
import mixin from './mixin'
const BTN_LIST = [
  { type: 'set', loading: false, text: '设置' },
  { type: 'draw', loading: false, text: '提取' },
  { type: 'stop', loading: false, text: '停止' },
  { type: 'add', loading: false, text: '添加' },
  { type: 'deleteUp', loading: false, text: '删除' },
  { type: 'open', loading: false, text: '打开' },
  { type: 'close', loading: false, text: '关闭' }
]
export default {
  name: 'EquipmentCont',
  components: { Point, cusTable, cusForm },
  mixins: [...mixin],
  data () {
    return {
      tableHead: Object.freeze([
        { property: 'index', label: '序号', width: 50, fixed: 'left' },
        { property: 'name', label: '名称', width: 170, fixed: 'left' },
        { property: 'result', label: '结果信息', width: 300 },
        { label: '操作', width: 190, fixed: 'right', type: 'btn' }
      ]),
      only: {
        btn: {
          loading: false
        }
      },
      ns: Object.freeze({
        'tableData05': {
          title: '05国标反控-',
          send: 'counterControlSend05'
        },
        'tableData17': {
          title: '17国标反控-',
          send: 'counterControlSend17'
        },
        'tableDataBcn': {
          title: '博控协议反控-'
        }
      }),
      contaminantSelect: [], // 污染物列表
      contaminantSelectNot: [], // 污染物列表，没有数采仪
      dataAcquisition: [{ label: '数采仪', value: '数采仪' }],
      contaminantLoading: true,
      infoidSelect: [],
      infoidLoading: false,
      form: {
        show: false,
        title: '',
        values: {},
        inputs: [],
        rules: {}
      },
      isPoll: true, // 开启/关闭轮训
      pollNum: 60000, // 轮询时间默认60秒
      interval: 3000 // 轮询的间隔时间
    }
  },
  created () {
    this.check()
  },
  activated () {
    this.notFirstView(_ => {
      if (this.check.$poiId !== this.$store.getters.pointCheck.id) {
        this.check()
      }
    })
  },
  watch: {
    'form.values.infoid' (val) {
      let command = this.form.values.command
      switch (command) {
        case 3021:
        // 设置-现场机信息(仪表)
          let tem = this.form.inputs.find(e => e.value === 'temperature')
          if (val) {
            let slt = this.form.inputs.find(e => e.value === 'infoid')
              .select
              .find(e => e.value === val)
            tem.label = slt.label
            tem.hidden = false
          } else {
            tem.label = ''
            tem.hidden = true
          }
          break
      }
    },
    'form.values.type' (val) {
      let command = this.form.values.command
      switch (command) {
        case 3020:
        // 提取-现场机信息(仪表)
          const infoid = this.form.inputs.find(e => e.value === 'infoid')
          infoid.select = this.infoidSelectFilter
          this.form.values.infoid = ''
          break
      }
    },
    async 'form.values.pollCode' (nd) {
      let command = this.form.values.command
      switch (command) {
        case 3020: // 提取-现场机信息(仪表)
        case 3021: // 设置-现场机信息(仪表)
          let infoid = this.form.inputs.find(e => e.value === 'infoid')
          if (nd) {
            await this.queryInfoid(nd)
            infoid.select = this.infoidSelectFilter
            infoid.hidden = false
            this.form.values.infoid = ''
          } else {
            infoid.hidden = true
            infoid.select = []
          }
          break
      }
    }
  },
  computed: {
    infoidSelectFilter () {
      const select = [...this.infoidSelect]
      const { command, type } = this.form.values
      if (command === 3020) {
        if (type === 1) {
          return select.filter(e => e.type === 2)
        } else if (type === 2) {
          return select.filter(e => e.type === 3)
        }
      }
      return select
    }
  },
  methods: {
    // 初始化数据
    initData () {
      for (const [key] of Object.entries(this.ns)) {
        if (Array.isArray(this[key])) {
          this[key].forEach(e => { e.result = '' })
        }
      }
    },
    cusForm () {
      return this.$refs.cusForm.$refs.form || {}
    },
    async check () {
      let { id: poiId } = await this.$store.dispatch('IsPointLoad')
      if (!poiId) return false
      this.check.$poiId = poiId
      this.isPoll = false
      this.initData()
      this.queryContaminant(poiId)
    },
    // 查询污染物列表
    async queryContaminant (poiId) {
      this.contaminantLoading = true
      try {
        let res = await this.$api.sysPointView({ poiId })
        if (res.state === 0) {
          let data = res.data.pollants.map(e => {
            return {
              ...e,
              label: e.polName,
              value: e.polCode
            }
          })
          data.unshift(this.dataAcquisition[0])
          this.contaminantSelect = Object.freeze(data)
          this.contaminantSelectNot = [...data]
          this.contaminantSelectNot.splice(0, 1)
          this.contaminantSelectNot = Object.freeze(this.contaminantSelectNot)
        }
        this.contaminantLoading = false
      } catch (error) {
        this.$isRepeat(error, () => {
          this.contaminantLoading = false
        })
      }
    },
    // 查询信息因子列表
    async queryInfoid (code) {
      this.infoidLoading = true
      let { polId: pollId } = this.contaminantSelect.find(e => e.value === code)
      try {
        let params = { poiId: this.$store.getters.pointCheck.id, pollId }
        let res = await this.$api.ContaminantFactor(params)
        if (res.state === 0) {
          let data = res.data.map(e => {
            return {
              ...e,
              label: e.name,
              value: e.id
            }
          })
          this.infoidSelect = Object.freeze(data)
        }
        this.infoidLoading = false
      } catch (error) {
        this.$isRepeat(error, () => {
          this.infoidLoading = false
        })
      }
    },
    btnList (type, method) {
      if (type) {
        type = Array.isArray(type) ? type : [type]
        return BTN_LIST
          .filter(e => type.includes(e.type))
          .map((e, k) => {
            return {
              ...e,
              e: `${e.type}${method}`
            }
          })
      }
      return BTN_LIST.map((e, k) => {
        return {
          ...e,
          e: `${e.type}${method}`
        }
      })
    },
    // 分发事件
    async distribution ({ e, btn, row, type, data }) {
      let { id: poiId } = await this.$store.dispatch('IsPointLoad')
      if (!poiId) {
        this.$message('暂无监控点数据')
        return false
      }
      // console.log(e, btn, row, type, data)
      if (this.only.btn.loading) {
        let str = BTN_LIST.find(e => e.type === this.only.btn.type).text
        this.$message.warning(`${this.ns[this.only.type].title}${str}-${this.only.data.name}，正在发送中，请稍后！`)
        return false
      }
      this.only = { ...this.only, e, btn, row, type, data, fn: null }
      this.isPoll = true
      this[e] && this[e]()
    },
    // 默认设置表单
    defForm (command, show = true) {
      let only = this.only
      let str = { set: '设置', draw: '提取', stop: '停止' }
      str = str[only.btn.type]
      let inputs = command
        ? [
          { label: '', type: 'input', value: 'pointId', hidden: true },
          { label: '', type: 'input', value: 'command', hidden: true }
        ]
        : [ { label: '', type: 'input', value: 'pointId', hidden: true } ]
      let values = command
        ? {
          pointId: this.$store.getters.pointCheck.id,
          command
        }
        : { pointId: this.$store.getters.pointCheck.id }
      this.form = {
        show,
        title: `${this.ns[only.type].title}${str}-${only.data.name}`,
        inputs,
        values
      }
    },
    // 处理表单提交
    submit () {
      let { e } = this.only
      this[e] && this[e](true)
    },
    // 统一处理结果
    async processResult (params, time = this.pollNum) {
      let { type, btn, row, data } = this.only
      let { title, send } = this.ns[type]
      btn.loading = true
      const rowData = this[type].find((e, k) => k === row)
      rowData.result = '正在发送中...'
      let str = BTN_LIST.find(e => e.type === btn.type).text
      // 提交
      try {
        let res = await this.$api[send](params)
        if (res.state === 0) {
          this.$message.info(`${title}${str}-${data.name}，正在发送中...`)
          let ams = {
            cn: this.form.values.command,
            qn: res.data
          }
          // 轮询结果
          await this.poll(new Date().getTime(), time, rowData, str, ams)
        } else {
          rowData.result = res.msg
          this.$message.error(`${title}${str}-${data.name}，${res.msg}`)
        }
      } catch (error) {
        rowData.result = '发送失败'
        console.log(error)
      }
      btn.loading = false
    },
    // 轮询
    async poll (start, time, rowData, str, params) {
      let { type, data, fn } = this.only
      let { title } = this.ns[type]
      let res = null
      try {
        res = await this.$api.counterControlPoll(params)
        if (res.state === 0) {
          let { reverseControlState: state } = res.data
          // 则定义轮询回调
          let cusText = (fn && fn(res.data)) || ''
          // 0: 正在进行中，1: 完成，2: 失败
          if (state === '0') {
            await this.sleep()
            if (!this.isPoll) {
              // 切换监控点时，终止轮询
              console.log('切换监控点，终止轮询---')
              rowData.result = ``
            } else if (new Date().getTime() - start < time) {
              res = await this.poll(start, time, rowData, str, params)
            } else {
              console.log('超时---')
              rowData.result = `${str}超时${cusText}`
              this.$message.closeAll()
              this.$message.error(`${title}${str}-${data.name}，${str}超时${cusText}`)
            }
          } else {
            if (state === '1') {
              console.log('反控成功---')
              rowData.result = `${str}成功${cusText}`
              this.$message.closeAll()
              this.$message.success(`${title}${str}-${data.name}，${str}成功${cusText}`)
            } else {
              console.log('反控失败---')
              rowData.result = `${str}失败${cusText}`
              this.$message.closeAll()
              this.$message.error(`${title}${str}-${data.name}，${str}失败${cusText}`)
            }
          }
        } else {
          rowData.result = `${str}失败`
        }
      } catch (error) {
        rowData.result = `${str}失败`
        res = error
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
</script>

<style lang="scss" scoped>
.equipment-right {
  padding: 3px 0 3px 10px;
  .tabs {
    display: flex;
    flex-direction: column;
    /deep/ {
      .el-tabs__content {
        padding: 0;
        margin-top: 3px;
        flex-grow: 1;
        position: relative;
      }
    }
    .tab-child {
      position: absolute;
    }
  }
}
</style>

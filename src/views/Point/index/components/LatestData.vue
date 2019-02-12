<template>
  <div class="latest-data WH"
    v-loading="dataLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    :element-loading-background="$store.getters.loadingColor">
    <div class="data-type-select">
      <el-radio-group v-model="dataType"
        size="small">
        <el-radio-button v-for="(item, index) in dataTypeSelect"
          :key="index"
          :label="item.label"
          @click.native="queryData(item.label)">{{ item.value }}</el-radio-button>
      </el-radio-group>
      <base-btn type="more"
        class="search"
        @click="$router.push({ name: 'DataQuery', query: { isQuery: true, statisType: compType(dataType), id: $store.getters.pointCheck.id } })"></base-btn>
    </div>
    <el-tabs tab-position="top"
      style="height: 100%;"
      v-model="dataTabs"
      class="data-tab">
      <el-tab-pane label="列表">
        <Datas :data="data.datas"
          :headData="data.head"
          :type="dataType"
          height="100%"></Datas>
      </el-tab-pane>
      <el-tab-pane label="图表">
        <Chart :data="data.chart"
          :loading="chartLoading"
          v-if="dataTabs === '1'"></Chart>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { computedWidth } from '@/utils'
import components from './components'
import load from './mixins/load'
export default {
  components: { ...components },
  mixins: [load],
  data () {
    return {
      dataType: '2011',
      dataTypeSelect: Object.freeze([
        { label: '2011', value: '实时' },
        { label: '2051', value: '分钟' },
        { label: '2061', value: '小时' },
        { label: '2031', value: '日' }
      ]),
      dataTabs: '0',
      data: {
        datas: [],
        head: [],
        chart: []
      },
      dataLoading: true,
      chartLoading: false
    }
  },
  computed: {
    compType () {
      const typeList = { 2011: 1, 2051: 8, 2061: 7, 2031: 6 }
      return index => typeList[index]
    }
  },
  methods: {
    initQuery () {
      this.queryData()
    },
    // 数据列表，图表数据查询
    queryData () {
      clearTimeout(this.queryData.$thrott)
      this.queryData.$thrott = setTimeout(async () => {
        let { id: pointId } = await this.$store.dispatch('IsPointLoad')
        if (!pointId) return false
        this.dataLoading = true
        this.queryChart()
        let table = await Promise.all([this.queryTableHead(), this.queryList()])
        this.$isRepeat(table, () => {
          this.dataLoading = false
        })
      }, 100)
    },
    // 动态表头
    async queryTableHead () {
      this.data.head = []
      let res = null
      let params = { cn: this.dataType, current: 1, pointId: this.$store.getters.pointCheck.id, size: 20 }
      this.queryTableHead.$dataType = this.dataType
      try {
        res = await this.$api.pointInfoTableHead(params)
        if (res.state === 0) {
          res.data = res.data || []
          let timeBar = res.data.find(e => e.field === 'dataTime')
          if (timeBar) {
            timeBar.fixed = 'left'
          }
          res.data = computedWidth(res.data, ['dataTime'])
          res.data.length && res.data.unshift({ field: 'index', title: '序号', width: 51, fixed: 'left' })
          this.data.head = res.data
        }
      } catch (error) {
        res = error
      }
      return res
    },
    // 查询数据列表
    async queryList () {
      let res = true
      let params = { pointId: this.$store.getters.pointCheck.id, cn: this.dataType, current: 1, size: 20 }
      try {
        res = await this.$api.pointInfoList(params)
        if (res.state === 0) {
          this.data.datas = Object.freeze(res.data || [])
        } else if (res.state === 101) {
          this.$message.error('没有该监控点信息')
        }
      } catch (error) {
        res = error
      }
      return res
    },
    // 查询图表
    async queryChart () {
      this.chartLoading = true
      let params = { pointId: this.$store.getters.pointCheck.id, cn: this.dataType, current: 1, size: 20 }
      this.data.chart = { columns: [], rows: [] }
      try {
        let res = await this.$api.pointInfoCharts(params)
        if (res.state === 0) {
          res.data = Object.assign({}, {
            columns: [],
            rows: []
          }, res.data)
          this.data.chart = res.data
        } else if (res.state === 101) {
          this.$message.error('没有该监控点信息')
        }
        this.chartLoading = false
      } catch (error) {
        this.$isRepeat(error, () => {
          this.chartLoading = false
        })
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.latest-data {
  .search {
    float: right;
    margin-top: 2px;
    margin-left: 10px;
  }
  .center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    color: #909399;
    font-size: 14px;
  }
  .data-type-select {
    position: absolute;
    top: 5px;
    left: 5px;
    z-index: 10;
  }
  .data-tab {
    display: flex;
    flex-direction: column;
    position: relative;
    /deep/ {
      .el-tabs__header {
        margin-bottom: 3px;
      }
      .el-tab-pane {
        height: 100%;
      }
      .el-tabs__nav {
        float: right;
      }
      .el-tabs__nav-scroll {
        padding-right: 20px;
      }
      .el-tabs__item {
        &:nth-child(2) {
          padding-left: 0;
        }
        &:last-child {
          padding-right: 0;
        }
      }
    }
  }
}
</style>

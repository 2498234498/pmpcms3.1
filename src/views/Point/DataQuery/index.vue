<template>
  <div class="data-query WH">
    <div class="data-query-left lf w220">
      <Point @check="check"></Point>
    </div>
    <div class="data-query-right lf w100-220" v-resize="mixinResize" ref="container">
      <div class="query-container clearfix" ref="queryContainer" onselectstart="return false">
        <query-bar label="数据类型：">
          <el-select v-model="queryValue.statisType"
            size="mini" class="select">
            <el-option v-for="(opt, opt_key) in statisTypeArr"
              :key="opt_key"
              :label="opt.label"
              :value="opt.value" />
          </el-select>
        </query-bar>
        <query-bar label="开始时间：">
          <custom-time :value.sync="queryValue.beginTime" :contrastValue.sync="queryValue.endTime" :type="queryValue.statisType" only="begin"></custom-time>
        </query-bar>
        <query-bar label="结束时间：">
          <custom-time :value.sync="queryValue.endTime" :contrastValue.sync="queryValue.beginTime" :type="queryValue.statisType" only="end"></custom-time>
        </query-bar>
        <query-bar>
          <base-btn type="search"
            class="btn"
            @click="check"></base-btn>
          <base-btn type="export"
            class="btn"
            :loading="exportLoading"
            @click="exportTable(queryValue)"></base-btn>
        </query-bar>
      </div>
      <el-tabs type="border-card" v-model="tabs">
        <el-tab-pane label="数据列表" :style="{height: mixinHeight - 55 + 'px'}">
          <el-table :data="tableData"
            border
            class="table"
            ref="configurationTable"
            :height="isShowPage ? mixinHeight - 126 : mixinHeight - 52"
            highlight-current-row
            style="width: 100%"
            :cell-style="setColor"
            :class="['configurationTable', {afterRenderClass: mixinShowAfterRenderClass}]"
            v-loading="loading"
            element-loading-text="数据加载中"
            element-loading-spinner="el-icon-loading"
            :element-loading-background="$store.getters.loadingColor">
            <el-table-column v-for="(item, index) in tableHead"
              :key="(index + item.title)"
              align="center"
              :fixed="item.fixed"
              :prop="item.field"
              :label="item.title"
              :formatter="formatter"
              :min-width="item.width">
              <template slot="header" slot-scope="scope">
                <el-switch v-if="item.field === 'index' && ![1, 2, 9, 10].includes(queryValue.statisType)"
                  v-model="switchTab"
                  class="switch-tab"
                  inactive-color="#ff4949">
                </el-switch>
                <span :keys="scope" v-html="item.title"></span>
              </template>
              <template v-if="Array.isArray(item.children)">
                <el-table-column v-for="(child, child_index) in item.children"
                  :key="child_index"
                  align="center"
                  :prop="child.field"
                  :formatter="formatter"
                  :label="child.title"
                  :min-width="child.width" />
              </template>
            </el-table-column>
          </el-table>
          <el-pagination class="page-container"
            v-show="isShowPage"
            @size-change="current = 1, query(null, true), handleTableScrollHeight('configurationTable')"
            @current-change="query(null, true), handleTableScrollHeight('configurationTable')"
            background
            :current-page.sync="current"
            :page-sizes="sizes"
            :page-size.sync="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="数据图表" :style="{height: mixinHeight - 55 + 'px', paddingTop: '20px'}">
          <ve-line
            height="100%"
            v-if="tabs === '1'"
            ref="chart"
            :data="chart.data"
            :settings="chart.settings"
            :legend="chart.legend"
            :toolbox="chart.toolbox"
            :extend="chart.extend"
            :data-zoom="chart.dataZoom"
            :grid="chart.grid"
            :tooltip="chart.tooltip"
            :loading="chart.loading">
          </ve-line>
        </el-tab-pane>
      </el-tabs>
      <el-dialog
        title="选择报表模板"
        class="model-dialog"
        :visible.sync="showDialog">
        <viewer class="pic-container WH">
          <el-card class="picture" v-for="(item, index) in prepareImg" :key="index" :body-style="{ padding: '0px' }">
            <img :src="item.src" :alt="item.previewText" title="查看预览">
            <div class="text-bar">
              <p>{{ item.previewText }}</p>
              <el-button type="primary" size="small" :loading="item.loading" @click="exportDayAndMonth(item)">导出</el-button>
            </div>
          </el-card>
          <div v-if="!prepareImg.length" class="not">
            暂无模板，可能原因：<br/>
            1.请选择监控点<br/>
            2.该监控点暂无类型，请到监控点配置设置该监控点类型
          </div>
        </viewer>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Point from '@/components/Point'
import customTime from './components/customTime'
import resizeMixin from '@/mixins/resize'
import chart from './mixin/chart'
import page from '@/mixins/page'
import tableScrollHeight from '@/mixins/tableScrollHeight'
import { parseTime, getCountDays, comSerial, downFile, computedWidth, tableHeadTab, setTableHeadBr, getType, cached } from '@/utils'

// 格式化列表的超标和数据状态
function formatExcessAndState (retFlag, flag) {
  const obj = {}
  retFlag.split(',').forEach(e => {
    const [name, excess] = e.split('_')
    obj[name] = { excess }
  })
  flag.split(',').forEach(e => {
    const [ name, state ] = e.split('_')
    let old = obj[name] || {}
    obj[name] = { ...old, state }
  })
  return obj
}

export default {
  name: 'DataQuery',
  components: { Point, customTime },
  mixins: [resizeMixin, chart, page, tableScrollHeight],
  data () {
    return {
      current: 1,
      size: 10,
      total: 0,
      tableData: [],
      tableTitle: [],
      tabs: '0',
      loading: false,
      exportLoading: false,
      switchTab: true,
      showDialog: false,
      queryValue: {
        beginTime: new Date(`${parseTime(undefined, '{y}-{m}-{d}')} 00:00:00`),
        endTime: new Date(`${parseTime(undefined, '{y}-{m}-{d}')} 23:59:59`),
        statisType: 1
      },
      statisTypeArr: [
        { label: '实时数据', value: 1 },
        { label: '分钟数据', value: 8 },
        { label: '小时数据', value: 7 },
        { label: '日数据', value: 6 },
        { label: '月度数据', value: 5 },
        { label: '季度数据', value: 3 },
        { label: '年度数据', value: 4 },
        { label: '超标数据', value: 2 },
        { label: '日报表', value: 9 },
        { label: '月报表', value: 10 }
      ],
      prepareImg: []
    }
  },
  created () {
    // 接收从别的页面传过来的参数
    !!this.$route.query.statisType && (this.queryValue.statisType = Number(this.$route.query.statisType))
    this.query(this.queryValue)
  },
  activated () {
    this.notFirstView(_ => {
      if ((this.query.$pointId !== this.$store.getters.pointCheck.id) || this.$route.query.isQuery) {
        // 接收从别的页面传过来的参数
        !!this.$route.query.statisType && (this.queryValue.statisType = Number(this.$route.query.statisType))
        this.check()
      }
    })
  },
  watch: {
    'queryValue.statisType' (val, od) {
      const queryValue = this.queryValue
      const year = new Date().getFullYear()
      const month = new Date().getMonth() + 1
      switch (val) {
        // 实时、超标、分钟、小时，默认获取当天时间
        case 1:
        case 2:
        case 8:
        case 7:
          queryValue.beginTime = new Date(`${parseTime(undefined, '{y}-{m}-{d}')} 00:00:00`)
          queryValue.endTime = new Date(`${parseTime(undefined, '{y}-{m}-{d}')} 23:59:59`)
          break
        // 日数据默认获取当前一个月时间
        case 6:
          queryValue.beginTime = new Date(`${year}-${month}-01 00:00:00`)
          queryValue.endTime = new Date(`${year}-${month}-${getCountDays(year, month)} 23:59:59`)
          break
        // 月、季度默认获取当前一年
        case 3:
        case 5:
          queryValue.beginTime = new Date(`${year}-01-01 00:00:00`)
          queryValue.endTime = new Date(`${year}-12-${getCountDays(year, 12)} 23:59:59`)
          break
        // 年数据默认获取前三年时间
        case 4:
          queryValue.beginTime = new Date(`${year - 3}-01-01 00:00:00`)
          queryValue.endTime = new Date(`${year}-12-${getCountDays(year, 12)} 23:59:59`)
          break
        // 日报表，默认获取当天时间
        case 9:
          queryValue.beginTime = new Date(`${parseTime(undefined, '{y}-{m}-{d}')} 00:00:00`)
          queryValue.endTime = new Date(`${parseTime(undefined, '{y}-{m}-{d}')} 23:59:59`)
          break
        // 月报表，默认获得当月
        case 10:
          queryValue.beginTime = new Date(`${year}-${month}-01 00:00:00`)
          queryValue.endTime = new Date(`${year}-${month}-${getCountDays(year, month)} 23:59:59`)
          break
      }
      this.check()
      // this.query(queryValue)
    },
    tabs (val) {
      this.tabQuery()
    },
    async tableHead () {
      await this.$nextTick()
      this.table.doLayout && this.table.doLayout()
    }
  },
  computed: {
    table () {
      return this.$refs.configurationTable || {}
    },
    tableHead () {
      let head = []
      const not = [1, 2]
      if (!not.includes(this.queryValue.statisType) && this.switchTab) {
        // 只显示平均值
        head = tableHeadTab(this.tableTitle, ['index', 'dataTime'])
      } else if (not.includes(this.queryValue.statisType)) {
        // 全部显示
        head = this.tableTitle.map(e => {
          return {
            ...e,
            title: setTableHeadBr(e.title)
          }
        })
      } else {
        // 全部显示
        head = this.tableTitle
      }
      return head
    },
    // 日报表和月报表不需要显示分页组件
    isShowPage () {
      if ([9, 10].includes(this.queryValue.statisType)) {
        return false
      }
      return true
    },
    // 表格数据转对象
    tableHeadObj () {
      let head = [...this.tableTitle]
      head.splice(0, 1)
      return head.reduce((prev, { field, title, children }) => {
        let child = null
        if (children && Array.isArray(children)) {
          child = children.find(e => e.field.indexOf('avg') >= 0)
          child = child ? { [child.field]: title } : null
          if (child) {
            return { ...prev, ...child }
          }
        }
        return { ...prev, [field]: title }
      }, {})
    }
  },
  methods: {
    // 统一查询数据
    // tab: 只在切换页码的传
    async query (params, tab) {
      let { id: pointId } = await this.$store.dispatch('IsPointLoad')
      if (!pointId) return false
      this.query.$pointId = pointId
      let _query = this.query
      if (params) {
        params = {...params}
        params = this.handleData(params)
        if (!params) return false
        _query.$params = {..._query.$params, ...params}
        this.current = 1
      }
      this.loading = true
      delete _query.$params.poiId
      delete _query.$params.pointId
      _query.$params = {
        ...(_query.$params || {}),
        current: this.current,
        size: this.size,
        [this.queryValue.statisType === 1 ? 'poiId' : 'pointId']: pointId
      }

      let api = this.getApiList(this.queryValue.statisType)
      if (this.queryValue.statisType === 1) {
        delete _query.$params.statisType
      }

      let res = null
      if (!tab) {
        if (!this.isShowPage) {
          // 日报表 月报表
          // TODO
          res = await Promise.all([
            this.queryHead(api.head, _query.$params),
            this.queryDayAndMonth(api.data, _query.$params)
          ])
          this.queryCharDayAndMonth()
          res = true
        } else {
          if (this.tabs === '0') {
            res = await Promise.all([
              this.queryHead(api.head, _query.$params),
              this.queryData(api.data, _query.$params)
            ])
          } else {
            res = await Promise.all([
              this.queryChart(api.chart, _query.$params)
            ])
          }
        }
      } else {
        res = await Promise.all([
          this.queryData(api.data, _query.$params)
        ])
      }
      this.$isRepeat(res, () => {
        this.loading = false
      })
    },
    getApiList (type) {
      let api = {}
      if (type === 1) {
        // 实时数据
        api = {
          head: 'busRtdDataTableHead',
          data: 'busRtdDataList',
          chart: 'busRtdDataCharts'
        }
      } else if (!this.isShowPage) {
        // 日报表 月报表
        api = {
          head: 'busHisDataTableHead',
          data: 'busHisDataSelectData'
        }
      } else {
        // 统计数据
        api = {
          head: 'busHisDataTableHead',
          data: 'busHisDataList',
          chart: 'busHisDataCharts'
        }
      }
      return api
    },
    // 监控点选中
    check () {
      this.tableTitle = []
      this.chart.data.columns = []
      this.query(this.queryValue)
    },
    tabQuery () {
      if (this.tabs === '0' && this.tableTitle.length) {
        return false
      } else if (this.tabs === '1' && this.chart.data.columns.length) {
        return false
      }
      this.query(this.queryValue)
    },
    // 查询表头
    async queryHead (api, params) {
      let res = null
      params = {
        [!params.statisType ? 'poiId' : 'pointId']: params[!params.statisType ? 'poiId' : 'pointId'],
        statisType: params.statisType
      }
      try {
        res = await this.$api[api](params)
        if (res.state === 0) {
          res.data = res.data || []
          let timeBar = res.data.find(e => e.field === 'dataTime')
          if (timeBar) {
            timeBar.fixed = 'left'
          }
          res.data = computedWidth(res.data, ['dataTime'])
          res.data.length && res.data.unshift({ field: 'index', title: '序号', width: 51, fixed: 'left' })
          this.tableTitle = Object.freeze(res.data)
        }
      } catch (error) {
        res = error
      }
      return res
    },
    cachedFormat: cached(formatExcessAndState),
    // 查询表数据
    async queryData (api, params) {
      let res = null
      try {
        res = await this.$api[api](params)
        if (res.state === 0) {
          res.data.rows = res.data.rows || []
          this.tableData = Object.freeze(res.data.rows.map((e, k) => {
            let { retFlag = '', flag = '' } = e
            for (const key in e) {
              let obj = e[key]
              if (key !== 'retFlag' && key !== 'flag' && key.indexOf('_') >= 0) {
                const match = this.cachedFormat(retFlag, flag)
                const matchKey = match[key.split('_')[1]]
                if (matchKey) {
                  const { excess, state } = matchKey
                  if (state >= 0) {
                    obj = `${obj}(T)`
                  } else if (excess !== 'N' && excess !== 'T' && excess) {
                    obj = `${obj}(${excess})`
                  }
                }
                e[key.toLowerCase()] = obj
              }
            }
            if (params.statisType === 3) {
              e.dataTime = this.getQuarter(e.dataTime)
            }
            return {
              ...e,
              index: comSerial(this.current, this.size, k)
            }
          }))
        }
        this.total = res.data.total
      } catch (error) {
        res = error
      }
      return res
    },
    // 查询日报表和月报表
    async queryDayAndMonth (api, params) {
      let res = null
      params = {...params}
      delete params.current
      delete params.size
      try {
        res = await this.$api[api](params)
        if (res.state === 0) {
          if (params.statisType === 10) {
            this.tableData = res.data.dataList.map(e => {
              return {
                ...e,
                dataTime: e.dataTime ? `${e.dataTime}日` : e.dataTime
              }
            })
          } else {
            this.tableData = res.data.dataList || []
          }
          const avg = { dataTime: '平均值' }
          const max = { dataTime: '最大值' }
          const min = { dataTime: '最小值' }
          for (const [key, value] of Object.entries(res.data.total)) {
            const [vk, mark] = key.split('_')
            if (mark.indexOf('avg') >= 0) {
              avg[`${vk}_avg`] = value || 0
            } else if (mark.indexOf('max') >= 0) {
              max[`${vk}_avg`] = value || 0
            } else if (mark.indexOf('min') >= 0) {
              min[`${vk}_avg`] = value || 0
            }
          }
          this.tableData = [...this.tableData, avg, max, min]
          this.total = 1
        } else {
          this.$message.error('数据列表查询失败')
        }
      } catch (err) {
        res = err
      }
      return res
    },
    // 查询图表的日报表和月报表
    queryCharDayAndMonth () {
      // this.chart.data.columns
      const columns = this.tableTitle.map(e => e.title.replace(/\(.*\)/, ''))
      columns.splice(0, 1)
      this.chart.data.columns = columns
      // this.tableHeadObj
      const obj = {}
      for (const [, value] of Object.entries(this.tableHeadObj)) {
        obj[value.replace(/\(.*\)/, '')] = '-'
      }
      // this.chart.data.rows
      const rows = this.tableData
        .map(e => {
          const cObj = { ...obj }
          for (const [key, value] of Object.entries(e)) {
            if (this.tableHeadObj[key]) {
              cObj[this.tableHeadObj[key].replace(/\(.*\)/, '')] = typeof value === 'string' ? value.replace(/\(.*\)/, '') : value
            }
          }
          return { ...cObj }
        })
        .filter(e => !['最大值', '平均值', '最小值'].includes(e['数据时间']))
      this.chart.data.rows = rows
    },
    // 获取 xxxx年季度
    getQuarter (str) {
      const quarter = ['', '一', '二', '三', '四']
      let arr = str.split('-')
      return `${arr[0]}第${quarter[Math.ceil(arr[1] / 3)]}季度`
    },
    // 查询图表
    async queryChart (api, params) {
      this.chart.loading = true
      params = {...params}
      delete params.current
      delete params.size
      try {
        this.chart.data.columns = []
        this.chart.data.rows = []
        let res = await this.$api[api](params)
        if (res.state === 0) {
          let data = this.chart.data
          if (!params.statisType) {
            data.columns = res.data.pols
            data.rows = res.data.datatime.map((e, k) => {
              let d = data.columns.reduce((prev, c, ck) => {
                prev[c] = res.data.datas[ck][k] || 0
                return prev
              }, {})
              return {
                X: e || k,
                ...d
              }
            })
            res.data.pols.unshift('X')
          } else {
            data.columns = res.data.pollNames
            data.rows = res.data.dataTime.map((e, k) => {
              let d = res.data.item.reduce((prev, c, ck) => {
                prev[c.pollName] = c.data[k] || 0
                return prev
              }, {})
              if (params.statisType === 3) {
                e = e ? this.getQuarter(e) : k
              }
              return {
                X: e,
                ...d
              }
            })
            res.data.pollNames.unshift('X')
          }
        }
        this.chart.loading = false
      } catch (error) {
        this.$isRepeat(error, () => {
          this.chart.loading = false
        })
      }
      return true
    },
    // 处理入参
    handleData (params) {
      params = {...params}
      let { beginTime, endTime } = params
      if (!beginTime || !endTime) {
        this.$message.error('请补充完开始时间或结束时间')
        return false
      }
      let endYear = endTime.getFullYear()
      let endMonth = endTime.getMonth() + 1
      // 处理入参
      switch (params.statisType) {
        // 日数据
        case 6:
          params.beginTime = `${parseTime(beginTime, '{y}-{m}-{d}')} 00:00:00`
          params.endTime = `${parseTime(endTime, '{y}-{m}-{d}')} 23:59:59`
          break
        // 月
        case 5:
          params.beginTime = `${parseTime(beginTime, '{y}-{m}')}-01 00:00:00`
          params.endTime = `${parseTime(endTime, '{y}-{m}')}-${getCountDays(endYear, endMonth)} 23:59:59`
          break
        // 年
        case 4:
          params.beginTime = `${parseTime(beginTime, '{y}')}-01-01 00:00:00`
          params.endTime = `${parseTime(endTime, '{y}')}-12-${getCountDays(endYear, endMonth)} 23:59:59`
          break
        default:
          params.beginTime = parseTime(beginTime)
          params.endTime = parseTime(endTime)
          break
      }
      return params
    },
    async exportTable (params) {
      // 9:日数据 10:月数据
      if (!this.isShowPage) {
        this.showDialog = true
        // 32水类 31气类
        const poiTypeSelect = { 32: { text: '废水', img: 'water' }, 31: { text: '废气', img: 'gas' } }
        const { poiType } = this.$store.getters.pointCheck
        const check = poiTypeSelect[poiType]
        const defObj = { loading: false }
        if (check) {
          if (this.queryValue.statisType === 9) {
            if (poiType === '31') {
              this.prepareImg = [
                { src: require(`@img/${check.img}-dayTable-1.jpg`), tempType: 1, previewText: `${check.text}平均日报表-1`, ...defObj },
                { src: require(`@img/${check.img}-dayTable-2.jpg`), tempType: 2, previewText: `${check.text}平均日报表-2`, ...defObj },
                { src: require(`@img/${check.img}-dayTable-3.jpg`), tempType: 3, previewText: `${check.text}平均日报表-3`, ...defObj }
              ]
            } else {
              this.prepareImg = [
                { src: require(`@img/${check.img}-dayTable-1.jpg`), tempType: 1, previewText: `${check.text}平均日报表-1`, ...defObj }
              ]
            }
          } else if (this.queryValue.statisType === 10) {
            if (poiType === '31') {
              this.prepareImg = [
                { src: require(`@img/${check.img}-monthTable-1.jpg`), tempType: 1, previewText: `${check.text}平均月报表-1`, ...defObj },
                { src: require(`@img/${check.img}-monthTable-2.jpg`), tempType: 2, previewText: `${check.text}平均月报表-2`, ...defObj },
                { src: require(`@img/${check.img}-monthTable-3.jpg`), tempType: 3, previewText: `${check.text}平均月报表-3`, ...defObj }
              ]
            } else {
              this.prepareImg = [
                { src: require(`@img/${check.img}-monthTable-1.jpg`), tempType: 1, previewText: `${check.text}平均月报表-1`, ...defObj }
              ]
            }
          }
        }
      } else {
        this.exportLoading = true
        let { id: pointId } = await this.$store.dispatch('IsPointLoad')
        if (!pointId) {
          this.exportLoading = false
          return false
        }
        params = this.handleData(params)
        if (!params) {
          this.exportLoading = false
          return false
        }
        params[params.statisType === 1 ? 'poiId' : 'pointId'] = this.$store.getters.pointCheck.id
        params.statisType === 1 && delete params.statisType
        this.$message('正在导出报表中...')
        delete params.current
        delete params.size
        let api = !params.statisType ? 'busRtdDataExpRtd' : 'busHisDataExpRtd'
        let state = this.statisTypeArr.find(e => e.value === this.queryValue.statisType)
        try {
          let res = await this.$api[api](params)
          if (getType(res) === 'Blob') {
            downFile(res, `数据查询-${state.label}${new Date().getTime()}.xls`)
          } else {
            this.$message.error('导出失败')
          }
          this.exportLoading = false
        } catch (error) {
          this.$isRepeat(error, () => {
            this.exportLoading = false
          })
        }
      }
    },
    // 导出日报表和月报表
    async exportDayAndMonth (row) {
      if (row.loading) return
      const queryValue = this.queryValue
      if (!queryValue.beginTime || !queryValue.endTime) {
        this.$message.error('请补充完开始时间或结束时间')
        return
      }
      row.loading = true
      this.$message('正在导出报表中...')
      let params = {
        ...queryValue,
        beginTime: parseTime(queryValue.beginTime),
        endTime: parseTime(queryValue.endTime),
        pointId: this.$store.getters.pointCheck.id,
        tempType: row.tempType
      }
      let state = this.statisTypeArr.find(e => e.value === this.queryValue.statisType)
      try {
        const res = await this.$api.busHisDataExport(params)
        if (getType(res) === 'Blob') {
          downFile(res, `数据查询-${state.label}-${row.previewText}-${new Date().getTime()}.xls`)
        } else {
          this.$message.error('导出失败')
        }
        row.loading = false
      } catch (err) {
        this.$isRepeat(err, () => {
          row.loading = false
        })
      }
    },
    // 根据污染物是否超标而变红色
    setColor ({ column, row }) {
      try {
        let { property } = column
        let { retFlag = '', flag = '' } = row
        const match = this.cachedFormat(retFlag, flag)
        const { state } = match[property.split('_')[1]]
        // flag = flag.split(',')
        return state >= 0 ? { 'color': 'red' } : {}
      } catch (error) {
        return {}
      }
    },
    formatter (row, { property }, cellValue, index) {
      if (property === 'index') {
        return index + 1
      }
      return cellValue === undefined ? '-' : cellValue
    }
  }
}
</script>

<style lang="scss" scoped>
.data-query {
  .select {
    width: 100px;
  }
  .data-query-left {
    height: 100%;
  }
  .data-query-right {
    height: 100%;
  }
  /deep/ .el-tabs__content {
    padding: 3px;
  }
  .switch-tab {
    line-height: 0;
    padding: 0;
    display: block;
  }
  .model-dialog {
    .pic-container {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      .picture {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 200px;
        width: 200px;
        overflow: hidden;
        &:nth-child(2n) {
          margin-left: 10px;
        }
        img {
          width: 100%;
          height: 200px;
          cursor: pointer;
        }
        .text-bar {
          padding: 6px;
          text-align: center;
          p {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 4px;
          }
        }
      }
    }
  }
}
</style>

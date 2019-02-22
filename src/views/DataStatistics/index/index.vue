<template>
  <div class="data-integrity WH"
    v-resize="mixinResize"
    ref="container">
    <div class="query-container clearfix"
      ref="queryContainer"
      onselectstart="return false">
      <query-bar label="时间：">
        <el-date-picker v-model="params.dataTime"
          :type="dateType"
          size="mini"
          class="w120"
          value-format="yyyy/MM/dd"
          placeholder="选择时间">
        </el-date-picker>
      </query-bar>
      <query-bar label="类型：">
        <el-select v-model="params.poiType"
          size="mini"
          class="w80"
          @change="query(params)"
          placeholder="选择类型">
          <el-option v-for="(item, index) in $store.state.codeData.st"
            :key="index"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </query-bar>
      <query-bar label="省市区：">
        <el-cascader class="cascader w180"
          expand-trigger="hover"
          :options="city"
          :props="cascaderProps"
          @change="query(params)"
          clearable
          size="mini"
          v-model="params.areaId" />
      </query-bar>
      <query-bar label="企业：">
        <el-input v-model="params.comName" @keyup.enter.native="query(params)" size="mini" placeholder="输入企业名称"></el-input>
      </query-bar>
      <query-bar label="监控点：">
        <el-input v-model.trim="params.poiName" @keyup.enter.native="query(params)" size="mini" placeholder="输入监控点名称"></el-input>
      </query-bar>
      <query-bar label="MN号：">
        <el-input v-model.trim="params.poiNum" @keyup.enter.native="query(params)" size="mini" placeholder="输入MN号"></el-input>
      </query-bar>
      <query-bar>
        <base-btn type="search"
          class="btn"
          @click="query(params)" />
        <base-btn type="export"
          class="btn"
          @click="exportTableDay"
          :loading="exportLoading"
          v-show="tabs !== '1'" />
      </query-bar>
    </div>
    <el-tabs type="border-card"
      class="custom-tabs WH"
      :style="{ height: `${mixinHeight - 6}px` }"
      v-model="tabs">
      <el-tab-pane label="日">
        <day :loadingProp.sync="dataList[0].loading" :data="dataList[0].data" :params="dataList[0].params" @query="query" ref="day"></day>
      </el-tab-pane>
      <el-tab-pane label="月">
        <month :loadingProp.sync="dataList[1].loading" :data="dataList[1].data" :params="dataList[1].params" @query="query" ref="month"></month>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import resizeMixin from '@/mixins/resize'
import city from '@/utils/city'
import components from './components'
import { getDate, getType, downFile } from '@/utils'
export default {
  name: 'DataIntegrity',
  mixins: [resizeMixin],
  components: { ...components },
  data () {
    return {
      params: {
        dataTime: getDate({ timestamp: new Date().getTime() - 24 * 60 * 60 * 1000, format: 'yyyy/MM/dd' }),
        poiType: '',
        areaId: [],
        comName: '',
        poiName: '',
        poiNum: ''
      },
      tabs: '0',
      cascaderProps: {
        value: 'id',
        label: 'text'
      },
      city: Object.freeze(city),
      exportLoading: false,
      dataList: [
        { loading: false, isFirst: true, data: [], api: 'statisDataCompDayList', errMsg: '日列表查询失败', params: {} },
        { loading: false, isFirst: true, data: [], api: 'statisDataCompMonthList', errMsg: '月列表查询失败', params: {} }
      ]
    }
  },
  mounted () {
    this.query(this.params)
  },
  watch: {
    tabs () {
      this.mixinResize()
      // TODO
      if (this.dataList[this.tabs].isFirst) this.query(this.params)
    }
  },
  computed: {
    tabsData () {
      switch (this.tabs) {
        case '0':
          return () => this.$refs.day
        case '1':
          return () => this.$refs.month
      }
    },
    dateType () {
      const typeObj = {
        0: 'date',
        1: 'month'
      }
      return typeObj[this.tabs]
    }
  },
  methods: {
    async query (params) {
      if (!this.params.dataTime) {
        this.$message.error('请选择时间')
        return
      }
      const tabsData = this.tabsData()
      const ckData = this.dataList[this.tabs]
      ckData.loading = true
      ckData.isFirst = false
      if (params) {
        this.query.$params = { ...params }
        this.query.$params.areaId = this.query.$params.areaId.length ? this.query.$params.areaId[this.query.$params.areaId.length - 1] : ''
        ckData.params = this.query.$params
        if (tabsData) tabsData.current = 1
      }
      let rParams = {}
      if (tabsData) {
        const { size, current } = tabsData
        rParams = { ...this.query.$params, size, current }
      } else {
        rParams = { ...this.query.$params, size: 1, current: 10 }
      }
      if (this.tabs === '1') {
        delete rParams.dataTime
      }

      try {
        const res = await this.$api[ckData.api](rParams)
        if (res.state === 0) {
          if (this.tabs === '1') {
            const pre = { loading: false, children: [], expandLoading: false }
            ckData.data = res.data.records.map(e => {
              return {
                ...e,
                ...pre
              }
            })
          } else {
            ckData.data = res.data.records
          }
          tabsData.total = res.data.total
        } else {
          this.$message.errro(ckData.errMsg)
        }
        ckData.loading = false
      } catch (err) {
        this.$isRepeat(err, () => {
          ckData.loading = false
        })
      }
    },
    // 导出日数据
    async exportTableDay () {
      if (!this.params.dataTime) {
        this.$message.error('请选择时间')
        return
      }
      this.exportLoading = true
      let params = { ...this.params }
      let { areaId } = params
      areaId = areaId.length ? areaId[areaId.length - 1] : ''
      params.areaId = areaId

      this.$message(`正在导出报表...`)

      try {
        const res = await this.$api.statisDataComExport(params)
        if (getType(res) === 'Blob') {
          downFile(res, `数据完整率-日数据-${new Date().getTime()}.xls`)
          this.$message.success('导出成功')
        } else {
          this.$message.error('导出失败')
        }
      } catch (err) {
        console.log(err)
      }
      this.exportLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.w120 {
  width: 120px !important;
}
.w80 {
  width: 80px !important;
}
.w180 {
  width: 180px !important;
}
</style>


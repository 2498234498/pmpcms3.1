<template>
  <div class="data-integrity WH"
    v-resize="mixinResize"
    ref="container">
    <div class="query-container clearfix"
      ref="queryContainer"
      onselectstart="return false">
      <query-bar label="时间：">
        <el-date-picker v-model="params.time"
          :type="dateType"
          size="mini"
          class="w120"
          placeholder="选择时间">
        </el-date-picker>
      </query-bar>
      <query-bar label="类型：">
        <el-select v-model="params.type"
          size="mini"
          class="w80"
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
          change-on-select
          clearable
          size="mini"
          v-model="params.address" />
      </query-bar>
      <query-bar label="企业：">
        <el-input v-model="params.enterprise" size="mini" placeholder="输入企业名称"></el-input>
      </query-bar>
      <query-bar label="监控点：">
        <el-input v-model.trim="params.pointName" size="mini" placeholder="输入监控点名称"></el-input>
      </query-bar>
      <query-bar label="MN号：">
        <el-input v-model.trim="params.mn" size="mini" placeholder="输入MN号"></el-input>
      </query-bar>
      <query-bar>
        <base-btn type="search"
          class="btn"
          @click="query(params)" />
        <base-btn type="export"
          class="btn"
          :loading="exportLoading"
          v-show="tabs !== '1'" />
      </query-bar>
    </div>
    <el-tabs type="border-card"
      class="custom-tabs WH"
      :style="{ height: `${mixinHeight - 6}px` }"
      v-model="tabs">
      <el-tab-pane label="日">
        <day :loadingProp.sync="dataList[0].loading" :data="dataList[0].data" :params="params" @query="query" ref="day"></day>
      </el-tab-pane>
      <el-tab-pane label="月">
        <month :loadingProp.sync="dataList[0].loading" :data="dataList[0].data" :params="params" @query="query" ref="month"></month>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import resizeMixin from '@/mixins/resize'
import city from '@/utils/city'
import components from './components'
import { getDate } from '@/utils'
export default {
  name: 'DataIntegrity',
  mixins: [resizeMixin],
  components: { ...components },
  data () {
    return {
      params: {
        time: new Date(getDate({timestamp: new Date().getTime() - 24 * 60 * 60 * 1000})),
        type: '',
        address: [],
        enterprise: '',
        pointName: '',
        mn: ''
      },
      tabs: '0',
      cascaderProps: {
        value: 'id',
        label: 'text'
      },
      city: Object.freeze(city),
      exportLoading: false,
      dataList: [
        { loading: false, isFirst: true, data: [] },
        { loading: false, isFirst: true, data: [] }
      ]
    }
  },
  created () {
    // TODO
    // this.query(this.params)
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
    query (params) {
      const tabsData = this.tabsData()
      const ckData = this.dataList[this.tabs]
      ckData.loading = true
      ckData.isFirst = false
      if (params) {
        this.query.$params = params
        if (tabsData) tabsData.current = 1
      }
      let rParams = {}
      if (tabsData) {
        const { size, current } = tabsData
        rParams = { ...this.query.$params, size, current }
      } else {
        rParams = { ...this.query.$params, size: 1, current: 10 }
      }
      console.log(rParams)
      // TODO
      setTimeout(() => {
        ckData.loading = false
      }, 1000)
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


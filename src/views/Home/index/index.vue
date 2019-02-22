<template>
  <div class="container WH" v-resize="mixinResize" ref="container">
    <div class="query-container clearfix" ref="queryContainer" onselectstart="return false">
      <query-bar label="排放类型：">
        <el-select v-model="params.st" class="select" @change="query()" size="mini">
          <el-option
            v-for="item in $store.state.codeData.st"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </query-bar>
      <query-bar label="监控级别：">
        <el-select size="mini" v-model="params.monitorTypeId" @change="query()" class="select">
          <el-option
            v-for="item in $store.state.codeData.monitorType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </query-bar>
      <query-bar label="站点名称：">
        <el-input size="mini" v-model="params.pointName" @keyup.enter.native="query()" class="input" placeholder="输入站点名称"></el-input>
      </query-bar>
      <query-bar label="MN号：">
        <el-input size="mini" v-model="params.mn" @keyup.enter.native="query()" class="input" placeholder="输入MN号"></el-input>
      </query-bar>
      <query-bar label="行业类型：">
        <el-select size="mini" v-model="params.comIndustryId" @change="query()" class="comIndustry">
          <el-option
            v-for="item in comIndustryList"
            :key="item.indId"
            :label="item.indName"
            :value="item.indId"
          />
        </el-select>
      </query-bar>
      <query-bar>
        <base-btn type="search" class="btn" @click="query()"></base-btn>
      </query-bar>
      <query-bar class="state">
        <div class="num"
          v-for="(item, index) in stateArr"
          :key="item.class">
          <span :class="item.class" @click="selectState(index)" :style="style[index]">{{item.name}}</span>
          <countTo :startVal='startVal' :endVal='item.num' :duration='duration'></countTo>
        </div>
      </query-bar>
    </div>
    <el-tabs type="border-card" class="tab" v-model="activeName">
      <el-tab-pane label="数据列表" :style="{height: mixinHeight - 60 + 'px'}" name="dataList">
        <el-table
          :data="tableData"
          border
          class="table"
          ref="configurationTable"
          :height="mixinHeight - 70 - ( statisShow ? 280 : 0 )"
          highlight-current-row
          style="width: 100%"
          :cell-style="setColor"
          @row-dblclick="rowDblclick"
          :class="['configurationTable', {afterRenderClass: mixinShowAfterRenderClass}]"
          v-loading="loading"
          element-loading-text="数据加载中"
          element-loading-spinner="el-icon-loading"
          :element-loading-background="$store.getters.loadingColor"
        >
          <el-table-column
            v-for="(item, index) in tableHead"
            :key="index"
            align="center"
            :prop="item.field"
            :label="item.title"
            :min-width="item.width"
          >
            <template v-if="Array.isArray(item.children)">
              <el-table-column v-for="(child, child_index) in item.children"
                :key="child_index"
                align="center"
                :prop="child.field"
                :label="child.title"
                :min-width="child.width">
                <template slot-scope="scope">
                  <span title="双击查看详情" style="display: block;">{{ scope.row[item.field] }}</span>
                </template>
              </el-table-column>
            </template>
            <template v-slse slot-scope="{ row }">
              <span title="双击查看详情" style="display: block;">{{ row[item.field] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="数据地图" :style="{height: mixinHeight - 80 + 'px'}" name="dataChart">
        <ve-bmap
          ref="bmap"
          v-if="'dataChart' === activeName"
          :settings="settings"
          height="100%"
          :series="series"
          :after-set-option-once="afterSet"
          :loading="loadingEcharts"
        >
          <div class="search-bar">
            <label>搜索MN号：</label>
            <el-select
              class="search"
              v-model="search"
              size="mini"
              filterable
              placeholder="请选择MN号"
              @change="selectMN"
            >
              <el-option
                v-for="(item, index) in MNList"
                :key="index"
                :label="item.mn"
                :value="item.value"
              />
            </el-select>
          </div>
        </ve-bmap>
      </el-tab-pane>
    </el-tabs>
    <statistics :show.sync="statisShow">
      <industry-statistics :loading="loading" :data="industryStaData" slot="left"></industry-statistics>
      <industry-type :loading="loading" :data="tableData" slot="cent"></industry-type>
      <last-data slot="right"></last-data>
    </statistics>
  </div>
</template>

<script>
import resizeMixin from '@/mixins/resize'
import map from './mixin/map'
import countTo from 'vue-count-to'
import Statistics from './components/Statistics'
export default {
  name: 'Home',
  mixins: [resizeMixin, map],
  components: {
    countTo,
    Statistics,
    IndustryStatistics: resolve => require(['./components/IndustryStatistics'], resolve),
    IndustryType: resolve => require(['./components/IndustryType'], resolve),
    LastData: resolve => require(['./components/LastData'], resolve)
  },
  data () {
    return {
      statisShow: true,
      startVal: 0,
      duration: 1000,
      styleArr: Object.freeze([
        { color: '#fff', background: '#409eff' },
        { color: '#fff', background: '#67c23a' },
        { color: '#fff', background: 'gray' },
        { color: '#fff', background: 'red' },
        { color: '#fff', background: 'orange' }
      ]),
      style: Object.freeze([
        { color: '#fff', background: '#409eff' }
      ]),
      activeName: 'dataList',
      loading: false,
      loadingEcharts: false,
      params: {
        st: '',
        monitorTypeId: '',
        onlineStatus: '',
        dataStatus: '',
        pointName: '',
        mn: '',
        comIndustryId: ''
      },
      onlineStatusArr: Object.freeze([
        { label: '全部', value: '' },
        { label: '在线', value: 'ONLINE' },
        { label: '离线', value: 'OFFLINE' }
      ]),
      dataStatusArr: Object.freeze([
        { label: '全部', value: '' },
        { label: '正常', value: 'N' },
        { label: '超标', value: 'T' },
        { label: '故障', value: 'D' }
      ]),
      tableData: [],
      stateArr: [
        { class: 'total', endVal: 'total', name: '总数', num: 0 },
        { class: 'online', endVal: 'online', name: '在线', num: 0 },
        { class: 'offline', endVal: 'offline', name: '离线', num: 0 },
        { class: 'overproof', endVal: 'over', name: '超标', num: 0 },
        { class: 'destory', endVal: 'destory', name: '故障', num: 0 }
      ],
      tableHead: [],
      waterTableHead: Object.freeze([
        { field: 'w00000', title: '污水', width: 100, children: [{ field: 'w00000', title: 'L/S' }] },
        { field: 'w01001', title: 'PH值', width: 100, children: [{ field: 'w01001', title: '' }] },
        { field: 'w01018', title: 'cod', width: 100, children: [{ field: 'w01018', title: 'mg/L' }] },
        { field: 'w21003', title: '氨氮', width: 100, children: [{ field: 'w21003', title: 'mg/L' }] }
      ]),
      airTableHead: Object.freeze([
        { field: 'a00000', title: '废气', width: 100, children: [{ field: 'a00000', title: 'm3/s' }] },
        { field: 'a34013', title: '烟尘', width: 100, children: [{ field: 'a34013', title: 'mg/m3' }] },
        { field: 'a21026', title: '二氧化硫', width: 100, children: [{ field: 'a21026', title: 'mg/L' }] },
        { field: 'a21002', title: '氮氧化物', width: 100, children: [{ field: 'a21002', title: 'mg/m3' }] }
      ]),
      allTableHead: Object.freeze([
        { field: 'index', title: '序号', width: 50 },
        { field: 'companyName', title: '企业名称', width: 150 },
        { field: 'pointName', title: '站点名称', width: 150 },
        { field: 'monitorTypeName', title: '监控级别', width: 100 },
        { field: 'comIndustryName', title: '行业类型', width: 150 },
        { field: 'onlineStatus', title: '在线状态', width: 80 },
        { field: 'dataStatus', title: '数据状态', width: 80 },
        { field: 'dataTime', title: '最新数据时间', width: 154 }
      ]),
      comIndustryList: Object.freeze([{indName: '全部', indId: ''}])
    }
  },
  created () {
    this.query()
    this.sysIndustryList()
  },
  computed: {
    // 统计数据格式化
    dataFormat () {
      return (value, name) => {
        return { value, name }
      }
    },
    // 在线率统计数据
    industryStaData () {
      let data = new Array(3).fill([])
      try {
        const { total, online, offline, over, destory } = this.stateArr.reduce((prev, { endVal, name, num }) => {
          return { ...prev, [endVal]: this.dataFormat(num, name) }
        }, {})
        const normal = this.dataFormat(total.value - destory.value - over.value, '正常')
        data[0] = [total]
        data[1] = [destory, over, normal]
        data[2] = [online, offline]
      } catch (error) {
        data = new Array(3).fill([])
      }
      return data
    }
  },
  methods: {
    rowDblclick (row) {
      this.$router.push({ name: 'PointInfo', query: { id: row.pointId, isQuery: true } })
    },
    selectState (state) {
      this.params.onlineStatus = ''
      this.params.dataStatus = ''
      switch (state) {
        case 1:
          this.params.onlineStatus = 'ONLINE'
          break
        case 2:
          this.params.onlineStatus = 'OFFLINE'
          break
        case 3:
          this.params.dataStatus = 'T'
          break
        case 4:
          this.params.dataStatus = 'D'
          break
        default:
          break
      }
      this.changeStyle(state)
      this.query()
    },
    changeStyle (num) {
      this.style = this.styleArr.map((ele, index) => {
        return Object.is(index, num) ? ele : {}
      })
    },
    async query () {
      this.loading = true
      this.loadingEcharts = true
      this.search = ''
      try {
        // 表头
        switch (Number(this.params.st)) {
          case 0:
            this.tableHead = this.allTableHead
            break
          case 31:
            this.tableHead = [...this.allTableHead, ...this.airTableHead]
            break
          case 32:
            this.tableHead = [...this.allTableHead, ...this.waterTableHead]
            break
          default:
            break
        }
        let res = await this.$api.homeTableData(Object.assign(this.params, { current: 1, size: 9999 }))
        if (res.state === 0) {
          // 状态数量
          for (let key in res.data) {
            const match = this.stateArr.find(e => e.endVal === key)
            if (match) {
              match.num = res.data[key]
            }
          }
          this.MNList = []
          this.mapData = []
          // 表数据
          this.tableData = Object.freeze(res.data.rows.map((ele, index) => {
            let onlineStatus = this.onlineStatusArr.map(item => Object.is(item.value, ele.onlineStatus) ? item.label : '').join().replace(/,/g, '')
            let dataStatus = Object.is(ele.onlineStatus, 'OFFLINE') ? '-' : this.dataStatusArr.map(item => Object.is(item.value, ele.dataStatus) ? item.label : '').join().replace(/,/g, '')
            // 地图下拉框数据
            this.MNList = Object.freeze([...this.MNList, {
              mn: ele.mn,
              value: `${Math.floor(ele.longitude * 1000) / 1000},${Math.floor(ele.latitude * 1000) / 1000},${index},${ele.mn}`
            }])
            // 地图数据
            this.mapData = Object.freeze([...this.mapData, {
              ...ele,
              onlineStatus: onlineStatus,
              dataStatus: dataStatus
            }])
            return {
              ...ele,
              index: index + 1,
              onlineStatus: onlineStatus,
              dataStatus: dataStatus
            }
          }))
          // 处理点击状态按钮时,地图显示出错问题
          if (this.activeName === 'dataChart') {
            this.activeName = ''
            setTimeout(() => {
              this.activeName = 'dataChart'
            }, 300)
          }
          this.loading = false
          this.loadingEcharts = false
        }
      } catch (error) {
        this.$isRepeat(error, () => {
          this.loading = false
          this.loadingEcharts = false
        })
      }
    },
    // 行业类型
    async sysIndustryList () {
      this.comIndustryList = this.comIndustryList.concat((await this.$api.sysIndustryList()).data) || this.comIndustryList
    },
    // 判断单元格是否需要变色
    setColor ({ column, row }) {
      try {
        let { property } = column
        let { onlineStatus, dataStatus } = row
        // 判断状态
        if ((property === 'onlineStatus' && onlineStatus === '离线') || (property === 'dataStatus' && dataStatus !== '正常' && dataStatus !== '-')) {
          return { 'color': 'red' }
        } else if ((property === 'onlineStatus' && onlineStatus !== '离线') || (property === 'dataStatus' && dataStatus === '正常')) {
          return { 'color': 'green' }
        } else {
          return {}
        }
      } catch (error) {
        return {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  overflow: hidden;
  .input {
    width: 150px;
  }
  /deep/ .query-bar {
    margin-right: 5px;
  }
  .select {
    width: 60px;
  }
  .comIndustry {
    width: 180px;
  }
  .query-container {
    position: relative;
  }
  .state {
    position: absolute;
    z-index: 99;
    right: 0;
    bottom: -3px;
    height: 0;
  }
  .num {
    margin: 10px 0;
    height: 20px;
    span {
      float: left;
      height: 20px;
      line-height: 20px;
      &:first-child {
        padding: 0 10px;
        border-radius: 5px;
        font-size: 12px;
        cursor: pointer;
      }
      &:last-child {
        color: #003399;
        font-weight: bolder;
        font-size: 14px;
        margin: 0 10px 0 5px;
      }
    }
    .total {
      color: #409eff;
      border: 1px solid #409eff;
      &:hover {
        color: #fff;
        background: #409eff;
      }
    }
    .online {
      color: $onlineClr;
      border: 1px solid $onlineClr;
      &:hover {
        color: #fff;
        background: $onlineClr;
      }
    }
    .offline {
      color: $offlineClr;
      border: 1px solid $offlineClr;
      &:hover {
        color: #fff;
        background: $offlineClr;
      }
    }
    .overproof {
      color: $overproofClr;
      border: 1px solid $overproofClr;
      &:hover {
        color: #fff;
        background: $overproofClr;
      }
    }
    .destory {
      color: $destoryClr;
      border: 1px solid $destoryClr;
      &:hover {
        color: #fff;
        background: $destoryClr;
      }
    }
  }
  .tab {
    .green {
      color: #67c23a;
    }
    /deep/ .el-tabs__content {
      padding: 5px;
    }
    /deep/ .el-table {
      tr {
        cursor: pointer;
      }
    }
    .search-bar {
      position: absolute;
      top: 5px;
      left: 5px;
      opacity: 0.9;
      line-height: 40px;
      background: rgba(173, 138, 138, 0.1);;
      padding: 0 4px;
      border-radius: 4px;
      z-index: 2;
      label,
      .search {
        float: left;
      }
      label {
        font-size: 14px;
      }
      .search {
        width: 300px;
      }
    }
  }
}
</style>

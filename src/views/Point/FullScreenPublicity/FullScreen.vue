<template>
  <div class="container">
    <div class="info" v-for="(item, index) in ledData" :key="index" :style="ledStyle">
      <div v-if="item.hasOwnProperty('dataTime') && item.hasOwnProperty('poiName')">
        <span class="companyName">{{item.comName}}<a class="poiName">{{item.poiName}}</a></span>
      </div>
      <div class="flex" v-if="item.hasOwnProperty('dataTime')">
        <span class="fisrt">监测时间</span>
        <span class="second time">{{item.dataTime}}</span>
      </div>
      <div class="flex">
        <span class="fisrt" v-if="item.hasOwnProperty('comContact')">联系人</span>
        <span class="second phone" v-if="item.hasOwnProperty('comContact')">{{item.comContact}}</span>
        <span class="fisrt" v-if="item.hasOwnProperty('phone')">联系电话</span>
        <span class="second phone" v-if="item.hasOwnProperty('phone')">{{item.phone}}</span>
      </div>
      <el-table :data="allTableData[index][current[index]]" class="table">
        <el-table-column
          label="监测指标"
          align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.polName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="动态监测值"
          align="center">
          <template slot-scope="scope">
            <span :class="scope.row.flag?scope.row.flag.split('_')[0]==1?'red':'green':'red'">{{ scope.row[`pol_${scope.row.polCode}`] !== null ? scope.row[`pol_${scope.row.polCode}`] : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center">
          <template slot-scope="scope">
            <span :class="scope.row.flag?scope.row.flag.split('_')[1]=='N'?'green':'red':'red'">{{ scope.row.flag ? state[scope.row.flag.split('_')[1]] : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="排放限值"
          align="center">
          <template slot-scope="scope">
            <span :class="scope.row.floorval==null&&scope.row.ceilval==null ?'red': ''">{{ceilvalAndFloorval(scope.row.floorval, scope.row.ceilval)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="单位"
          align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.polUnit }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import screenfull from 'screenfull'
export default {
  name: 'FullScreen',
  data () {
    return {
      state: {
        C: '校验',
        D: '故障',
        F: '排放源停运',
        M: '维护',
        N: '正常',
        P: '电源故障',
        S: '设定值',
        T: '超标'
      },
      poiId: '',
      ledData: [], // 接口请求的led全部数据
      ledStyle: {}, // 每一个led盒子的width和height
      itemTableData: {}, // 每一个led表格的数据
      allTableData: {}, // 处理后的全部led表格数据
      current: {}, // 记录每一个led的分页的编码
      clearPageData: null,
      clearQuery: null,
      queryTime: 50000, // 每隔多久调取一下查询
      pageTime: 30000, // 每隔多久分页一次
      ledCurrent: 10, // 每个分屏的led每页展示的数量
      defalutCurrent: 0 // 默认展示第一页
    }
  },
  methods: {
    ceilvalAndFloorval (floorval, ceilval) {
      if (floorval === null && ceilval === null) {
        return '-'
      } else if (floorval !== null) {
        return `> ${floorval}`
      } else {
        return `< ${ceilval}`
      }
    },
    submit () {
      this.screenfull()
    },
    screenfull () {
      if (!screenfull.enabled) { // 如果不允许进入全屏，发出不允许提示
        this.$message.warning('不支持全屏')
        return false
      }
      this.isFullscreen = true
      screenfull.toggle()
    },
    /**
     * 是否全屏并按键ESC键的方法
     */
    checkFull () {
      var isFull = document.fullscreen || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled
      // to fix : false || undefined == undefined
      if (isFull === undefined) {
        isFull = false
      }
      return isFull
    },
    open () {
      this.$confirm('是否显示全屏?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        closeOnClickModal: false,
        showClose: false,
        type: 'warning'
      }).then(() => {
        this.screenfull()
        window.onresize = () => {
          // 全屏下监控是否按键了ESC
          if (!this.checkFull()) {
            // 全屏下按键esc后要执行的动作
            this.$router.push({ name: 'FullScreenPublicity' })
          }
        }
      }).catch(() => {
        this.$router.push({ name: 'FullScreenPublicity' })
      })
    },
    init () {
      document.onkeydown = () => {
        var e = event || window.event
        // 去掉默认事件
        if (e && e.keyCode === 122) {
          return false
        }
      }
      this.open()
    },
    // 分屏样式
    fullScreen (num) {
      switch (num) {
        case 0:
        case 1:
          this.ledStyle = {
            height: '100%',
            width: '100%'
          }
          break
        case 2:
          this.ledStyle = {
            height: '100%',
            width: '50%'
          }
          break
        case 3:
        case 4:
          this.ledStyle = {
            height: '50%',
            width: '50%'
          }
          break
      }
    },
    // 每一个led每页对应的table数据
    pageData () {
      this.ledData.forEach((ele, index) => {
        if (this.allTableData[index][this.current[index] + 1]) {
          this.current[index] = this.current[index] + 1
        } else {
          this.current[index] = 0
        }
      })
      this.$forceUpdate()
    },
    async query () {
      clearInterval(this.clearPageData)
      let res = await this.$api.ledConfigData({poiId: this.poiId})
      if (res.state === 0) {
        this.ledData = res.data || []
        this.fullScreen(this.ledData.length)
        // 处理成table想要的数据
        this.ledData.forEach((ele, index) => {
          this.allTableData[index] = {}
          this.current[index] = this.defalutCurrent
          ele.pollants.forEach((item, i) => {
            if (!this.allTableData[index][parseInt(i / this.ledCurrent)]) {
              this.allTableData[index][parseInt(i / this.ledCurrent)] = []
            }
            this.allTableData[index][parseInt(i / this.ledCurrent)][i % this.ledCurrent] = ele.pollants[i]
          })
        })
        if (this.ledData.length) {
          this.clearPageData = setInterval(() => {
            this.pageData()
          }, this.pageTime)
        }
      }
    }
  },
  created () {
    if (!this.$route.query.poiId) {
      this.$router.push({path: '/404'})
      return
    } else {
      this.poiId = this.$route.query.poiId
      if (this.poiId.split(',').length > 4) {
        this.$router.push({path: '/404'})
        return
      }
    }
    // 数据更新时间
    if (this.$route.query.updateTime) {
      this.queryTime = this.$route.query.updateTime
    }
    this.$nextTick(() => {
      this.init()
    })
    this.query()
    this.clearQuery = setInterval(() => {
      this.query()
    }, this.queryTime)
  },
  destroyed () {
    // 组件销毁之后不触发onresize事件
    window.onresize = () => false
    // 组件销毁后清除定时器
    clearInterval(this.clearPageData)
    clearInterval(this.clearQuery)
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #000000;
  top: 0;
  left: 0;
  z-index: 1500;
  .info {
    display: flex;
    flex-direction: column;
    padding: 5px;
    float: left;
    .poiName {
      color: #decf46;
      font-size: 18px;
      font-weight: bolder;
      cursor: default;
      margin-left: 20px;
    }
    .flex {
      display: flex;
      width: 100%;
      span {
        display: flex;
        height: 29px;
        justify-content: center;
        align-items: center;
        color: #fff;
        border: 1px solid red;
        border-bottom: none;
        font-size: 18px;
        font-weight: bolder;
      }
      .time {
        color: #c5191a;
      }
      .phone {
        color: #125a10;
      }
    }
    .fisrt {
      width: 200px;
    }
    .second {
      flex: 1;
    }
    .companyName {
      display: block;
      width: 100%;
      text-align: center;
      line-height: 60px;
      font-size: 30px;
      color: #f2fc0e;
      border: 1px solid red;
      border-bottom: none;
    }
  }
  /deep/ .el-table {
    &::before {
      height: 0;
    }
    border: 1px solid red;
    background: #000;
    th {
      background: #000000 !important;
      border: 1px solid red;
      border-left: none;
      border-top: none;
      border-bottom: none;
      .cell {
        color: #fff;
        font-weight: bolder;
        font-size: 18px;
      }
    }
    td {
      background: #000000;
      border: 1px solid red;
      border-left: none;
      border-top: none;
      color: #fff;
      font-weight: bolder;
      font-size: 18px;
    }
    tr {
      &:first-child {
        td {
          border-top: 1px solid red;
        }
      }
    }
    tbody {
      tr {
        td {
          &:first-child {
            .cell {
              span {
                color: #0c720f;
              }
            }
          }
        }
      }
    }
    .el-table__body-wrapper {
      background: #000;
    }
    .green {
      color: #0a6e0e;
    }
    .red {
      color: #d20807;
    }
  }
}
</style>



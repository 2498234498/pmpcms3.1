<template>
  <el-card class="card-info" shadow="hover">
    <div class="info-bar">
      <div class="info-child">
        <label>监控点名称：</label>
        <span :title="data.pointName">{{ data.pointName }}</span>
      </div>
      <div class="info-child">
        <label>MN号：</label>
        <span :title="data.pointMnnum">{{ data.pointMnnum }}</span>
      </div>
    </div>
    <div class="info-bar">
      <div class="info-child">
        <label>监控点类型：</label>
        <span :title="pointType(data.pointType)">{{ pointType(data.pointType) }}</span>
      </div>
      <div class="info-child">
        <label>所属企业：</label>
        <span :title="data.belongCompanyName">{{ data.belongCompanyName }}</span>
      </div>
    </div>
    <div class="info-bar">
      <div class="info-child">
        <label>监控点地址：</label>
        <span :title="data.pointAddress">{{ data.pointAddress }}</span>
      </div>
      <!-- <div class="info-child">
        <label>地理位置：</label>
        <span>{{ data.pointLongitude }} / {{ data.pointLatitude }}</span>
      </div> -->
      <div class="info-child">
        <label>监控范围：</label>
        <span :title="pointMonitor(data.pointMonitortype)">{{ pointMonitor(data.pointMonitortype) }}</span>
      </div>
    </div>
    <div class="info-bar">
      <div class="info-child">
        <label>运维企业：</label>
        <el-popover
          ref="popover"
          v-if="data.operationCompanyName"
          placement="top-start"
          width="300"
          trigger="hover"
          class="popover"
          :content="data.operationCompanyName">
          <span slot="reference">{{ data.operationCompanyName }}</span>
        </el-popover>
      </div>
      <!-- <div class="info-child">
        <label>运维有效期：</label>
        <span>{{ effectiveTime }}</span>
      </div> -->
    </div>
    <!-- <div class="info-bar">
      <div class="info-child">
        <label>运行状态：</label>
        <span :style="data.pointState !== 'N' ? { color: 'red' } : ''">{{ pointState(data.pointState) }}</span>
      </div>
    </div> -->
    <!-- <div class="info-bar">
      <div class="info-child">
        <label>最新数据时间：</label>
        <span>{{ data.lastDataTime || '' }}</span>
      </div>
    </div> -->
  </el-card>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    pointType () {
      const typeArr = { 31: '气类', 32: '水类' }
      return index => typeArr[index] || ''
    },
    pointMonitor () {
      const typeArr = ['', '国控', '省控', '市控', '区控']
      return index => typeArr[index] || ''
    },
    pointState () {
      // const stateArr = ['', '离线', '故障', '超标', '正常']
      const stateObj = { OFFLINE: '离线', D: '故障', T: '超标', N: '正常' }
      return index => stateObj[index] || ''
    },
    // 有效时间
    effectiveTime () {
      if (this.data.operationBeginTime && this.data.operationEndTime) {
        return `${this.data.operationBeginTime} 至 ${this.data.operationEndTime}`
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
.card-info {
  width: 100%;
  /deep/ .el-card__body {
    padding: 3px 0px;
  }
  .info-bar {
    width: 100%;
    font-size: 14px;
    line-height: 20px;
    display: flex;
    border: 1px solid;
    border-bottom: 0;
    border-left: 0;
    line-height: 22px;
    &:last-child {
      border-bottom: 1px solid;
      border-color: #dcdfe6;
    }
    border-color: #dcdfe6;
    .info-child {
      width: 50%;
      display: flex;
      label, span {
        display: inline;
        padding: 5px;
      }
      label {
        color: #666;
        min-width: 110px;
        border-left: 1px solid;
        border-color: #dcdfe6;
      }
      > span {
        color: #666;
        flex-grow: 1;
        border-left: 1px solid;
        border-color: #dcdfe6;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
      .popover {
        // display: none;
        span {
          padding: 0;

        }
      }
    }
  }
  .clear {
    clear: both;
  }
}
</style>

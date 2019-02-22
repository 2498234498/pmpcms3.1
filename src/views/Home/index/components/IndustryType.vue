<template>
  <div class="industry-type WH">
    <div class="pie-bar">
      <ve-pie :tooltip="chart.tooltip"
        :legend="chart.legend"
        :series="chart.series"
        :title="chart.title"
        :loading="loading"
        class="pie"
        ref="pie"
        height="100%"
        width="100%"></ve-pie>
    </div>
    <el-dropdown class="title"
      placement="top">
      <span class="el-dropdown-link">
        {{ drawSelect.find(e => e.value === check).label }}<i class="el-icon-arrow-down el-icon--right icon"></i>
        <div class="triangle"></div>
      </span>
      <el-dropdown-menu slot="dropdown"
        class="type-drop">
        <el-dropdown-item v-for="(item, index) in drawSelect"
          :key="index"
          @click.native="drawCheck(item.value)">{{ item.label }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import resize from './mixin/resize'
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  mixins: [resize],
  data () {
    return {
      chart: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          show: false
        },
        series: {
          name: '行业类型',
          type: 'pie',
          radius: [0, '60%'],
          label: {
            formatter: '{b}{c}({d}%)',
            color: '#000',
            fontSize: '13'
          },
          labelLine: {
            show: true,
            length: 5,
            length2: 5,
            // smooth: 1,
            lineStyle: {
              color: '#000',
              width: 2
            }
          },
          data: []
        }
      },
      drawSelect: [
        { label: '排放类型', value: 'st' },
        { label: '监控级别', value: 'monitorTypeName' },
        { label: '行业类型', value: 'comIndustryName' }
      ],
      check: 'st',
      pointTypeSelect: { 31: '水类', 32: '气类' }
    }
  },
  watch: {
    data: {
      deep: true,
      handler () {
        this.drawCheck()
      }
    }
  },
  methods: {
    drawCheck (value) {
      if (value) {
        this.check = value
      }
      const { check } = this
      const data = []
      let dataObj = {}
      let code = []
      if (check === 'st') { // 排放类型
        code = this.$store.state.codeData.st.filter(e => e.value)
      } else if (check === 'monitorTypeName') { // 监控级别
        code = this.$store.state.codeData.monitorType.filter(e => e.value)
      }
      dataObj = code.reduce((prev, { label, value }) => {
        prev[this.pointTypeSelect[value] || label] = 0
        return prev
      }, {})
      dataObj = {
        ...dataObj,
        ...this.data
          .reduce((prev, cur) => {
            let hit = this.pointTypeSelect[cur[check]] || cur[check]
            if (prev[hit]) {
              prev[hit]++
            } else {
              prev[hit] = 1
            }
            return prev
          }, {})}
      for (const [key, value] of Object.entries(dataObj)) {
        data.push({ name: this.pointTypeSelect[key] || key, value })
      }
      this.chart.series.data = Object.freeze(data)
      this.pie && this.pie.resize()
    }
  }
}
</script>

<style lang="scss" scoped>
.industry-type {
  display: flex;
  flex-direction: column;
  .pie-bar {
    width: 100%;
    flex-grow: 1;
    position: relative;
    .pie {
      position: absolute !important;
    }
  }
  .title {
    position: relative;
    height: 30px;
    width: 50%;
    margin: 0 auto;
    background-color: #0054ab;
    text-align: center;
    line-height: 32px;
    font-size: 18px;
    font-weight: normal;
    color: #fff;
    border-radius: 6px;
    cursor: pointer;
    .triangle {
      position: absolute;
      display: inline-block;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 10px solid #0054ab;
    }
    .icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>

<style lang="scss">
.type-drop {
  z-index: 10001 !important;
  background-color: #0054ab;
  border-color: transparent;
  .el-dropdown-menu__item {
    color: #fff;
    &:focus, &:not(.is-disabled):hover {
      background-color: #02162d;
      color: #fff;
    }
  }
  .popper__arrow {
    display: none;
  }
}
</style>

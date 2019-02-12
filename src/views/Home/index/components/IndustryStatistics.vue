<template>
  <div class="industry-statistics WH">
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
    <h4 class="title">
      在线率统计
      <div class="triangle"></div>
    </h4>
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
      colorList: Object.freeze({
        '总数': '#005CB3',
        '超标': '#FE4901',
        '故障': '#FBB26C',
        '正常': '#409FFF',
        '离线': '#827F7E',
        '在线': '#009944'
      }),
      chart: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          show: false
        },
        series: [
          {
            name: '在线率统计',
            type: 'pie',
            radius: [0, '30%'],
            label: {
              formatter: '{b}\n{c}\n\n',
              position: 'inside',
              align: 'left',
              verticalAlign: 'middle',
              fontSize: '20'
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              color: '#000'
            },
            data: []
          },
          {
            name: '在线率统计',
            type: 'pie',
            radius: ['35%', '47%'],
            z: 10,
            label: {
              formatter: '{b}{c}({d}%)',
              color: '#000',
              fontSize: '13'
            },
            labelLine: {
              show: true,
              length: 20,
              lineStyle: {
                color: '#000',
                width: 2
              }
            },
            data: []
          },
          {
            name: '在线率统计',
            type: 'pie',
            radius: ['55%', '67%'],
            label: {
              formatter: '{b}{c}({d})',
              color: '#000',
              fontSize: '13'
            },
            labelLine: {
              show: true,
              length: 20,
              lineStyle: {
                color: '#000',
                width: 2
              }
            },
            data: []
          }
        ]
      }
    }
  },
  watch: {
    data: {
      deep: true,
      handler (v) {
        this.chart.series[0].data = Object.freeze(v[0].map(this.joinColor))
        this.chart.series[1].data = Object.freeze(v[1].map(this.joinColor))
        this.chart.series[2].data = Object.freeze(v[2].map(this.joinColor))
        this.pie && this.pie.resize()
      }
    }
  },
  methods: {
    joinColor (e) {
      return {
        ...e,
        itemStyle: {
          color: this.colorList[e.name]
        }
      }
    }
  }
}
</script>

<style lang="scss">
.industry-statistics {
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
    background-color: #0054AB;
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
      border-bottom: 10px solid #0054AB;
    }
  }
}
</style>


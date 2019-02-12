const chart = {
  data () {
    return {
      chart: {
        loading: false,
        data: {
          columns: [],
          rows: []
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          confine: true
        },
        toolbox: {
          show: true,
          feature: {
            restore: {},
            dataZoom: {},
            magicType: {
              type: ['line', 'bar']
            },
            saveAsImage: {}
          }
        },
        dataZoom: [
          {
            type: 'slider',
            start: 0,
            end: 5
          }
        ],
        extend: {
          // series: {
          //   step: true,
          //   smooth: 0
          // }
        },
        legend: {
          type: 'scroll',
          left: 'left',
          right: 180
        },
        settings: {
          digit: 4
        },
        grid: {
          x: 10
        }
      }
    }
  },
  beforeDestroy () {
    this.$refs.chart && this.$refs.chart.clean()
  }
}

export default chart

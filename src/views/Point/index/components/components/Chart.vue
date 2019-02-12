<template>
  <ve-line
    ref="chart"
    height="100%"
    :data="data"
    :settings="chart.settings"
    :legend="chart.legend"
    :toolbox="chart.toolbox"
    :extend="chart.extend"
    :data-zoom="chart.dataZoom"
    :grid="chart.grid"
    :tooltip="chart.tooltip"
    :loading="loading">
  </ve-line>
</template>

<script>
import chart from '../mixins/chart'
export default {
  mixins: [chart],
  props: {
    data: {
      type: Object,
      default () {
        return {
          columns: [],
          rows: []
        }
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.chart{
  // display: inline;
  float: left;
}
</style>

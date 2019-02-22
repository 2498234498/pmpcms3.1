<template>
  <!-- 数据完整率 -->
  <div class="data-integrity WH">
    <el-table :data="tableData"
      border
      height="100%"
      highlight-current-row
      ref="table"
      v-loading="loading"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="$store.getters.loadingColor"
      style="width: 100%">
      <el-table-column v-for="(item, index) in tableHead"
        :key="index"
        :label="item.title"
        :min-width="item.width"
        :prop="item.field"
        :fixed="item.fixed"
        :formatter="formatter"
        align="center">
        <template v-if="Array.isArray(item.children)">
          <el-table-column v-for="(child, child_index) in item.children"
            :key="child_index"
            align="center"
            :prop="child.field"
            :label="child.title"
            :formatter="formatter"
            :min-width="child.width" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import load from './mixins/load'
const generateTable = (key) => {
  return [
    { field: `${key}Real`, title: '实收', width: 80 },
    { field: `${key}Expect`, title: '应收', width: 80 },
    { field: `${key}Rate`, title: '完整率', width: 80 }
  ]
}
export default {
  mixins: [load],
  data () {
    return {
      loading: false,
      tableHead: [
        { field: 'index', title: '序号', width: 50, fixed: 'left' },
        { field: 'dataTime', title: '时间', width: 150 },
        { field: 'poiName', title: '监控点', width: 150 },
        { field: 'rtd', title: '实时数据', width: 100, children: generateTable('rtd') },
        { field: 'minute', title: '分钟数据', width: 100, children: generateTable('minute') },
        { field: 'hour', title: '小时数据', width: 100, children: generateTable('hour') },
        { field: 'day', title: '日数据', width: 100, children: generateTable('day') }
      ],
      tableData: []
    }
  },
  methods: {
    async initQuery () {
      let { id: poiId } = await this.$store.dispatch('IsPointLoad')
      if (!poiId) return false
      this.loading = true
      const params = { size: 20, current: 1, poiId }

      try {
        const res = await this.$api.statisDataCompDayList(params)
        if (res.state === 0) {
          this.tableData = res.data.records
        } else {
          this.$message.error('数据完整率列表查询失败')
        }
        this.loading = false
      } catch (err) {
        this.$isRepeat(err, () => {
          this.loading = false
        })
      }
    },
    formatter (row, { property }, cellValue, index) {
      let value = ''
      switch (property) {
        case 'index':
          value = index + 1
          break
        case 'dayRate':
        case 'hourRate':
        case 'minuteRate':
        case 'rtdRate':
          value = (cellValue + '') ? cellValue + '%' : cellValue
          break
      }
      return value || cellValue
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

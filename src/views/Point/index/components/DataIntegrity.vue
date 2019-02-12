<template>
  <!-- 数据完整率 -->
  <div class="data-integrity WH">
    <el-table :data="tableData"
      border
      height="100%"
      highlight-current-row
      ref="table"
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
const generateTable = () => {
  return [
    { field: 'index', title: '实收', width: 80 },
    { field: 'index', title: '应收', width: 80 },
    { field: 'index', title: '完整率', width: 80 }
  ]
}
export default {
  mixins: [load],
  data () {
    return {
      loading: false,
      tableHead: [
        { field: 'index', title: '序号', width: 50, fixed: 'left' },
        { field: 'index', title: '时间', width: 150 },
        { field: 'index', title: '监控点', width: 100 },
        { field: 'index', title: '实时数据', width: 100, children: generateTable() },
        { field: 'index', title: '分钟数据', width: 100, children: generateTable() },
        { field: 'index', title: '小时数据', width: 100, children: generateTable() },
        { field: 'index', title: '日数据', width: 100, children: generateTable() }
      ],
      tableData: []
    }
  },
  methods: {
    initQuery () {},
    formatter (row, { property }, cellValue, index) {
      let value = ''
      switch (property) {
        case 'index':
          value = index + 1
          break
      }
      return value || cellValue
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

<template>
  <div class="day WH"
    v-loading="loadingAuto"
    element-loading-text="数据加载中"
    element-loading-spinner="el-icon-loading"
    :element-loading-background="$store.getters.loadingColor">
    <el-table :data="data"
      border
      height="calc(100% - 72px)"
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
    <el-pagination class="page-container"
      @size-change="current = 1, $emit('query'), handleTableScrollHeight('table')"
      @current-change="$emit('query'), handleTableScrollHeight('table')"
      background
      :current-page.sync="current"
      :page-sizes="sizes"
      :page-size.sync="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import mInit from './mixin/init'
export default {
  mixins: [mInit],
  data (vm) {
    return {
      tableHead: [
        { field: 'index', title: '序号', width: 50, fixed: 'left' },
        { field: 'dataTime', title: '时间', width: 150 },
        { field: 'areaId', title: '省市区', width: 150 },
        { field: 'comName', title: '企业', width: 130 },
        { field: 'poiName', title: '监控点', width: 150 },
        { field: 'poiNum', title: 'MN号', width: 130 },
        { field: 'rtd', title: '实时数据', width: 100, children: vm.generateTable('rtd') },
        { field: 'minute', title: '分钟数据', width: 100, children: vm.generateTable('minute') },
        { field: 'hour', title: '小时数据', width: 100, children: vm.generateTable('hour') },
        { field: 'day', title: '日数据', width: 100, children: vm.generateTable('day') }
      ]
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>

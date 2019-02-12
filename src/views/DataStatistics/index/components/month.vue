<template>
  <div class="month WH"
    v-loading="loadingAuto"
    element-loading-text="数据加载中"
    element-loading-spinner="el-icon-loading"
    :element-loading-background="$store.getters.loadingColor">
    <el-table :data="data"
      border
      height="calc(100% - 72px)"
      highlight-current-row
      ref="table"
      @expand-change="expandChange"
      style="width: 100%">
      <el-table-column v-for="(item, index) in tableHead"
        :key="index"
        :label="item.title"
        :min-width="item.width"
        :prop="item.field"
        :fixed="item.fixed"
        :type="item.type || ''"
        align="center">
        <template slot-scope="scope">
          <el-row v-if="item.type === 'btn'">
            <base-btn type="export"
              :loading="scope.row.loading"
              @click="exportTable(scope.row)"></base-btn>
          </el-row>
          <el-table :data="item.children"
            v-else-if="item.type === 'expand'"
            border
            highlight-current-row
            ref="table"
            style="width: 100%">
            <el-table-column v-for="(item, index) in tableChildHead"
              :key="index"
              :label="item.title"
              :min-width="item.width"
              :prop="item.field"
              :fixed="item.fixed"
              :formatter="formatterChild"
              align="center">
              <template v-if="Array.isArray(item.children)">
                <el-table-column v-for="(child, child_index) in item.children"
                  :key="child_index"
                  align="center"
                  :prop="child.field"
                  :label="child.title"
                  :formatter="formatterChild"
                  :min-width="child.width">
                </el-table-column>
              </template>
            </el-table-column>
          </el-table>
          <span v-else>
            {{ formatter(scope.row, item.property, scope.row[item.property], scope.$index) }}
          </span>
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
import { comSerial } from '@/utils'
export default {
  mixins: [mInit],
  data (vm) {
    return {
      tableHead: [
        { field: 'index', title: '序号', width: 50, fixed: 'left' },
        { type: 'expand', width: 50 },
        { field: 'index', title: '省市区', width: 150 },
        { field: 'index', title: '企业', width: 100 },
        { field: 'index', title: '监控点', width: 100 },
        { field: 'index', title: 'MN号', width: 130 },
        { type: 'btn', title: '操作', width: 100, fixed: 'right' }
      ],
      tableChildHead: [
        { field: 'index', title: '序号', width: 50, fixed: 'left' },
        { field: 'index', title: '时间', width: 100 },
        { field: 'index', title: '实时数据', width: 100, children: vm.generateTable() },
        { field: 'index', title: '分钟数据', width: 100, children: vm.generateTable() },
        { field: 'index', title: '小时数据', width: 100, children: vm.generateTable() },
        { field: 'index', title: '日数据', width: 100, children: vm.generateTable() }
      ]
    }
  },
  methods: {
    query () {},
    exportTable (row) { },
    formatter (row, property, cellValue, index) {
      let value = ''
      switch (property) {
        case 'index':
          value = comSerial(this.current, this.size, index)
          break
      }
      return value || cellValue
    },
    expandChange (row) {
      row.expand = !row.expand
      if (row.expand) {
        // TODO 查询子列
        // this.query(row)
      }
    },
    formatterChild (row, { property }, cellValue, index) {
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

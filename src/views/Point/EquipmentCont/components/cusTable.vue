<template>
  <el-table :data="Data"
    border
    class="table"
    ref="configurationTable"
    height="100%"
    highlight-current-row
    :cell-style="setColor"
    tooltip-effect="light"
    style="width: 100%">
    <el-table-column v-for="(item, index) in Head"
      :key="index"
      :fixed="item.fixed || false"
      :prop="item.property"
      :min-width="item.width"
      :label="item.label"
      show-overflow-tooltip
      align="center">
      <template slot-scope="scope">
        <el-row v-if="item.type == 'btn'">
          <base-btn v-for="(btn, index) in scope.row.btnList"
            :key="index"
            :type="btn.type"
            :loading="btn.loading"
            @click="$emit('click', { e: btn.e, btn, row: scope.$index, type, data: scope.row })"></base-btn>
        </el-row>
        <span v-else>{{ item.property === 'index' ? scope.$index + 1 : scope.row[item.property] }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    Head: {
      type: Array,
      default () {
        return []
      }
    },
    Data: {
      type: Array,
      default () {
        return []
      }
    },
    type: ''
  },
  methods: {
    setColor ({ column, row }) {
      let { property } = column
      if (property === 'name') {
        return { color: '#006159' }
      }
      return {}
    }
  }
}
</script>

<template>
  <el-table :data="data"
    border
    class="table data"
    :height="height"
    highlight-current-row
    :cell-style="setColor"
    ref="table"
    style="width: 100%">
    <el-table-column v-for="(item, index) in tableTitle"
      :key="(index + item.title)"
      :label="item.title"
      :min-width="tableHeadWidth(item.field) || item.width"
      :prop="item.field"
      :fixed="item.fixed"
      :formatter="formatter"
      align="center">
      <template slot="header"
        slot-scope="scope">
        <el-switch v-if="item.field === 'index' && ['2051', '2061', '2031'].includes(type)"
          v-model="switchTab"
          class="switch-tab"
          inactive-color="#ff4949">
        </el-switch>
        <span v-html="item.title"></span>
      </template>
      <template v-if="Array.isArray(item.children)">
        <el-table-column v-for="(child, child_index) in item.children"
          :key="child_index"
          align="center"
          :formatter="formatter"
          :prop="child.field"
          :label="child.title"
          :min-width="tableHeadWidth(child.field) || child.width" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { tableHeadTab, setTableHeadBr } from '@/utils'
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    headData: {
      type: Array,
      default: () => []
    },
    height: '',
    type: ''
  },
  data () {
    return {
      switchTab: true
    }
  },
  watch: {
    async tableTitle () {
      await this.$nextTick()
      this.table.doLayout && this.table.doLayout()
    }
  },
  computed: {
    table () {
      return this.$refs.table || {}
    },
    tableTitle () {
      let head = []
      const not = ['2051', '2061', '2031']
      if (not.includes(this.type) && this.switchTab) {
        // 只显示平均值
        head = tableHeadTab(this.headData, ['index', 'dataTime'])
      } else if (!not.includes(this.type)) {
        // 全部显示，设置表头换行
        head = this.headData.map(e => {
          return {
            ...e,
            title: setTableHeadBr(e.title)
          }
        })
      } else {
        // 全部显示
        head = this.headData
      }
      return head
    },
    // 分钟、小时、日 类型的数据，显示全部时，设置宽度为90
    tableHeadWidth () {
      const not = ['2051', '2061', '2031']
      const notKey = ['index', 'dataTime']
      if (not.includes(this.type) && !this.switchTab) {
        return index => {
          if (!notKey.includes(index)) {
            return 90
          } else {
            return false
          }
        }
      }
      return index => false
    }
  },
  methods: {
    // 根据污染物是否超标而变红色
    setColor ({ column, row }) {
      try {
        let { property } = column
        let { flage } = row
        if (!(property.split('_').length >= 3 && flage && flage.indexOf('_') >= 0)) return {}

        const w = flage.indexOf(property.split('_')[2])
        let mark = flage.substr(w, flage.length).split(',')[0].split('_')[1]
        return mark === '1' ? { 'color': 'red' } : {}
      } catch (error) {
        return {}
      }
    },
    formatter (row, { property }, cellValue, index) {
      let value = ''
      switch (property) {
        case 'index':
          value = index + 1
          break
        default:
          if (property !== 'flage' && property.indexOf('_') >= 0 && cellValue !== undefined) {
            let { flage } = row
            if (flage) {
              const w = flage.indexOf(property.split('_')[2])
              if (w >= 0) {
                let mark = flage.substr(w, flage.length).split(',')[0].split('_')[2]
                let v = flage.substr(w, flage.length).split(',')[0].split('_')[1]
                if (v === '1') {
                  value = `${cellValue}(T)`
                } else if (mark !== 'N' && mark !== 'T' && mark) {
                  value = `${cellValue}(${mark})`
                }
              }
            }
          }
          break
      }
      return value || (cellValue === undefined ? '-' : cellValue)
    }
  }
}
</script>

<style lang="scss" scoped>
// .data-list{}
.table {
  .switch-tab {
    line-height: 0;
    padding: 0;
    display: block;
  }
}
</style>

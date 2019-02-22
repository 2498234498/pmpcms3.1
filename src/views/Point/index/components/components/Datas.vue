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
        <span :keys="scope" v-html="item.title"></span>
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
import { tableHeadTab, setTableHeadBr, cached } from '@/utils'

// 格式化列表的超标和数据状态
function formatExcessAndState (flag) {
  return flag.split(',').reduce((prev, e) => {
    const [name, excess, state] = e.split('_')
    prev[name] = { name, excess, state }
    return prev
  }, {})
}

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
        const flagObj = this.cachedFormat(flage)
        const match = this.compExcessAndState(flagObj, property)
        if (!match) return {}

        return match.excess === '1' ? { 'color': 'red' } : {}
      } catch (error) {
        return {}
      }
    },
    cachedFormat: cached(formatExcessAndState),
    compExcessAndState (obj, property) {
      return obj[property.split('_')[2]]
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
              const flagObj = this.cachedFormat(flage)
              const match = this.compExcessAndState(flagObj, property)
              if (match) {
                const { excess, state } = match
                if (excess === '1') {
                  value = `${cellValue}(T)`
                } else if (state !== 'N' && state !== 'T' && state) {
                  value = `${cellValue}(${state})`
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

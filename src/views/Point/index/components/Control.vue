<template>
  <div class="control WH"
    v-loading="Loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    :element-loading-background="$store.getters.loadingColor">
    <el-table :data="data"
      border
      class="control-table"
      height="100%"
      highlight-current-row
      tooltip-effect="light"
      ref="table"
      style="width: 100%">
      <el-table-column v-for="(item, index) in head"
        :key="index"
        :label="item.title"
        :min-width="item.width"
        :prop="item.field"
        :fixed="item.fixed"
        show-overflow-tooltip
        align="center">
        <template slot-scope="scope">
          <el-row v-if="item.type == 'btn'">
            <base-btn type="detail"
              @click="detail(scope.row)"></base-btn>
          </el-row>
          <span v-else>{{ formatter(item.field, scope.row, scope.$index) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialog.title"
      :visible.sync="dialog.show"
      center
      class="dialog"
      width="60%">
      <el-table :data="dialog.data"
        border
        class="control-table"
        height="100%"
        highlight-current-row
        :row-style="setColor"
        style="width: 100%">
        <el-table-column v-for="(item, index) in dialog.head"
          :key="index"
          :label="item.title"
          :min-width="item.width"
          :prop="item.field"
          :fixed="item.fixed"
          :formatter="dialogFormatter"
          align="center">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import load from './mixins/load'
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  mixins: [load],
  data () {
    return {
      head: Object.freeze([
        { field: 'index', title: '序号', width: 50, fixed: 'left' },
        { field: 'devName', title: '仪表名称', width: 150 },
        { field: 'changeTime', title: '变化时间', width: 154 },
        { field: 'changeProjectName', title: '变化项目（项目：历史值 -> 当前值）', width: 300 },
        { title: '操作', width: 100, type: 'btn' }
      ]),
      dialog: {
        title: '',
        show: false,
        head: Object.freeze([
          { field: 'index', title: '序号', width: 50, fixed: 'left' },
          { field: 'name', title: '因子名称', width: 150 },
          { field: 'nowValue', title: '当前', width: 100 },
          { field: 'hisValueN', title: '历史', width: 100 },
          { field: 'unit', title: '单位', width: 100 }
        ]),
        data: []
      },
      data: []
    }
  },
  watch: {
    'dialog.show' (val) {
      if (!val) {
        this.dialog = {
          ...this.dialog,
          title: '',
          data: []
        }
      }
    }
  },
  computed: {
    Loading: {
      get () {
        return this.loading
      },
      set (val) {
        this.$emit('update:loading', val)
      }
    }
  },
  methods: {
    initQuery () {
      this.queryControl()
    },
    // 动态管控, is是否刷新
    async queryControl () {
      let { id: pointId } = await this.$store.dispatch('IsPointLoad')
      if (!pointId) return false
      this.Loading = true
      try {
        let res = await this.$api.pointInfoCodeList({ current: 1, pointId, size: 20 })
        if (res.state === 0) {
          this.data = Object.freeze(res.data || [])
        }
        this.Loading = false
      } catch (error) {
        this.$isRepeat(error, () => {
          this.Loading = false
        })
      }
    },
    formatter (field, row, index) {
      let value = ''
      switch (field) {
        case 'changeProjectName':
          let projectName = row.changeProject.reduce((prev, c) => {
            if (c.hisValue) {
              prev += `${c.name}：${c.hisValue || ' '} -> ${c.nowValue || ' '}，`
            } else {
              prev += `${c.name}：${c.nowValue || ' '}，`
            }
            return prev
          }, '')
          projectName = projectName.length ? projectName.substring(0, projectName.length - 1) : ''
          value = projectName
          break
        case 'index':
          value = index + 1
          break
      }
      return value || row[field]
    },
    setColor (data) {
      if (data.row.hisValueN !== '') {
        return { color: 'red' }
      }
      return {}
    },
    // 详情
    detail (data) {
      this.dialog = {
        ...this.dialog,
        show: true,
        title: `${data.devName} ${data.changeTime}`
      }
      this.dialog.data = data.changeProject
    },
    dialogFormatter (row, { property: field }, cellValue, index) {
      let value = ''
      switch (field) {
        case 'index':
          value = index + 1
          break
        case 'hisValueN':
          value = row.rtdValue === row.hisValue ? '' : row.hisValue
          break
      }
      return value || cellValue
    }
  }
}
</script>

<style lang="scss" scoped>
.w150 {
  width: 150px;
}
// .dialog {
//   /deep/ {
//     .el-dialog {
//       min-width: 650px;
//     }
//   }
// }
// /deep/ {
//   .el-table__row {
//     cursor: pointer;
//   }
// }
</style>

<style lang="css">
.el-tooltip__popper {
  max-width: 300px;
}
</style>

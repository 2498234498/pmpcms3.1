<template>
  <div class="container" v-resize="mixinResize" ref="container">
    <div class="query-container clearfix" onselectstart="return false" ref="queryContainer">
      <query-bar label="开始时间：">
        <el-date-picker
          v-model="params.beginTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          size="mini"
          placeholder="请选择开始时间"
          align="right"
          :picker-options="startDatePicker">
        </el-date-picker>
      </query-bar>
      <query-bar label="结束时间：">
        <el-date-picker
          v-model="params.endTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          size="mini"
          placeholder="请选择结束时间"
          align="right"
          :picker-options="endDatePicker">
        </el-date-picker>
      </query-bar>
      <query-bar label="日志类型：">
        <el-select size="mini" class="select" v-model="params.oltCode" @change="query(params)">
          <el-option
            v-for="item in oltCodeArr"
            :key="item.oltCode"
            :label="item.oltName"
            :value="item.oltCode">
          </el-option>
        </el-select>
      </query-bar>
      <query-bar>
        <base-btn type="search" class="btn" @click="query(params)"></base-btn>
        <base-btn type="export" class="btn" @click="exportTable"></base-btn>
      </query-bar>
    </div>
    <el-table
      ref="table"
      :data="tableData"
      border
      class="table"
      :height="mixinHeight - 73"
      :class="['configurationTable', {afterRenderClass: mixinShowAfterRenderClass}]"
      highlight-current-row
      v-loading="loading"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="$store.getters.loadingColor"
      style="width: 100%">
      <el-table-column
        v-for="(item, index) in tableTitle"
        :key="index"
        :fixed="item.fixed ? item.fixed : false"
        :min-width="item.width"
        :label="item.label"
        align="center">
        <template slot-scope="scope">
          <span v-if="item.type === 'index'">{{(current - 1) * size + scope.$index + 1}}</span>
          <el-row v-else-if="item.type == 'btn'">
            <base-btn type="detail" @click="detail(scope.row)"></base-btn>
          </el-row>
          <span v-else>{{ item.type === 'type' ? scope.row[item.property.split('.')[0]][item.property.split('.')[1]] : scope.row[item.property] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="page-container"
      @size-change="current = 1, query(), handleTableScrollHeight('table')"
      @current-change="query(), handleTableScrollHeight('table')"
      :current-page.sync="current"
      background
      :page-sizes="sizes"
      :page-size.sync="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog
      title="平台用户操作日志"
      :visible.sync="showDialog"
      v-if="showDialog">
      <el-form label-width="120px" :model="form">
        <el-form-item v-for="item in formItem" :key="item.property" :label="item.label" >
          <span v-html="form[item.property].replace(/;/g, '<br>')">{{ form[item.property] }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import resizeMixin from '@/mixins/resize'
import datePickerMixin from '@/mixins/datePicker'
import pageMixins from '@/mixins/page'
import tableScrollHeight from '@/mixins/tableScrollHeight'
import { getDate, downFile, getType } from '@/utils'
export default {
  name: 'UserJournal',
  data () {
    return {
      params: {
        beginTime: `${getDate({format: 'yyyy-MM-dd'})} 00:00:00`,
        endTime: `${getDate({format: 'yyyy-MM-dd'})} 23:59:59`,
        oltCode: ''
      },
      paramsQuery: {},
      oltCodeArr: [],
      tableData: [],
      tableTitle: [
        { property: 'index', label: '序号', width: 50, fixed: 'left', type: 'index' },
        { property: 'olCreatetime', label: '时间', width: 140 },
        { property: 'user.usrFullname', label: '操作用户', width: 100, fixed: 'left', type: 'type' },
        { property: 'type.oltName', label: '日志类型', width: 140, type: 'type' },
        { property: 'olDistribution', label: '描述', width: 140 },
        { label: '操作', width: 140, fixed: 'right', type: 'btn' }
      ],
      loading: false,
      showDialog: false,
      formItem: [
        { property: 'olCreatetime', label: '时间：' },
        { property: 'user.usrFullname', label: '操作用户：' },
        { property: 'type.oltName', label: '日志类型：' },
        { property: 'olIp', label: 'IP地址：' },
        { property: 'olDistribution', label: '描述：' },
        { property: 'olParams', label: '操作详情：' }
      ],
      form: {
        'user.usrFullname': '',
        olIp: '',
        olClass: '',
        olMethod: '',
        'type.oltName': '',
        olDistribution: '',
        olCreatetime: '',
        olParams: ''
      }
    }
  },
  mixins: [resizeMixin, datePickerMixin, pageMixins, tableScrollHeight],
  methods: {
    detail (row) {
      this.showDialog = true
      for (let key in this.form) {
        this.form[key] = row[key] || row[key.split('.')[0]][key.split('.')[1]]
      }
    },
    async exportTable () {
      try {
        this.$message({
          message: '正在导出报表...',
          duration: 0
        })
        let res = await this.$api.sysOperateLogExport(this.params)
        this.$message.closeAll()
        if (getType(res) === 'Blob') {
          downFile(res, `平台用户操作日志${new Date().getTime()}.xls`)
          this.$message.success('导出成功')
        } else {
          this.$message.error('导出失败')
        }
      } catch (error) {
        this.$isRepeat(error, () => {
          this.$message({
            message: '正在导出报表...',
            duration: 0
          })
        })
      }
    },
    async query (params) {
      this.loading = true
      try {
        // 查询参数
        if (params) {
          this.current = 1
          for (let key in this.params) {
            this.paramsQuery[key] = this.params[key]
          }
        }
        let res = await this.$api.sysOperateLogListJson(Object.assign(this.paramsQuery, {
          size: this.size,
          current: this.current
        }))
        if (res.state === 0) {
          // 请求成功后赋值查询的值
          if (params) {
            for (let key in this.params) {
              this.paramsQuery[key] = this.params[key]
            }
          }
        }
        this.tableData = res.data.records || []
        this.total = res.data.total || 0
        this.loading = false
      } catch (error) {
        this.$isRepeat(error, () => {
          this.loading = false
        })
      }
    }
  },
  async created () {
    this.oltCodeArr = (await this.$api.sysOperateLogType()) || [{oltName: '全部', oltCode: ''}]
    await this.query(this.params)
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  span {
    word-break: break-all;
  }
  .select {
    width: 80px;
  }
}
</style>

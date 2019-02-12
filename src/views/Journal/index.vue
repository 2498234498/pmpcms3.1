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
          :picker-options="startDatePicker"
          @change="beginTimeChange">
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
          :picker-options="endDatePicker"
          @change="endTimeChange">
        </el-date-picker>
      </query-bar>
      <query-bar label="MN号：">
        <el-input v-model="params.mnnum" @keyup.enter.native="query(params)" class="mnWidth" size="mini" placeholder="输入MN号"></el-input>
      </query-bar>
      <query-bar label="CN：">
        <el-input size="mini" v-model="params.cn" @keyup.enter.native="query(params)" placeholder="输入CN"></el-input>
      </query-bar>
      <query-bar label="QN：">
        <el-input size="mini" v-model="params.qn" @keyup.enter.native="query(params)" placeholder="输入QN"></el-input>
      </query-bar>
      <query-bar label="解析状态：">
        <el-select v-model="params.errorType" size="mini" @change="query(params)" class="select">
          <el-option
            v-for="item in errorTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </query-bar>
      <query-bar>
        <base-btn type="search" @click="query(params)" class="btn"></base-btn>
        <base-btn type="export" @click="exportTable" class="btn"></base-btn>
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
          <span :class="item.type == 'dataPtText' ? 'name-wrapper' : ''" v-else>{{ item.type === 'type' ? errorType[scope.row[item.property]] : scope.row[item.property] }}</span>
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
      title="报文详情"
      :visible.sync="showDialog"
      v-if="showDialog">
      <el-form label-width="120px" :model="form">
        <el-form-item v-for="item in formItem" :key="item.property" :label="item.label">
          <span :class="item.class ? item.class : ''">{{ form[item.property] }}</span>
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
import { getDate, downFile } from '@/utils'
export default {
  name: 'PointJournal',
  data () {
    return {
      limitTime: 7,
      params: {
        mnnum: '',
        cn: '',
        qn: '',
        errorType: '',
        beginTime: `${getDate({format: 'yyyy-MM-dd'})} 00:00:00`,
        endTime: `${getDate({format: 'yyyy-MM-dd'})} 23:59:59`
      },
      paramsQuery: {},
      tableData: [],
      tableTitle: [
        { property: 'index', label: '序号', width: 50, fixed: 'left', type: 'index' },
        { property: 'dataPtMnnum', label: 'MN号', width: 150, fixed: 'left' },
        { property: 'dataPtCn', label: 'CN', width: 100 },
        { property: 'dataPtQn', label: 'QN', width: 160 },
        { property: 'dataPtDatatime', label: '数据时间', width: 160 },
        { property: 'dataPtInputtime', label: '接收时间', width: 160 },
        { property: 'dataPtText', label: '报文内容', width: 140, type: 'dataPtText' },
        { property: 'resolveErrorType', label: '解析状态', width: 150, type: 'type' },
        { label: '操作', width: 140, fixed: 'right', type: 'btn' }
      ],
      loading: false,
      showDialog: false,
      formItem: [
        { property: 'dataPtMnnum', label: 'MN号：' },
        { property: 'dataPtCn', label: 'CN：' },
        { property: 'dataPtQn', label: 'QN：' },
        { property: 'dataPtDatatime', label: '数据时间：' },
        { property: 'dataPtInputtime', label: '接收时间：' },
        { property: 'dataPtText', label: '报文内容：', class: 'msgContent' }
      ],
      form: {
        dataPtMnnum: '',
        dataPtCn: '',
        dataPtQn: '',
        dataPtDatatime: '',
        dataPtInputtime: '',
        dataPtText: ''
      },
      errorTypeList: [
        { label: '全部', value: '' },
        { label: '正常解析', value: 0 },
        { label: '接收错误', value: 1 },
        { label: '数据包为空', value: 2 },
        { label: 'CRC校验错误', value: 3 },
        { label: '超时', value: 4 },
        { label: '监控点不存在', value: 5 },
        { label: '解析错误', value: 6 },
        { label: '未解析', value: 7 }
      ],
      errorType: {
        '0': '正常解析',
        '1': '接收错误',
        '2': '数据包为空',
        '3': 'CRC校验错误',
        '4': '超时',
        '5': '监控点不存在',
        '6': '解析错误',
        '7': '未解析'
      }
    }
  },
  mixins: [resizeMixin, pageMixins, datePickerMixin, tableScrollHeight],
  methods: {
    async exportTable () {
      try {
        if (this.params.mnnum) {
          this.$message({
            message: '正在到导出报表...',
            duration: 0
          })
          let res = await this.$api.busDataPacketExport(this.params)
          this.$message.closeAll()
          if (typeof res === 'object') {
            downFile(res, `监控点通讯报文日志${new Date().getTime()}.xls`)
            this.$message.success('导出成功')
          } else {
            this.$message.error('导出失败')
          }
        } else {
          this.$message.error('只能导出一个监控点的报文日志,请输入一个MN号进行导出')
        }
      } catch (error) {
        this.$isRepeat(error, () => {
          this.$message({
            message: '正在到导出报表...',
            duration: 0
          })
        })
      }
    },
    detail (row) {
      this.showDialog = true
      for (let key in this.form) {
        this.form[key] = row[key]
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
        let res = await this.$api.busDataPacketListJson(Object.assign(this.paramsQuery, {
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
  created () {
    this.query(this.params)
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  .select {
    width: 120px;
  }
  .msgContent {
    word-wrap: break-word;
  }
  .table {
    /deep/ .cell {
      display: flex;
      justify-content: center;
      align-items: center;
      > span {
        height: 20px;
        line-height: 20px;
        display: inline-block;
        width: 100%;
      }
      .name-wrapper {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}
</style>

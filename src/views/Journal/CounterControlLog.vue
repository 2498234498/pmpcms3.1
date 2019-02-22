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
      <query-bar label="发起方式：">
        <el-select v-model="params.isAuto" size="mini" @change="query(params)" class="auto_select">
          <el-option
            v-for="item in isAutoList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </query-bar>
      <query-bar label="请求状态：">
        <el-select v-model="params.status" size="mini" @change="query(params)" class="status_select">
          <el-option
            v-for="item in statusList"
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
      :data="tableData"
      border
      ref="table"
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
          <span :class="item.type == 'rclText' ? 'name-wrapper' : ''" v-else>{{ item.type === 'type' ? codeType[scope.row[item.property]] : scope.row[item.property] }}</span>
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
      v-loading="loadingDetails"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="$store.getters.loadingColor"
      v-if="showDialog">
      <el-form label-width="120px" :model="form">
        <el-form-item v-for="item in formItem" :key="item.property" :label="item.label">
          <span :class="item.class ? item.class : ''">{{ form[item.property] ? form[item.property] : item.property === 'notify' || item.property === 'result' ? item.msg : ''}}</span>
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
  name: 'CounterControlLog',
  data () {
    return {
      limitTime: 7,
      params: {
        beginTime: `${getDate({format: 'yyyy-MM-dd'})} 00:00:00`,
        endTime: `${getDate({format: 'yyyy-MM-dd'})} 23:59:59`,
        mnnum: '',
        cn: '',
        qn: '',
        isAuto: '',
        status: ''
      },
      paramsQuery: {},
      tableData: [],
      tableTitle: [
        { property: 'index', label: '序号', width: 50, fixed: 'left', type: 'index' },
        { property: 'rclMnnum', label: 'MN号', width: 150, fixed: 'left' },
        { property: 'rclCn', label: 'CN', width: 100 },
        { property: 'rclQn', label: 'QN', width: 150 },
        { property: 'rclInputtime', label: '请求时间', width: 150 },
        { property: 'rclIsAuto', label: '发起方式', width: 140, type: 'type' },
        { property: 'rclStatus', label: '请求状态', width: 140, type: 'type' },
        { property: 'rclText', label: '报文内容', width: 140, type: 'rclText' },
        { label: '操作', width: 140, fixed: 'right', type: 'btn' }
      ],
      loading: false,
      showDialog: false,
      formItem: [
        { property: 'rclMnnum', label: 'MN号：' },
        { property: 'rclCn', label: 'CN：' },
        { property: 'rclQn', label: 'QN：' },
        { property: 'rclInputtime', label: '请求时间：' },
        { property: 'rclText', label: '请求报文：', class: 'msgContent' },
        { property: 'notify', label: '应答报文：', class: 'msgContent', msg: '暂无应答信息' },
        { property: 'result', label: '返回结果：', class: 'msgContent', msg: '暂无结果信息' }
      ],
      form: {
        rclMnnum: '',
        rclCn: '',
        rclQn: '',
        rclInputtime: '',
        rclText: '',
        notify: '',
        result: ''
      },
      loadingDetails: false,
      isAutoList: [
        { label: '全部', value: '' },
        { label: '系统发送', value: '0' },
        { label: '手动发送', value: '1' }
      ],
      statusList: [
        { label: '全部', value: '' },
        { label: '已发送', value: '2' },
        { label: '数采仪已收到反控', value: '3' },
        { label: '反控完成', value: '4' }
      ],
      codeType: {
        '0': '系统发送',
        '1': '手动发送',
        '2': '已发送',
        '3': '数采仪已收到反控',
        '4': '反控完成'
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
          let res = await this.$api.busReversecontrolLogExport(this.params)
          this.$message.closeAll()
          if (getType(res) === 'Blob') {
            downFile(res, `反控日志${new Date().getTime()}.xls`)
            this.$message.success('导出成功')
          } else {
            this.$message.error('导出失败')
          }
        } else {
          this.$message.error('只能导出一个监控点的反控日志,请输入一个MN号进行导出')
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
    async detail (row) {
      this.showDialog = true
      this.loadingDetails = true
      try {
        let res = await this.$api.busReversecontrolResultSelectByQn({qn: row.rclQn})
        if (res.state === 0) {
          for (let key in this.form) {
            this.form[key] = row[key] ? row[key] : res.data[key] || ''
          }
        }
        this.loadingDetails = false
      } catch (error) {
        this.$isRepeat(error, () => {
          this.loadingDetails = false
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
        let res = await this.$api.busReversecontrolLogListJson(Object.assign(this.paramsQuery, {
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
  .msgContent {
    word-wrap: break-word;
  }
  .auto_select {
    width: 80px;
  }
  .status_select {
    width: 130px;
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

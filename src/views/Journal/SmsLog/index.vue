<template>
  <div class="sms-log WH"
    v-resize="mixinResize"
    ref="container">
    <div class="query-container clearfix"
      onselectstart="return false"
      ref="queryContainer">
      <!-- TODO -->
      <query-bar label="开始时间：">
        <el-date-picker
          v-model="params.beginTime"
          type="datetime"
          size="mini"
          placeholder="请选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          align="right">
        </el-date-picker>
      </query-bar>
      <!-- TODO -->
      <query-bar label="结束时间：">
        <el-date-picker
          v-model="params.endTime"
          type="datetime"
          size="mini"
          placeholder="请选择结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="endDatePicker"
          align="right">
        </el-date-picker>
      </query-bar>
      <query-bar label="类型：">
        <el-select v-model="params.type" size="mini" class="w60" @change="query(params)">
          <el-option
            v-for="item in typeSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </query-bar>
      <query-bar label="企业：">
        <el-input v-model="params.comName" @keyup.enter.native="query(params)" size="mini" placeholder="输入企业"></el-input>
      </query-bar>
      <query-bar label="MN号：">
        <el-input v-model="params.mn" @keyup.enter.native="query(params)" size="mini" placeholder="输入MN号"></el-input>
      </query-bar>
      <query-bar>
        <base-btn type="search" class="btn" @click="query(params)"></base-btn>
      </query-bar>
    </div>
    <el-table ref="table"
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
      <el-table-column v-for="(item, index) in tableHead"
        :key="index"
        :fixed="item.fixed ? item.fixed : false"
        :min-width="item.width"
        :prop="item.field"
        :label="item.title"
        align="center">
        <template slot-scope="scope">
          <el-row v-if="item.type == 'btn'">
            <base-btn type="detail"
              @click="detail(scope.row)"></base-btn>
          </el-row>
          <span v-else>{{ formatter(scope.row, item.field, scope.row[item.field], scope.$index) }}</span>
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
      title="短信详情"
      :visible.sync="showDialog">
      <el-form label-width="120px" :model="form">
        <el-form-item v-for="item in formItem" :key="item.property" :label="item.label">
          <span :class="item.class ? item.class : ''" v-html="form[item.property]"></span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import resizeMixin from '@/mixins/resize'
import tableScrollHeight from '@/mixins/tableScrollHeight'
import pageMixins from '@/mixins/page'
import datePicker from './mixin/datePicker'
import { getDate, comSerial, cached, flatChildrenId } from '@/utils'
import city from '@/utils/city'
export default {
  mixins: [resizeMixin, pageMixins, tableScrollHeight, datePicker],
  data () {
    const nowDate = (type) => {
      return `${getDate({ format: 'yyyy-MM-dd' })} ${type === 'start' ? '00:00:00' : '23:59:59'}`
    }
    return {
      city: Object.freeze(city),
      tableData: [],
      tableHead: [
        { field: 'index', title: '序号', width: 50, fixed: 'left' },
        { field: 'sendTime', title: '发送时间', width: 150 },
        { field: 'reasonType', title: '类型', width: 50 },
        { field: 'areaId', title: '省市区', width: 150 },
        { field: 'comName', title: '企业', width: 140 },
        { field: 'poiName', title: '监控点', width: 140 },
        { field: 'mn', title: 'MN号', width: 130 },
        { field: 'sendResult', title: '发送结果', width: 80 },
        { type: 'btn', title: '操作', width: 100, fixed: 'right' }
      ],
      params: {
        beginTime: nowDate('start'),
        endTime: nowDate('end'),
        type: '2',
        comName: '',
        mn: ''
      },
      typeSelect: [
        { label: '全部', value: '2' },
        { label: '超标', value: '0' },
        { label: '离线', value: '1' }
      ],
      showDialog: false,
      formItem: [
        { property: 'sendTime', label: '时间：' },
        { property: 'receiver', label: '接收人：' },
        { property: 'content', label: '内容：' }
      ],
      form: {
        sendTime: '',
        receiver: '',
        content: ''
      }
    }
  },
  created () {
    // this.query(this.params)
  },
  methods: {
    cachedAddr: cached(flatChildrenId),
    async query (params) {
      this.loading = true
      let _query = this.query
      if (params) {
        this.current = 1
        _query.$params = {...(_query.$params || {}), ...params}
      }
      _query.$params = {
        ...(_query.$params || {}),
        current: this.current,
        size: this.size
      }

      try {
        const res = await this.$api.sysSmsLogList(_query.$params)
        if (res.state === 0) {
          this.tableData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error('列表查询失败')
        }
        this.loading = false
      } catch (err) {
        this.$isRepeat(err, () => {
          this.loading = false
        })
      }
    },
    formatter (row, property, cellValue, index) {
      const reasonTypeSelect = ['超标', '离线']
      let value = ''
      switch (property) {
        case 'index':
          value = comSerial(this.current, this.size, index)
          break
        case 'areaId':
          value = this.cachedAddr(this.city, cellValue, 'text').join('')
          break
        case 'reasonType':
          value = reasonTypeSelect[cellValue]
          break
        case 'sendResult':
          value = cellValue > 0 ? '发送成功' : cellValue
          break
      }
      return value || cellValue
    },
    detail ({ receiver, sendTime, content }) {
      this.showDialog = true
      this.form = {
        sendTime,
        content,
        receiver: receiver.split(';').reduce((prev, e) => {
          if (e) {
            const [ name, phone ] = e.split(',')
            return [...prev, `姓名：${name}，手机号：${phone}`]
          }
          return prev
        }, []).join('<br/>')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sms-log {
  .w60 {
    width: 60px;
  }
}
</style>

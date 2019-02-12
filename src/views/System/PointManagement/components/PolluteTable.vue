<template>
  <el-dialog
    title="请选择一个污染物"
    :visible.sync="showDialog"
    center
    width="80%"
    @close="$emit('cancel')"
    class="dialog"
    v-loading="loading"
    element-loading-text="数据加载中"
    element-loading-spinner="el-icon-loading"
    :element-loading-background="$store.getters.loadingColor"
  >
    <div class="query-container" onselectstart="return false">
      <query-bar label="污染物名称：">
        <el-input v-model="params.polName" @keyup.enter.native="query(params)" size="mini"></el-input>
      </query-bar>
      <query-bar label="污染物编码：">
        <el-input v-model="params.polCode" @keyup.enter.native="query(params)" size="mini"></el-input>
      </query-bar>
      <query-bar label="编码类型：">
        <el-select v-model="params.protocolType" @change="query(params)" size="mini">
          <el-option
            v-for="(item, index) in $store.state.codeData.protocolType"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </query-bar>
      <query-bar>
        <base-btn type="search" class="btn" @click="query(params)"></base-btn>
      </query-bar>
    </div>
    <el-table
      ref="polluteTable"
      :data="tableData"
      class="table"
      height="calc(100% - 62px - 36px)"
      highlight-current-row
      style="width: 100%"
      @row-click="rowClick"
    >
      <el-table-column
        v-for="(item, index) in tableTitle"
        :key="index"
        :min-width="item.width"
        :label="item.label"
        align="center"
      >
        <template slot-scope="scope">
          <el-row v-if="item.type === 'check'">
            <el-checkbox v-model="scope.row[item.property]"></el-checkbox>
          </el-row>
          <span v-else>{{item.type ==='type' ? $store.state.codeData.code[scope.row[item.property]] : scope.row[item.property]}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="page-container"
      @size-change="current = 1,query(), handleTableScrollHeight('polluteTable')"
      @current-change="query(), handleTableScrollHeight('polluteTable')"
      :current-page.sync="current"
      background
      :page-sizes="sizes"
      :page-size.sync="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <div slot="footer" class="dialog-footer">
      <el-button type="danger" @click="showDialog = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import tableScrollHeight from '@/mixins/tableScrollHeight'
import page from '@/mixins/page'
export default {
  mixins: [tableScrollHeight, page],
  data () {
    return {
      params: {
        polCode: '',
        polName: '',
        protocolType: ''
      },
      queryParams: {},
      tableData: [],
      tableTitle: [
        { label: '', width: 30, property: 'check', type: 'check' },
        { property: 'index', label: '序号', width: 50 },
        { property: 'polName', label: '污染物名称', width: 130 },
        { property: 'polCode', label: '污染物编码', width: 100 },
        { property: 'protocolType', label: '编码类型', width: 80, type: 'type' },
        { property: 'polSumUnit', label: '单位', width: 60 }
      ],
      showDialog: true,
      checkRow: {}
    }
  },
  methods: {
    async query (params) {
      this.loading = true
      try {
        if (params) {
          for (let key in this.params) {
            this.queryParams[key] = this.params[key]
          }
          this.checkRow = {}
        }
        let res = await this.$api.polQuery(Object.assign(this.queryParams, {
          current: this.current,
          size: this.size
        }))
        if (res.state === 0) {
          if (params) {
            for (let key in this.params) {
              this.queryParams[key] = this.params[key]
            }
          }
        }
        this.tableData = res.data.rows.map((ele, index) => {
          return {
            index: (this.current - 1) * this.size + index + 1,
            current: this.current,
            check: this.checkRow.index === (this.current - 1) * this.size + index + 1 ? true : false, // eslint-disable-line
            ...ele
          }
        }) || []
        this.total = res.data.total || 0
        this.loading = false
      } catch (error) {
        this.$isRepeat(error, () => {
          this.loading = false
        })
      }
    },
    rowClick (row) {
      // 判断是否切换页码
      if (this.current === row.current) {
        // 清楚上一次选中的checkout
        if (JSON.stringify(this.checkRow) !== '{}' && this.checkRow.index !== row.index) {
          let index = this.checkRow.index % this.size === 0 ? this.size - 1 : this.checkRow.index % this.size - 1
          this.$set(this.tableData[index], 'check', false)
        }
      } else {
        this.checkRow = {}
      }
      // 记录上一次选中的checkout
      this.checkRow = row
      let index = row.index % this.size === 0 ? this.size - 1 : row.index % this.size - 1
      this.$set(this.tableData[index], 'check', !row.check)
    },
    save () {
      if (JSON.stringify(this.checkRow) !== '{}') {
        this.$emit('checkData', this.checkRow)
        this.showDialog = false
      } else {
        this.$message.error('请选择一个污染物')
      }
    }
  },
  created () {
    this.query(this.params)
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  /deep/ {
    .el-dialog {
      min-width: 900px;
    }
    .el-dialog__body {
      padding: 10px;
      tbody {
        tr {
          cursor: pointer;
        }
      }
    }
  }
}
</style>

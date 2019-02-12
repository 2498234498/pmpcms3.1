<template>
  <el-dialog
    :title="`添加${infoCodeData.title}信息因子`"
    :visible.sync="showDialog"
    center
    width="60%"
    v-loading="loading"
    element-loading-text="数据加载中"
    element-loading-spinner="el-icon-loading"
    :element-loading-background="$store.getters.loadingColor"
    @close="$emit('cancel')"
    class="dialog"
  >
    <div class="query-container clearfix">
      <query-bar label="信息因子名称：">
        <el-input v-model="params.name" @keyup.enter.native="query(params)" size="mini"></el-input>
      </query-bar>
      <query-bar label="编码：">
        <el-input v-model="params.id" @keyup.enter.native="query(params)" size="mini"></el-input>
      </query-bar>
      <query-bar label="类型：">
        <el-select v-model="params.type" size="mini" @change="query(params)" class="select">
          <el-option
            v-for="(item, index) in infoCodeData.infoCodeTypeArr"
            :key="index"
            :value="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
      </query-bar>
      <query-bar>
        <base-btn type="search" class="btn" @click="query(params)"></base-btn>
      </query-bar>
    </div>
    <el-table
      ref="table"
      :data="tableData"
      border
      class="table"
      height="calc(100% - 44px)"
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
          <el-row v-if="item.type === 'checkBlooean'">
            <el-checkbox v-model="scope.row[item.property]"></el-checkbox>
          </el-row>
          <span v-else>{{ codeEscape(item.property, scope.row[item.property], scope.$index) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="danger" @click="showDialog = false">取 消</el-button>
      <el-button type="primary" @click="sumbit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    infoCodeData: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      showDialog: true,
      loading: false,
      params: {
        name: '',
        id: '',
        type: ''
      },
      tableTitle: [
        { label: '', width: 30, property: 'checkBlooean', type: 'checkBlooean' },
        { label: '序号', width: 50, property: 'index' },
        { property: 'name', label: '名字', width: 100 },
        { property: 'id', label: '编码', width: 100 },
        { property: 'type', label: '类型', width: 100, type: 'type' },
        { property: 'unitName', label: '单位', width: 100 }
      ],
      tableData: [],
      allTableData: [],
      checkRow: []
    }
  },
  methods: {
    // 编码转义
    codeEscape (type, value, index) {
      switch (type) {
        case 'index':
          return index + 1
        case 'type':
          return this.infoCodeData.type[value]
        default:
          return value
      }
    },
    async query (params) {
      this.loading = true
      try {
        if (params) {
          this.tableData = (await this.$api.queryAllInfoCode(this.params)).data || []
        } else {
          this.tableData = this.allTableData || []
        }
        this.tableData.forEach((ele, index) => {
          ele.index = index
        })
        this.loading = false
      } catch (error) {
        this.$isRepeat(error, () => {
          this.loading = false
        })
      }
    },
    rowClick (row) {
      this.$set(this.tableData[row.index], 'checkBlooean', !row.checkBlooean)
    },
    sumbit () {
      this.checkRow = []
      this.tableData.forEach(ele => {
        if (ele.checkBlooean) {
          this.checkRow.push(ele)
        }
      })
      if (this.checkRow.length) {
        this.$emit('add', this.checkRow)
        this.showDialog = false
      } else {
        this.$message.error('至少选择一个信息因子')
      }
    },
    async init () {
      let store = this.$store.state.information.polluteInforList
      this.allTableData = store
      // 判断污染物信息因子全部的表数据是否调过
      if (!this.allTableData.length) {
        this.allTableData = await this.$store.dispatch('getPolluteInfoList', this.params)
      }
      await this.query()
    }
  },
  created () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  /deep/ .el-dialog {
    min-width: 850px;
  }
  /deep/ .el-dialog__body {
    padding: 0 25px;
    tbody {
      tr {
        cursor: pointer;
      }
    }
  }
}
</style>



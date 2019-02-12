<template>
  <div class="container">
    <el-dialog
      :title="`${informationData.polName}信息因子`"
      width="70%"
      center
      :visible.sync="dialogFormVisible"
      @close="$emit('cancel')"
      v-loading="loading"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="$store.getters.loadingColor">
      <el-table
        ref="table"
        :data="tableData"
        border
        class="table"
        height="100%"
        highlight-current-row
        style="width: 100%">
        <el-table-column
          v-for="(item, index) in tableTitle"
          :key="index"
          :min-width="item.width"
          :label="item.label"
          align="center">
          <template slot-scope="scope">
            <el-row v-if="item.type === 'btn'">
              <base-btn type="delete" @click="del(scope.$index)"></base-btn>
            </el-row>
            <span v-else>{{ codeEscape(item.property, scope.row[item.property], scope.$index) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="showFactorList=true">添加信息因子</el-button>
        <el-button @click="dialogFormVisible=false" type="danger">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <information-factor-list v-if="showFactorList" :infoCodeData="infoCodeData" @add="add" @cancel="showFactorList=false"></information-factor-list>
  </div>
</template>

<script>
import informationFactorList from './InformationFactorList'
export default {
  props: {
    informationData: {
      type: Object,
      default: null
    }
  },
  components: {
    informationFactorList
  },
  data () {
    return {
      dialogFormVisible: true,
      showFactorList: false,
      loading: false,
      tableTitle: [
        { property: 'index', label: '序号', width: 50 },
        { property: 'name', label: '信息因子名称', width: 150 },
        { property: 'id', label: '编码', width: 100 },
        { property: 'type', label: '类型', width: 100 },
        { property: 'unitName', label: '单位', width: 100 },
        { label: '操作', width: 100, type: 'btn' }
      ],
      tableData: [],
      infoCodeData: {},
      type: {}
    }
  },
  methods: {
    // 编码转义
    codeEscape (type, value, index) {
      switch (type) {
        case 'index':
          return index + 1
        case 'type':
          return this.type[value]
        default:
          return value
      }
    },
    async infoCodeType () {
      let res = await this.$api.querySysInfoCodeType()
      res.data.forEach(ele => {
        this.type[ele.id] = ele.name
      })
      this.infoCodeData = {
        infoCodeTypeArr: [{ id: '', name: '全部' }, ...res.data || []],
        type: this.type,
        title: this.informationData.polName
      }
    },
    add (checkRowData) {
      this.tableData = [...this.tableData, ...checkRowData]
      // 去掉重复的污染物
      for (let i = 0; i < this.tableData.length - 1; i++) {
        for (let j = i + 1; j < this.tableData.length; j++) {
          if (this.tableData[i].id === this.tableData[j].id) {
            this.tableData.splice(j, 1)
          }
        }
      }
    },
    del (index) {
      this.tableData.splice(index, 1)
    },
    async submit () {
      this.loading = true
      let res = await this.$api.insertPollInfoCode({
        polId: this.informationData.polId,
        infoCodes: this.tableData.map(ele => ele.id).join() || ''
      })
      if (res.state === 0) {
        this.$message.success('操作成功')
        this.dialogFormVisible = false
        this.loading = false
      } else {
        this.$message.error('操作失败')
      }
    },
    async query () {
      this.loading = true
      try {
        let res = await this.$api.queryInfoCodeByPointId({polId: this.informationData.polId})
        this.tableData = res.data || []
        this.loading = false
      } catch (error) {
        this.$isRepeat(error, () => {
          this.loading = false
        })
      }
    }
  },
  async created () {
    this.loading = true
    await this.infoCodeType()
    await this.query()
  }
}
</script>

<style>
</style>



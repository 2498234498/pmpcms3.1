<template>
  <div>
    <el-dialog :title="title"
      :visible.sync="dialogShow"
      center
      class="dialog"
      v-loading="loading"
      width="70%"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="$store.getters.loadingColor">
      <el-tabs tab-position="left"
        v-model="tabs"
        style="height: 100%;">
        <el-tab-pane label="基本信息" class="tab-pane">
          <el-form :model="form.values"
            :rules="form.rules"
            status-icon
            ref="form">
            <el-form-item v-for="(item, index) in form.inputs"
              :key="index"
              :label="item.label"
              :prop="item.value"
              v-show="!item.hidden"
              label-width="120px">
              <el-input v-if="item.type === 'input'"
                :placeholder="item.placeholder"
                :type="item.types"
                :readonly="item.readonly"
                @focus="inputEvent(item.focus || '')"
                v-model.trim="form.values[item.value]" />
              <el-select v-else-if="item.type === 'select'"
                v-model="form.values[item.value]"
                :filterable="item.filterable"
                :disabled="item.disabled">
                <el-option v-for="(opt, opt_key) in item.select"
                  :key="opt_key"
                  :label="opt.label"
                  :value="opt.value" />
              </el-select>
              <el-cascader expand-trigger="hover"
                v-else-if="item.type === 'selects'"
                :options="item.select"
                :props="item.props"
                style="min-width: 300px;"
                v-model="form.values[item.value]" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="污染物信息"
          class="tab-pane"
          ref="pol">
          <el-table
            :data="custom.tableData"
            border
            highlight-current-row
            style="width: 100%"
            height="100%">
            <el-table-column
              v-for="(item, index) in polluteTableTitle"
              :key="index"
              :min-width="item.width"
              :label="item.label"
              align="center">
              <template slot-scope="scope">
                <el-row v-if="item.type == 'btn'">
                  <base-btn type="edit" @click="edit(scope.row)"></base-btn>
                  <base-btn type="delete" @click="del(scope.row.index)"></base-btn>
                </el-row>
                <span v-else>{{ item.type ? $store.state.codeData.code[scope.row[item.property]] || scope.row[item.property] : scope.row[item.property] }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="add" v-show="newShow">添加污染物</el-button>
        <el-button type="danger" @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <Bmap :show.sync="mapShow" :degree="degree" @submit="mapSubmit"></Bmap>
    <add-pollute v-if="showAddPollute" :rowData="rowData" @cancel="showAddPollute=false" @addRowData="addRowData"></add-pollute>
  </div>
</template>

<script>
import Bmap from './Bmap'
import AddPollute from './AddPollute'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    title: '',
    form: {
      type: Object,
      default () {
        return {
          inputs: [],
          values: {
            poiId: '',
            poiName: '',
            poiMnnum: '',
            comId: '',
            poiType: '32',
            poiMonitortype: '1',
            latlon: '',
            areaId: [],
            address: '',
            reportType: '05'
          },
          rules: {}
        }
      }
    },
    custom: {
      type: Object,
      default () {
        return {
          tableData: []
        }
      }
    }
  },
  components: { Bmap, AddPollute },
  data () {
    return {
      rowData: null,
      showAddPollute: false,
      tabs: '0',
      newShow: false,
      check: null,
      polShow: false,
      mapShow: false,
      polluteTableTitle: [
        { property: 'index', label: '序号', width: 50 },
        { property: 'polName', label: '污染物名称', width: 85 },
        { property: 'polCode', label: '污染物编码', width: 85 },
        { property: 'ceilval', label: '上限', width: 60 },
        { property: 'floorval', label: '下限', width: 60 },
        { property: 'type', label: '类型', width: 60, type: 'type' },
        { property: 'polUnit', label: '均值单位', width: 70 },
        { property: 'polSumUnit', label: '总量单位', width: 70 },
        { property: 'protocolType', label: '编码类型', width: 70, type: 'type' },
        { property: 'polSumUnit', label: '操作', width: 130, type: 'btn' }
      ],
      degree: ''
    }
  },
  computed: {
    dialogShow: {
      get () {
        return this.show
      },
      set (val) {
        this.$emit('update:show', val)
      }
    }
  },
  watch: {
    // 新增污染物显示隐藏
    tabs (val) {
      if (val === '1') {
        this.newShow = true
      } else {
        this.newShow = false
      }
    }
  },
  methods: {
    add () {
      this.rowData = Object.assign({title: '添加污染物'})
      this.showAddPollute = true
    },
    edit (row) {
      this.rowData = Object.assign(row, {title: '修改污染物'})
      this.showAddPollute = true
    },
    del (index) {
      this.custom.tableData.splice(index - 1, 1)
      this.custom.tableData.forEach((ele, index) => {
        ele.index = index + 1
      })
    },
    addRowData (addRowData) {
      let state = true
      if (addRowData.title === '添加污染物') {
        this.custom.tableData.forEach(ele => {
          if (ele.polName === addRowData.polName) {
            this.$message.error('请不要添加重复的污染物')
            state = false
          }
        })
        if (state) {
          this.custom.tableData.push(Object.assign(addRowData, {index: this.custom.tableData.length + 1}))
        }
      } else {
        this.custom.tableData.forEach((ele, index) => {
          if (ele.polName === addRowData.polName && addRowData.index - 1 !== index) {
            this.$message.error('污染物已存在,请修改成其他的污染物')
            state = false
          }
        })
        if (state) {
          this.custom.tableData.splice(addRowData.index - 1, 1, addRowData)
        }
      }
    },
    submit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let values = {...this.form.values}
          let { latlon = '' } = values
          let polList = this.custom.tableData.map(ele => {
            return {
              polId: ele.polId,
              polName: ele.polName,
              ceilval: ele.ceilval || '',
              floorval: ele.floorval || ''
            }
          })
          let params = {
            ...values,
            poiLongitude: latlon.split('/')[0] || '',
            poiLatitude: latlon.split('/')[1] || '',
            areaId: values.areaId.length ? values.areaId[values.areaId.length - 1] : '',
            polList: JSON.stringify(polList)
          }
          delete params.latlon
          this.$emit('submit', params)
        } else {
          this.tabs = '0'
          return false
        }
      })
    },
    // 初始化表单
    async formInit () {
      try {
        this.form.values = {
          poiId: '',
          poiName: '',
          poiMnnum: '',
          comId: '',
          poiType: '32',
          poiMonitortype: '1',
          latlon: '',
          areaId: [],
          address: '',
          reportType: '05'
        }
        this.custom.tableData = []
        this.tabs = '0'
        this.$nextTick(() => {
          this.$refs.form.clearValidate()
        })
      } catch (error) {
        return true
      }
    },
    inputEvent (e) {
      this[e] && this[e]()
      this.degree = this.form.values.latlon
    },
    // 地图显示
    mapEvent () {
      this.mapShow = true
    },
    // 地图提交事件
    mapSubmit (data) {
      this.form.values.latlon = data
    }
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
    }
    .el-tabs__content {
      height: 100%;
    }
  }
}
.tab-pane {
  height: 100%;
}
.table {
  /deep/ .cell {
    text-align: center;
  }
  .form-item {
    margin-bottom: 0;
    .input {
      width: 80%;
    }
  }
}
</style>

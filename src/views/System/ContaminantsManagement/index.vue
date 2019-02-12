<template>
  <div class="container" v-resize="mixinResize" ref="container">
    <div class="query-container clearfix" onselectstart="return false" ref="queryContainer">
      <query-bar label="编码类型：">
        <el-select v-model="params.protocolType" size="mini" @change="query(params)" class="select">
          <el-option v-for="(item, index) in $store.state.codeData.protocolType" :key="index" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </query-bar>
      <query-bar label="类型：">
        <el-select v-model="params.type" size="mini" @change="query(params)" class="select">
          <el-option v-for="(item, index) in $store.state.codeData.st" :key="index" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </query-bar>
      <query-bar label="污染物名称：">
        <el-input v-model="params.polName" @keyup.enter.native="query(params)" size="mini" placeholder="输入污染物名称"></el-input>
      </query-bar>
      <query-bar label="污染物编码：">
        <el-input v-model="params.polCode" @keyup.enter.native="query(params)" size="mini" placeholder="输入污染物编码"></el-input>
      </query-bar>
      <query-bar>
        <base-btn type="search" class="btn" @click="query(params)"></base-btn>
        <base-btn type="export" class="btn" :loading="exportLoading" @click="exportExcel"></base-btn>
        <base-btn type="add" class="btn" @click="openDialog"></base-btn>
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
      style="width: 100%"
      v-loading="loading"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="$store.getters.loadingColor">
      <el-table-column
        v-for="(item, index) in tableTitle"
        :key="index"
        :fixed="item.fixed ? item.fixed : false"
        :min-width="item.width"
        :label="item.label"
        align="center">
        <template slot-scope="scope">
          <el-row v-if="item.type == 'btn'">
            <base-btn type="relation" @click="showInformationFactor=true,informationData=scope.row"></base-btn>
            <base-btn v-if="scope.row.protocolType == '00'" type="edit" @click="openDialog(scope.row)"></base-btn>
            <base-btn v-if="scope.row.protocolType == '00'" type="delete" @click="del(scope.row.polId)"></base-btn>
          </el-row>
          <span v-else>{{ codeEscape(item.property, scope.row[item.property], scope.$index) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="page-container"
      @size-change="current = 1, query(), handleTableScrollHeight('table')"
      @current-change="query(), handleTableScrollHeight('table')"
      :current-page.sync="current"
      :page-sizes="sizes"
      :page-size.sync="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.show"
      center
      v-loading="dialog.loading"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="$store.getters.loadingColor"
      class="dialog">
      <el-form :model="form" :rules="rules" ref="form" status-icon label-width="100px" label-position="right">
        <el-form-item label="污染物名称" prop="polName">
          <el-input v-model="form.polName"></el-input>
        </el-form-item>
        <el-form-item label="污染物编码" prop="polCode">
          <el-input v-model="form.polCode"></el-input>
        </el-form-item>
        <el-form-item label="均值单位" prop="polUnit">
          <el-select v-model="form.polUnit">
            <el-option v-for="(item, index) in unit" :key="index" :value="item.unitname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编码类型">
          <el-select v-model="form.protocolType">
            <el-option value="00" label="自定义"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type">
            <el-option v-for="(item, index) in $store.state.codeData.stArr" :key="index" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialog.show = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </div>
    </el-dialog>
    <information-factor
      v-if="showInformationFactor"
      :informationData="informationData"
      @cancel="showInformationFactor=false">
    </information-factor>
  </div>
</template>

<script>
import { getDate, downFile, deleteAfterCurrent } from '@/utils'
import resizeMixin from '@/mixins/resize'
import page from '@/mixins/page'
import tableScrollHeight from '@/mixins/tableScrollHeight'
import informationFactor from './components/InformationFactor'
export default {
  name: 'ContaminantsManagement',
  mixins: [resizeMixin, page, tableScrollHeight],
  components: {
    informationFactor
  },
  data () {
    return {
      showInformationFactor: false,
      informationData: null,
      tableData: [],
      tableTitle: Object.freeze([
        { label: '序号', width: 50, property: 'index' },
        { property: 'polName', label: '污染物名称', width: 100 },
        { property: 'polCode', label: '污染物编码', width: 100 },
        { property: 'polUnit', label: '均值单位', width: 100 },
        { property: 'polSumUnit', label: '总量单位', width: 100 },
        { property: 'protocolType', label: '编码类型', width: 100, type: 'type' },
        { property: 'type', label: '类型', width: 100, type: 'type' },
        { property: 'polCreatetime', label: '创建时间', width: 150 },
        { label: '操作', width: 220, fixed: 'right', type: 'btn' }
      ]),
      params: {
        polCode: '',
        polName: '',
        protocolType: '',
        type: ''
      },
      paramsQuery: {},
      unit: [],
      exportLoading: false,
      form: {
        polName: '',
        polCode: '',
        polUnit: '',
        protocolType: '00',
        type: '32',
        polId: ''
      },
      rules: {
        polName: [
          { required: true, message: '请输入污染物名称', trigger: 'blur' },
          { min: 2, max: 20, message: '污染物名称必须是2至20位', trigger: 'blur' }
        ],
        polCode: [
          { required: true, message: '请输入污染物名称', trigger: 'blur' },
          { min: 2, max: 6, message: '污染物名称必须是2至6位', trigger: 'blur' }
        ]
      },
      dialog: {
        loading: false,
        show: false,
        title: ''
      }
    }
  },
  created () {
    this.query(this.params)
  },
  methods: {
    // 编码转义
    codeEscape (type, value, index) {
      switch (type) {
        case 'index':
          return (this.current - 1) * this.size + index + 1
        case 'type':
        case 'protocolType':
          return this.$store.state.codeData.code[value]
        default:
          return value
      }
    },
    // 查询
    async query (params) {
      this.loading = true
      try {
        if (params) {
          this.current = 1
          for (let key in this.params) {
            this.paramsQuery[key] = this.params[key]
          }
        }
        let res = await this.$api.polQuery(Object.assign(this.paramsQuery, {
          size: this.size,
          current: this.current
        }))
        if (res.state === 0) {
          if (params) {
            for (let key in this.params) {
              this.paramsQuery[key] = this.params[key]
            }
          }
        }
        this.tableData = res.data.rows || []
        this.total = res.data.total || 0
        this.loading = false
      } catch (error) {
        // 请求取消
        this.$isRepeat(error, () => {
          this.loading = false
        })
      }
    },
    del (polId) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async _ => {
        this.loading = true
        try {
          let res = await this.$api.polDelete({ids: polId})
          if (res.state === 0) {
            this.$message.success('删除成功')
            this.current = deleteAfterCurrent(this.current, this.size, this.total)
            this.query()
          } else {
            this.$message.error('删除失败')
          }
        } catch (error) {
          this.$isRepeat(_, () => {
            this.loading = false
          })
        }
      }).catch(() => {})
    },
    // 打开添加或修改模板
    async openDialog (params) {
      this.dialog = Object.assign(this.dialog, {
        show: true,
        loading: true
      })
      try {
        // 判断污染物列表是否调通过
        if (!this.unit.length) {
          let res = await this.$api.sysUnitList()
          this.unit = res.data || []
        }
        if (params) {
          // 清除表单验证的结果
          this.$nextTick(() => {
            this.$refs.form.clearValidate()
          })
          this.dialog.title = `修改${params.polName}污染物`
          for (let key in this.form) {
            this.form[key] = params[key]
          }
        } else {
          // 将所有字段值重置为初始值并移除校验结果
          this.$nextTick(() => {
            this.$refs.form.resetFields()
          })
          this.dialog.title = '添加污染物'
        }
        this.dialog.loading = false
      } catch (error) {
        this.$isRepeat(error, () => {
          this.dialog.loading = false
        })
      }
    },
    submit () {
      this.$refs.form.validate(async valid => {
        // 如果验证成功
        if (valid) {
          this.dialog.loading = true
          try {
            let polSumUnit = ''
            this.unit.forEach(ele => {
              if (ele.unitname === this.form.polUnit) {
                polSumUnit = ele.unitSum
              }
            })
            let params = Object.assign(this.form, {
              polSumUnit: polSumUnit
            })
            let res = ''
            let message = ''
            if (params.polId) {
              res = await this.$api.polUpdate(params)
              message = '修改'
            } else {
              res = await this.$api.polAdd(params)
              message = '添加'
            }
            if (res.state === 0) {
              this.$message.success(`${message}成功`)
              this.dialog.show = false
              this.dialog.loading = false
              this.query()
            } else {
              this.$message.error(res.msg)
            }
            this.dialog.loading = false
          } catch (error) {
            this.$isRepeat(error, () => {
              this.dialog.loading = false
            })
          }
        } else {
          return false
        }
      })
    },
    async exportExcel () {
      this.$message('正在导出报表中...')
      this.exportLoading = true
      try {
        let res = await this.$api.polExport(this.params)
        if (typeof res === 'object') {
          downFile(res, `污染物报表${getDate().replace(/[^0-9]/g, '')}.xls`)
        } else {
          this.$message.error('导出失败')
        }
        this.exportLoading = false
      } catch (error) {
        this.$isRepeat(error, () => {
          this.exportLoading = false
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  .select {
    width: 80px;
  }
}
</style>

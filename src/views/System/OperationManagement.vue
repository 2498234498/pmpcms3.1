<template>
  <div class="container" v-resize="mixinResize" ref="container">
    <div class="query-container clearfix" onselectstart="return false" ref="queryContainer">
      <query-bar label="运维商名称：">
        <el-input v-model.trim="params.name" @keyup.enter.native="query(params)" size="mini" placeholder="输入运维商名称"></el-input>
      </query-bar>
      <query-bar label="企业组织机构代码：">
        <el-input v-model.trim="params.companyCode" @keyup.enter.native="query(params)" size="mini" placeholder="输入企业组织机构代码"></el-input>
      </query-bar>
      <query-bar>
        <base-btn type="search" class="btn" @click="query(params)"></base-btn>
        <base-btn type="add" class="btn" @click="openDialog"></base-btn>
      </query-bar>
    </div>
    <el-table
      :data="tableData"
      border
      class="table"
      :height="mixinHeight - 73"
      ref="configurationTable"
      :class="['configurationTable', {afterRenderClass: mixinShowAfterRenderClass}]"
      v-loading="loading"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="$store.getters.loadingColor"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        v-for="(item, index) in tableTitle"
        :key="index"
        :fixed="item.fixed ? item.fixed : false"
        :min-width="item.width"
        :label="item.label"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-row v-if="item.type === 'btn'">
            <base-btn type="edit" @click="openDialog(scope.row)"></base-btn>
            <base-btn type="delete" @click="del(scope.row)"></base-btn>
          </el-row>
          <span>{{ codeEscape(item.property, scope.row[item.property], scope) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="page-container"
      @size-change="current = 1, query(), handleTableScrollHeight('configurationTable')"
      @current-change="query(), handleTableScrollHeight('configurationTable')"
      :current-page.sync="current"
      background
      :page-sizes="sizes"
      :page-size.sync="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <el-dialog
      :title="dialog.title"
      class="dialog"
      :visible.sync="dialog.show"
      center
      v-if="dialog.show"
      v-loading="dialog.loading"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="$store.getters.loadingColor"
    >
      <el-tabs tab-position="left" style="height: 100%;"  v-model="dialog.tabName">
        <el-tab-pane label="基本信息" name="0">
          <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" status-icon>
            <el-form-item label="运维商名称" prop="name">
              <el-input v-model.trim="form.name"></el-input>
            </el-form-item>
            <el-form-item label="组织机构代码" prop="companyCode">
              <el-input v-model.trim="form.companyCode"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="企业" ref="tabPane" name="1">
          <el-transfer v-model="transfer.checkCom" :props="props" :data="transfer.comList" :titles="['未选企业', '已选企业']"></el-transfer>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialog.show = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validateCode } from '@/utils/validate'
import resizeMixin from '@/mixins/resize'
import pageMixins from '@/mixins/page'
import tableScrollHeight from '@/mixins/tableScrollHeight'
import { deleteAfterCurrent } from '@/utils'
export default {
  name: 'OperationManagement',
  data () {
    return {
      props: {
        label: 'comName',
        key: 'comId'
      },
      params: {
        name: '',
        companyCode: ''
      },
      paramsQuery: {},
      tableData: [],
      tableTitle: Object.freeze([
        { property: 'index', label: '序号', width: 50, fixed: 'left' },
        { property: 'name', label: '运维商名称', width: 200, fixed: 'left' },
        { property: 'companyCode', label: '企业组织机构代码', width: 140 },
        { property: 'company', label: '旗下企业', width: 100 },
        { property: 'creatTime', label: '创建时间', width: 154 },
        { label: '操作', width: 140, fixed: 'right', type: 'btn' }
      ]),
      loading: false,
      form: {
        name: '',
        companyCode: '',
        id: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入运维商名称', trigger: 'change' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'change' }
        ],
        companyCode: [
          { validator: this.validator, trigger: 'change' }
        ]
      },
      dialog: {
        title: '',
        show: false,
        loading: false,
        tabName: '0'
      },
      transfer: {
        checkCom: [],
        comList: []
      }
    }
  },
  mixins: [resizeMixin, pageMixins, tableScrollHeight],
  methods: {
    // 编码转义
    codeEscape (type, value, {row, $index}) {
      switch (type) {
        case 'index':
          return (this.current - 1) * this.size + $index + 1
        case 'company':
          return row.operationAndCompany.map(item => item.comName).join(',')
        default:
          return value
      }
    },
    // 自定义验证
    validator ({ field }, value, callback) {
      switch (field) {
        case 'companyCode':
          if (value !== '' && !validateCode(value)) {
            callback(new Error('长度为 9 个字符的数字和字母或为空'))
          } else {
            callback()
          }
          break
        default:
          callback()
          break
      }
    },
    submit () {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          this.dialog.loading = true
          try {
            let params = Object.assign(this.form, {
              operationCompanyId: this.transfer.checkCom
            })
            let res = ''
            if (this.dialog.title === '添加运维商') {
              res = await this.$api.addSysOperation(params)
            } else {
              res = await this.$api.updateSysOperation(params)
            }
            let message = params.id ? '修改' : '添加'
            if (res.state === 0) {
              this.$message.success(`${message}成功`)
              this.dialog.show = false
              this.dialog.loading = false
              this.query()
            } else {
              this.$message.error(`${message}失败`)
            }
          } catch (error) {
            this.$isRepeat(error, () => {
              this.dialog.loading = false
            })
          }
          this.dialog.loading = false
        } else {
          this.dialog.tabName = '0'
        }
      })
    },
    async openDialog (params) {
      this.dialog = Object.assign(this.dialog, {
        show: true,
        loading: true,
        tabName: '0'
      })
      try {
        // 企业列表
        if (!this.transfer.comList.length) {
          let res = await this.$api.sysOperation()
          this.transfer.comList = res.data.map(ele => {
            return {comId: ele.comId, comName: ele.comName}
          }) || []
        }
        for (let key in this.form) {
          this.form[key] = params ? params[key] : ''
        }
        if (params) {
          this.dialog.title = `修改${params.name}运维商`
          this.transfer.checkCom = params.operationAndCompany.map(ele => ele.comId)
        } else {
          this.dialog.title = '添加运维商'
          this.transfer.checkCom = []
        }
        this.dialog.loading = false
      } catch (error) {
        this.$isRepeat(error, () => {
          this.dialog.loading = false
        })
      }
    },
    del (row) {
      let msgArr = ['该运维商有旗下企业和用户在使用', '该运维商有旗下企业在使用', '该运维商有用户在使用', '此操作将永久删除该运营商']
      let msg = ''
      if (row.operationAndCompany.length && row.operationAnduser.length) {
        msg = msgArr[0]
      } else if (row.operationAndCompany.length) {
        msg = msgArr[1]
      } else if (row.operationAnduser.length) {
        msg = msgArr[2]
      } else {
        msg = msgArr[3]
      }
      this.$confirm(`${msg}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async _ => {
        this.loading = true
        try {
          let res = await this.$api.deleteSysOperation({ id: row.id })
          if (res.state === 0) {
            this.$message.success('删除成功')
            this.current = deleteAfterCurrent(this.current, this.size, this.total)
            this.query()
          } else {
            this.$message.error('删除失败')
          }
          this.loading = false
        } catch (error) {
          this.$isRepeat(error, () => {
            this.loading = false
          })
        }
      }).catch(() => { })
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
        let res = await this.$api.querySysOperation(Object.assign(this.paramsQuery, {
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
  .dialog {
    /deep/ .el-dialog {
      min-width: 900px;
    }
  }
  /deep/ .el-tabs__content {
    height: 100%;
    .el-tab-pane {
      height: 100%;
      .el-transfer {
        height: 100%;
        margin-left: 80px;
        .el-transfer-panel {
          height: 100%;
          .el-transfer-panel__body {
            height: 100%;
            overflow: auto;
            .el-checkbox-group {
              height: 100%;
            }
          }
        }
      }
    }
  }
}
</style>

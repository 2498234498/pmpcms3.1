<template>
  <div class="container" v-resize="mixinResize" ref="container">
    <!-- onselectstart处理双击容器选中容器中的内容 -->
    <div class="query-container clearfix" onselectstart="return false" ref="queryContainer">
      <query-bar label="字典名称：">
        <!-- v-model.trim去掉左右空格 -->
        <el-input v-model.trim="params.dicName" @keyup.enter.native="query(params)" size="mini" placeholder="输入字典名称"></el-input>
      </query-bar>
      <query-bar label="字典编码：">
        <el-input v-model.trim="params.dicCode" @keyup.enter.native="query(params)" size="mini" placeholder="输入字典编码"></el-input>
      </query-bar>
      <query-bar label="字典值：">
        <el-input v-model.trim="params.dicValue" @keyup.enter.native="query(params)" size="mini" placeholder="输入字典值"></el-input>
      </query-bar>
      <query-bar>
        <base-btn type="search" class="btn" @click="query(params)"></base-btn>
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
      v-loading="loading"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="$store.getters.loadingColor"
      style="width: 100%"
    >
      <el-table-column
        v-for="(item, index) in tableTitle"
        :key="index"
        :fixed="item.fixed ? item.fixed : false"
        :min-width="item.width"
        :label="item.label"
        align="center"
      >
        <template slot-scope="scope">
          <el-row v-if="item.type == 'btn'">
            <base-btn type="edit" @click="openDialog(scope.row)"></base-btn>
            <base-btn type="delete" @click="del(scope.row)"></base-btn>
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
      background
      :page-sizes="sizes"
      :page-size.sync="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <el-dialog
      :title="title"
      :visible.sync="showDialog"
      center
      v-if="showDialog"
      v-loading="loadingDialog"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="$store.getters.loadingColor"
    >
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" status-icon>
        <el-form-item label="字典名称" prop="dicName">
          <el-input v-model.trim="form.dicName"></el-input>
        </el-form-item>
        <el-form-item label="字典编码" prop="dicCode">
          <el-input v-model.trim="form.dicCode"></el-input>
        </el-form-item>
        <el-form-item label="字典值" prop="dicValue">
          <el-input v-model.trim="form.dicValue"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="dicRemark">
          <el-input v-model="form.dicRemark" type="textarea" placeholder="请输入内容" :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import resizeMixin from '@/mixins/resize'
import pageMixins from '@/mixins/page'
import tableScrollHeight from '@/mixins/tableScrollHeight'
// import { validateChinese } from '@/utils/validate'
import { deleteAfterCurrent } from '@/utils'
export default {
  name: 'DictionaryTable',
  mixins: [resizeMixin, pageMixins, tableScrollHeight],
  data () {
    // const dicCode = (rule, value, callback) => {
    //   if (!value) callback(new Error('字典编码不能为空'))
    //   if (!validateChinese(value)) callback(new Error('字典编码不能为中文'))
    //   callback()
    // }
    // const dicValue = (rule, value, callback) => {
    //   if (!value) callback(new Error('字典值不能为空'))
    //   if (!validateChinese(value)) callback(new Error('字典值不能为中文'))
    //   callback()
    // }
    return {
      params: {
        dicName: '',
        dicCode: '',
        dicValue: ''
      },
      paramsQuery: {},
      tableData: [],
      tableTitle: [
        { property: 'index', label: '序号', width: 50, fixed: 'left' },
        { property: 'dicName', label: '字典名称', width: 150, fixed: 'left' },
        { property: 'dicCode', label: '字典编码', width: 150 },
        { property: 'dicValue', label: '字典值', width: 100 },
        { property: 'dicRemark', label: '备注', width: 250 },
        { property: 'dicCreatetime', label: '创建时间', width: 154 },
        { property: 'dicUpdatetime', label: '修改时间', width: 154 },
        { label: '操作', width: 140, type: 'btn', fixed: 'right' }
      ],
      form: {
        dicId: '',
        dicName: '',
        dicCode: '',
        dicValue: '',
        dicRemark: ''
      },
      rules: {
        dicName: [{ required: true, message: '字典名称不能为空', trigger: 'change' }],
        dicCode: [{ required: true, message: '字典编码不能为空', trigger: 'change' }],
        dicValue: [{ required: true, message: '字典值不能为空', trigger: 'change' }],
        dicType: [{ required: true, message: '字典类型不能为空', trigger: 'change' }]
      },
      loadingDialog: false,
      showDialog: false,
      title: '',
      loading: false
    }
  },
  methods: {
    del (row) {
      this.$confirm(`确定要删除${row.dicName}字典表?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async _ => {
        this.loading = true
        let res = await this.$api.sysDictionaryDelete({ids: row.dicId})
        if (res.state === 0) {
          this.$message.success('删除成功')
          this.current = deleteAfterCurrent(this.current, this.size, this.total)
          this.query()
        } else {
          this.$message.error('删除失败')
        }
        this.loading = false
      }).catch(() => { })
    },
    // 添加或修改
    openDialog (params) {
      this.showDialog = true
      this.title = params ? '修改字典表' : '添加字典表'
      for (let key in this.form) {
        this.form[key] = params ? params[key] : ''
      }
    },
    submit () {
      this.$refs['ruleForm'].validate(async valid => {
        if (!valid) return false
        this.loadingDialog = true
        try {
          let res = ''
          let message = ''
          if (this.title === '添加字典表') {
            message = '添加'
            res = await this.$api.sysDictionaryAdd(this.form)
          } else {
            message = '修改'
            res = await this.$api.sysDictionaryUpdate(this.form)
          }
          if (res.state === 0) {
            this.$message.success(`${message}成功`)
            this.showDialog = false
            this.query()
          } else {
            this.$message.error(`${message}失败`)
          }
          this.loadingDialog = false
        } catch (error) {
          console.log(error)
        }
      })
    },
    // 编码转义
    codeEscape (type, value, index) {
      switch (type) {
        case 'index':
          return (this.current - 1) * this.size + index + 1
        default:
          return value
      }
    },
    async query (params) {
      this.loading = true
      try {
        // 请求参数
        if (params) {
          this.current = 1
          for (let key in this.params) {
            this.paramsQuery[key] = this.params[key]
          }
        }
        let res = await this.$api.sysDictionaryQuery(Object.assign(this.paramsQuery, {
          size: this.size,
          current: this.current
        }))
        if (res.state === 0) {
          // 请求成功后赋值
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
}
</style>



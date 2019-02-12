<template>
  <div class="container" v-resize="mixinResize" ref="container">
    <!-- onselectstart处理双击容器选中容器中的内容 -->
    <div class="query-container clearfix" onselectstart="return false" ref="queryContainer">
      <query-bar label="企业名称：">
        <!-- v-model.trim去掉左右空格 -->
        <el-input v-model.trim="params.comName" @keyup.enter.native="query(params)" size="mini" placeholder="输入企业名称"></el-input>
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
    ></el-pagination>
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
        <el-form-item label="企业名称" prop="comName">
          <el-input v-model.trim="form.comName"></el-input>
        </el-form-item>
        <el-form-item label="企业地址" prop="areaId">
          <el-cascader
            class="cascader"
            expand-trigger="hover"
            :options="cityList"
            :props="props"
            v-model="form.areaId"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model.trim="form.comAddress"></el-input>
        </el-form-item>
        <el-form-item label="组织机构代码" prop="orgId">
          <el-input v-model.trim="form.orgId"></el-input>
        </el-form-item>
        <el-form-item label="企业类型" prop="comIndustry">
          <el-select v-model="form.comIndustry">
            <el-option
              v-for="item in companyType"
              :key="item.indId"
              :value="item.indId"
              :label="item.indName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="环保负责人">
          <el-input v-model.trim="form.usrId"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="comContactPhone">
          <el-input v-model.trim="form.comContactPhone"></el-input>
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
import { flatChildrenId, deleteAfterCurrent } from '@/utils'
import resizeMixin from '@/mixins/resize'
import pageMixins from '@/mixins/page'
import tableScrollHeight from '@/mixins/tableScrollHeight'
import city from '@/utils/city'
import { validatePhone } from '@/utils/validate'
export default {
  name: 'EnterpriseManagement',
  data () {
    var phone = (rule, value, callback) => {
      if (value && !validatePhone(value)) {
        callback(new Error('手机号码格式不正确,请输入正确的手机号码!'))
      } else {
        callback()
      }
    }
    return {
      props: {
        value: 'id',
        label: 'text'
      },
      params: {
        comName: ''
      },
      paramsQuery: {},
      tableData: [],
      tableTitle: Object.freeze([
        { property: 'index', label: '序号', width: 50, fixed: 'left' },
        { property: 'comName', label: '企业名称', width: 100, fixed: 'left' },
        { property: 'areaId', label: '省/市/区', width: 200 },
        { property: 'orgId', label: '组织机构代码', width: 100 },
        { property: 'comCreatetime', label: '创建时间', width: 154 },
        { label: '操作', width: 140, fixed: 'right', type: 'btn' }
      ]),
      loading: false,
      showDialog: false,
      loadingDialog: false,
      title: '',
      row: {},
      form: {
        comName: '',
        areaId: [],
        comAddress: '',
        orgId: '',
        comIndustry: '',
        usrId: '',
        comId: '',
        comContactPhone: ''
      },
      rules: {
        comName: [
          { required: true, message: '请输入企业名称', trigger: 'change' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'change' }
        ],
        orgId: [{ min: 9, max: 9, message: '长度为 9 个字符', trigger: 'change' }],
        areaId: [{ required: true, message: '请输入企业地址', trigger: 'change' }],
        comIndustry: [{ required: true, message: '请输入企业类型', trigger: 'change' }],
        comContactPhone: [{ required: true, validator: phone }]
      },
      cityList: Object.freeze(city),
      companyType: []
    }
  },
  mixins: [resizeMixin, pageMixins, tableScrollHeight],
  methods: {
    // 添加或修改
    async openDialog (params) {
      this.showDialog = true
      this.loadingDialog = true
      // 给form表单里的变量赋值
      for (let key in this.form) {
        this.form[key] = key === 'areaId' ? params ? flatChildrenId(this.cityList, params.areaId) : [] : params ? params[key] : ''
      }
      this.title = params ? `修改${params.comName}企业配置` : '添加企业配置'
      // 判断企业类型列表是否成功请求过,如果成功过,第二次就不会再次请求
      if (!this.companyType.length) {
        let res = await this.$api.companyTypeList()
        this.companyType = res.data || []
      }
      this.loadingDialog = false
    },
    // 编码转义
    codeEscape (type, value, index) {
      switch (type) {
        case 'index':
          return (this.current - 1) * this.size + index + 1
        case 'areaId':
          return flatChildrenId(this.cityList, value, 'text').join('/')
        default:
          return value
      }
    },
    async submit () {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          this.loadingDialog = true
          try {
            // 请求参数
            let params = {}
            for (let key in this.form) {
              params[key] = key === 'areaId' ? this.form.areaId[this.form.areaId.length - 1] : this.form[key]
            }
            // 请求结果
            let res = ''
            if (this.title === '添加企业配置') {
              res = await this.$api.addSysCompany(params)
            } else {
              res = await this.$api.updateSysCompany(params)
            }
            // 操作成功后的提示的消息
            let message = params.comId ? '修改' : '添加'
            if (res.state === 0) {
              this.$message.success(`${message}成功`)
              this.showDialog = false
              this.query()
            } else {
              this.$message.error(`${message}失败`)
            }
            this.loadingDialog = false
          } catch (error) {
            // 代码程序出错时抛出的错误
            this.$isRepeat(error, () => { })
          }
        } else {
          return false
        }
      })
    },
    async del (row) {
      this.loading = true
      try {
        let res = await this.$api.deleteSysCompany({ comId: row.comId, type: 'one' })
        this.$confirm(res.state !== 0 ? `${res.msg}是否继续?` : '此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async _ => {
          let res = await this.$api.deleteSysCompany({ comId: row.comId })
          if (res.state === 0) {
            this.$message.success('删除成功')
            // 删除成功后,对页码的处理
            this.current = deleteAfterCurrent(this.current, this.size, this.total)
            this.query()
          } else {
            this.$message.error('删除失败')
          }
          this.loading = false
        }).catch(() => { })
      } catch (error) {
        this.$isRepeat(error, () => {
          this.loading = false
        })
      }
    },
    // 查询
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
        let res = await this.$api.getSysCompany(Object.assign(this.paramsQuery, {
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
        this.tableData = res.data.list || []
        this.total = res.data.total || 0
        this.loading = false
      } catch (error) {
        // 请求取消
        this.$isRepeat(error, () => {
          this.loading = false
        })
      }
    }
  },
  created () {
    // 省市区数据
    // this.cityList = Object.freeze(city)
    this.query(this.params)
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  .cascader {
    width: $formInputWidth;
  }
}
</style>

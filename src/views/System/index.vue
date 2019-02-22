<template>
  <div class="container" v-resize="mixinResize" ref="container">
    <!-- onselectstart处理双击容器选中容器中的内容 -->
    <div class="query-container clearfix" ref="queryContainer" onselectstart="return false">
      <query-bar label="账号：">
        <el-input v-model="queryValue.usrName"
          @keyup.enter.native="query(queryValue)"
          size="mini"
          placeholder="输入账号"></el-input>
      </query-bar>
      <query-bar label="姓名：">
        <el-input v-model="queryValue.usrFullname"
          @keyup.enter.native="query(queryValue)"
          size="mini"
          placeholder="输入姓名"></el-input>
      </query-bar>
      <query-bar label="激活状态：">
        <el-select v-model="queryValue.usrActive"
          class="select"
          @change="query(queryValue)"
          size="mini">
          <el-option v-for="(opt, opt_key) in usrActiveSelect"
            :key="opt_key"
            :label="opt.label"
            :value="opt.value" />
        </el-select>
      </query-bar>
      <query-bar label="用户类型：">
        <el-select v-model="queryValue.rolId"
          class="select"
          @change="query(queryValue)"
          size="mini">
          <el-option v-for="(opt, opt_key) in rulIdSelect"
            :key="opt_key"
            :label="opt.label"
            :value="opt.value" />
        </el-select>
      </query-bar>
      <query-bar>
        <base-btn type="search"
          class="btn"
          @click="query(queryValue)"></base-btn>
        <base-btn type="export"
          class="btn"
          :loading="exportLoading"
          @click="exportTable(queryValue)"></base-btn>
        <base-btn type="add"
          class="btn"
          @click="add"></base-btn>
      </query-bar>
    </div>
    <el-table :data="tableData"
      border
      class="table"
      ref="configurationTable"
      :height="mixinHeight - 73"
      highlight-current-row
      style="width: 100%"
      :class="['configurationTable', {afterRenderClass: mixinShowAfterRenderClass}]"
      v-loading="loading"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="$store.getters.loadingColor">
      <el-table-column v-for="(item, index) in tableTitle"
        :key="index"
        :fixed="item.fixed || false"
        :min-width="item.width"
        :label="item.label"
        align="center">
        <template slot-scope="scope">
          <el-row v-if="item.type == 'btn'">
            <base-btn type="edit"
              @click="edit(scope.row)"></base-btn>
            <!-- 超级管理不能删除 -1 -->
            <!-- 不能删除当前登录的账号 -->
            <base-btn type="delete"
              v-if="scope.row.rolId !== '-1' && scope.row.usrId !== $store.getters.userInfo.usrId"
              @click="del(scope.row)"></base-btn>
          </el-row>
          <span v-else>{{ formatter(scope.row, item.property, scope.row[item.property], scope.$index) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="page-container"
      @size-change="current = 1, query(), handleTableScrollHeight('configurationTable')"
      @current-change="query(), handleTableScrollHeight('configurationTable')"
      background
      :current-page.sync="current"
      :page-sizes="sizes"
      :page-size.sync="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog :title="form.title"
      :visible.sync="form.showDialog"
      center
      class="dialog"
      width="60%"
      v-loading="form.loading"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="$store.getters.loadingColor">
      <el-form :model="form.values"
        :rules="form.rules"
        status-icon
        style="margin-top: -60px;"
        ref="form">
        <el-form-item>
          <el-input type="text" style="opacity: 0;"></el-input>
          <el-input type="password" style="opacity: 0;"></el-input>
        </el-form-item>
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
            :clearable="item.clearable"
            :disabled="item.disabled"
            @blur="inputEvent(item.blur)"
            @focus="inputEvent(item.focus)"
            v-model="form.values[item.value]"></el-input>
          <el-select v-else-if="item.type === 'select'"
            v-model="form.values[item.value]"
            :filterable="item.filterable"
            :disabled="item.disabled">
            <el-option v-for="(opt, opt_key) in item.select"
              :key="opt_key"
              :label="opt.label"
              :disabled="item.disabled"
              :value="opt.value" />
          </el-select>
          <el-radio-group v-else-if="item.type === 'radio'"
            v-model="form.values[item.value]">
            <el-radio v-for="(opt, opt_key) in item.select"
              :key="opt_key"
              :label="opt.value">{{ opt.label }}</el-radio>
          </el-radio-group>
          <el-date-picker v-else-if="item.type === 'dateTime'"
            :placeholder="item.placeholder"
            v-model="form.values[item.value]"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss" />
          <el-transfer v-else-if="item.type === 'transfer'"
            class="transfer"
            v-model="form.values[item.value]"
            ref="transfer"
            :data="item.select"
            filterable
            :titles="item.titles"></el-transfer>
        </el-form-item>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button type="danger" @click="form.showDialog = false">取 消</el-button>
        <el-button type="primary"
          @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { comSerial, parseTime, downFile, deleteAfterCurrent, getType } from '@/utils'
import { validateText, validatePhone, validateEmail } from '@/utils/validate'
import md5 from 'md5'
import resizeMixin from '@/mixins/resize'
import page from '@/mixins/page'
import tableScrollHeight from '@/mixins/tableScrollHeight'
export default {
  name: 'UserManagement',
  mixins: [resizeMixin, page, tableScrollHeight],
  data () {
    let userSelect = []
    // 只有超级管理员才有“管理员”权限修改
    if (['-1'].includes(this.$store.getters.userInfo.rolId)) {
      userSelect = [
        { label: '管理员', value: '1' },
        { label: '运维商', value: '2' },
        { label: '企业', value: '3' }
      ]
    } else {
      userSelect = [
        { label: '运维商', value: '2' },
        { label: '企业', value: '3' }
      ]
    }
    return {
      exportLoading: false,
      queryValue: {
        usrName: '',
        usrFullname: '',
        usrActive: '',
        rolId: ''
      },
      usrActiveSelect: Object.freeze([{ label: '全部', value: '' }, { label: '已激活', value: 1 }, { label: '已冻结', value: 0 }]),
      rulIdSelect: [],
      tableData: [],
      ComArr: [], // 运维商ID数组
      OperArr: [], // 企业ID数组
      defPass: '******',
      tableTitle: [
        { property: 'index', label: '序号', width: 50, fixed: 'left' },
        { property: 'usrName', label: '账号', width: 100, fixed: 'left' },
        { property: 'usrFullname', label: '姓名', width: 140 },
        { property: 'usrMobile', label: '手机号', width: 110 },
        { property: 'usrActiveName', label: '激活状态', width: 100 },
        { property: 'usrDeadlineName', label: '过期时间', width: 150 },
        { property: 'rolName', label: '用户类型', width: 100 },
        { property: 'usrCreatetime', label: '创建时间', width: 151 },
        { property: 'usrLogintime', label: '最后登录时间', width: 151 },
        { label: '操作', width: 140, fixed: 'right', type: 'btn' }
      ],
      form: {
        showDialog: false,
        type: 'add',
        openIng: false,
        title: '添加用户',
        loading: false,
        inputs: [
          { label: '', type: 'input', value: 'usrId', hidden: true },
          { label: '账号', type: 'input', value: 'usrName', placeholder: '可输入企业组织机构代码', readonly: false, hidden: false, disabled: false },
          { label: '密码', type: 'input', value: 'password', types: 'password', clearable: true, blur: 'passBlur', focus: 'passFocus', hidden: false },
          { label: '姓名', type: 'input', value: 'usrFullname', hidden: false },
          { label: '手机号', type: 'input', value: 'usrMobile', hidden: false },
          { label: '电子邮箱', type: 'input', value: 'usrEmail', hidden: false },
          { label: '激活状态', type: 'radio', value: 'usrActive', select: [{ label: '是', value: '1' }, { label: '否', value: '0' }], hidden: false },
          { label: '用户类型', type: 'select', value: 'rolId', select: userSelect, hidden: false, disabled: false },
          { label: '帐号过期时间', type: 'dateTime', value: 'usrDeadline', placeholder: '默认永久', hidden: false },
          { label: '授权运维商', type: 'transfer', value: 'paramOper', select: [], titles: ['运维商列表', '我的列表'], hidden: false, filterable: true },
          { label: '授权企业', type: 'transfer', value: 'paramCom', select: [], titles: ['企业列表', '我的列表'], hidden: false, filterable: true }
        ],
        values: {
          usrId: '',
          usrName: '',
          password: '',
          usrFullname: '',
          usrMobile: '',
          usrEmail: '',
          usrActive: '1',
          rolId: '',
          usrDeadline: '',
          paramOper: [],
          paramCom: []
        },
        rules: {
          usrName: { required: true, validator: this.validator, trigger: 'blur' },
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '密码长度必须是6位至15位', trigger: 'blur' }
          ],
          usrFullname: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 2, max: 15, message: '姓名长度必须是2位至15位', trigger: 'blur' }
          ],
          usrMobile: { required: true, validator: this.validator, trigger: 'blur' },
          usrEmail: { validator: this.validator, trigger: 'blur' }
        }
      }
    }
  },
  created () {
    this.queryUserType()
    this.query(this.queryValue)
    this.queryCom()
    this.queryOper()
  },
  watch: {
    // 监听用户类型
    'form.values.rolId': {
      handler (val, od) {
        if (val === '') return false
        let match = ['paramOper', 'paramCom']
        const tabList = [[6, 8, 9, 10], [], [10], [9]]
        // console.log(this.form.values)
        if (val === '-1' || this.form.values.usrId === this.$store.getters.userInfo.usrId) {
          val = '0'
          match = match.concat('usrActive', 'usrDeadline')
        }
        this.form.inputs.forEach((e, k) => {
          if (match.includes(e.value)) {
            if (tabList[val].includes(k)) {
              e.hidden = true
            } else {
              e.hidden = false
            }
            if (val !== '0') {
              if (val === '2' || val === '3') {
                e.type = 'select'
              } else {
                e.type = 'transfer'
              }
            }
          } else if (od === '-1' && e.value !== 'usrId') {
            e.hidden = false
          } else if (this.form.values.usrId !== this.$store.getters.userInfo.usrId && ['usrActive', 'usrDeadline'].includes(e.value)) {
            e.hidden = false
          }
        })

        // 如果修改的是超级管理员，则不显示激活状态、过期时间、运维商、企业
        if (val === '0') {
          this.form.inputs.find(e => e.value === 'rolId').disabled = true
        } else {
          this.form.inputs.find(e => e.value === 'rolId').disabled = false
        }

        // let type = this.form.type
        // console.log(this.form.openIng)
        let values = this.form.values
        switch (val) {
          case '0':
          case '1':
            if (this.form.openIng) {
              values['paramCom'] = Array.isArray(values['paramCom']) ? values['paramCom'] : values['paramCom'].split(',')
              values['paramOper'] = Array.isArray(values['paramOper']) ? values['paramOper'] : values['paramOper'].split(',')
            } else {
              values['paramCom'] = []
              values['paramOper'] = []
            }
            break
          case '2':
          case '3':
            if (this.form.openIng) {
              values['paramOper'] = Array.isArray(values['paramOper']) ? values['paramOper'][0] || '' : values['paramOper'] || ''
              values['paramCom'] = Array.isArray(values['paramCom']) ? values['paramCom'][0] || '' : values['paramCom'] || ''
            } else {
              values['paramOper'] = ''
              values['paramCom'] = ''
            }
            break
        }

        // 超级管理员、管理员显示的是“授权”
        // 运维商、企业显示的是“所属”
        let inputs = this.form.inputs
        if (['0', '1'].includes(val)) {
          inputs[9].label = '授权运维商'
          inputs[10].label = '授权企业'
        } else {
          inputs[9].label = '所属运维商'
          inputs[10].label = '所属企业'
        }
      }
    },
    'form.showDialog' (val) {
      if (!val) {
        // 清空“超级管理员”的选项
        let rolId = this.form.inputs.find(e => e.value === 'rolId')
        for (let i = 0; i < rolId.select.length; i++) {
          const e = rolId.select[i]
          if (e.value === '-1' || (this.$store.getters.userInfo.rolId === '1' && e.value === '1')) {
            rolId.select.splice(i, 1)
            i--
          }
        }
      } else {
        this.$nextTick(() => {
          try {
            // 清空transfer的搜索内容
            this.$refs.transfer.forEach(e => {
              e.clearQuery('left')
              e.clearQuery('right')
            })
          } catch (error) {}
        })
      }
    }
  },
  methods: {
    async query (params) {
      this.loading = true
      let _query = this.query
      if (params) {
        this.current = 1
        _query.$params = Object.assign(_query.$params || {}, params)
      }
      _query.$params = Object.assign(_query.$params || {}, {
        current: this.current,
        size: this.size
      })
      try {
        let res = await this.$api.sysUserQueryUserList(_query.$params)
        if (res.state === 0) {
          this.tableData = res.data.records || []
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
        this.loading = false
      } catch (error) {
        // 请求取消
        this.$isRepeat(error, () => {
          this.loading = false
        })
      }
    },
    formatter (row, property, cellValue, index) {
      let value = ''
      const usrActiveArr = ['已冻结', '已激活']
      switch (property) {
        case 'index':
          value = comSerial(this.current, this.size, index)
          break
        case 'usrActiveName':
          value = usrActiveArr[row.usrActive]
          break
        case 'usrCreatetime':
          value = parseTime(row.usrCreatetime)
          break
        case 'usrDeadlineName':
          value = row.usrDeadline || '永久有效'
          break
      }
      return value || cellValue
    },
    // 查询单个用户
    async querySingle (params) {
      this.form.loading = true
      let data = null
      try {
        let res = await this.$api.sysUserQueryUserById(params)
        if (res.state === 0) {
          data = res.data
        }
        this.form.loading = false
      } catch (error) {
        this.$isRepeat(error, () => {
          this.loading = false
        })
      }
      return data
    },
    // 查询用户类型
    async queryUserType () {
      try {
        let params = { current: 1, size: 1000 }
        let res = await this.$api.sysRulelist(params)
        if (res.state === 0) {
          this.rulIdSelect = res.data.records.map(e => {
            return {
              label: e.name,
              value: e.id
            }
          })
          this.rulIdSelect.unshift({ label: '全部', value: '' })
        } else {
          this.$message.error(res.msg)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 查询运维商列表
    async queryCom () {
      try {
        let res = await this.$api.sysUserQueryCompany()
        if (res.state === 0) {
          let disabled = false
          this.ComArr = res.data.map(e => {
            return {
              key: e.comId,
              label: e.comName,
              value: e.comId,
              disabled
            }
          })
          let match = this.form.inputs.find(e => e.value === 'paramCom')
          if (match && match.select) match.select = this.ComArr
        } else {
          this.$message.error('企业列表查询失败')
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 查询企业列表
    async queryOper () {
      try {
        let res = await this.$api.sysUserQueryOper()
        if (res.state === 0) {
          let disabled = false
          this.OperArr = res.data.map(e => {
            return {
              key: e.id,
              label: e.name,
              value: e.id,
              disabled
            }
          })
          let match = this.form.inputs.find(e => e.value === 'paramOper')
          if (match && match.select) match.select = this.OperArr
        } else {
          this.$message.error('企业列表查询失败')
        }
      } catch (error) {
        console.log(error)
      }
    },
    add () {
      this.form = Object.assign({}, this.form, {
        showDialog: true,
        type: 'add',
        title: '添加用户'
      })
      this.$nextTick(_ => {
        this.$refs.form.resetFields()
        let usr = this.form.inputs.find(e => e.value === 'usrName')
        if (usr) usr.disabled = false
        this.form.rules.password[0].required = true
        this.form.values.password = ''
        this.form.values.rolId = this.form.inputs.find(e => e.value === 'rolId').select[0].value
      })
    },
    edit (data) {
      this.form.openIng = true
      data = Object.assign({}, data)
      this.form = Object.assign({}, this.form, {
        showDialog: true,
        type: 'edit',
        title: '修改用户'
      })
      this.$nextTick(async _ => {
        this.$refs.form.resetFields()
        let usr = this.form.inputs.find(e => e.value === 'usrName')
        if (usr) usr.disabled = true
        data = await this.querySingle({ usrId: data.usrId }) || data
        this.form.values = Object.assign(this.form.values, data)
        // 超级管理员，则加多一项“超级管理员”的选项
        let inputs = this.form.inputs.find(e => e.value === 'rolId')
        if (data.rolId === '-1') {
          inputs.select.unshift({ label: '超级管理员', value: '-1' })
        } else if (data.rolId === '1' && this.$store.getters.userInfo.rolId === '1') {
          // 登录用户是“管理员”和修改的是“管理员用户”，则加一栏“管理员选项”
          inputs.select.unshift({ label: '管理员', value: '1' })
        }
        this.form.rules.password[0].required = false
        this.form.values.password = this.defPass
        this.$nextTick(_ => { this.form.openIng = false })
      })
    },
    del (data) {
      this.$confirm('确认删除此用户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async _ => {
        this.loading = true
        try {
          let res = await this.$api.sysUserDeleteUser({usrId: data.usrId})
          if (res.state === 0) {
            this.$message.success('删除成功')
            this.current = deleteAfterCurrent(this.current, this.size, this.total)
            this.query()
          } else {
            this.$message.error('删除失败')
          }
          this.loading = false
        } catch (error) {
          // 请求取消
          this.$isRepeat(error, () => {
            this.loading = false
          })
        }
      })
    },
    // 导出
    async exportTable (params) {
      this.$message('正在导出报表中...')
      this.exportLoading = true
      try {
        let res = await this.$api.sysUserExpor(params)
        if (getType(res) === 'Blob') {
          downFile(res, `用户管理报表${new Date().getTime()}.xls`)
        } else {
          this.$message.error('导出失败')
        }
        this.exportLoading = false
      } catch (error) {
        // 请求取消
        this.$isRepeat(error, () => {
          this.exportLoading = false
        })
      }
    },
    submit () {
      this.$refs.form.validate(async valid => {
        if (!valid) return false
        this.form.loading = true
        let { paramCom, paramOper, rolId, usrActive,
          usrDeadline, usrEmail, usrFullname, password,
          usrId, usrMobile, usrName, usrPassword } = this.form.values
        let data = { paramCom, paramOper, rolId, usrActive, usrDeadline, usrEmail, usrFullname, usrId, usrMobile, usrName }
        if (this.form.type === 'add') {
          data.usrPassword = md5(password).toUpperCase()
        } else {
          // 判断是否为原密码，如果是原密码，则不进行md5加密
          if (password === this.defPass) {
            data.usrPassword = usrPassword
          } else {
            data.usrPassword = md5(password).toUpperCase()
          }
        }
        // 1:管理员 2:运维商 3:企业
        // 管理员可有 企业、运维商
        // 运维商可有 运维商
        // 企业可有 企业
        if (data.rolId === '2') {
          data.paramCom = []
        } else if (data.rolId === '3') {
          data.paramOper = []
        } else if (data.rolId === '-1') {
          // 如果是超级管理员，则把运维商、企业、过期时间置为空
          data.paramOper = ''
          data.paramCom = ''
          data.usrDeadline = ''
        }
        data.paramOper = Array.isArray(data.paramOper) ? data.paramOper.join(',') : data.paramOper
        data.paramCom = Array.isArray(data.paramCom) ? data.paramCom.join(',') : data.paramCom
        try {
          let res = null
          let msg = ''
          if (this.form.type === 'add') {
            res = await this.$api.sysUserSave(data)
            msg = '添加'
          } else if (this.form.type === 'edit') {
            res = await this.$api.sysUserEdit(data)
            msg = '修改'
          }
          if (res.state === 0) {
            this.form.showDialog = false
            this.$message.success(`${msg}成功`)
            this.query()
          } else if (res.state === 6) {
            this.$message.error('账号已经存在，请检查重新输入')
          } else {
            this.$message.error(res.msg)
          }
          this.form.loading = false
        } catch (error) {
          this.$isRepeat(error, () => {
            this.form.loading = false
          })
        }
      })
    },
    // 自定义验证
    validator ({ field }, value, callback) {
      switch (field) {
        case 'usrName':
          if (!validateText(value)) {
            callback(new Error('账号必须是字母、下划线、数字，至少4位，最多20位'))
          } else if (!(value.length >= 4 && value.length <= 20)) {
            callback(new Error('账号必须是字母、下划线、数字，至少4位，最多20位'))
          } else {
            callback()
          }
          break
        case 'usrMobile':
          if (!validatePhone(value)) {
            callback(new Error('请输入正确的手机号'))
          } else {
            callback()
          }
          break
        case 'usrEmail':
          if (value.length && !validateEmail(value)) {
            callback(new Error('请输入正确的邮箱格式'))
          } else {
            callback()
          }
          break
      }
    },
    inputEvent (e) {
      if (e && this[e]) this[e]()
    },
    passBlur () {
      if (this.form.type !== 'edit') return false
      let pass = this.form.values.password
      let defPass = this.defPass
      if (pass === '') {
        this.form.values.password = defPass
      }
    },
    passFocus () {
      if (this.form.type !== 'edit') return false
      let pass = this.form.values.password
      let defPass = this.defPass
      if (pass === defPass) {
        this.form.values.password = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  .select {
    width: 100px;
  }
  /deep/ .transfer {
    .el-input__prefix {
      left: 137px;
    }
  }
}
</style>


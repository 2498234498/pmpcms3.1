<template>
  <div class="container" v-resize="mixinResize" ref="container">
    <div class="query-container clearfix" onselectstart="return false" ref="queryContainer">
      <query-bar label="监控点名称：">
        <el-input v-model="queryValue.poiName" @keyup.enter.native="query(queryValue)" size="mini" placeholder="输入监控点名称"></el-input>
      </query-bar>
      <query-bar label="MN号：">
        <el-input v-model="queryValue.poiMnnum" @keyup.enter.native="query(queryValue)" size="mini" placeholder="输入MN号"></el-input>
      </query-bar>
      <query-bar label="企业名称：">
        <el-input v-model="queryValue['company.comName']" @keyup.enter.native="query(queryValue)" size="mini" placeholder="输入企业名称"></el-input>
      </query-bar>
      <query-bar>
        <base-btn type="search" class="btn" @click="query(queryValue)"></base-btn>
        <base-btn type="export" class="btn" @click="exportTable(queryValue)" :loading="exportLoading"></base-btn>
        <base-btn type="add" class="btn" @click="add"></base-btn>
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
          <!-- <el-row v-if="item.type == 'switch'">
            <el-switch
              v-model="scope.row[item.property]"
              :disabled="scope.row[item.property]"
              @change="accept(scope.row)"
              active-color="#13ce66"
              :active-text="scope.row[item.property]?'已验收':'未验收'"
              inactive-color="#ff4949">
            </el-switch>
          </el-row> -->
          <el-row v-if="item.type == 'btn'">
            <base-btn type="relation" @click="pointInfo=scope.row,showPointInfo=true"></base-btn>
            <base-btn type="edit" @click="edit(scope.row)"></base-btn>
            <base-btn type="delete" @click="del(scope.row)"></base-btn>
          </el-row>
          <span v-else>{{ formatter(scope.row, item.property, scope.row[item.property], scope.$index) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="page-container"
      @size-change="current = 1, query(), handleTableScrollHeight('table')"
      @current-change="query(), handleTableScrollHeight('table')"
      :current-page.sync="current"
      background
      :page-sizes="sizes"
      :page-size.sync="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <edit-form
      :show.sync="form.showDialog"
      :loading="form.loading"
      :title="form.title"
      :form="form"
      :custom="customForm"
      ref="editForm"
      @submit="submit">
    </edit-form>
    <Point-Information-Factor v-if="showPointInfo" :pointInfo="pointInfo" @cancel="showPointInfo=false"></Point-Information-Factor>
  </div>
</template>

<script>
import { downFile, comSerial, flatChildrenId, deleteAfterCurrent } from '@/utils'
import { EditForm, PointInformationFactor } from './components'
import resizeMixin from '@/mixins/resize'
import page from '@/mixins/page'
import tableScrollHeight from '@/mixins/tableScrollHeight'
import city from '@/utils/city'
import select from './select'
export default {
  name: 'PointManagement',
  components: { EditForm, PointInformationFactor },
  mixins: [resizeMixin, page, tableScrollHeight],
  data () {
    return {
      showPointInfo: false,
      exportLoading: false,
      pointInfo: null,
      queryValue: {
        poiName: '',
        poiMnnum: '',
        'company.comName': ''
      },
      comSelect: [],
      selectArea: Object.freeze(city),
      tableData: [],
      tableTitle: Object.freeze([
        { property: 'index', label: '序号', width: 50, fixed: 'left' },
        { property: 'poiName', label: '监控点名称', width: 140, fixed: 'left' },
        { property: 'poiMnnum', label: 'MN号', width: 160 },
        { property: 'comName', label: '企业名称', width: 120 },
        { property: 'poiTypeName', label: '监控点类型', width: 100 },
        // { property: 'poiCheckName', label: '验收状态', width: 160, type: 'switch' },
        { label: '操作', width: 270, fixed: 'right', type: 'btn' }
      ]),
      form: {
        showDialog: false,
        type: 'add',
        title: '',
        loading: false,
        mapShow: false,
        tabs: '0',
        num: 0, // 自定义污染物累加数量
        newShow: false,
        inputs: [
          { label: '', type: 'input', value: 'poiId', hidden: true },
          { label: '监控点名称', type: 'input', value: 'poiName' },
          { label: 'MN号', type: 'input', value: 'poiMnnum' },
          { label: '所属企业', type: 'select', value: 'comId', select: [], filterable: true },
          { label: '监控点类型', type: 'select', value: 'poiType', select: select.poiTypeSelect },
          { label: '监控范围', type: 'select', value: 'poiMonitortype', select: select.poiMonSelect },
          { label: '经度/维度', type: 'input', value: 'latlon', readonly: true, focus: 'mapEvent' },
          { label: '省/市/区', type: 'selects', value: 'areaId', select: Object.freeze(city), props: { value: 'id', label: 'text' } },
          { label: '详细地址', type: 'input', value: 'address' },
          { label: '上报协议', type: 'select', value: 'reportType', select: select.reportTypeSelect }
        ],
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
        rules: {
          poiName: [
            { required: true, message: '请输入监控点名称', trigger: 'blur' },
            { min: 4, max: 20, message: '监控点名称必须是4位至20位', trigger: 'blur' }
          ],
          poiMnnum: { required: true, validator: this.validator, trigger: 'change' },
          comId: { required: true, message: '请选择企业名称', trigger: 'change' },
          poiMonitortype: { required: true, message: '请选择监控范围', trigger: 'change' },
          latlon: { required: true, message: '请选择经度/维度', trigger: 'change' },
          areaId: { required: true, message: '请选择省/市/区', trigger: 'change', type: 'array' },
          address: [
            { required: true, message: '请输入详细地址', trigger: 'blur' },
            { min: 4, max: 20, message: '详细地址必须是4位至20位', trigger: 'blur' }
          ],
          reportType: { required: true, message: '请选择上报协议', trigger: 'change' }
        }
      },
      customForm: {
        tableData: [],
        protocolType: ''
      },
      detailData: {
        poiId: '',
        show: false
      }
    }
  },
  created () {
    this.query(this.queryValue)
    this.queryComSelect()
  },
  watch: {
    // 新增污染物显示隐藏
    'form.tabs' (val) {
      if (val === '1') {
        this.form.newShow = true
      } else {
        this.form.newShow = false
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
        let res = await this.$api.sysPointList(_query.$params)
        if (res.state === 0) {
          this.tableData = res.data.rows || []
          this.total = res.data.total
        } else {
          this.$message.error('系统异常')
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
      switch (property) {
        case 'index':
          value = comSerial(this.current, this.size, index)
          break
        case 'poiTypeName':
          value = this.$store.state.codeData.code[row.poiType]
          break
        case 'poiCheckName':
          const poiCheckArr = [false, true]
          value = poiCheckArr[row.poiCheck]
          break
        case 'comName':
          value = row.company.comName
          break
      }
      return value || cellValue
    },
    // 查询企业列表
    async queryComSelect () {
      let parmas = { current: 1, size: 1000 }
      try {
        let res = await this.$api.getSysCompany(parmas)
        if (res.state === 0) {
          let comSelect = Object.freeze(res.data.list.map(e => {
            return {
              label: e.comName,
              value: e.comId
            }
          }))
          this.comSelect = comSelect
          this.form.inputs.find(e => e.value === 'comId').select = comSelect
        } else {
          this.$message.error('企业列表查询失败')
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 查询单个监控点详情
    async queryDetail (poiId) {
      this.form.loading = true
      this.form.tabs = '0'
      try {
        let res = await this.$api.sysPointView({ poiId })
        if (res.state === 0) {
          let data = Object.freeze(res.data)
          this.customForm.protocolType = res.data.point.reportType
          this.customForm.tableData = data.pollants.map((ele, index) => {
            return {
              index: index + 1,
              ceilval: ele.ceilval || '',
              floorval: ele.floorval || '',
              ...ele
            }
          })
          this.form.values.reportType = data.point.reportType || ''
        }
        this.form.loading = false
      } catch (error) {
        this.$isRepeat(error, () => {
          this.form.loading = false
        })
      }
    },
    async exportTable (data) {
      this.$message('正在导出报表中...')
      this.exportLoading = true
      let params = {
        companyName: data['company.comName'],
        mn: data.poiMnnum,
        poiName: data.poiName
      }
      try {
        let res = await this.$api.sysPointExport(params)
        if (typeof res === 'object') {
          downFile(res, `监控点配置报表${new Date().getTime()}.xls`)
        } else {
          this.$message.error('导出失败')
        }
        this.exportLoading = false
      } catch (error) {
        this.$isRepeat(error, () => {
          this.exportLoading = false
        })
      }
    },
    async add () {
      await this.$refs.editForm.formInit()
      this.form = Object.assign(this.form, {
        showDialog: true,
        type: 'add',
        title: '添加监控点'
      })
    },
    async edit (data) {
      await this.$refs.editForm.formInit()
      this.form = Object.assign(this.form, {
        showDialog: true,
        type: 'edit',
        title: '修改监控点'
      })
      let { poiId, poiName, poiMnnum, comId,
        poiType, poiMonitortype, areaId, address, poiLongitude, poiLatitude } = data
      let latlon = `${poiLongitude}/${poiLatitude}`
      areaId = areaId ? flatChildrenId(this.selectArea, areaId) : []
      this.form.values = Object.assign(this.form.values, {
        poiId,
        poiName,
        poiMnnum,
        comId,
        poiType,
        poiMonitortype,
        latlon,
        areaId,
        address
      })
      this.queryDetail(poiId)
    },
    del (data) {
      this.$confirm('确认删除此监控点？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async _ => {
        this.loading = true
        try {
          let res = await this.$api.sysPointDelete({poiId: data.poiId})
          if (res.state === 0) {
            this.$message.success('删除成功')
            this.current = deleteAfterCurrent(this.current, this.size, this.total)
            this.query()
          } else {
            this.$message.error('删除失败')
          }
          this.$store.dispatch('QueryPoint')
          this.loading = false
        } catch (error) {
          this.$isRepeat(error, () => {
            this.loading = false
          })
        }
      })
    },
    // 验收
    // async accept ({ poiId, poiMnnum, index }) {
    //   this.loading = true
    //   try {
    //     let res = await this.$api.sysPointCheck({ poiId })
    //     if (res.state === 0) {
    //       this.$message.success('验收成功')
    //     } else {
    //       this.$set(this.tableData[index % this.size - 1], 'poiCheckName', false)
    //       this.$message.error('验收失败')
    //     }
    //     this.loading = false
    //   } catch (error) {
    //     this.$isRepeat(error, () => {
    //       this.loading = false
    //     })
    //   }
    // },
    async submit (params) {
      this.form.loading = true
      let res = null
      let str = ''
      try {
        if (this.form.type === 'add') {
          str = '添加'
          res = await this.$api.sysPointSave(params)
        } else if (this.form.type === 'edit') {
          str = '修改'
          res = await this.$api.sysPointUpdate(params)
        }
        if (res.state === 0) {
          this.form.showDialog = false
          this.$message.success(`${str}成功`)
          this.query()
        } else if (res.state === 101) {
          this.$message.error('mn号已经存在，请重新输入')
        } else {
          this.$message.error(`${str}失败`)
        }
        this.form.loading = false
        this.$store.dispatch('QueryPoint')
      } catch (error) {
        this.$isRepeat(error, () => {
          this.form.loading = false
        })
      }
    },
    validator (rule, value, callback) {
      switch (rule.field) {
        case 'poiMnnum':
          if (value === '') {
            callback(new Error('请输入MN号'))
          } else if (value.length !== 14 && value.length !== 24) {
            callback(new Error('MN号必须是14位或者24位'))
          } else {
            callback()
          }
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}
.dialog /deep/ .el-dialog {
  min-width: 900px;
}
.customCom {
  .title {
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    font-weight: 700;
    text-align: right;
  }
}
.dialog {
  /deep/ .el-tabs__content {
    height: 100%;
    overflow-y: auto;
  }
  /deep/ .el-cascader {
    width: 330px;
  }
  .polBtn {
    margin-left: 5px;
  }
}
</style>

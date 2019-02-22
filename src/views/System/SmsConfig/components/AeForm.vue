<template>
  <el-dialog class="add-edit-form"
    center
    :title="title"
    :visible.sync="dialogVisible"
    style=""
    width="60%"
    v-loading="loading"
    element-loading-text="数据加载中"
    element-loading-spinner="el-icon-loading"
    :element-loading-background="$store.getters.loadingColor">
    <el-tabs tab-position="left"
      v-model="tabs"
      class="form-tabs WH">
      <el-tab-pane label="监控点选择"
        class="tab-pane">
        <!-- 监控点选择 -->
        <el-form :model="pointForm.values"
          :rules="pointForm.rules"
          ref="pointForm"
          status-icon
          label-width="100px">
          <el-form-item label="省市区"
            prop="areaId">
            <el-cascader class="cascader w300"
              v-if="model === 'add'"
              expand-trigger="hover"
              :options="city"
              :props="cascaderProps"
              change-on-select
              clearable
              placeholder="请选择省市区"
              v-model="pointForm.values.areaId" />
            <span v-else>{{ cachedAddr(city, pointForm.values.areaId.length ? pointForm.values.areaId[pointForm.values.areaId.length - 1] : '', 'text').join('-') }}</span>
          </el-form-item>
          <el-form-item label="企业"
            prop="comId">
            <el-select v-model="pointForm.values.comId"
              v-if="model === 'add'"
              filterable
              placeholder="请选择企业">
              <el-option v-for="(item, index) in enterpriseSelect"
                :key="index"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
            <span v-else>{{ (enterpriseSelect.find(e => e.value === pointForm.values.comId) || {}).label }}</span>
          </el-form-item>
          <el-form-item label="监控点"
            prop="poiId">
            <el-select v-model="pointForm.values.poiId"
              v-if="model === 'add'"
              filterable
              placeholder="请选择监控点">
              <el-option v-for="(item, index) in pointSelect"
                :key="index"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
            <span v-else>{{ (pointSelect.find(e => e.value === pointForm.values.poiId) || {}).label }}</span>
          </el-form-item>
        </el-form>
        <!-- 监控点选择 -->
      </el-tab-pane>
      <el-tab-pane label="运维人员"
        class="tab-pane">
        <!-- 运维人员 -->
        <el-form :model="operationForm.values"
          :rules="operationForm.rules"
          class="form"
          ref="operationForm"
          status-icon
          label-width="165px">
          <el-form-item label="实时数据连续超标次数"
            prop="rtdContinuationOverproofMax">
            <el-input v-model.number.trim="operationForm.values.rtdContinuationOverproofMax"
              placeholder="不输入，默认不配置" />
          </el-form-item>
          <el-form-item label="分钟数据连续超标次数"
            prop="minuteContinuationOverproofMax">
            <el-input v-model.number.trim="operationForm.values.minuteContinuationOverproofMax"
              placeholder="不输入，默认不配置" />
          </el-form-item>
          <el-form-item label="小时数据连续超标次数"
            prop="hourContinuationOverproofMax">
            <el-input v-model.number.trim="operationForm.values.hourContinuationOverproofMax"
              placeholder="不输入，默认不配置" />
          </el-form-item>
          <el-form-item label="数采仪掉线超过时间"
            prop="offlineMaxTime">
            <el-input v-model.number.trim="operationForm.values.offlineMaxTime"
              placeholder="不输入，默认不配置">
              <template slot="append">小时</template>
            </el-input>
          </el-form-item>
          <el-form-item label="短信发送间隔"
            prop="smsInterval">
            <el-input v-model.number.trim="operationForm.values.smsInterval"
              placeholder="不输入，默认不配置">
              <template slot="append">小时</template>
            </el-input>
          </el-form-item>
          <p>短信接收人员：<el-button type="success"
              size="mini"
              @click="addPersonnel(operationForm.asyncInputs, 'operationTable')">添加</el-button>
            <!-- <el-button type="danger"
              size="mini"
              @click="operationForm.asyncInputs.splice(1, operationForm.asyncInputs.length)">删除所有</el-button> -->
          </p>
          <div class="table">
            <el-table :data="operationForm.asyncInputs"
              border
              highlight-current-row
              ref="operationTable"
              height="100%"
              :rules="operationForm.rules"
              style="width: 100%">
              <el-table-column v-for="(item, index) in asyncTableHead"
                :key="index"
                :label="item.title"
                :min-width="item.width"
                align="center">
                <template slot-scope="scope">
                  <el-row v-if="item.type === 'btn'">
                    <el-button type=""
                      size="mini"
                      @click="scope.row.isEdit = !scope.row.isEdit">{{ scope.row.isEdit ? '保存' : '编辑' }}</el-button>
                    <el-button type="danger"
                      v-if="operationForm.asyncInputs.length > 1"
                      size="mini"
                      @click="operationForm.asyncInputs.splice(scope.$index, 1)">删除</el-button>
                  </el-row>
                  <span v-else-if="item.field === 'index'">{{ scope.$index + 1 }}</span>
                  <span v-else-if="!scope.row.isEdit">{{ scope.row[item.field] }}</span>
                  <el-form-item label-width="0px"
                    style="margin-bottom: 18px;"
                    :prop="`parent.asyncInputs.${scope.$index}.${item.field}`"
                    :rules='operationForm.rules[item.field]'
                    v-else>
                    <el-input size="mini"
                      v-model.trim="scope.row[item.field]" />
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form>
        <!-- 运维人员 -->
      </el-tab-pane>
      <!-- <el-tab-pane label="负责人"
        class="tab-pane">
        <el-form :model="principalForm.values"
          :rules="principalForm.rules"
          class="form"
          status-icon
          ref="principalForm"
          label-width="165px">
          <el-form-item label="实时数据连续超标次数"
            prop="rtdContinuationOverproofMax">
            <el-input v-model.number.trim="principalForm.values.rtdContinuationOverproofMax"
              placeholder="不输入，默认不配置" />
          </el-form-item>
          <el-form-item label="分钟数据连续超标次数"
            prop="minuteContinuationOverproofMax">
            <el-input v-model.number.trim="principalForm.values.minuteContinuationOverproofMax"
              placeholder="不输入，默认不配置" />
          </el-form-item>
          <el-form-item label="小时数据连续超标次数"
            prop="hourContinuationOverproofMax">
            <el-input v-model.number.trim="principalForm.values.hourContinuationOverproofMax"
              placeholder="不输入，默认不配置" />
          </el-form-item>
          <el-form-item label="数采仪掉线超过时间"
            prop="offlineMaxTime">
            <el-input v-model.number.trim="principalForm.values.offlineMaxTime"
              placeholder="不输入，默认不配置">
              <template slot="append">小时</template>
            </el-input>
          </el-form-item>
          <el-form-item label="短信发送间隔"
            prop="smsInterval">
            <el-input v-model.number.trim="principalForm.values.smsInterval"
              placeholder="不输入，默认不配置">
              <template slot="append">小时</template>
            </el-input>
          </el-form-item>
          <p>短信接收人员：<el-button type="success"
              size="mini"
              @click="addPersonnel(principalForm.asyncInputs, 'principalTable')">添加</el-button>
            <el-button type="danger"
              size="mini"
              @click="principalForm.asyncInputs = []">删除所有</el-button>
          </p>
          <div class="table">
            <el-table :data="principalForm.asyncInputs"
              border
              highlight-current-row
              ref="principalTable"
              height="100%"
              :rules="principalForm.rules"
              style="width: 100%">
              <el-table-column v-for="(item, index) in asyncTableHead"
                :key="index"
                :label="item.title"
                :min-width="item.width"
                align="center">
                <template slot-scope="scope">
                  <el-row v-if="item.type === 'btn'">
                    <el-button type=""
                      size="mini"
                      @click="scope.row.isEdit = !scope.row.isEdit">{{ scope.row.isEdit ? '保存' : '编辑' }}</el-button>
                    <el-button type="danger"
                      size="mini"
                      @click="principalForm.asyncInputs.splice(scope.$index, 1)">删除</el-button>
                  </el-row>
                  <span v-else-if="item.field === 'index'">{{ scope.$index + 1 }}</span>
                  <span v-else-if="!scope.row.isEdit">{{ scope.row[item.field] }}</span>
                  <el-form-item label-width="0px"
                    style="margin-bottom: 18px;"
                    :rules='principalForm.rules[item.field]'
                    :prop="`parent.asyncInputs.${scope.$index}.${item.field}`"
                    v-else>
                    <el-input size="mini"
                      v-model.trim="scope.row[item.field]" />
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form>
      </el-tab-pane> -->
    </el-tabs>
    <span slot="footer"
      class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary"
        @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import city from '@/utils/city'
import { validatePhone } from '@/utils/validate'
import { cached, flatChildrenId, findTreeData } from '@/utils'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: '',
    model: {
      type: String,
      required: true
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data (vm) {
    const commonVal = (required = false, mark) => {
      return [
        { required, pattern: /^([1-9]\d{0,1}|100)$/, message: '请输入1-100的整数', trigger: 'blur' },
        { validator: mark ? vm.validateLeast : vm.validateOther, trigger: 'blur' }
      ]
    }
    return {
      loading: false,
      city: Object.freeze(city),
      tabs: '0',
      cascaderProps: {
        value: 'id',
        label: 'text'
      },
      enterpriseSelect: [], // 企业选择列表
      pointSelect: [], // 监控点选择列表
      enterpriseTime: null,
      pointTime: null,
      pointForm: {
        values: {
          areaId: [], // 省市区
          comId: '', // 企业
          poiId: '' // 监控点, all 全部
        },
        rules: {
          areaId: { required: true, message: '请选择省市区', type: 'array', trigger: 'change' },
          comId: { required: true, message: '请选择企业', trigger: 'change' },
          poiId: { required: true, message: '请选择监控点', trigger: 'change' }
        }
      },
      operationForm: { // 运维人员
        values: {
          rtdContinuationOverproofMax: '', // 实时数据
          minuteContinuationOverproofMax: '', // 分钟数据
          hourContinuationOverproofMax: '', // 小时数据
          offlineMaxTime: '', // 数采仪掉线
          smsInterval: '1' // 短信发送间隔
        },
        rules: {
          rtdContinuationOverproofMax: commonVal(false, true),
          minuteContinuationOverproofMax: commonVal(),
          hourContinuationOverproofMax: commonVal(),
          offlineMaxTime: commonVal(),
          smsInterval: commonVal(true),
          usrName: { required: true, validator: vm.validatorUsrName, key: 'operationForm', trigger: 'blur' },
          usrPhone: { required: true, validator: vm.validatorUsrPhone, key: 'operationForm', trigger: 'blur' }
        },
        asyncInputs: []
      },
      // principalForm: { // 负责人
      //   values: {
      //     rtdContinuationOverproofMax: '', // 实时数据
      //     minuteContinuationOverproofMax: '', // 分钟数据
      //     hourContinuationOverproofMax: '', // 小时数据
      //     offlineMaxTime: '', // 数采仪掉线
      //     smsInterval: '1' // 短信发送间隔
      //   },
      //   rules: {
      //     rtdContinuationOverproofMax: commonVal(),
      //     minuteContinuationOverproofMax: commonVal(),
      //     hourContinuationOverproofMax: commonVal(),
      //     offlineMaxTime: commonVal(),
      //     smsInterval: commonVal(true),
      //     usrName: { required: true, validator: vm.validatorUsrName, key: 'principalForm', trigger: 'blur' },
      //     usrPhone: { required: true, validator: vm.validatorUsrPhone, key: 'principalForm', trigger: 'blur' }
      //   },
      //   asyncInputs: []
      // },
      asyncTableHead: [
        { field: 'index', title: '序号', width: 50 },
        { field: 'usrName', title: '姓名', width: 150 },
        { field: 'usrPhone', title: '手机号', width: 150 },
        { type: 'btn', title: '操作', width: 150 }
      ]
    }
  },
  beforeCreate () {
    this.$nextTick(_ => {
      this.operationForm.values.parent = this.operationForm
      // this.principalForm.values.parent = this.principalForm
    })
  },
  created () {
    this.$store.dispatch('IsPointLoad')
  },
  watch: {
    async show (v) {
      if (v) {
        await this.$nextTick()
        const allFormName = ['pointForm', 'operationForm'] // $refs
        allFormName.forEach(e => {
          this.$refs[e] && this.$refs[e].resetFields()
          if (this[e].asyncInputs) {
            if (this.model === 'add') {
              this[e].asyncInputs = [{ usrName: '', usrPhone: '', isEdit: true }]
            } else {
              this[e].asyncInputs = []
            }
          }
        })
        // 只有在修改(编辑)时，才去格式化父组件传进来的数据
        if (this.model === 'edit') {
          this.tabs = '1'
          this.formatFormData()
        } else {
          this.tabs = '0'
        }
      }
    },
    'pointForm.values.areaId' (v) {
      clearTimeout(this.enterpriseTime)
      this.enterpriseTime = setTimeout(() => {
        if (this.model === 'add') this.pointForm.values.comId = ''
        this.enterpriseSelect = []

        const id = v.length ? v[v.length - 1] : ''
        if (!id) return

        const obj = findTreeData(this.$store.getters.pointData, id)
        if (!obj || !Array.isArray(obj.children) || !obj.children.length) return false

        this.enterpriseSelect = this.matchComIdList(obj.children)
      }, 50)
    },
    'pointForm.values.comId' (v) {
      clearTimeout(this.pointTime)
      this.pointTime = setTimeout(() => {
        if (this.model === 'add') this.pointForm.values.poiId = ''
        this.pointSelect = []

        if (!v) return false
        const obj = findTreeData(this.$store.getters.pointData, v)
        if (!obj || !Array.isArray(obj.children) || !obj.children.length) return false

        this.pointSelect = obj.children.map(({ id: value, label }) => {
          return { value, label }
        })
      }, 50)
    }
  },
  computed: {
    dialogVisible: {
      get () {
        return this.show
      },
      set (val) {
        this.$emit('update:show', val)
      }
    }
  },
  methods: {
    // 添加短信接收人员
    addPersonnel (data, ref) {
      data.push({ usrName: '', usrPhone: '', isEdit: true })
      this.$nextTick(() => {
        // 滚动到底部
        this.$refs[ref].$refs.bodyWrapper.scrollTop = this.$refs[ref].$refs.bodyWrapper.scrollHeight
      })
    },
    // 检验姓名
    validatorUsrName (rules, value, callback) {
      if (value === '') {
        callback(new Error('请输入姓名'))
      } else if (value.length < 0 || value.length > 10) {
        callback(new Error('请输入1-10位的姓名'))
      } else {
        const { key } = rules
        const { length } = this[key].asyncInputs.filter(e => e.usrName === value) || []
        if (length > 1) {
          callback(new Error('姓名重复'))
        } else {
          callback()
        }
      }
    },
    // 检验手机号
    validatorUsrPhone (rules, value, callback) {
      if (!validatePhone(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        const { key } = rules
        const { length } = this[key].asyncInputs.filter(e => e.usrPhone === value) || []
        if (length > 1) {
          callback(new Error('手机号重复'))
        } else {
          callback()
        }
      }
    },
    // 实时、分钟、小时、数采仪至少输入一项 验证
    validateLeast (rules, value, callback) {
      const { minuteContinuationOverproofMax, hourContinuationOverproofMax, offlineMaxTime } = this.operationForm.values
      if (!value && !minuteContinuationOverproofMax && !offlineMaxTime && !hourContinuationOverproofMax) {
        callback(new Error('实时、分钟、小时、数采仪至少输入一项'))
      } else {
        callback()
      }
    },
    // 验证分钟、小时、数采仪
    validateOther (rules, value, callback) {
      this.$refs.operationForm.validateField('rtdContinuationOverproofMax')
      callback()
    },
    // 匹配出企业列表的数据
    matchComIdList (array) {
      let match = []
      array.forEach(({ id, label, children }) => {
        if (String(id).length >= 30 || id === '-1') {
          match.push({ label, value: id })
        } else if (Array.isArray(children) && children.length) {
          match = [...match, ...this.matchComIdList(children)]
        }
      })
      return match
    },
    cachedAddr: cached(flatChildrenId),
    // 格式化父组件传进来的数据
    formatFormData () {
      const { operationForm } = this
      const {
        areaId,
        comId,
        poiId,
        hourContinuationOverproofMax,
        minuteContinuationOverproofMax,
        rtdContinuationOverproofMax,
        offlineMaxTime,
        smsInterval,
        receiverPhones
      } = this.data
      this.pointForm.values = {
        areaId: this.cachedAddr(this.city, areaId),
        comId,
        poiId
      }
      operationForm.values = {
        ...operationForm.values,
        hourContinuationOverproofMax: hourContinuationOverproofMax || '',
        minuteContinuationOverproofMax: minuteContinuationOverproofMax || '',
        rtdContinuationOverproofMax: rtdContinuationOverproofMax || '',
        offlineMaxTime: offlineMaxTime || '',
        smsInterval: smsInterval || ''
      }
      operationForm.asyncInputs = receiverPhones.split(';').reduce((prev, e) => {
        if (e) {
          const [usrName, usrPhone] = e.split(',')
          return [...prev, {
            usrName,
            usrPhone,
            isEdit: false
          }]
        }
        return prev
      }, [])
    },
    // 检验所有表单
    async validateAllForm () {
      // pointForm 监控点选择
      // operationForm 运维人员
      // principalForm 负责人
      const allFormName = ['pointForm', 'operationForm'] // $refs
      let errList = []
      await Promise.all(allFormName.map(async (e, k) => {
        // 修改动态表单的编辑，之后才可进行验证
        const { asyncInputs = [] } = this[e]
        asyncInputs.forEach(e => { e.isEdit = true })
        await this.$nextTick()
        try {
          this.$refs[e] && await this.$refs[e].validate()
          asyncInputs.forEach(e => { e.isEdit = false })
          return true
        } catch (error) {
          errList.push(k + '')
        }
      }))

      const errStart = errList[0]
      if (errStart) {
        // 跳到出现的表单
        this.tabs = errStart
        return false
      } else {
        return true
      }
    },
    async submit () {
      const validateResult = await this.validateAllForm()
      if (!validateResult) return
      this.loading = true

      let { comId, poiId } = this.pointForm.values
      const { values, asyncInputs } = this.operationForm
      comId = poiId === 'all' ? comId : ''
      poiId = poiId === 'all' ? '' : poiId
      const receiverPhones = asyncInputs.map(({ usrName, usrPhone }) => {
        return `${usrName},${usrPhone}`
      }).join(';')
      const params = { ...values, comId, poiId, receiverPhones }
      delete params.parent
      params.hourContinuationOverproofMax = params.hourContinuationOverproofMax || 0
      params.minuteContinuationOverproofMax = params.minuteContinuationOverproofMax || 0
      params.offlineMaxTime = params.offlineMaxTime || 0
      params.rtdContinuationOverproofMax = params.rtdContinuationOverproofMax || 0

      try {
        const res = await this.$api.sysSmsAddOrUpdate(params)
        if (res.state === 0) {
          this.dialogVisible = false
          this.$message.success(`${this.model === 'add' ? '添加' : '修改'}短信配置成功`)
          this.$emit('submit')
        } else {
          this.$message.error(`${this.model === 'add' ? '添加' : '修改'}短信配置失败`)
        }
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.w300 {
  width: 300px;
}
.form {
  p {
    text-align: center;
    font-size: 16px;
  }
}
</style>

<style lang="scss">
.add-edit-form {
  .el-dialog {
    min-width: 700px;
  }
}
.el-dialog__body {
  padding: 16px 6px !important;
}
.form-tabs {
  /deep/ {
    .el-tabs__content {
      height: 100%;
      .tab-pane {
        height: 100%;
        .el-form {
          height: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          .table {
            flex: 1;
          }
        }
      }
    }
  }
}
</style>

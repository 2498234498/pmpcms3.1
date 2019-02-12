<template>
  <el-dialog class="add-edit-form"
    center
    :title="title"
    :visible.sync="dialogVisible"
    v-if="dialogVisible"
    width="60%">
    <el-tabs tab-position="left"
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
            prop="address">
            <el-cascader class="cascader w300"
              expand-trigger="hover"
              :options="city"
              :props="cascaderProps"
              change-on-select
              clearable
              placeholder="请选择省市区"
              v-model="pointForm.values.address" />
          </el-form-item>
          <el-form-item label="企业"
            prop="enterprise">
            <el-select v-model="pointForm.values.enterprise"
              placeholder="请选择企业">
              <el-option v-for="(item, index) in enterpriseSelect"
                :key="index"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="监控点"
            v-show="!['all', ''].includes(pointForm.values.enterprise)"
            prop="pointId">
            <el-select v-model="pointForm.values.pointId"
              placeholder="请选择监控点">
              <el-option v-for="(item, index) in pointSelect"
                :key="index"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
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
            prop="realTime">
            <el-input v-model.number.trim="operationForm.values.realTime"
              placeholder="不输入，默认不配置" />
          </el-form-item>
          <el-form-item label="分钟数据连续超标次数"
            prop="minute">
            <el-input v-model.number.trim="operationForm.values.minute"
              placeholder="不输入，默认不配置" />
          </el-form-item>
          <el-form-item label="小时数据连续超标次数"
            prop="hour">
            <el-input v-model.number.trim="operationForm.values.hour"
              placeholder="不输入，默认不配置" />
          </el-form-item>
          <el-form-item label="数采仪掉线超过时间"
            prop="dropped">
            <el-input v-model.number.trim="operationForm.values.dropped"
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
            <el-button type="danger"
              size="mini"
              @click="operationForm.asyncInputs = []">删除所有</el-button>
          </p>
          <div class="table">
            <el-table :data="operationForm.asyncInputs"
              border
              highlight-current-row
              ref="operationTable"
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
                    <el-button type="success"
                      size="mini"
                      @click="addPersonnel(operationForm.asyncInputs, 'operationTable')">添加</el-button>
                    <el-button type="danger"
                      size="mini"
                      @click="operationForm.asyncInputs.splice(scope.$index, 1)">删除</el-button>
                  </el-row>
                  <span v-else-if="item.field === 'index'">{{ scope.$index + 1 }}</span>
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
      <el-tab-pane label="负责人"
        class="tab-pane">
        <!-- 负责人 -->
        <el-form :model="principalForm.values"
          :rules="principalForm.rules"
          class="form"
          status-icon
          ref="principalForm"
          label-width="165px">
          <el-form-item label="实时数据连续超标次数"
            prop="realTime">
            <el-input v-model.number.trim="principalForm.values.realTime"
              placeholder="不输入，默认不配置" />
          </el-form-item>
          <el-form-item label="分钟数据连续超标次数"
            prop="minute">
            <el-input v-model.number.trim="principalForm.values.minute"
              placeholder="不输入，默认不配置" />
          </el-form-item>
          <el-form-item label="小时数据连续超标次数"
            prop="hour">
            <el-input v-model.number.trim="principalForm.values.hour"
              placeholder="不输入，默认不配置" />
          </el-form-item>
          <el-form-item label="数采仪掉线超过时间"
            prop="dropped">
            <el-input v-model.number.trim="principalForm.values.dropped"
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
                    <el-button type="success"
                      size="mini"
                      @click="addPersonnel(principalForm.asyncInputs, 'principalTable')">添加</el-button>
                    <el-button type="danger"
                      size="mini"
                      @click="principalForm.asyncInputs.splice(scope.$index, 1)">删除</el-button>
                  </el-row>
                  <span v-else-if="item.field === 'index'">{{ scope.$index + 1 }}</span>
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
        <!-- 负责人 -->
      </el-tab-pane>
    </el-tabs>
    <span slot="footer"
      class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary"
        @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import city from '@/utils/city'
import { validatePhone } from '@/utils/validate'
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
    }
  },
  data (vm) {
    const commonVal = (required = false) => {
      return { required, pattern: /^([1-9]\d{0,1}|100)$/, message: '请输入1-100的整数', trigger: 'blur' }
    }
    return {
      city: Object.freeze(city),
      cascaderProps: {
        value: 'id',
        label: 'text'
      },
      enterpriseSelect: [], // 企业选择列表
      pointSelect: [], // 监控点选择列表
      pointForm: {
        values: {
          address: [], // 省市区
          enterprise: '', // 企业, all 全部
          pointId: '' // 监控点
        },
        rules: {
          address: { required: true, message: '请选择省市区', type: 'array', trigger: 'change' },
          enterprise: { required: true, message: '请选择企业', trigger: 'change' },
          pointId: { validator: vm.validatePointId, trigger: 'change' }
        }
      },
      operationForm: {
        values: {
          realTime: '', // 实时数据
          minute: '', // 分钟数据
          hour: '', // 小时数据
          dropped: '', // 数采仪掉线
          smsInterval: '1' // 短信发送间隔
        },
        rules: {
          realTime: commonVal(),
          minute: commonVal(),
          hour: commonVal(),
          dropped: commonVal(),
          smsInterval: commonVal(true),
          usrName: { required: true, validator: vm.validatorUsrName, key: 'operationForm', trigger: 'blur' },
          usrPhone: { required: true, validator: vm.validatorUsrPhone, key: 'operationForm', trigger: 'blur' }
        },
        asyncInputs: []
      },
      principalForm: {
        values: {
          realTime: '', // 实时数据
          minute: '', // 分钟数据
          hour: '', // 小时数据
          dropped: '', // 数采仪掉线
          smsInterval: '1' // 短信发送间隔
        },
        rules: {
          realTime: commonVal(),
          minute: commonVal(),
          hour: commonVal(),
          dropped: commonVal(),
          smsInterval: commonVal(true),
          usrName: { required: true, validator: vm.validatorUsrName, key: 'principalForm', trigger: 'blur' },
          usrPhone: { required: true, validator: vm.validatorUsrPhone, key: 'principalForm', trigger: 'blur' }
        },
        asyncInputs: []
      },
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
      this.principalForm.values.parent = this.principalForm
    })
  },
  created () {
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
      data.push({ usrName: '', usrPhone: '' })
      console.log(this.$refs[ref])
      this.$nextTick(() => {
        // 滚动到底部
        this.$refs[ref].$refs.bodyWrapper.scrollTop = this.$refs[ref].$refs.bodyWrapper.scrollHeight
      })
    },
    // 检验监控点
    validatePointId (rules, value, callback) {
      // 如果企业选择了全部，则不需要检验监控点
      if (this.pointForm.values.enterprise === 'all') {
        callback()
      } else if (value === '') {
        callback(new Error('请选择监控点'))
      } else {
        callback()
      }
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

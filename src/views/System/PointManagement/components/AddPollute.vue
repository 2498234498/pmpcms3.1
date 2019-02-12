<template>
  <div>
    <el-dialog
      :title="form.title"
      :visible.sync="showDialog"
      center
      v-loading="loading"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="$store.getters.loadingColor"
      @close="$emit('cancel')"
      class="dialog">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="污染物名称" prop="polName">
          <el-input v-model="form.polName" @click.native="showPullteTable=true"></el-input>
        </el-form-item>
        <el-form-item label="上限" prop="ceilval">
          <el-input v-model="form.ceilval"></el-input>
        </el-form-item>
        <el-form-item label="下限" prop="floorval">
          <el-input v-model="form.floorval"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="save('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <pollute-table v-if="showPullteTable" @cancel="showPullteTable=false" @checkData="checkData"></pollute-table>
  </div>
</template>

<script>
import PolluteTable from './PolluteTable'
export default {
  props: {
    rowData: {
      type: Object,
      default: null
    }
  },
  components: {
    PolluteTable
  },
  data () {
    let ceilval = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else if (/^(-|\+)?\d+(\.\d{1,2})?$/.test(value)) {
        if (Number(value) > 10000000 || Number(value) < -10000000) {
          callback(new Error('必须是小于10000000和大于-10000000'))
        } else {
          let floorval = this.form.floorval
          if (floorval) {
            this.$refs.ruleForm.validateField('floorval')
          }
          if (floorval && Number(value) < Number(floorval)) {
            callback(new Error('上限值不能小于下限值'))
          } else {
            callback()
          }
        }
      } else {
        callback(new Error('请输入符合正数、小数、负数、最多两位小数的规则'))
      }
    }
    let floorval = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else if (/^(-|\+)?\d+(\.\d{1,2})?$/.test(value)) {
        if (Number(value) > 10000000 || Number(value) < -10000000) {
          callback(new Error('必须是小于10000000和大于-10000000'))
        } else {
          let ceilval = this.form.ceilval
          if (ceilval && Number(value) > Number(ceilval)) {
            callback(new Error('下限值不能大于上限值'))
          } else {
            callback()
          }
        }
      } else {
        callback(new Error('请输入符合正数、小数、负数、最多两位小数的规则'))
      }
    }
    return {
      loading: false,
      showDialog: true,
      showPullteTable: false,
      form: {
        polName: '',
        ceilval: '',
        floorval: '',
        title: ''
      },
      rules: {
        polName: [{ required: true, message: '污染物名称不能为空' }],
        ceilval: [{ required: true, validator: ceilval }],
        floorval: [{ required: true, validator: floorval }]
      },
      checkTableData: null
    }
  },
  methods: {
    initData () {
      if (this.rowData) {
        for (let key in this.form) {
          this.form[key] = this.rowData[key] || ''
        }
      }
    },
    checkData (data) {
      this.checkTableData = data
      this.form.polName = data.polName
    },
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('addRowData', Object.assign(this.checkTableData || this.rowData, this.form, {
            index: this.rowData.index
          }))
          this.showDialog = false
        } else {
          return false
        }
      })
    }
  },
  created () {
    this.initData()
  }
}
</script>

<style>

</style>



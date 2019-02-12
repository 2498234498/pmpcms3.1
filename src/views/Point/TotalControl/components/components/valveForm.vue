<template>
  <el-dialog title="设置阀门状态"
    width="60%"
    center
    :visible.sync="dialogShow">
    <el-form :model="values"
      :rules="rules"
      status-icon
      label-width="120px"
      ref="form">
      <el-form-item label="阀门当前状态">
        <span>{{ statusText }}</span>
      </el-form-item>
      <el-form-item label="打开/关闭/不启用"
        prop="status"
        class="form-item">
        <el-select v-model="values.valenable">
          <el-option v-for="(opt, opt_key) in statusSelect"
            :key="opt_key"
            :label="opt.label"
            :value="opt.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="设置原因"
        prop="reason"
        class="form-item">
        <el-input type="textarea"
          v-model="values.reason"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer"
      class="dialog-footer">
      <el-button type="danger"
        @click="dialogShow = false">取 消</el-button>
      <el-button type="primary"
        @click="submit">发 送</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    status: ''
  },
  data (vm) {
    return {
      values: {
        command: 3118,
        valenable: 1,
        reason: ''
      },
      rules: {
        valenable: { required: true, message: '请选择打开或关闭', trigger: 'change' },
        reason: [
          { required: true, message: '请输入打开/关闭原因', trigger: 'blur' },
          { min: 1, max: 500, message: '最多500个字', trigger: 'blur' }
        ]
      },
      statusSelect: Object.freeze([
        { label: '打开', value: 1 },
        { label: '关闭', value: 2 },
        { label: '不启用', value: 0 }
      ])
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.init()
      }
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
    },
    statusText () {
      const statusObj = {
        '0': '关',
        '1': '开'
      }
      return statusObj[this.status] || '数采仪在线，但没有阀门状态记录，请提取！'
    }
  },
  methods: {
    async init () {
      this.values = {
        command: 3118,
        valenable: 1,
        reason: ''
      }
    },
    async submit () {
      await this.$refs.form.validate()
      this.$emit('submit', { ...this.values, poiId: this.$store.getters.pointCheck.id })
      this.dialogShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.form-item {
  margin-bottom: 22px !important;
  /deep/ .el-form-item__error {
    top: 100% !important;
    left: 0 !important;
  }
}
</style>

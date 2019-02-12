<template>
  <el-dialog
    title="解除污染物额度"
    :visible.sync="show"
    center
    v-loading="loading"
    element-loading-text="数据加载中"
    element-loading-spinner="el-icon-loading"
    :element-loading-background="$store.getters.loadingColor"
    @close="$emit('cancel')"
    class="dialog"
  >
    <el-form ref="ruleForm"
      :rules="rules"
      :model="form"
      label-width="120px"
      status-icon>
      <el-form-item label="监控点名称">
        <span>{{ $store.getters.pointCheck.label }}</span>
      </el-form-item>
      <el-form-item label="污染物名称"
        prop="polCode">
        <el-select v-model="form.polCode">
          <el-option v-for="(item, index) in amountRemoveData.contaminantSelect"
            :key="index"
            :label="item.polName"
            :value="item.polCode"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="danger" @click="show = false">取 消</el-button>
      <el-button type="primary" @click="sumbit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    amountRemoveData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      show: true,
      loading: false,
      form: {
        polCode: ''
      },
      rules: {
        polCode: [
          { required: true, message: '污染物名称不能为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    sumbit () {
      if (!this.amountRemoveData.contaminantSelect.length) {
        this.$message.error(`${this.$store.getters.pointCheck.label}没有绑定的污染物,请先到(系统管理-污染物管理)添加该监控点绑定的污染物!`)
      } else {
        this.$refs['ruleForm'].validate(async (valid) => {
          if (valid) {
            this.loading = true
            try {
              let params = {
                polCode: this.form.polCode,
                poiId: this.$store.getters.pointCheck.id || ''
              }
              let res = await this.$api.deleteEmissionAllowance(params)
              let state = {
                '0': '解除污染物额度成功',
                '1': '解除污染物额度失败',
                '8': '监控点反控超时',
                '101': '监控点不在线',
                '102': '其他设备正在反控，请稍后再尝试'
              }
              if (res.state === 0) {
                this.$message.success(state[res.state])
              } else {
                this.$message.error(state[res.state])
              }
              this.show = false
              this.$emit('submit')
            } catch (error) {
              this.$isRepeat(error, () => {})
            }
            this.loading = false
          } else {
            return false
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>



<template>
  <el-dialog
    :title="amountAddUpdate.title"
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
          <el-option v-for="(item, index) in contaminantSelect"
            :key="index"
            :label="item.polName"
            :value="item.polCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="额度"
        prop="pslValAdd">
        <el-input v-model.trim="form.pslValAdd"
          autocomplete="off"></el-input>
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
    amountAddUpdate: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      show: true,
      loading: false,
      contaminantSelect: [],
      form: {
        polCode: '',
        pslValAdd: ''
      },
      rules: {
        polCode: { required: true, message: '请选择污染物名称', trigger: 'change' },
        pslValAdd: [
          { required: true, message: '请输入额度', trigger: 'change' },
          { pattern: /^[0-9]{1,}$/, message: '只支持数字', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    sumbit () {
      if (!this.contaminantSelect.length) {
        this.$message.error('当前没有新增额度成功的污染物,请先新增额度污染物!')
      } else {
        this.$refs['ruleForm'].validate(async (valid) => {
          if (valid) {
            this.loading = true
            try {
              let params = Object.assign(this.form, {
                poiId: this.$store.getters.pointCheck.id
              })
              let message = ''
              if (this.amountAddUpdate.title === '新增额度') {
                params.type = 0
                message = '新增额度'
              } else {
                params.type = 1
                message = '删减额度'
              }
              let res = await this.$api.emissionLimitAdd(params)
              let state = {
                '0': `${message}成功`,
                '1': `${message}失败`,
                '8': '监控点反控超时',
                '101': '监控点不在线',
                '102': '其他设备正在反控，请稍后再尝试',
                '111': '污染物没有累计开始时间'
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
    },
    init () {
      this.contaminantSelect = this.amountAddUpdate.contaminantSelect
    }
  },
  created () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
</style>



<template>
  <el-dialog center
    title="中国网建短信平台"
    :visible.sync="dialogVisible"
    style=""
    width="60%"
    class="sms-form"
    v-loading="loading"
    element-loading-text="数据加载中"
    element-loading-spinner="el-icon-loading"
    :element-loading-background="$store.getters.loadingColor">
    <el-form :model="values"
      :rules="rules"
      ref="form"
      status-icon
      label-width="100px">
      <el-form-item label="账号"
        prop="account">
        <el-input v-model="values.account"
          placeholder="中国网建网站登录的用户账号"></el-input>
      </el-form-item>
      <el-form-item label="秘钥"
        prop="secretkey">
        <el-input v-model="values.secretkey"
          placeholder="账号发送短信的秘钥"></el-input>
      </el-form-item>
    </el-form>
    <a href="http://sms.webchinese.com.cn/default.shtml" target="_blank" class="description">点击访问“中国网建短信平台”</a>
    <span slot="footer"
      class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary"
        @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      values: {
        account: '',
        secretkey: ''
      },
      rules: {
        account: { required: true, message: '请输入账号', trigger: 'blur' },
        secretkey: { required: true, message: '请输入账号发送短信的秘钥', trigger: 'blur' }
      }
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
  watch: {
    async show (v) {
      if (v) {
        await this.$nextTick()
        this.$refs.form.resetFields()
        // TODO
        this.queryAccount()
      }
    }
  },
  methods: {
    // 查询中国网建账号
    async queryAccount () {
      this.loading = true
      try {
        const res = await this.$api.sysSmsGetSmsAccount()
        if (res.state === 0) {
          this.values = { ...this.value, ...res.data }
        } else {
          this.$message.error('查询中国网建账号信息失败')
        }
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    async submit () {
      await this.$refs.form.validate()
      this.loading = true
      // TODO
      try {
        const res = await this.$api.sysSmsSetSmsAccount(this.values)
        if (res.state === 0) {
          this.dialogVisible = false
          this.$emit('submit')
        } else {
          this.$message.error('账号保存失败')
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
.description {
  display: block;
  margin-left: 100px;
  text-decoration: underline;
  color: rgb(0, 0, 238);
}
</style>


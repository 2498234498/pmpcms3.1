<template>
  <el-dialog :title="title"
    width="60%"
    center
    v-if="dialogShow"
    :visible.sync="dialogShow">
    <el-form :model="values"
      :rules="rules"
      status-icon
      label-width="120px"
      ref="form">
      <el-form-item v-for="(item, index) in inputs"
        :key="index"
        :label="item.label"
        :prop="item.value"
        v-show="!item.hidden">
        <el-input v-if="item.type === 'input' && !item.dataType"
          :placeholder="item.placeholder"
          :type="item.types"
          v-model.trim="values[item.value]">
          <template v-if="item.append" slot="append">{{ item.append }}</template>
        </el-input>
        <el-input v-else-if="item.type === 'input' && item.dataType === 'number'"
          :placeholder="item.placeholder"
          :type="item.types"
          v-model.number.trim="values[item.value]">
          <template v-if="item.append" slot="append">{{ item.append }}</template>
        </el-input>
        <el-select v-else-if="item.type === 'select'"
          v-model="values[item.value]"
          :filterable="item.filterable"
          :no-data-text="getNoDataText(item.value)"
          :loading="item.value === 'pollCode' || item.value === 'polId' ? contaminantLoading : item.value === 'infoid' ? infoidLoading : false"
          :disabled="item.disabled">
          <el-option v-for="(opt, opt_key) in item.select"
            :key="opt_key"
            :label="opt.label"
            :disabled="item.disabled"
            :value="opt.value" />
        </el-select>
        <el-radio-group v-else-if="item.type === 'radio'"
          v-model="values[item.value]">
          <el-radio v-for="(opt, opt_key) in item.select"
            :key="opt_key"
            :label="opt.value">{{ opt.label }}</el-radio>
        </el-radio-group>
        <el-date-picker v-else-if="item.type === 'dateTime'"
          :placeholder="item.placeholder"
          v-model="values[item.value]"
          type="datetime" />
        <el-time-picker v-else-if="item.type === 'time'"
          :format="item.format || 'HH:mm:ss'"
          :placeholder="item.placeholder"
          v-model="values[item.value]" />
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
    title: '',
    values: {
      type: Object,
      default: () => { }
    },
    inputs: {
      type: Array,
      default () {
        return []
      }
    },
    rules: {
      type: Object,
      default: () => { }
    },
    // 污染物列表加载
    contaminantLoading: {
      type: Boolean,
      default: false
    },
    // 信息因子列表加载
    infoidLoading: {
      type: Boolean,
      default: false
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
    }
  },
  methods: {
    // 匹配污染物和信息因子下拉框的提示文字
    getNoDataText (key) {
      switch (key) {
        case 'pollCode':
          return '暂无污染物，请到监控点管理添加污染物'
        case 'infoid':
          return '暂无信息因子，请到监控点管理添加信息因子'
        default:
          return ''
      }
    },
    async submit () {
      await this.$refs.form.validate()
      this.$emit('submit')
      this.dialogShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

<template>
  <div class="emissionquota"
    v-resize="mixinResize"
    ref="container">
    <div class="query-container clearfix"
      onselectstart="return false"
      ref="queryContainer">
      <query-bar label="污染物：">
        <el-select v-model="params.polCode"
          filterable
          size="mini"
          clearable
          :loading="contaminantLoading"
          @change="query"
          placeholder="请选择污染物">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in contaminantSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </query-bar>
      <query-bar label="状态：">
        <el-select v-model="params.status"
          filterable
          size="mini"
          clearable
          @change="query"
          placeholder="请选择状态">
          <el-option v-for="item in statusSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </query-bar>
      <query-bar label="类型：">
        <el-select
          v-model="params.type"
          filterable
          size="mini"
          clearable
          @change="query">
          <el-option
            v-for="item in typeSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </query-bar>
      <query-bar>
        <base-btn type="search" @click="query" class="btn"></base-btn>
        <base-btn type="addQuota" class="btn" @click="addUpdate('新增额度')"></base-btn>
        <base-btn type="deletionQuota" class="btn" @click="addUpdate('删减额度')"></base-btn>
        <base-btn type="deleteQuota" class="btn" @click="del"></base-btn>
      </query-bar>
    </div>
    <el-table :data="tableData"
      border
      class="table"
      :height="mixinHeight - 6"
      ref="configurationTable"
      :class="['configurationTable', {afterRenderClass: mixinShowAfterRenderClass}]"
      :cell-style="setColor"
      v-loading="loading"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="$store.getters.loadingColor"
      highlight-current-row
      style="width: 100%">
      <el-table-column
        v-for="(item, index) in tableHead"
        :key="index"
        :min-width="item.width"
        :label="item.label"
        align="center">
        <template slot-scope="scope">
          <span>{{ codeEscape(item.property, scope.row[item.property], scope.$index) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <amount-add-update
      v-if="amountAddUpdate.show"
      @cancel="amountAddUpdate.show=false"
      :amountAddUpdate="amountAddUpdate"
      @submit="query">
    </amount-add-update>
    <amount-remove
      v-if="amountRemove.show"
      @cancel="amountRemove.show=false"
      :amountRemoveData="amountRemove"
      @submit="query">
    </amount-remove>
  </div>
</template>

<script>
import resizeMixin from '@/mixins/resize'
import AmountRemove from './components/AmountRemove'
import AmountAddUpdate from './components/AmountAddUpdate'
import load from './mixin/load'
export default {
  props: {
    contaminantSelect: {
      type: Array,
      default: () => []
    },
    contaminantLoading: {
      type: Boolean,
      default: false
    }
  },
  mixins: [resizeMixin, load],
  components: {
    AmountRemove,
    AmountAddUpdate
  },
  data () {
    return {
      // 解除污染物额度
      amountRemove: {
        show: false,
        contaminantSelect: []
      },
      // 新增额度和删减额度
      amountAddUpdate: {
        show: false,
        title: '',
        contaminantSelect: []
      },
      loading: false,
      tableData: [],
      tableHead: Object.freeze([
        { property: 'index', label: '序号', width: 50, fixed: 'left' },
        { property: 'polName', label: '污染物名称', width: 150, fixed: 'left' },
        { property: 'type', label: '类型', width: 150 },
        { property: 'status', label: '状态', width: 120 },
        { property: 'pslAddTime', label: '累积开始时间', width: 150 },
        { property: 'pslValAdd', label: '排放额度', width: 100 },
        { property: 'pslCreatetime', label: '创建时间', width: 150 }
      ]),
      params: {
        polCode: '',
        status: '',
        type: ''
      },
      statusSelect: Object.freeze([
        { label: '全部', value: '' },
        { label: '成功', value: '0' },
        { label: '失败', value: '1' },
        { label: '异常', value: '2' },
        { label: '超时', value: '8' }
      ]),
      statusCode: {
        '0': '成功',
        '1': '失败',
        '2': '异常',
        '8': '超时'
      },
      typeSelect: [
        { label: '全部', value: '' },
        { label: '增加额度', value: '0' },
        { label: '删减额度', value: '1' },
        { label: '解除排放额度', value: '2' }
      ],
      typeCode: {
        '0': '增加额度',
        '1': '删减额度',
        '2': '解除排放额度'
      }
    }
  },
  methods: {
    // 初始化
    initQuery () {
      this.query()
    },
    // 新增额度和删减额度
    addUpdate (title) {
      this.amountAddUpdate = {
        show: true,
        title: title,
        contaminantSelect: this.contaminantSelect
      }
    },
    // 解除污染物额度
    del () {
      this.amountRemove = {
        show: true,
        contaminantSelect: this.contaminantSelect
      }
    },
    async query () {
      this.loading = true
      try {
        let params = Object.assign(this.params, {
          poiId: this.$store.getters.pointCheck.id
        })
        let res = await this.$api.emissionLimit(params)
        this.tableData = res.data || []
        this.loading = false
      } catch (error) {
        this.$isRepeat(error, () => {
          this.loading = false
        })
      }
    },
    // 编码转义
    codeEscape (type, value, index) {
      switch (type) {
        case 'index':
          return index + 1
        case 'status':
          return this.statusCode[value]
        case 'type':
          return this.typeCode[value]
        default:
          return value
      }
    },
    // 设置单元格样式
    setColor ({ column, row }) {
      if (column.label === '状态') {
        if (!row.status) {
          return { 'color': 'green' }
        } else {
          return { 'color': 'red' }
        }
      }
    }
  }
}
</script>

<style lang='scss' scoped >
.emissionquota {
  height: 100%;
}
</style>



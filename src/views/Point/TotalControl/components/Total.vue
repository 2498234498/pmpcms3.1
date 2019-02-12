<template>
  <div class="WH"
    ref="container"
    v-resize="mixinResize">
    <div class="query-container clearfix"
      onselectstart="return false"
      ref="queryContainer">
      <query-bar label="污染物：">
        <el-select v-model="polCode"
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
      <query-bar>
        <base-btn type="search"
          class="btn"
          @click="query()"></base-btn>
      </query-bar>
    </div>
    <el-table :data="tableData"
      border
      class="table"
      :height="mixinHeight - 6"
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="$store.getters.loadingColor">
      <el-table-column v-for="(item, index) in tableHead"
        :key="index"
        :fixed="item.fixed || false"
        :min-width="item.width"
        :prop="item.property"
        :label="item.label"
        align="center">
        <template slot-scope="scope">
          {{ item.property === 'index' ? scope.$index + 1 : scope.row[item.property] }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import resizeMixin from '@/mixins/resize'
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
  mixins: [load, resizeMixin],
  data () {
    return {
      polCode: '',
      loading: false,
      tableHead: Object.freeze([
        { property: 'index', label: '序号', width: 50, fixed: 'left' },
        { property: 'polName', label: '污染物名称', width: 150, fixed: 'left' },
        { property: 'psmVal', label: '已排总量', width: 90 },
        { property: 'psmTotal', label: '排放额度', width: 90 },
        { property: 'remainVal', label: '剩余额度', width: 90 },
        { property: 'psmStartTime', label: '累计开始时间', width: 154 },
        { property: 'psmEndTime', label: '累计结束时间', width: 154 }
      ]),
      tableData: []
    }
  },
  created () {
    // console.log(this.$store.getters.pointCheck)
    // this.query()
  },
  methods: {
    initQuery () {
      this.polCode = ''
      this.query()
    },
    async query () {
      this.loading = true
      let params = {
        poiId: this.$store.getters.pointCheck.id,
        polCode: this.polCode
      }
      try {
        let res = await this.$api.busTotalData(params)
        if (res.state === 0) {
          this.tableData = res.data || []
        }
        this.loading = false
      } catch (error) {
        this.$isRepeat(error, () => {
          this.loading = false
        })
      }
    }
  }
}
</script>

<style scoped lang='scss'>
</style>



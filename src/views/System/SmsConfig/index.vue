<template>
  <div class="sms-config WH"
    v-resize="mixinResize"
    ref="container">
    <div class="query-container clearfix"
      ref="queryContainer"
      onselectstart="return false">
      <query-bar label="省市区：">
        <el-cascader class="cascader w180"
          expand-trigger="hover"
          :options="city"
          :props="cascaderProps"
          change-on-select
          clearable
          size="mini"
          v-model="params.address" />
      </query-bar>
      <query-bar label="企业：">
        <el-input v-model="params.enterprise"
          size="mini"
          placeholder="输入企业名称"></el-input>
      </query-bar>
      <query-bar label="监控点：">
        <el-input v-model.trim="params.pointName"
          size="mini"
          placeholder="输入监控点名称"></el-input>
      </query-bar>
      <query-bar label="MN号：">
        <el-input v-model.trim="params.mn"
          size="mini"
          placeholder="输入MN号"></el-input>
      </query-bar>
      <query-bar>
        <base-btn type="search"
          class="btn" />
        <base-btn type="add"
          @click="add"
          class="btn" />
      </query-bar>
    </div>
    <el-table :data="tableData"
      border
      :height="mixinHeight - 76"
      highlight-current-row
      ref="table"
      v-loading="loading"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="$store.getters.loadingColor"
      style="width: 100%">
      <el-table-column v-for="(item, index) in tableHead"
        :key="index"
        :label="item.title"
        :min-width="item.width"
        :prop="item.field"
        :fixed="item.fixed"
        align="center">
        <template slot-scope="scope">
          <el-row v-if="item.type === 'btn'">
            <base-btn type="edit"></base-btn>
            <base-btn type="del"></base-btn>
          </el-row>
          <el-row v-else-if="item.type === 'switch'">
            <el-switch
              v-model="scope.row.status"
              class="switch-tab"
              active-text="关闭"
              inactive-text="开启">
            </el-switch>
          </el-row>
          <span v-else>{{ formatter(scope.row, item.property, scope.row[item.property], scope.$index) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="page-container"
      @size-change="current = 1, handleTableScrollHeight('table')"
      @current-change="handleTableScrollHeight('table')"
      background
      :current-page.sync="current"
      :page-sizes="sizes"
      :page-size.sync="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <ae-form :show.sync="aeForm.show" :model="aeForm.model" :title="aeForm.title"></ae-form>
  </div>
</template>

<script>
import { comSerial } from '@/utils'
import city from '@/utils/city'
import resizeMixin from '@/mixins/resize'
import page from '@/mixins/page'
import tableScrollHeight from '@/mixins/tableScrollHeight'
import AeForm from './components/AeForm'
export default {
  name: 'SmsConfig',
  mixins: [resizeMixin, page, tableScrollHeight],
  components: { AeForm },
  data () {
    return {
      city: Object.freeze(city),
      cascaderProps: {
        value: 'id',
        label: 'text'
      },
      params: {
        address: [],
        enterprise: '',
        pointName: '',
        mn: ''
      },
      tableHead: [
        { field: 'index', title: '序号', width: 50, fixed: 'left' },
        { field: 'index', title: '省市区', width: 150 },
        { field: 'index', title: '企业', width: 120 },
        { field: 'index', title: '监控点名称', width: 120 },
        { field: 'index', title: 'Mn号', width: 120 },
        { field: 'index', title: '状态', width: 100, fixed: 'right', type: 'switch' },
        { type: 'btn', title: '操作', width: 120, fixed: 'right' }
      ],
      tableData: [],
      aeForm: {
        show: false,
        model: 'add',
        title: '添加短信配置'
      }
    }
  },
  methods: {
    add () {
      this.aeForm = {
        show: true,
        model: 'add',
        title: '添加短信配置'
      }
    },
    formatter (row, property, cellValue, index) {
      let value = ''
      switch (property) {
        case 'index':
          value = comSerial(this.current, this.size, index)
          break
      }
      return value || cellValue
    }
  }
}
</script>

<style lang="scss" scoped>
.w180 {
  width: 180px;
}
.switch-tab {
  line-height: 0;
  padding: 0;
  display: block;
}
</style>


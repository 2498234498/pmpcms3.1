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
          v-model="params.areaId" />
      </query-bar>
      <query-bar label="企业：">
        <el-input v-model="params.comName"
          size="mini"
          @keyup.enter.native="query(params)"
          placeholder="输入企业名称"></el-input>
      </query-bar>
      <query-bar label="监控点：">
        <el-input v-model.trim="params.poiName"
          size="mini"
          @keyup.enter.native="query(params)"
          placeholder="输入监控点名称"></el-input>
      </query-bar>
      <query-bar label="MN号：">
        <el-input v-model.trim="params.mn"
          size="mini"
          @keyup.enter.native="query(params)"
          placeholder="输入MN号"></el-input>
      </query-bar>
      <query-bar>
        <base-btn type="search"
          @click="query(params)"
          class="btn" />
        <base-btn type="add"
          @click="add"
          class="btn" />
        <base-btn type="sms"
          @click="smsFormShow = true"
          class="btn" />
      </query-bar>
      <query-bar label="" title="短信总开关">
        <el-switch
          style="height: 100%;"
          v-model="totalSwitch"
          @change="totalSwitchChange"
          :active-value="1"
          active-text="开启"
          :inactive-value="0"
          inactive-text="关闭">
        </el-switch>
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
            <base-btn type="editUp" @click="edit(scope.row)"></base-btn>
            <base-btn type="deleteUp" @click="del(scope.row)"></base-btn>
          </el-row>
          <el-row v-else-if="item.type === 'switch'">
            <el-switch
              v-model="scope.row.inUse"
              @change="switchChange(scope.row)"
              class="switch-tab"
              :active-value="1"
              active-text="开启"
              :inactive-value="0"
              inactive-text="关闭">
            </el-switch>
          </el-row>
          <span v-else>{{ formatter(scope.row, item.field, scope.row[item.field], scope.$index) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="page-container"
      @size-change="current = 1, query(), handleTableScrollHeight('table')"
      @current-change="query(), handleTableScrollHeight('table')"
      background
      :current-page.sync="current"
      :page-sizes="sizes"
      :page-size.sync="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <ae-form :show.sync="aeForm.show" :model="aeForm.model" :title="aeForm.title" :data="aeForm.data" @submit="query"></ae-form>
    <sms-form :show.sync="smsFormShow"></sms-form>
  </div>
</template>

<script>
import { comSerial, cached, flatChildrenId, deleteAfterCurrent } from '@/utils'
import city from '@/utils/city'
import resizeMixin from '@/mixins/resize'
import page from '@/mixins/page'
import tableScrollHeight from '@/mixins/tableScrollHeight'
export default {
  name: 'SmsConfig',
  mixins: [resizeMixin, page, tableScrollHeight],
  components: {
    AeForm: resolve => require(['./components/AeForm'], resolve),
    smsForm: resolve => require(['./components/smsForm'], resolve)
  },
  data () {
    return {
      city: Object.freeze(city),
      cascaderProps: {
        value: 'id',
        label: 'text'
      },
      totalSwitch: 1,
      params: {
        areaId: [],
        comName: '',
        poiName: '',
        mn: ''
      },
      tableHead: [
        { field: 'index', title: '序号', width: 50, fixed: 'left' },
        { field: 'areaId', title: '省市区', width: 150 },
        { field: 'comName', title: '企业', width: 140 },
        { field: 'poiName', title: '监控点名称', width: 140 },
        { field: 'mn', title: 'Mn号', width: 120 },
        { field: 'inUse', title: '状态', width: 140, fixed: 'right', type: 'switch' },
        { type: 'btn', title: '操作', width: 140, fixed: 'right' }
      ],
      tableData: [],
      aeForm: {
        show: false,
        model: 'add',
        title: '添加短信配置',
        data: {}
      },
      smsFormShow: false
    }
  },
  created () {
    // TODO
    this.query(this.params)
    this.queryTotalSwitch()
  },
  activated () {
    this.queryTotalSwitch()
  },
  methods: {
    async query (params) {
      this.loading = true
      let _query = this.query
      if (params) {
        this.current = 1
        _query.$params = { ...(_query.$params || {}), ...params }
        const { $params: { areaId } } = _query
        _query.$params.areaId = areaId.length ? areaId.slice(-1) + '' : ''
      }
      _query.$params = {
        ...(_query.$params || {}),
        current: this.current,
        size: this.size
      }

      try {
        const res = await this.$api.sysSmsList(_query.$params)
        if (res.state === 0) {
          this.tableData = (res.data.list || [])
          this.total = res.data.total
        } else {
          this.$message.error('列表查询失败')
        }
        this.loading = false
      } catch (err) {
        this.$isRepeat(err, () => {
          this.loading = false
        })
      }
    },
    // 查询短信全局开关
    async queryTotalSwitch () {
      try {
        const res = await this.$api.sysSmsGetGloSwitch()
        if (res.state === 0) {
          this.totalSwitch = res.data
        } else {
          this.$message.error('短信全局开关查询失败')
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 设置短信全局开关
    async setTotalSwitch (smsGlobalSwitch) {
      try {
        const res = await this.$api.sysSmsSetGloSwitch({ smsGlobalSwitch })
        if (res.state === 0) {
          return true
        }
      } catch (err) {
        return false
      }
    },
    totalSwitchChange (data) {
      let state = null
      this.$confirm(`确定${data ? '开启' : '关闭'}全局短信？`, '全局短信总开关', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            // TODO
            state = await this.setTotalSwitch(data)
            if (!state) {
              this.totalSwitch = +(!data)
            }
            done()
            instance.confirmButtonLoading = false
          } else {
            this.totalSwitch = +(!data)
            done()
          }
        }
      }).then(() => {
        this.$message({
          type: `${state ? 'success' : 'error'}`,
          message: `${data ? '开启' : '关闭'}${state ? '成功' : '失败'}!`
        })
      }).catch(() => {
        this.$message('取消设置')
      })
    },
    cachedAddr: cached(flatChildrenId),
    add () {
      this.aeForm = {
        show: true,
        model: 'add',
        title: '添加短信配置'
      }
    },
    edit (data) {
      data = { ...data }
      this.aeForm = {
        show: true,
        model: 'edit',
        title: `添加短信配置 - ${data.poiName}`,
        data
      }
    },
    async del ({ poiId, poiName }) {
      await this.$prompt(`确认删除${poiName}监控点的短信配置`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      this.loading = true
      try {
        const res = await this.$api.sysSmsDelete({ poiId })
        if (res.state === 0) {
          this.$message.success('删除成功')
          this.current = deleteAfterCurrent(this.current, this.size, this.total)
          this.query()
        } else {
          this.$message.error('删除失败')
        }
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    // 列表单条开关
    async switchChange (data) {
      this.loading = true
      const { poiId, inUse, poiName } = data
      try {
        const res = await this.$api.sysSmsChangeInUse({ poiId, inUse })
        if (res.state === 0) {
          this.$message.success(`${poiName}监控点状态修改为${inUse ? '开启' : '关闭'}`)
        } else {
          this.$message.error(`${poiName}监控点状态修改失败`)
          data.inUse = +!data.inUse
        }
      } catch (err) {
        console.log(err)
        data.inUse = +!data.inUse
      }
      this.loading = false
    },
    formatter (row, property, cellValue, index) {
      let value = ''
      switch (property) {
        case 'index':
          value = comSerial(this.current, this.size, index)
          break
        case 'areaId':
          // cachedAddr
          value = this.cachedAddr(this.city, cellValue, 'text').join('')
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


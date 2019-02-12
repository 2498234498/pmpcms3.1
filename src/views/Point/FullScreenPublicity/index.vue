<template>
  <div class="container" v-resize="mixinResize" ref="container" onselectstart="return false">
    <div class="query-container clearfix" ref="queryContainer">
      <query-bar label="企业名称：">
        <el-input v-model="params.companyName" @keyup.enter.native="query()" size="mini" placeholder="输入企业名称"></el-input>
      </query-bar>
      <query-bar label="站点名称：">
        <el-input v-model="params.pointName" @keyup.enter.native="query()" size="mini" placeholder="输入企站点名称"></el-input>
      </query-bar>
      <query-bar label="MN号：">
        <el-input v-model="params.mn" @keyup.enter.native="query()" size="mini" placeholder="输入MN号"></el-input>
      </query-bar>
      <query-bar>
        <base-btn type="search" class="btn" @click="query()"></base-btn>
        <base-btn type="fullScreen" class="btn" @click="screenfull()"></base-btn>
      </query-bar>
    </div>
    <el-table
      ref="configurationTable"
      :data="currentData"
      class="table"
      :height="mixinHeight-73"
      border
      :class="['configurationTable', {afterRenderClass: mixinShowAfterRenderClass}]"
      style="width: 100%"
      @row-click="rowClick"
      v-loading="loading"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="$store.getters.loadingColor"
    >
      <el-table-column
        v-for="(item, index) in tableTitle"
        :key="index"
        :min-width="item.width"
        :label="item.label"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="item.type === 'index'">{{scope.row[item.property] + 1}}</span>
          <el-row v-else-if="item.type === 'check'">
            <el-checkbox v-model="scope.row[item.property]"></el-checkbox>
          </el-row>
          <el-row v-else-if="item.type == 'btn'">
            <el-button type="warning" size="mini" @click="setting(scope.row)">配置</el-button>
          </el-row>
          <span v-else>{{scope.row[item.property]}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="page-container"
      @size-change="current = 1, pageData(), handleTableScrollHeight('configurationTable')"
      @current-change="pageData(), handleTableScrollHeight('configurationTable')"
      :current-page.sync="current"
      background
      :page-sizes="sizes"
      :page-size.sync="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <el-dialog
      :title="title"
      center
      :visible.sync="showSetting"
      class="dialog"
      v-loading="loadingDialog"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="$store.getters.loadingColor">
      <el-form :model="form" label-width="100px" tab-position="left">
        <el-form-item label="站点信息：">
          <el-checkbox-group v-model="form.poiInf">
            <el-checkbox
              v-for="item in dictionaryLed"
              :key="item.dicCode"
              :label="item.dicName"
            />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="污染物：">
          <el-checkbox-group v-model="form.polCode">
            <el-checkbox
              v-for="item in polList"
              :key="item.polCode"
              :label="item.polName"
            />
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="showSetting = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import resizeMixin from '@/mixins/resize'
import pageMixins from '@/mixins/page'
import tableScrollHeight from '@/mixins/tableScrollHeight'
export default {
  name: 'FullScreenPublicity',
  mixins: [resizeMixin, pageMixins, tableScrollHeight],
  data () {
    return {
      loading: false,
      loadingDialog: false,
      showSetting: false,
      params: {
        companyName: '',
        pointName: '',
        mn: '',
        onlineStatus: 'ONLINE'
      },
      tableData: [],
      tableTitle: [
        { label: '', width: 30, property: 'check', type: 'check' },
        { property: 'index', label: '序号', width: 50, type: 'index' },
        { property: 'companyName', label: '企业名称', width: 150 },
        { property: 'pointName', label: '站点名称', width: 150 },
        { property: 'mn', label: 'MN号', width: 150 },
        { property: 'comIndustryName', label: '行业类型', width: 150 },
        { label: '操作', width: 140, type: 'btn' }
      ],
      title: '',
      form: {
        id: null,
        poiInf: [],
        polCode: []
      },
      dictionaryLed: [],
      ledCode: {},
      polList: [],
      polCode: {},
      poiId: '',
      check: [],
      currentData: []
    }
  },
  methods: {
    screenfull () {
      this.check = []
      this.tableData.forEach(ele => {
        if (ele.check) {
          this.check.push(ele.pointId)
        }
      })
      if (this.check.length > 4) {
        this.$message.error('最多只能支持4个监控点的全屏展示')
      } else if (this.check.length === 0) {
        this.$message.error('请选择一个监控点进行全屏展示')
      } else {
        this.$router.push({path: '/fullScreen', query: {poiId: this.check.join()}})
        this.$store.dispatch('setFullScreenState', {
          tableData: this.tableData,
          current: this.current,
          size: this.size,
          params: this.params
        })
      }
    },
    async submit () {
      let params = {
        id: this.form.id,
        poiId: this.poiId,
        poiInf: this.form.poiInf.map(ele => this.ledCode[ele]).join(','),
        polCode: this.form.polCode.map(ele => this.polCode[ele]).join(',')
      }
      let res = await this.$api.updateLedConfig(params)
      if (res.state === 0) {
        this.$message.success('修改成功')
        this.showSetting = false
      } else {
        this.$message.error('修改失败')
      }
    },
    async setting (row) {
      this.loadingDialog = true
      this.showSetting = true
      this.poiId = row.pointId
      try {
        this.polList = []
        this.title = `${row.pointName}全屏公示配置`
        await this.infoList(row.pointId)
        let res = await this.$api.queryLedConfig({poiId: row.pointId})
        this.form = {
          id: res.data.id,
          poiInf: res.data.poiInf.map(ele => this.ledCode[ele]) || [],
          polCode: res.data.polCode.map(ele => this.polCode[ele]) || []
        }
        this.loadingDialog = false
      } catch (error) {
        this.$isRepeat(error, () => {
          this.loadingDialog = false
        })
      }
    },
    rowClick (row) {
      // 点击设置按钮不触发
      if (!this.showSetting) {
        this.$set(this.tableData[row.index], 'check', !row.check)
      }
    },
    pageData () {
      this.currentData = []
      this.tableData.forEach(ele => {
        if (parseInt(ele.index / this.size) === this.current - 1) {
          this.currentData.push(ele)
        }
      })
    },
    async query () {
      this.loading = true
      try {
        this.current = 1
        let res = await this.$api.homeTableData(this.params)
        this.tableData = res.data.rows.map((ele, index) => {
          return {
            ...ele,
            index: index,
            check: false
          }
        }) || []
        this.pageData()
        this.loading = false
        this.total = this.tableData.length
      } catch (error) {
        this.$isRepeat(error, () => {
          this.loading = false
        })
      }
    },
    // 站点信息和污染物列表
    async infoList (poiId) {
      let res = await Promise.all([
        await this.$api.queryDictionaryLed(),
        await this.$api.sysPointView({poiId: poiId})
      ])
      // 站点信息列表
      this.dictionaryLed = res[0].data || []
      res[0].data.forEach(item => {
        this.ledCode[item.dicName] = item.dicCode
        this.ledCode[item.dicCode] = item.dicName
      })
      // 监控点列表
      this.polList = []
      res[1].data.pollants.forEach(ele => {
        this.polList.push({
          polName: ele.polName,
          polCode: ele.polCode
        })
        this.polCode[ele.polName] = ele.polCode
        this.polCode[ele.polCode] = ele.polName
      })
    }
  },
  created () {
    if (JSON.stringify(this.$store.state.fullScreen.fullScreen) !== '{}') {
      this.params = this.$store.state.fullScreen.fullScreen.params
      this.tableData = this.$store.state.fullScreen.fullScreen.tableData
      this.current = this.$store.state.fullScreen.fullScreen.current
      this.size = this.$store.state.fullScreen.fullScreen.size
      this.pageData()
    } else {
      this.query()
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  /deep/ tbody {
    tr {
      cursor: pointer;
    }
  }
  /deep/ .dialog {
    .el-dialog {
      min-width: 1100px;
      .el-checkbox-group {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .el-checkbox {
          width: 25%;
          margin-left: 0;
        }
      }
    }
  }
}
</style>



<template>
  <div class="valve WH"
    v-resize="mixinResize"
    v-loading="Loading"
    element-loading-text="数据加载中"
    element-loading-spinner="el-icon-loading"
    :element-loading-background="$store.getters.loadingColor"
    ref="container">
    <div class="query-container clearfix"
      onselectstart="return false"
      ref="queryContainer">
      <query-bar>
        <base-btn v-for="(item, index) in btnList"
          :type="item.btnType"
          :loading="item.loading"
          @click="btnEvent(item)"
          :key="index"></base-btn>
      </query-bar>
    </div>
    <div class="container WH"
      :style="{height: mixinHeight - 6 + 'px'}">
      <div class="status-bar">
        <img :src="statusSrc"
          alt="阀门状态">
      </div>
      <div class="table-bar">
        <el-table :data="tableData"
          border
          class="table"
          ref="configurationTable"
          height="calc(100% - 72px)"
          highlight-current-row
          style="width: 100%">
          <el-table-column v-for="(item, index) in tableHead"
            :key="index"
            :fixed="item.fixed || false"
            :min-width="item.width"
            :prop="item.property"
            :label="item.label"
            :formatter="formatter"
            align="center">
          </el-table-column>
        </el-table>
        <el-pagination class="pagination"
          @size-change="current = 1, query(), handleTableScrollHeight('configurationTable')"
          @current-change="query(), handleTableScrollHeight('configurationTable')"
          background
          :current-page.sync="current"
          :page-sizes="sizes"
          :page-size.sync="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <valve-form :show.sync="dialogShow"
      :status="status"
      @submit="submit"></valve-form>
  </div>
</template>

<script>
import { comSerial } from '@/utils'
import Point from '@/components/Point'
import resizeMixin from '@/mixins/resize'
import page from '@/mixins/page'
import tableScrollHeight from '@/mixins/tableScrollHeight'
import valveForm from './components/valveForm'
import load from './mixin/load'
import counterControl from './mixin/counterControl'
export default {
  props: {
    loadingProp: {
      type: Boolean,
      default: false
    }
  },
  components: { Point, valveForm },
  mixins: [resizeMixin, page, tableScrollHeight, load, counterControl],
  data () {
    return {
      btnList: [
        { btnType: 'draw', loading: false, event: 'draw', title: '提取' },
        { btnType: 'switch', loading: false, event: 'switchValve', title: '打开/关闭阀门' }
      ],
      statusSrc: require('@img/valveManage3.png'),
      status: '',
      tableData: [],
      tableHead: Object.freeze([
        { property: 'index', label: '序号', width: 50, fixed: 'left' },
        { property: 'vclTime', label: '操作时间', width: 154, fixed: 'left' },
        { property: 'vclStatus', label: '状态', width: 80 },
        { property: 'vclReason', label: '操作原因', width: 200 },
        { property: 'vclTypeName', label: '操作类型', width: 200 },
        { property: 'usrId', label: '操作用户', width: 200 }
      ]),
      dialogShow: false
    }
  },
  computed: {
    Loading: {
      get () {
        return this.loadingProp
      },
      set (val) {
        this.$emit('update:loadingProp', val)
      }
    }
  },
  methods: {
    initQuery () {
      this.current = 1
      this.query()
    },
    async query () {
      let params = {
        current: this.current,
        poiId: this.$store.getters.pointCheck.id,
        size: this.size
      }
      try {
        this.Loading = true
        let res = await this.$api.valveList(params)
        if (res.state === 0) {
          this.tableData = res.data.array || []
          this.total = res.data.total

          const statusImg = [require('@img/valveManage2.png'), require('@img/valveManage1.png')]
          if (this.$store.getters.pointCheck.state === 'OFFLINE') {
            this.statusSrc = require('@img/valveManage3.png')
          } else {
            this.status = res.data.vclState
            this.statusSrc = statusImg[res.data.vclState] || require('@img/valveManage4.png')
          }
        } else {
          this.$message.error('阀门反控列表查询失败')
        }
        this.Loading = false
      } catch (err) {
        this.$isRepeat(err, () => {
          this.Loading = false
        })
      }
    },
    formatter (row, { property }, cellValue, index) {
      let value = ''
      const vclTypeSelect = ['数采仪启动到当前无改变', '平台控制改变', '余额不足或充值改变', '数采仪用户设置改变', '污染物超标控制阀门改变', '平台强制设置阀门状态改变']
      const vclStatusSelect = ['关闭', '打开']
      switch (property) {
        case 'index':
          value = comSerial(this.current, this.size, index)
          break
        case 'vclTypeName':
          value = vclTypeSelect[row.vclType]
          break
        case 'vclStatus':
          value = vclStatusSelect[cellValue]
          break
      }
      return value || cellValue
    },
    draw () {
      let params = { command: 3101 }
      this.processResult({ api: 'valveDraw', params, fnEvent: 'query' })
    },
    switchValve () {
      this.dialogShow = true
    },
    submit (params) {
      if (params.valenable === 1) {
        this.only.fn = (data) => {
          try {
            if (data.reverseControlState === '1') {
              return '阀门打开成功，数采仪将不会自动控制阀门'
            } else {
              return '反控失败'
            }
          } catch (err) {
            return ''
          }
        }
      } else if (params.valenable === 2) {
        this.only.fn = (data) => {
          try {
            if (data.reverseControlState === '1') {
              return '阀门关闭成功，数采仪将不会自动控制阀门'
            } else {
              return '反控失败'
            }
          } catch (err) {
            return ''
          }
        }
      } else if (params.valenable === 0) {
        this.only.fn = (data) => {
          try {
            if (data.reverseControlState === '1') {
              return '数采仪可以根据超标，超额自己控制阀门'
            } else {
              return '反控失败'
            }
          } catch (err) {
            return ''
          }
        }
      }
      this.processResult({ api: 'valveSwitch', params, fnEvent: 'query' })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  .status-bar {
    min-height: 200px;
    height: 200px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
  .table-bar {
    flex-grow: 1;
    position: relative;
    .table {
      position: absolute;
    }
    .pagination {
      position: absolute;
      bottom: 0;
      margin: 20px 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>

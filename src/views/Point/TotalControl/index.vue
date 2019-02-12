<template>
  <div class="total-control WH">
    <div class="total-control-left WH w220 lf">
      <Point @check="check"></Point>
    </div>
    <div class="total-control-right WH w100-220 lf"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="$store.getters.loadingColor">
      <el-tabs type="border-card"
        v-model="tab"
        class="WH tabs">
        <el-tab-pane label="总量数据"
          class="tab-child WH">
          <total :load="load[0]"
            :contaminantSelect="contaminantSelect"
            :contaminantLoading.sync="contaminantLoading"></total>
        </el-tab-pane>
        <el-tab-pane label="排放额度"
          class="tab-child WH">
          <Amount :load="load[1]"
            :contaminantSelect="contaminantSelect"
            :contaminantLoading.sync="contaminantLoading"></Amount>
        </el-tab-pane>
        <el-tab-pane class="tab-child WH">
          <span slot="label">阀门反控<i :class="valveLoading ? 'el-icon-loading' : 'el-icon-refresh'"
              @click="load[2].isLoad && $refs.valve.initQuery()"
              title="刷新阀门反控"></i></span>
          <valve :load="load[2]"
            :loadingProp.sync="valveLoading"
            ref="valve"></valve>
        </el-tab-pane>
        <el-tab-pane label="开关量">
          <SwitchingQuantity></SwitchingQuantity>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import components from './components'
import Point from '@/components/Point'
export default {
  name: 'TotalControl',
  components: { ...components, Point },
  data () {
    return {
      loading: true,
      contaminantSelect: [],
      contaminantLoading: false,
      tab: '0',
      load: new Array(4).fill({ isShow: false, isLoad: true }),
      valveLoading: false
    }
  },
  created () {
    this.check()
  },
  activated () {
    this.notFirstView(_ => {
      if (this.check.$poiId !== this.$store.getters.pointCheck.id) {
        this.check()
      }
    })
  },
  watch: {
    tab: {
      immediate: true,
      handler (val) {
        this.init()
      }
    }
  },
  methods: {
    async check () {
      this.init(true) // 关闭
      let { id: poiId } = await this.$store.dispatch('IsPointLoad')
      this.loading = false
      if (!poiId) return false
      this.check.$poiId = poiId
      this.queryContaminant(poiId)
      this.init(false) // 开启
    },
    // 初始化子tabs事件
    init (isLoad) {
      this.load = this.load.map((e, k) => {
        return {
          isShow: Number(this.tab) === k,
          isLoad: isLoad !== undefined ? isLoad : e.isLoad
        }
      })
    },
    // 查询污染物列表
    async queryContaminant (poiId) {
      this.contaminantLoading = true
      try {
        let res = await this.$api.sysPointView({ poiId })
        if (res.state === 0) {
          this.contaminantSelect = Object.freeze(res.data.pollants.map(e => {
            return {
              ...e,
              label: e.polName,
              value: e.polCode
            }
          }))
        }
        this.contaminantLoading = false
      } catch (error) {
        this.$isRepeat(error, () => {
          this.contaminantLoading = false
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.total-control-right {
  padding: 3px 0 3px 10px;
  .tabs {
    display: flex;
    flex-direction: column;
    /deep/ {
      .el-tabs__content {
        padding: 0;
        margin-top: 3px;
        flex-grow: 1;
        position: relative;
      }
    }
    .tab-child {
      position: absolute;
    }
  }
}
</style>

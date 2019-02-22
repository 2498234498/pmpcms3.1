<template>
  <div class="point-info WH">
    <!-- <Point @check="check" class="point-left w220"></Point> -->
    <el-scrollbar class="point-right WH"
      noresize
      v-resize="mixinResize"
      ref="container">
      <Info :data="info"
        ref="queryContainer"
        class="info-bar"
        v-loading="infoLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :element-loading-background="$store.getters.loadingColor"></Info>
      <el-tabs class="tabs-datas"
        type="border-card"
        v-model="tabs">
        <el-tab-pane label="最新数据"
          class="tab-child">
          <latest-data :load="load[0]"></latest-data>
        </el-tab-pane>
        <el-tab-pane class="tab-child">
          <span slot="label">动态管控<i :class="controlLoading ? 'el-icon-loading' : 'el-icon-refresh'"
              @click="load[1].isLoad && $refs.control.queryControl()"
              title="刷新动态管控"></i></span>
          <Control :load="load[1]" :loading.sync="controlLoading" ref="control"></Control>
        </el-tab-pane>
        <el-tab-pane label="视频信息"
          class="tab-child">
          <video-info :load="load[2]"></video-info>
        </el-tab-pane>
        <el-tab-pane label="数据完整率"
          class="tab-child">
          <data-integrity :load="load[3]"></data-integrity>
        </el-tab-pane>
      </el-tabs>
    </el-scrollbar>
  </div>
</template>

<script>
import components from './components'
import resizeMixin from '@/mixins/resize'
export default {
  name: 'PointInfo',
  components: { ...components },
  mixins: [resizeMixin],
  data () {
    return {
      infoLoading: true,
      tabs: '0',
      load: new Array(4).fill({ isShow: false, isLoad: true }),
      info: {},
      controlLoading: false
    }
  },
  created () {
    this.$bus.on('pointCheck', this.check)
    this.check()
  },
  beforeDestroy () {
    this.$bus.off('pointCheck')
  },
  activated () {
    this.$bus.on('pointCheck', this.check)
    this.notFirstView(_ => {
      if ((this.check.$poiId !== this.$store.getters.pointCheck.id) || this.$route.query.isQuery) {
        this.check()
      }
    })
  },
  deactivated () {
    this.$bus.off('pointCheck')
  },
  watch: {
    tabs: {
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
      if (!poiId) return false
      this.check.$poiId = poiId
      this.init(false) // 开启
      this.queryInfo()
    },
    // 初始化子tabs事件
    init (isLoad) {
      this.load = this.load.map((e, k) => {
        return {
          isShow: Number(this.tabs) === k,
          isLoad: isLoad !== undefined ? isLoad : e.isLoad
        }
      })
    },
    // 查询基本信息
    async queryInfo () {
      this.infoLoading = true
      let params = { pointId: this.$store.getters.pointCheck.id }
      try {
        let res = await this.$api.pointInfo(params)
        if (res.state === 0) {
          res.data.operationCompany = Array.isArray(res.data.operationCompany) ? res.data.operationCompany : []
          res.data.operationCompanyName = res.data.operationCompany.map(e => e.name).join('，')
          this.info = Object.freeze(res.data)
        } else if (res.state === 101) {
          this.$message.error('没有该监控点信息')
        }
        this.infoLoading = false
      } catch (error) {
        this.$isRepeat(error, () => {
          this.infoLoading = false
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.point-info {
  .point-left {
    float: left;
    height: 100%;
  }
  .point-right {
    float: left;
    height: 100%;
    overflow-y: auto;
    /deep/ .el-scrollbar__view {
      height: 100%;
    }
    .info-bar {
      margin-bottom: 10px;
    }
    .tabs-datas {
      height: 100%;
      display: flex;
      flex-direction: column;
      /deep/ {
        .el-tabs__header {
          min-height: 39px;
        }
        .el-tabs__content {
          position: relative;
          padding: 3px;
          height: calc(100% - 39px);
          overflow-y: auto;
          flex-grow: 1;
        }
      }
      .tab-child {
        position: absolute;
        width: 100%;
        height: calc(100% - 3px);
        overflow: hidden;
      }
    }
  }
}
</style>

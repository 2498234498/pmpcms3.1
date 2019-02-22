<template>
  <el-tabs type="border-card"
    class="point-tabs"
    v-loading="$store.state.point.loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    :element-loading-background="$store.getters.loadingColor">
    <el-tab-pane class="tabs">
      <span slot="label">监控点列表<i :class="$store.state.point.loading ? 'el-icon-loading' : 'el-icon-refresh'" @click="$store.dispatch('QueryPoint')" title="刷新监控点列表"></i></span>
      <div class="point WH loading">
        <div class="query">
          <div class="query-bar">
            <label>运行状态：</label>
            <el-select v-model="runState"
              @change="search()"
              class="select"
              size="mini">
              <el-option v-for="(opt, opt_key) in runStateSelect"
                :key="opt_key"
                :label="opt.label"
                :value="opt.value" />
            </el-select>
          </div>
          <div class="query-bar">
            <el-input class="filter"
              size="mini"
              placeholder="搜索监控点 企业 MN号"
              clearable
              v-model="filterText">
            </el-input>
          </div>
        </div>
        <div class="point-tree">
          <el-scrollbar style="height: 100%;" ref="scroll">
            <el-tree
              :data="$store.getters.pointData"
              highlight-current
              default-expand-all
              :filter-node-method="filterNode"
              :render-content="renderContent"
              :indent="12"
              ref="tree"
              node-key="id"
              @node-click="handleNodeClick">
            </el-tree>
          </el-scrollbar>
        </div>
      </div>
      <div class="description">
        <p v-for="(item, index) in runStateSelect" :key="index">
          <i :class="`iconfont ${item.className}`" v-if="item.className"></i>{{ item.className ? item.label : '' }}
        </p>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
// <Point @check="选中触发的方法"></Point>
import { findTreeData } from '@/utils'
export default {
  data () {
    return {
      runStateSelect: Object.freeze([
        { label: '全部', value: '' },
        { label: '正常', value: 'N', className: 'icon-zhengchang online' },
        { label: '离线', value: 'OFFLINE', className: 'icon-lixian offline' },
        { label: '超标', value: 'T', className: 'icon-chaosu overproof' },
        { label: '故障', value: 'D', className: 'icon-guzhang destory' }
      ])
    }
  },
  created () {
    this.$store.commit('SET_LOAD_NUM', 'add')
    this.search()
  },
  activated () {
    this.initScroll()
  },
  deactivated () {
    this.animateScroll.$requestId && window.cancelAnimationFrame(this.animateScroll.$requestId)
  },
  destroyed () {
    this.animateScroll.$requestId && window.cancelAnimationFrame(this.animateScroll.$requestId)
    this.$store.commit('SET_LOAD_NUM')
    // 判断所有监控点列表都被关闭后，重置筛选数据
    if (this.$store.getters.pointLoadNum === 0) {
      this.$store.commit('SET_POINT_STATE', '')
      this.$store.commit('SET_POINT_TEXT', '')
    }
  },
  watch: {
    filterText (val) {
      this.search()
    },
    '$route': {
      deep: true,
      immediate: true,
      handler (val) {
        let { id } = val.query
        if (id) {
          const match = findTreeData(this.$store.getters.pointData, id)
          if (this.$store.getters.pointData.length && !match) {
            this.$message.error('找不到该监控点')
            return
          }
          if (this.$store.getters.pointData.length) {
            this.$store.commit('SET_POINT_CHECK', findTreeData(this.$store.getters.pointData, id))
          } else {
            this.$store.commit('SET_POINT_CHECK', { id })
          }
        }
      }
    },
    '$store.state.point.check': {
      deep: true,
      immediate: true,
      handler (val) {
        let { id } = val
        if (id) this.watch(id)
      }
    },
    '$store.state.point.data': {
      deep: true,
      immediate: true,
      handler (val) {
        let { id } = this.$store.getters.pointCheck
        if (id) this.watch(id)
      }
    }
  },
  computed: {
    runState: {
      get () {
        return this.$store.state.point.state
      },
      set (val) {
        this.$store.commit('SET_POINT_STATE', val)
      }
    },
    filterText: {
      get () {
        return this.$store.state.point.filterText
      },
      set (val) {
        this.$store.commit('SET_POINT_TEXT', val)
      }
    }
  },
  methods: {
    // 初始化滚动到选中的位置
    async initScroll () {
      this.initScroll.thrott && clearTimeout(this.initScroll.thrott)
      this.initScroll.thrott = setTimeout(() => {
        try {
          const { scroll: $scroll, tree: $tree } = this.$refs
          const $curNode = $tree.treeItemArray.find(e => e.classList.contains('is-current'))
          if ($curNode) {
            this.animateScroll($curNode, $scroll.$refs.wrap, 90)
          }
        } catch (err) {
          console.log(err)
        }
      }, 500)
    },
    animateScroll (element, $scroll, speed) {
      // 获取元素相对窗口的top值，此处应加上窗口本身的偏移
      const rect = element.getBoundingClientRect()

      // 计算元素是否在可视范围内
      const visible = $scroll.scrollTop + rect.top - 196 - $scroll.clientHeight
      let currentTop = $scroll.scrollTop
      // 如果元素在可视范围内，则不进行平滑
      if (currentTop > visible) return

      const top = $scroll.scrollTop + rect.top - 196 - $scroll.clientHeight / 2
      // 采用requestAnimationFrame，平滑动画
      const step = (timestamp) => {
        currentTop += speed
        if (currentTop <= top) {
          $scroll.scrollTo(0, currentTop)
          this.animateScroll.$requestId = window.requestAnimationFrame(step)
        } else {
          window.cancelAnimationFrame(this.animateScroll.$requestId)
          this.animateScroll.$requestId = null
        }
      }
      window.requestAnimationFrame(step)
    },
    async query () {
      // 已有数据，则不再进行加载
      if (this.$store.getters.pointLoad) {
        this.$nextTick(() => {
          this.$refs.tree && this.$refs.tree.setCurrentKey(this.$store.getters.pointCheck)
        })
      } else {
        this.$store.commit('SET_POINT_LOADING', true)
        let res = await this.$store.dispatch('QueryPoint')
        if (res) {
          this.$nextTick(() => {
            this.$refs.tree && this.$refs.tree.setCurrentKey(this.$store.getters.pointCheck)
          })
        }
        this.$store.commit('SET_POINT_LOADING', false)
      }
    },
    search () {
      // 节流搜索，100ms后执行
      clearTimeout(this.search.$throttle)
      this.search.$throttle = setTimeout(() => {
        const val = { state: this.runState, text: this.filterText }
        this.$refs.tree.filter(val)
      }, 50)
    },
    filterNode (value, data) {
      let { state, text } = value
      if (state) {
        // 状态准确匹配
        if (state === data.state && ((data.label || '').indexOf(text) >= 0 || (data.poiMnnum || '').indexOf(text) >= 0 || (data.companyName || '').indexOf(text) >= 0)) {
          return true
        }
      } else if ((data.label || '').indexOf(text) >= 0 || (data.poiMnnum || '').indexOf(text) >= 0 || (data.companyName || '').indexOf(text) >= 0) {
        // 其他模糊匹配
        return true
      }
      return false
    },
    // 点击节点触发事件
    handleNodeClick (data) {
      // 判断是不是最后一级
      if (data.children) return false
      this.send(data, 'click')
    },
    // 发射方法前处理
    send (data) {
      if (this.$store.getters.pointCheck.id !== data.id) {
        this.$store.commit('SET_POINT_CHECK', data)
        let check = this.$store.getters.pointCheck
        let processId = check.id
        // id 原始数据
        this.$emit('check', processId, data)
      }
    },
    watch (id) {
      this.$nextTick(_ => {
        this.$refs.tree && this.$refs.tree.setCurrentKey(this.$store.getters.pointCheck)
        this.initScroll()
      })
    },
    renderContent (h, { node, data, store }) {
      const icon = this.runStateSelect.find(e => e.value === data.state)
      return (
        <span class="tree-child">
          <el-tooltip effect="light" popper-class="tree-tooltip" content={(icon || {}).label || ''} placement="left">
            <i class={`iconfont ${(icon || {}).className || ''}`}></i>
          </el-tooltip>
          <span class="tree-label" title={node.label}>{node.label}</span>
        </span>
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.point-tabs {
  margin-top: 3px;
  height: calc(100% - 3px);
  /deep/ .el-tabs__content {
    padding: 3px 3px 0 3px;
    // padding-top: 3px;
    height: calc(100% - 42px);
    .tabs {
      height: 100%;
    }
  }
  /deep/ .el-scrollbar {
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
  /deep/ .el-tree {
    > .el-tree-node {
      display: block;
    }
  }
}
.point {
  height: calc(100% - 72px);
  // padding-top: 3px;
  .query {
    height: 70px;
    .query-bar {
      line-height: 30px;
      display: flex;
      label {
        font-weight: 100;
        font-size: 14px;
        min-width: 70px;
      }
      .select {
        flex-grow: 1;
      }
    }
  }
  .point-tree {
    height: calc(100% - 70px);
    overflow-y: auto;
    .filter {
      padding: 5px;
    }
    /deep/ .el-tree-node {
      width: 100%;
    }
    /deep/ .tree-child {
      line-height: 26px;
      padding-right: 20px;
      /deep/ i {
        width: 18px;
        height: 18px;
        background-size: 100% 100%;
        // display: block;
        vertical-align: middle;
        &.icon-bconline {
          // background-image: url('~@img/cell/green.png');
          display: inline-block;
        }
        &.icon-bcoffline {
          // background-image: url('~@img/cell/red.png');
          display: inline-block;
        }
      }
      /deep/ .tree-label {
        font-size: 12px;
        color: #606266;
      }
    }
    /deep/ .is-current {
      /deep/ .tree-label {
        font-size: 12px;
        color: #077f82;
      }
    }
    /deep/ .el-tree__empty-text {
      display: none;
    }
    /deep/ .is-leaf {
      color: transparent;
    }
  }
}
.description {
  position: relative;
  height: 72px;
  width: 100%;
  background-color: rgba(0, 0, 0, .03);
  &::before {
    position: absolute;
    content: ' ';
    height: 1px;
    width: 80%;
    top: 5px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgb(229, 229, 229);
  }
  p {
    &:first-child {
      height: 0;
      width: 0;
    }
    color: #666;
    font-size: 14px;
    float: left;
    width: 50%;
    text-align: center;
    margin-top: 12px;
    i {
      &.online {
        color: $onlineClr;
      }
      &.offline {
        color: $offlineClr;
      }
      &.overproof {
        color: $overproofClr;
      }
      &.destory {
        color: $destoryClr;
      }
    }
  }
}
</style>

<style lang="scss">
.point-tree .tree-child i {
  &.online {
    color: $onlineClr;
  }
  &.offline {
    color: $offlineClr;
  }
  &.overproof {
    color: $overproofClr;
  }
  &.destory {
    color: $destoryClr;
  }
}
</style>


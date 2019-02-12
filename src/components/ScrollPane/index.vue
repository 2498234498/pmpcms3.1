<template>
  <div class="scroll-pane" :class="{'is-scroll': tabBtnShow }">
    <el-scrollbar ref="scrollContainer"
      wrap-class="list"
      :vertical="false"
      class="scroll-container"
      @wheel.native.prevent="handleScroll">
      <slot />
    </el-scrollbar>
    <i class="el-icon-arrow-left tab-btn left ripple"
      @mousedown="touch(-30)" @mouseup="touchEnd" v-show="tabBtnShow"></i>
    <i class="el-icon-arrow-right tab-btn right ripple"
      @mousedown="touch(30)" @mouseup="touchEnd" v-show="tabBtnShow"></i>
  </div>
</template>

<script>
const tagAndTagSpacing = 15 // tagAndTagSpacing

export default {
  name: 'ScrollPane',
  data () {
    return {
      left: 0,
      tabBtnShow: false,
      touchTime: null
    }
  },
  mounted () {
    // 监听tabs的宽度
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    touch (num) {
      console.log(num)
      this.touchTime = true
      this.scroll(num)
    },
    touchEnd () {
      this.touchTime = null
    },
    handleScroll (e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 40
      const $scrollWrapper = this.$refs.scrollContainer.$refs.wrap
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
    },
    scroll (num) {
      const $scrollWrapper = this.$refs.scrollContainer.$refs.wrap
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + num
      if (this.touchTime) {
        this.touchTime = setTimeout(() => {
          this.scroll(num)
        }, 50)
      }
    },
    updateScroll () {
      try {
        const $scrollContainer = this.$refs.scrollContainer
        const $scrollWrapper = $scrollContainer.$refs.wrap
        const getWidth = (e) => parseFloat(window.getComputedStyle(e).width) || 0
        let $scrollWrapperWidth = getWidth($scrollWrapper)
        $scrollWrapper.style.width = '101%'
        setTimeout(_ => {
          if (Array.isArray($scrollContainer.$slots.default)) {
            let $defWidth = $scrollContainer.$slots.default.reduce((prev, e) => {
              prev += getWidth(e.elm)
              return prev
            }, 0)
            if ($defWidth > $scrollWrapperWidth - 15) {
              this.tabBtnShow = true
            } else {
              this.tabBtnShow = false
            }
          }
          $scrollWrapper.style.width = '100%'
        }, 300)
      } catch (error) {}
    },
    moveToTarget (currentTag) {
      const $container = this.$refs.scrollContainer.$el
      const $containerWidth = $container.offsetWidth
      const $scrollWrapper = this.$refs.scrollContainer.$refs.wrap
      const tagList = this.$parent.$refs.tag

      let firstTag = null
      let lastTag = null
      let prevTag = null
      let nextTag = null

      // find first tag and last tag
      if (tagList.length > 0) {
        firstTag = tagList[0]
        lastTag = tagList[tagList.length - 1]
      }

      // find preTag and nextTag
      for (let i = 0; i < tagList.length; i++) {
        if (tagList[i] === currentTag) {
          if (i === 0) {
            nextTag = tagList[i].length > 1 && tagList[i + 1]
          } else if (i === tagList.length - 1) {
            prevTag = tagList[i].length > 1 && tagList[i - 1]
          } else {
            prevTag = tagList[i - 1]
            nextTag = tagList[i + 1]
          }
          break
        }
      }

      if (firstTag === currentTag) {
        $scrollWrapper.scrollLeft = 0
      } else if (lastTag === currentTag) {
        $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth
      } else {
        // the tag's offsetLeft after of nextTag
        const afterNextTagOffsetLeft = nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing

        // the tag's offsetLeft before of prevTag
        const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagAndTagSpacing

        if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
          $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
        } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
          $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
        }
      }

      this.updateScroll()
    },
    resize () {
      clearTimeout(this.resize.$thrott)
      this.resize.$thrott = setTimeout(() => {
        this.updateScroll()
      }, 100)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.scroll-pane {
  white-space: nowrap;
  position: relative;
  width: 100%;
  padding-left: 3px;
  &.is-scroll {
    padding: 0 25px 0 28px;
  }
  .tab-btn {
    position: absolute;
    top: 3px;
    z-index: 100;
    font-size: 24px;
    height: 32px;
    line-height: 32px;
    background: #ccc;
    color: #666;
    overflow: hidden;
    cursor: pointer;
    &.left {
      left: 3px;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
    &.right {
      right: 3px;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
  }
}
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  /deep/ {
    .el-scrollbar__bar {
      bottom: 10px;
    }
    .el-scrollbar__wrap {
      height: 49px;
      overflow: hidden;
    }
  }
  /deep/ .el-scrollbar__view {
    margin-top: 3px;
  }
  /deep/ .el-scrollbar__bar {
    z-index: 20;
    /deep/ .el-scrollbar__thumb {
      background: rgba($color: #000000, $alpha: 0.3);
    }
    &.is-vertical {
      display: none;
    }
  }
}
/deep/ .list {
  width: calc(100%);
}
</style>

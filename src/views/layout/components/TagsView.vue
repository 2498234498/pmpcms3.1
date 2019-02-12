<template>
  <div class="tags-view-container">
    <scroll-pane class='tags-view-wrapper'
      ref='scrollPane'>
      <router-link ref='tag'
        class="tags-view-item"
        :title="tag.meta ? tag.meta.title || '' : ''"
        :class="isActive(tag)?'active':''"
        v-for="tag in visitedViews"
        :to="{ name: tag.name, query: {} }"
        :name="tag.name"
        :key="tag.path"
        @contextmenu.prevent.native="openMenu(tag,$event)">
        <img src="~@img/border-left.png"
          v-show="isActive(tag)?true:false"
          class="border-left"
          alt="">
        <span class="el-text">{{ tag.meta ? tag.meta.title || '' : '' }}</span>
        <span class='el-icon-close'
          @click.prevent.stop='closeSelectedTag(tag)'></span>
        <img src="~@img/border-right.png"
          v-show="isActive(tag)?true:false"
          class="border-right"
          alt="">
        <div class="line"
          v-if="isActive(tag)?true:false"></div>
      </router-link>
    </scroll-pane>
    <ul class='contextmenu'
      v-show="visible"
      :style="{left:left+'px',top:top+'px'}">
      <li @click="refresh(selectedTag)">刷新</li>
      <li @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags">全部关闭</li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from '@/components/ScrollPane'

export default {
  components: { ScrollPane },
  data () {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {}
    }
  },
  computed: {
    visitedViews () {
      return Array.from(this.$store.state.tagsView.visitedViews)
    }
  },
  watch: {
    $route () {
      this.addViewTags()
      this.moveToCurrentTag()
    },
    visible (value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted () {
    this.addViewTags()
  },
  methods: {
    async refresh (view) {
      let { fullPath, name } = view
      this.clearViewCache([name])
      await this.$nextTick()
      this.$router.replace({
        path: '/redirect' + fullPath
      })
    },
    // 清除页面缓存
    clearViewCache (array) {
      let self = this.$parent.$children.find(e => e.$options.name === 'AppMain')
      self = self.$children.filter(e => array.includes(e.$options.name)) || []
      self.forEach(e => {
        if (e.$vnode && e.$vnode.data.keepAlive) {
          if (e.$vnode.parent && e.$vnode.parent.componentInstance && e.$vnode.parent.componentInstance.cache) {
            if (e.$vnode.componentOptions) {
              let key = e.$vnode.key == null
                ? e.$vnode.componentOptions.Ctor.cid + (e.$vnode.componentOptions.tag ? `::${e.$vnode.componentOptions.tag}` : '')
                : e.$vnode.key
              let cache = e.$vnode.parent.componentInstance.cache
              let keys = e.$vnode.parent.componentInstance.keys
              if (cache[key]) {
                if (keys.length) {
                  var index = keys.indexOf(key)
                  if (index > -1) {
                    keys.splice(index, 1)
                  }
                }
                delete cache[key]
              }
            }
          }
        }
        e.$destroy()
      })
    },
    generateRoute () {
      if (this.$route.name) {
        return this.$route
      }
      return false
    },
    isActive (route) {
      return route.path === this.$route.path
    },
    addViewTags () {
      const route = this.generateRoute()
      if (!route) {
        return false
      }
      this.$store.dispatch('addVisitedViews', route)
      this.$refs.scrollPane.updateScroll()
    },
    moveToCurrentTag () {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag)
            break
          }
        }
      })
    },
    closeSelectedTag (view) {
      return new Promise(resolve => {
        this.$store.dispatch('delVisitedViews', view).then((views) => {
          this.clearViewCache([view.name])
          if (this.isActive(view)) {
            const latestView = views.slice(-1)[0]
            if (latestView) {
              this.$router.push(latestView)
            } else {
              this.$router.push('/main/home')
            }
          }
          this.$refs.scrollPane.updateScroll()
          resolve()
        })
      })
    },
    closeOthersTags () {
      let cache = this.$store.getters.cachedViews
      let tagName = this.selectedTag.name
      this.$router.push(this.selectedTag)
      this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
        if (tagName !== cache[cache.length - 1]) {
          this.clearViewCache(cache[cache.length - 1])
        }
        this.$refs.scrollPane.updateScroll()
      })
    },
    async closeAllTags () {
      let cache = this.$store.getters.cachedViews
      await this.$store.dispatch('delAllViews')
      this.clearViewCache(cache)
      this.$router.push('/main/home')
      this.addViewTags()
      this.$refs.scrollPane.updateScroll()
    },
    openMenu (tag, e) {
      this.visible = true
      this.selectedTag = tag
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      this.left = e.clientX - offsetLeft + 15 // 15: margin right
      this.top = e.clientY - 55
    },
    closeMenu () {
      this.visible = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tags-view-container {
  position: relative;
  .tags-view-wrapper {
    height: 36px;
    background: #42a1da;
    /deep/ .scroll-wrapper {
      top: 3px;
    }
    .tags-view-item {
      width: 145px;
      text-align: center;
      display: inline-block;
      position: relative;
      height: 32px;
      line-height: 32px;
      // border: 1px solid rgb(184, 184, 184);
      border-right-width: 0;
      color: #333;
      background: rgb(219, 219, 219);
      padding: 0 8px;
      font-size: 12px;
      transition: transform 0.15s ease-in-out, height 0.15s ease-in-out;
      border-radius: 8px 8px 0 0;
      border: 1px solid #b4babd;
      border-right-width: 0;
      transform: translateZ(0);
      .border-left {
        position: absolute;
        left: -14px;
        bottom: -2px;
        z-index: 1000;
      }
      .border-right {
        position: absolute;
        right: -13px;
        bottom: -2px;
        z-index: 1000;
      }
      &:first-child {
        .border-left {
          display: none;
        }
      }
      &:last-child {
        .border-right {
          display: none;
        }
        border-right-width: 1px;
      }
      .el-text {
        display: inline-block;
        max-width: 100px;
        margin: 0 1px;
        transform: translate3d(0, 0, 0);
        // padding-left: 0px;
        // padding-right: 10px;
        color: #757475;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .line {
        position: absolute;
        width: 100%;
        height: 2px;
        bottom: -2px;
        z-index: 9999;
        background: #fff;
        left: 0;
      }
      &:last-child {
        border-right-width: 1px;
      }
      &:first-of-type {
        // margin-left: 15px;
        border-radius: 0 8px 0 0;
      }
      &.active {
        // height: 30px;
        transform: scale(1) translateZ(0);
        z-index: 10;
        background-color: #fff;
        color: #333;
        border-width: 1px;
        border-color: #fff;
        // border-color: #42b983;
        // &::before {
        //   content: '';
        //   background: #00b8a9;
        //   display: inline-block;
        //   width: 8px;
        //   height: 8px;
        //   border-radius: 50%;
        //   position: relative;
        //   margin-right: 2px;
        // }
      }
    }
  }
  .contextmenu {
    // top: 54px !important;
    margin: 0;
    background: #fff;
    z-index: 100;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 22px;
      height: 22px;
      // vertical-align: 2px;
      font-size: 18px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      float: right;
      margin-top: 5px;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>

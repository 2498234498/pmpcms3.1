<template>
  <div class="layourt">
    <logobar></logobar>
    <div class="app-wrapper" :class="classObj">
      <!-- TODO -->
      <!-- <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div> -->
      <sidebar class="sidebar-container"></sidebar>
      <div class="main-container">
        <!-- <navbar></navbar> -->
        <tags-view></tags-view>
        <Point v-show="$route.meta.mobile" :class="$route.meta.mobile ? 'lf w220' : ''"></Point>
        <app-main :class="$route.meta.mobile ? 'lf w100-220' : ''"></app-main>
      </div>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView, Logobar } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
    Logobar,
    Point: resolve => require(['@/components/Point'], resolve)
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar () {
      return this.$store.state.app.sidebar
    },
    device () {
      return this.$store.state.app.device
    },
    classObj () {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation
        // mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside () {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .layourt {
    @include relative;
    overflow: hidden;
  }
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: calc(100% - 55px); // Logobar
    width: 100%;
    background: #42a1da;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>

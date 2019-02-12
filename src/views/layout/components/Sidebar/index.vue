<template>
  <div>
    <div class="sidebar-title">
      <i class="el-icon-menu"></i>
      <span>系统菜单</span>
      <i class="el-icon-arrow-left right" @click="toggleSideBar"></i>
    </div>
    <el-scrollbar wrapClass="scrollbar-wrapper">
      <el-menu
        mode="vertical"
        :show-timeout="200"
        :default-active="$route.path"
        :collapse="isCollapse"
        unique-opened
        background-color="#EAF0FC"
        text-color="#5F5D5D"
        active-text-color="#409EFF"
      >
        <sidebar-item v-for="route in routes" :key="route.name" :item="route" :base-path="route.path"></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes () {
      return Object.freeze([...this.$router.options.routes, ...this.$store.getters.roles])
    },
    isCollapse () {
      return !this.sidebar.opened
    }
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('ToggleSideBar')
    }
  }
}
</script>

<style lang="scss">
.el-tooltip__popper.is-dark {
  background: #eee;
  color: rgb(95, 93, 93);
  .popper__arrow {
    background-color: #eee;
    border-right-color: #000;
    &::after {
      border-right-color: #eee;
    }
  }
}
</style>

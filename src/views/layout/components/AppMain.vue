<template>
  <section class="app-main">
    <transition name="breadcrumb">
      <keep-alive :include="cachedViews">
        <router-view :key="key"></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews () {
      return this.$store.state.tagsView.cachedViews
    },
    key () {
      // return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
      return this.$route.fullPath.replace(/\?.*/g, '')
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar  */
  /*34 = TagsView   */
  /*55 = Logobar */
  height: calc(100vh - 50px - 34px - 9px);
  position: relative;
  overflow: hidden;
  background: #fff;
}
</style>

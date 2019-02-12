<template>
  <div class="query-bar">
    <label>{{ label }}</label>
    <slot></slot>
  </div>
</template>

<script>
// <query-bar label="label">
//  <el-input></el-input>
// </query-bar>
export default {
  name: 'QueryBar',
  props: ['label']
}
</script>

<style lang="scss" scoped>
.query-bar {
  float: left;
  > * {
    display: inline-block;
  }
}
</style>

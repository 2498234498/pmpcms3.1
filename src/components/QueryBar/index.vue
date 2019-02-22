<template>
  <div class="query-bar" :class="position">
    <label>{{ label }}</label>
    <slot></slot>
  </div>
</template>

<script>
// <query-bar label="label" position="left">
//  <el-input></el-input>
// </query-bar>
export default {
  name: 'QueryBar',
  props: {
    label: '', // 名称
    position: { // 对齐方式
      type: String,
      default: 'left',
      validator (value) {
        return ['left', 'right'].includes(value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.query-bar {
  &.left {
    float: left;
  }
  &.right {
    float: right;
  }
  > * {
    display: inline-block;
  }
}
</style>

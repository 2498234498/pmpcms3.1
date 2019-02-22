<template>
  <button
    class="ripple"
    v-if="is"
    @click="send"
    :class="`base-btn-${type} ${loading ? 'not' : ''}`">
    <i :class="!loading ? getName.iconClass : 'el-icon-loading'"></i>
    <span>{{ getName.name }}</span>
  </button>
</template>

<script>
import buttonPermissions from '@/config/buttonPermissions'
// 在buttonPermissions.js文件添加按钮
export default {
  name: 'BaseBtn',
  props: {
    type: '',
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  computed: {
    is () {
      let meta = this.$route.meta
      let menuIds = this.$store.getters.menuIds
      let btnInfo = buttonPermissions.find(d => d.type === this.type)
      // 如果此按钮是开放的（不在权限表里面），则显示
      if (btnInfo.openUp) return true
      if (meta.children) {
        return meta.children.some(t => t.bId === btnInfo.bId && menuIds.includes(t.id))
      }
      return true
    },
    getName () {
      try {
        return buttonPermissions.find(obj => obj.type === this.type) || {}
      } catch (error) {
        return {}
      }
    }
  },
  methods: {
    send () {
      if (this.loading) return false
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
button {
  height: 28px;
  line-height: 28px;
  margin-right: 5px;
  border-radius: 5px;
  float: left;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  span, i {
    font-size: 14px;
    color: #fff;
  }
  i {
    margin-left: 5px;
  }
  span {
    padding-right: 6px;
  }
  &.not {
    cursor: not-allowed;
    opacity: 0.7;
  }
  &:last-child {
    margin-right: 0;
  }
  &.base-btn-search {
    background: #409eff;
  }
  &.base-btn-add {
    background: #49b4d4;
  }
  &.base-btn-edit {
    background: #efad4d;
  }
  &.base-btn-delete {
    background: #f56c6c;
  }
  &.base-btn-export {
    background: #B0C4DE;
  }
  &.base-btn-detail {
    background: #80CEF3;
  }
  &.base-btn-accept {
    background: #20B2AA;
  }
  &.base-btn-more {
    background: #00cc55;
  }
  &.base-btn-set {
    background: #409eff;
  }
  &.base-btn-draw {
    background: #ccbb00;
  }
  &.base-btn-stop {
    background: #00cc55;
  }
  &.base-btn-deleteUp {
    background: #f56c6c;
  }
  &.base-btn-open {
    background: #b894e9;
  }
  &.base-btn-close {
    background: #da864a;
  }
  &.base-btn-switch {
    background: #4a9eda;
  }
  &.base-btn-poiRelation {
    background: #4a9eda;
  }
  &.base-btn-addQuota {
    background: #4a9eda;
  }
  &.base-btn-deletionQuota {
    background: #f56c6c;
  }
  &.base-btn-deleteQuota {
    background: #ccbb00;
  }
  &.base-btn-fullScreen {
    background: #ccbb00;
  }
  &.base-btn-refresh {
    background: #4a9eda;
  }
  &.base-btn-sms {
    background: #4a9eda;
  }
  &.base-btn-polluteRelation {
    background: #4a9eda;
  }
  &.base-btn-editUp {
    background: #efad4d;
  }
}
</style>


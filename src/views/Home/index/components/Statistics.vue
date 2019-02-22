<template>
  <div class="statistics" :class="statisShow ? '' : 'not'">
    <div class="sta-bar">
      <slot name="left"></slot>
    </div>
    <div class="sta-bar">
      <slot name="cent"></slot>
    </div>
    <div class="sta-bar">
      <slot name="right"></slot>
    </div>
    <div class="arrow ripple" @click="statisShow = !statisShow" :title="statisShow ? '点击缩放' : '点击展开'">
      <div class="container">&#62;</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    statisShow: {
      get () {
        return this.show
      },
      set (val) {
        this.$emit('update:show', val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.statistics {
  position: absolute;
  width: 100%;
  height: 280px;
  padding: 20px 0;
  bottom: 0;
  left: 0;
  display: flex;
  background-color: #fff;
  z-index: 2000;
  transform: translate3d(0, 0, 0);
  transition: transform .3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  border-top: 5px solid #42a1da;
  .sta-bar {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 33.3%;
    &::after {
      position: absolute;
      content: ' ';
      top: 0;
      right: 0;
      width: 1px;
      height: 100%;
      border: 1px dashed rgb(44, 166, 238);
    }
    &:nth-child(3)::after {
      display: none;
    }
  }
  .arrow {
    position: absolute;
    top: -17px;
    left: 50%;
    transform: translateX(-50%);
    height: 12px;
    width: 25px;
    background-color: rgb(160, 160, 160);
    cursor: pointer;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    .container {
      color: #fff;
      transform: rotate(90deg);
      font-size: 13px;
      text-align: center;
      transition: transform .3s ease;
    }
  }
  &.not {
    transform: translate3d(0, 99%, 0);
    .container {
      transform: rotate(270deg);
    }
  }
}
</style>

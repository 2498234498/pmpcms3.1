<template>
  <div class="last-data WH">
    <h4>超标报警信息：</h4>
    <div class="data-bar"
      v-loading="loading"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="$store.getters.loadingColor">
      <p class="item"
        v-for="(item, index) in dataList"
        :key="index"
        :title="item">{{ index + 1 }}.{{ item }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      // dataList: Object.freeze([
      //   '宇宙电子厂持续超标20小时，文字超出文字超出文字超出文字超出文字超出文字超出文字超出文字超出',
      //   '宇宙电子厂5号设备未能连接成功',
      //   '宇宙电子厂3号设备被关闭',
      //   '太阳污水厂1号出水口',
      //   '宇宙电子厂持续超标20小时',
      //   '宇宙电子厂持续超标20小时'
      // ])
      dataList: Object.freeze([])
    }
  }
}
</script>

<style lang="scss" scoped>
.last-data {
  padding-left: 25px;
  padding-right: 20px;
  h4 {
    color: #f56058;
    font-weight: normal;
    border-bottom: 1px solid #d7d5d5;
    padding-bottom: 2px;
    margin-bottom: 10px;
  }
  .data-bar {
    .item {
      margin-bottom: 18px;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>

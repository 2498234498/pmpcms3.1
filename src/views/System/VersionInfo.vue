<template>
  <div
    class="container"
    v-loading="loading"
    element-loading-text="数据加载中"
    element-loading-spinner="el-icon-loading"
    :element-loading-background="$store.getters.loadingColor"
  >
    <el-form
      label-position="right"
      label-width="100px"
      v-if="versionInfo.length"
    >
      <el-form-item
        v-for="(item, index) in versionInfo"
        :key="index"
        :label="`${item.dicName}:`"
      >
        <span>{{item.dicValue}}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'VersionInfo',
  data () {
    return {
      loading: false,
      versionInfo: []
    }
  },
  methods: {
    async query () {
      this.loading = true
      try {
        let res = await this.$api.queryVersionMess()
        this.versionInfo = res.data || []
        this.loading = false
      } catch (error) {
        this.$isRepeat(error, () => {
          this.loading = false
        })
      }
    }
  },
  created () {
    this.query()
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  margin-top: 20px;
  .el-form {
    width: 680px;
    margin: 0 auto;
    background: #fff;
    border: 1px solid #d6d7d8;
    border-radius: 8px;
    .el-form-item {
      margin-bottom: 0;
      border-bottom: 1px solid #e6e6e6;
      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>

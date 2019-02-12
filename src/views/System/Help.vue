<template>
  <div class="container">
    <el-tabs tab-position="left" class="tab-container" type="border-card">
      <el-tab-pane label="用户类型权限">
        <h2>用户类型权限</h2>
        <h4>1.超级管理员</h4>
        <div class="lineSpace">操作所有权限。</div>
        <h4>2.管理员</h4>
        <div class="lineSpace">添加企业用户和运维用户,显示本人账号和其管辖的企业用户和运维用户,对该账户绑定的运维商和企业下的监控点具有查看权限、修改、删除、添加权限。</div>
        <h4>3.运维商用户</h4>
        <div class="lineSpace">不能添加用户,可以看到自己和自己管理的企业用户,有企业配置管理和运维商配置管理的权限,对该账户绑定的企业下的监控点具有查看权限。</div>
        <h4>4.企业用户</h4>
        <div class="lineSpace">不能添加用户,企业用户只能看到自己用户,对该账户绑定的企业下的监控点具有查看权限。</div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'Help'
}
</script>

<style lang="scss" scoped>
.container {
  height: calc(100% - 10px);
  margin: 5px;
  h4 {
    margin-top: 20px;
  }
  .tab-container {
    height: 100%;
    .lineSpace {
      margin: 10px 0;
      text-indent: 20px;
    }
    /deep/ .el-tab-pane {
      margin-left: 40px;
    }
  }
}
</style>

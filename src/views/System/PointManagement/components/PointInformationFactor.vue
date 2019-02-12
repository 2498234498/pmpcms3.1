<template>
  <el-dialog
    :title="`${pointInfo.poiName}信息因子`"
    :visible.sync="showDialog"
    center
    v-loading="loading"
    element-loading-text="数据加载中"
    element-loading-spinner="el-icon-loading"
    :element-loading-background="$store.getters.loadingColor"
    @close="$emit('cancel')"
    class="dialog"
  >
    <el-tree
      :data="treeData"
      class="tree"
      ref="tree"
      show-checkbox node-key="id"
      :props="defaultProps"
      :default-expanded-keys="defaultExpandedKeys"
      :default-checked-keys="defaultExpandedKeys">
    </el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button type="danger" @click="showDialog = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    pointInfo: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      loading: false,
      showDialog: true,
      treeData: [],
      defaultProps: {
        children: 'sysInfoCode',
        label: 'name'
      },
      defaultExpandedKeys: []
    }
  },
  methods: {
    async save () {
      this.loading = true
      try {
        // 选中的checkbox
        let getCheckedKeys = this.$refs.tree.getCheckedKeys().filter(ele => {
          if (ele.indexOf('-') !== -1) {
            return ele
          }
        })
        let params = {
          poiId: this.pointInfo.poiId,
          infoCodes: getCheckedKeys.join(',')
        }
        let res = await this.$api.insertPointInfoCode(params)
        if (res.state === 0) {
          this.$message.success('操作成功')
          this.showDialog = false
        } else {
          this.$message.error('操作失败')
        }
      } catch (error) {
        this.$isRepeat(error, () => {
          this.loading = false
        })
      }
      this.loading = false
    },
    async query () {
      this.loading = true
      this.defaultExpandedKeys = []
      try {
        let res = await this.$api.queryPollAndInfoCodeByPoiId({ poiId: this.pointInfo.poiId })
        res.data.forEach(ele => {
          ele.id = ele.polId
          ele.name = ele.polName + '(污染物)'
          if (ele.sysInfoCode.length) {
            ele.sysInfoCode.forEach(item => {
              item.id = `${ele.id}-${item.id}`
              // 默认选中checkbox
              if (item.checkBlooean) {
                this.defaultExpandedKeys.push(item.id)
              }
            })
          } else {
            // 是否禁用
            ele.disabled = true
          }
        })
        this.treeData = res.data || []
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
    console.log(this.pointInfo)
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  /deep/ .el-dialog__body {
    padding: 25px 36px 30px;
    .tree {
      height: 100%;
    }
  }
}
</style>



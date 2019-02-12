<template>
  <div class="container">
    <el-table
      :data="tableData"
      border
      class="table"
      height="calc(100vh - 103px)"
      v-loading="loading"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="$store.getters.loadingColor"
      highlight-current-row
      style="width: 100%; margin-top: 3px;">
      <el-table-column
        v-for="(item, index) in tableTitle"
        :key="index"
        :min-width="item.width"
        :label="item.label"
        align="center">
        <template slot-scope="scope">
          <el-row v-if="item.type == 'btn' && scope.row.id !== '-1'">
            <el-button type="warning" @click="jurisdiction(scope.row)">授权</el-button>
          </el-row>
          <span v-else>{{ codeEscape(item.property, scope.row[item.property], scope.$index) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="权限维护"
      :visible.sync="showDialog"
      center
      v-if="showDialog"
      v-loading="loadingTree"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="$store.getters.loadingColor">
      <div class="tree-container" >
        <el-tree
          :data="treeData"
          show-checkbox
          node-key="id"
          ref="tree"
          :default-expanded-keys="defaultChecked"
          :default-checked-keys="defaultChecked"
          :props="props">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>
              <i class="iconfont" :class="data.parentId ? 'icon-wenben' : 'icon-wenjianjia'"></i>
              <span>{{ node.label }}</span>
            </span>
          </span>
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UserTypeManagement',
  data () {
    return {
      showDialog: false,
      tableData: [],
      loading: false,
      tableTitle: [
        { property: 'index', label: '序号', width: 50 },
        { property: 'name', label: '用户类型', width: 100 },
        { label: '操作', width: 140, type: 'btn' }
      ],
      treeData: [],
      props: {
        children: 'children',
        label: 'text'
      },
      defaultChecked: [],
      params: {
        id: '',
        name: '',
        ids: ''
      },
      loadingTree: false,
      ruleMenu: []
    }
  },
  methods: {
    // 编码转义
    codeEscape (type, value, index) {
      switch (type) {
        case 'index':
          return index + 1
        default:
          return value
      }
    },
    async submit () {
      this.loadingTree = true
      try {
        let checkedKeys = [...this.$refs.tree.getCheckedKeys(), ...this.$refs.tree.getHalfCheckedKeys()]
        this.params.ids = checkedKeys.join(',')
        let res = await this.$api.updateSysRule(this.params)
        if (res.state === 0) {
          this.$message.success('授权成功')
          this.showDialog = false
        } else {
          this.$message.error('授权失败')
        }
        this.loadingTree = false
      } catch (error) {
        this.$isRepeat(error, () => {
          this.loadingTree = false
        })
      }
    },
    // 删除父级id
    deleteParentId (array, id) {
      if (Array.isArray(array)) {
        array.forEach((ele, index) => {
          if (ele.id === id && !ele.children) {
            this.ruleMenu.push(id)
          } else if (Array.isArray(ele.children)) {
            this.deleteParentId(ele.children, id)
          }
        })
      }
    },
    // 授权
    async jurisdiction (row) {
      this.showDialog = true
      this.loadingTree = true
      try {
        this.defaultChecked = []
        this.ruleMenu = []
        this.params = {
          id: row.id,
          name: row.name
        }
        let res = await Promise.all([
          this.treeData.length ? '' : await this.$api.querySysMenu(),
          await this.$api.sysRuleMenu({id: row.id})
        ])
        this.treeData = res[0] ? res[0].data : this.treeData
        res[1].data.forEach(ele => {
          this.deleteParentId(this.treeData, ele)
        })
        this.defaultChecked = Object.freeze(this.ruleMenu)
        this.loadingTree = false
      } catch (error) {
        this.$isRepeat(error, () => {
          this.loadingTree = false
        })
      }
    },
    // 查询数据
    async query () {
      this.loading = true
      try {
        let res = await this.$api.querySysRule({current: 1, size: 10})
        this.tableData = res.data.records || []
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
  .icon-wenjianjia {
    color: #ebb563;
    font-size: 18px;
  }
  .icon-wenben {
    font-size: 16px;
  }
  .iconfont {
    margin-right: 4px;
    float: left;
  }
  /deep/ .el-tree-node__content {
    height: 30px;
    line-height: 30px;
  }
  .tree-container {
    height: 100%;
  }
  /deep/ .el-table__row {
    &:nth-of-type(1) {
      height: 45px;
    }
  }
}
</style>

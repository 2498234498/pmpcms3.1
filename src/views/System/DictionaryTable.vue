<template>
  <div class="container" v-resize="mixinResize" ref="container">
    <!-- onselectstart处理双击容器选中容器中的内容 -->
    <div class="query-container clearfix" onselectstart="return false" ref="queryContainer">
      <query-bar label="字典名称：">
        <!-- v-model.trim去掉左右空格 -->
        <el-input v-model.trim="params.dicName" @keyup.enter.native="query(params)" size="mini" placeholder="输入字典名称"></el-input>
      </query-bar>
      <query-bar>
        <base-btn type="search" class="btn" @click="query(params)"></base-btn>
        <base-btn type="add" class="btn" @click="openDialog"></base-btn>
      </query-bar>
    </div>
    <el-table
      ref="table"
      :data="tableData"
      border
      class="table"
      :height="mixinHeight - 73"
      :class="['configurationTable', {afterRenderClass: mixinShowAfterRenderClass}]"
      highlight-current-row
      v-loading="loading"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="$store.getters.loadingColor"
      style="width: 100%"
    >
      <el-table-column
        v-for="(item, index) in tableTitle"
        :key="index"
        :fixed="item.fixed ? item.fixed : false"
        :min-width="item.width"
        :label="item.label"
        align="center"
      >
        <template slot-scope="scope">
          <el-row v-if="item.type == 'btn'">
            <base-btn type="edit" @click="openDialog(params)"></base-btn>
            <base-btn type="delete"></base-btn>
          </el-row>
          <span v-else>{{ codeEscape(item.property, scope.row[item.property], scope.$index) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="page-container"
      @size-change="current = 1, query(), handleTableScrollHeight('table')"
      @current-change="query(), handleTableScrollHeight('table')"
      :current-page.sync="current"
      background
      :page-sizes="sizes"
      :page-size.sync="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <el-dialog
      :title="title"
      :visible.sync="showDialog"
      center
      v-if="showDialog"
      v-loading="loadingDialog"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="$store.getters.loadingColor"
    >
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" status-icon>
        <el-form-item label="字典名称" prop="dicName">
          <el-input v-model.trim="form.dicName"></el-input>
        </el-form-item>
        <el-form-item label="字典编码" prop="dicCode">
          <el-input v-model.trim="form.dicCode"></el-input>
        </el-form-item>
        <el-form-item label="字典值" prop="dicValue">
          <el-select v-model="form.dicValue">
            <el-option label="值" value="V"></el-option>
            <el-option label="列表" value="s"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字典类型" prop="dicType">
          <el-input v-model.trim="form.dicType"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="dicRemark">
          <el-input v-model="form.dicRemark" type="textarea" placeholder="请输入内容" :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import resizeMixin from '@/mixins/resize'
import pageMixins from '@/mixins/page'
import tableScrollHeight from '@/mixins/tableScrollHeight'
export default {
  name: 'DictionaryTable',
  mixins: [resizeMixin, pageMixins, tableScrollHeight],
  data () {
    return {
      params: {
        dicName: ''
      },
      tableData: [{}],
      tableTitle: [
        { property: 'index', label: '序号', width: 50 },
        { property: 'dicName', label: '字典名称', width: 100 },
        { property: 'dicCode', label: '字典编码', width: 100 },
        { property: 'dicValue', label: '字典值', width: 100 },
        { property: 'dicType', label: '字典类型', width: 154 },
        { property: 'dicRemark', label: '备注', width: 154 },
        { property: 'dicCreatetime', label: '创建时间', width: 154 },
        { property: 'dicUpdatetime', label: '修改时间', width: 154 },
        { label: '操作', width: 140, type: 'btn' }
      ],
      form: {
        dicName: '',
        dicCode: '',
        dicValue: '',
        dicType: '',
        dicRemark: ''
      },
      rules: {
        dicName: [{ required: true, message: '字典名称不能为空', trigger: 'change' }],
        dicCode: [{ required: true, message: '字典编码不能为空', trigger: 'change' }],
        dicValue: [{ required: true, message: '字典值不能为空', trigger: 'change' }],
        dicType: [{ required: true, message: '字典类型不能为空', trigger: 'change' }],
        dicRemark: [{ required: true, message: '备注不能为空', trigger: 'change' }]
      },
      loadingDialog: false,
      showDialog: false,
      title: ''
    }
  },
  methods: {
    // 添加或修改
    openDialog (params) {
      this.showDialog = true
      this.loadingDialog = true
      this.title = params ? '修改字典表' : '添加字典表'
      this.loadingDialog = false
    },
    submit () {
      this.showDialog = false
    },
    // 编码转义
    codeEscape (type, value, index) {
      switch (type) {
        case 'index':
          return (this.current - 1) * this.size + index + 1
        default:
          return value
      }
    },
    query (params) {}
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}
</style>



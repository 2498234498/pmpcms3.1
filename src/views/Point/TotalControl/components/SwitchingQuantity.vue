<template>
  <div class="container">
    <div class="btn">
      <base-btn type="draw"></base-btn>
      <base-btn type="refresh"></base-btn>
    </div>
    <div class="time">
      <span>数据更新时间</span>
      <span>2018-11-14 13:48:48</span>
    </div>
    <el-table
      :data="tableData"
      class="table"
      v-loading="loading"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      :element-loading-background="$store.getters.loadingColor">
      <el-table-column
        prop="project"
        label="项目"
        width="150"
        align="center">
      </el-table-column>
      <el-table-column
        label="状态"
        width="250"
        align="center">
        <template slot-scope="scope">
          <el-radio-group v-model="tableData[scope.$index].switch">
            <el-radio :label="0">{{ scope.row.type === 'DO' ? '断开' : '低'}}</el-radio>
            <el-radio :label="1">{{ scope.row.type === 'DO' ? '闭合' : '高'}}</el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
        align="center">
        <template slot-scope="scope">
          <el-row>
            <base-btn type="set" v-if="scope.row.type === 'DO'"></base-btn>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [
        { project: 'DO1', type: 'DO', switch: 0 },
        { project: 'DO2', type: 'DO', switch: 0 },
        { project: 'DO3', type: 'DO', switch: 0 },
        { project: 'DO4', type: 'DO', switch: 0 },
        { project: 'DI1', type: 'DI', switch: 0 },
        { project: 'DI2', type: 'DI', switch: 0 },
        { project: 'DI3', type: 'DI', switch: 0 },
        { project: 'DI4', type: 'DI', switch: 0 },
        { project: 'DI5', type: 'DI', switch: 0 },
        { project: 'DI6', type: 'DI', switch: 0 },
        { project: 'DI7', type: 'DI', switch: 0 },
        { project: 'DI8', type: 'DI', switch: 0 }
      ],
      value: '0',
      loading: false
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  .btn {
    width: 100%;
    height: 28px;
    margin: 5px 20px;
  }
  .time {
    height: 31px;
    width: 100%;
    margin-left: 20px;
    span {
      float: left;
      line-height: 30px;
      font-size: 14px;
      text-align: center;
      border-top: 1px solid #95B8E7;
      border-left: 1px solid #95B8E7;
      &:first-child {
        width: 150px;
      }
      &:last-child {
        width: 400px;
        border-right: 1px solid #95B8E7;
      }
    }
  }
  .table {
    margin-left: 20px;
    width: 550px;
    /deep/ th {
      background: #fff !important;
      border: 1px solid #95B8E7;
      border-left: none;
      &:first-child {
        border-left: 1px solid #95B8E7;
      }
      .cell {
        font-weight: 100;
      }
    }
    /deep/ tbody {
      tr {
        td {
          border: 1px solid #95B8E7;
          border-top: none;
          border-left: none;
          &:first-child {
            border-left: 1px solid #95B8E7;
          }
        }
        &:last-child {
          td {
            border-bottom: 2px solid #95B8E7;
          }
        }
      }
    }
  }
}
</style>



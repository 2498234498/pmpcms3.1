/**
 * 按钮列表
 * ! *** 指绝对key值，不可作为自定义key值
 */

// {
//   name: '', // *** 按钮名称
//   bId: '', // *** 按钮ID，自定义内容，不可重复，用于权限管理, B10001 B10002 B10003 ...
//   openUp: true, // *** 开放权限
//   ...
// }

export default [
  {
    name: '添加',
    bId: 'B10001',
    type: 'add',
    iconClass: 'el-icon-circle-plus-outline'
  },
  {
    name: '修改',
    bId: 'B10002',
    type: 'edit',
    iconClass: 'el-icon-edit-outline'
  },
  {
    name: '查询',
    bId: 'B10003',
    // openUp: true,
    type: 'search',
    iconClass: 'el-icon-search'
  },
  {
    name: '删除',
    bId: 'B10004',
    type: 'delete',
    iconClass: 'el-icon-delete'
  },
  {
    name: '导出',
    bId: 'B10005',
    type: 'export',
    iconClass: 'el-icon-printer'
  },
  {
    name: '详情',
    bId: 'B10006',
    openUp: true,
    type: 'detail',
    iconClass: 'el-icon-view'
  },
  {
    name: '验收',
    bId: 'B10007',
    // openUp: true,
    type: 'accept',
    iconClass: 'el-icon-star-on'
  },
  {
    name: '更多',
    bId: 'B10008',
    openUp: true,
    type: 'more',
    iconClass: 'el-icon-more'
  },
  {
    name: '设置',
    bId: 'B10009',
    openUp: true,
    type: 'set',
    iconClass: 'el-icon-setting'
  },
  {
    name: '提取',
    bId: 'B10010',
    openUp: true,
    type: 'draw',
    iconClass: 'el-icon-upload2'
  },
  {
    name: '停止',
    bId: 'B10011',
    openUp: true,
    type: 'stop',
    iconClass: 'iconfont icon-stop-copy'
  },
  {
    name: '删除',
    bId: 'B10012',
    openUp: true,
    type: 'deleteUp',
    iconClass: 'el-icon-delete'
  },
  {
    name: '开启',
    bId: 'B10013',
    openUp: true,
    type: 'open',
    iconClass: 'el-icon-circle-check'
  },
  {
    name: '关闭',
    bId: 'B10014',
    openUp: true,
    type: 'close',
    iconClass: 'el-icon-circle-close'
  },
  {
    name: '设置阀门',
    bId: 'B10015',
    openUp: true,
    type: 'switch',
    iconClass: 'iconfont icon-kaiguan'
  },
  // 监控点信息因子
  {
    name: '信息因子',
    bId: 'B10016',
    type: 'poiRelation',
    iconClass: 'iconfont icon-guanlian'
  },
  {
    name: '新增额度',
    bId: 'B10017',
    openUp: true,
    type: 'addQuota',
    iconClass: 'el-icon-circle-plus-outline'
  },
  {
    name: '删减额度',
    bId: 'B10018',
    openUp: true,
    type: 'deletionQuota',
    iconClass: 'iconfont icon-jian'
  },
  {
    name: '解除污染物额度',
    bId: 'B10019',
    openUp: true,
    type: 'deleteQuota',
    iconClass: 'iconfont icon-shenqingjiechu'
  },
  {
    name: '进入全屏',
    bId: 'B10019',
    openUp: true,
    type: 'fullScreen',
    iconClass: 'iconfont icon-quanping'
  },
  {
    name: '刷新',
    bId: 'B10020',
    openUp: true,
    type: 'refresh',
    iconClass: 'iconfont icon-shuaxin'
  },
  {
    name: '短信平台',
    bId: 'B10021',
    openUp: true,
    type: 'sms',
    iconClass: 'iconfont icon-duanxin'
  },
  // 污染物信息因子
  {
    name: '信息因子',
    bId: 'B10022',
    openUp: true,
    type: 'polluteRelation',
    iconClass: 'iconfont icon-guanlian'
  },
  {
    name: '修改',
    bId: 'B10023',
    type: 'editUp',
    openUp: true,
    iconClass: 'el-icon-edit-outline'
  }
]

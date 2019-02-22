/**
 * 系统管理
 */
import { postRequest, getRequest, getExcelRequest } from '../config'

// 企业配置管理-查询
function getSysCompany (params) {
  return postRequest(
    '/sysCompany/list',
    params
  )
}

// 企业配置管理-添加
function addSysCompany (params) {
  return postRequest(
    '/sysCompany/save',
    params
  )
}

// 企业配置管理-修改
function updateSysCompany (params) {
  return postRequest(
    '/sysCompany/update',
    params
  )
}

// 企业配置管理-删除
function deleteSysCompany (params) {
  return postRequest(
    '/sysCompany/delete',
    params
  )
}

// 企业配置管理-企业类型列表
function companyTypeList () {
  return getRequest(
    '/sysIndustry/list'
  )
}

// 污染物查询
function polQuery (params) {
  return postRequest(
    `/sysPollant/listJson`,
    params
  )
}
// function polQuery (params) {
//   return postRequest(
//     `sysPollant/listJson`,
//     params
//   )
// }

// 增加污染物
function polAdd (params) {
  return postRequest(
    `/sysPollant/save`,
    params
  )
}
// 删除污染物
function polDelete (params) {
  return postRequest(
    `/sysPollant/deletePollant`,
    params
  )
}

// 修改污染物
function polUpdate (params) {
  return postRequest(
    `/sysPollant/update`,
    params
  )
}

// 导出污染物
function polExport (params) {
  return getExcelRequest(
    `/sysPollant/exportPollant`,
    params
  )
}

// 查询污染物单位
function sysUnitList () {
  return postRequest(
    '/sysUnit/listJson'
  )
}

// 查询用户类型
function sysRulelist (params) {
  return postRequest(
    `11/sysRole/listJson`,
    params
  )
}

// 查询用户列表
function sysUserQueryUserList (params) {
  return postRequest(
    `12/sysUser/queryUserList`,
    params
  )
}

// 查询单个用户
function sysUserQueryUserById (params) {
  return getRequest(
    '/sysUser/queryUserById',
    params
  )
}

// 删除用户
function sysUserDeleteUser (params) {
  return getRequest(
    '12/sysUser/deleteUser',
    params
  )
}

// 用户管理 查询运维商列表
function sysUserQueryCompany (params) {
  return getRequest(
    '/sysCompany/queryCompany',
    params
  )
}

// 用户管理 查询企业列表
function sysUserQueryOper (params) {
  return getRequest(
    '/sysOperation/queryOper',
    params
  )
}

// 新增用户
function sysUserSave (params) {
  return postRequest(
    '12/sysUser/saveUser',
    params
  )
}

// 修改用户
function sysUserEdit (params) {
  return postRequest(
    '/sysUser/updateUser',
    params
  )
}

// 导出用户报表
function sysUserExpor (params) {
  return getExcelRequest(
    '/sysUser/exportUser',
    params
  )
}

// 运营商配置管理-查询
function querySysOperation (params) {
  return postRequest(
    '/sysOperation/listJson',
    params
  )
}

// 运营商配置管理-添加
function addSysOperation (params) {
  return postRequest(
    '/sysOperation/save',
    params
  )
}
// 运营商配置管理-修改
function updateSysOperation (params) {
  return postRequest(
    '/sysOperation/update',
    params
  )
}
// 运营商配置管理-删除
function deleteSysOperation (id) {
  return postRequest(
    '/sysOperation/delete',
    id
  )
}

// 用户类型管理-查询
function querySysRule (params) {
  return postRequest(
    '/sysRole/listJson',
    params
  )
}

// 查询监控点
function sysPointList (parmas) {
  return postRequest(
    '/sysPoint/listJSON',
    parmas
  )
}

// 导出监控点
function sysPointExport (parmas) {
  return getExcelRequest(
    '/sysPoint/exportExcel',
    parmas
  )
}

// 添加监控点
function sysPointSave (params) {
  return postRequest(
    '/sysPoint/save',
    params
  )
}

// 修改监控点
function sysPointUpdate (params) {
  return postRequest(
    '/sysPoint/update',
    params
  )
}

// 删除监控点
function sysPointDelete (params) {
  return getRequest(
    '/sysPoint/delete',
    params
  )
}

// 监控点详情
function sysPointView (params) {
  return postRequest(
    '/sysPoint/pointToView',
    params
  )
}

// 验收监控点
function sysPointCheck (params) {
  return postRequest(
    '/sysPoint/check',
    params
  )
}

// 用户类型管理-菜单查询
function querySysMenu () {
  return getRequest(
    '/sysMenu/selectMenuForRole'
  )
}

// 用户类型-权限查询
function sysRuleMenu (id) {
  return getRequest(
    '/sysRole/selectMenuByRole',
    id
  )
}

// 用户类型-添加
function updateSysRule (params) {
  return postRequest(
    '/sysRole/saveorupdate',
    params
  )
}

// 运维商配置管理-查询企业
function sysOperation () {
  return postRequest(
    '/sysOperation/queryCompanyByUserId'
  )
}

// 查询版本信息
function queryVersionMess () {
  return getRequest(
    'sysDictionary/queryVersionMess'
  )
}

// 污染物-信息因子
function queryInfoCodeByPointId (pollId) {
  return getRequest(
    'sysInfoCode/queryInfoCodeByPolId',
    pollId
  )
}

// 污染物-所有信息因子
function queryAllInfoCode (params) {
  return getRequest(
    'sysInfoCode/queryAllInfoCode',
    params
  )
}

// 污染物-添加因子
function insertPollInfoCode (params) {
  return postRequest(
    'sysInfoCode/insertPollInfoCode',
    params
  )
}

// 污染物-所有因子类型
function querySysInfoCodeType () {
  return getRequest(
    'sysInfoCode/querySysInfoCodeType'
  )
}

// 污染物-根据监控点ID查询污染物和污染物的因子信息
function queryPollAndInfoCodeByPoiId (poiId) {
  return getRequest(
    'sysInfoCode/queryPollAndInfoCodeByPoiId',
    poiId
  )
}

// 监控点-修改(添加)信息因子
function insertPointInfoCode (params) {
  return getRequest(
    'sysInfoCode/insertPointInfoCode',
    params
  )
}

// 字典表查询
function sysDictionaryQuery (params) {
  return getRequest(
    'sysDictionary/selectAllDictionary',
    params
  )
}

// 添加字典表
function sysDictionaryAdd (params) {
  return getRequest(
    'sysDictionary/insertDictionary',
    params
  )
}

// 修改字典表
function sysDictionaryUpdate (params) {
  return getRequest(
    'sysDictionary/updateDictionary',
    params
  )
}

// 删除字典表
function sysDictionaryDelete (ids) {
  return getRequest(
    'sysDictionary/delete',
    ids
  )
}

// 获取短信全局开关
function sysSmsGetGloSwitch () {
  return postRequest(
    '35/sysSmsConfig/getSmsGlobalSwitch'
  )
}

// 设置短信全局开关
function sysSmsSetGloSwitch (params) {
  return postRequest(
    '35/sysSmsConfig/setSmsGlobalSwitch',
    params
  )
}

// 获取中国网建短信账号
function sysSmsGetSmsAccount () {
  return postRequest(
    '35/sysSmsConfig/getSmsPlatformAccountSecretkey'
  )
}

// 设置中国网建短信账号
function sysSmsSetSmsAccount (params) {
  return postRequest(
    '35/sysSmsConfig/setSmsPlatformAccountSecretkey',
    params
  )
}

// 添加或修改短信配置
function sysSmsAddOrUpdate (params) {
  return postRequest(
    '/sysSmsConfig/addOrUpdate',
    params
  )
}

// 短信配置列表
function sysSmsList (params) {
  return postRequest(
    '/sysSmsConfig/query',
    params
  )
}

// 删除短信配置
function sysSmsDelete (params) {
  return postRequest(
    '/sysSmsConfig/delete',
    params
  )
}

// 开启或关闭单条短信配置
function sysSmsChangeInUse (params) {
  return postRequest(
    '/sysSmsConfig/changeInUse',
    params
  )
}

export default {
  // 企业管理
  getSysCompany,
  addSysCompany,
  updateSysCompany,
  deleteSysCompany,
  companyTypeList,
  // 污染物管理
  polQuery,
  polAdd,
  polDelete,
  polUpdate,
  polExport,
  sysUnitList,
  queryInfoCodeByPointId,
  queryAllInfoCode,
  insertPollInfoCode,
  querySysInfoCodeType,
  queryPollAndInfoCodeByPoiId,
  // 用户管理
  sysRulelist,
  sysUserQueryUserList,
  sysUserQueryUserById,
  sysUserDeleteUser,
  sysUserQueryCompany,
  sysUserQueryOper,
  sysUserSave,
  sysUserEdit,
  sysUserExpor,
  querySysOperation,
  addSysOperation,
  updateSysOperation,
  deleteSysOperation,
  // 用户类型
  querySysRule,
  sysPointList,
  sysPointExport,
  sysPointSave,
  sysPointUpdate,
  sysPointDelete,
  sysPointView,
  sysPointCheck,
  querySysMenu,
  sysRuleMenu,
  updateSysRule,
  // 运维商配置
  sysOperation,
  // 查询版本信息
  queryVersionMess,
  // 监控点
  insertPointInfoCode,
  // 字典表管理
  sysDictionaryQuery,
  sysDictionaryAdd,
  sysDictionaryUpdate,
  sysDictionaryDelete,
  // 短信配置
  sysSmsGetGloSwitch,
  sysSmsSetGloSwitch,
  sysSmsGetSmsAccount,
  sysSmsSetSmsAccount,
  sysSmsAddOrUpdate,
  sysSmsList,
  sysSmsDelete,
  sysSmsChangeInUse
}

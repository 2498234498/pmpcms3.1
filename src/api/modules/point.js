/**
 * 监控点信息
 */
import { getRequest, postRequest, getExcelRequest } from '../config'

// 查询监控点信息
function pointInfo (params) {
  return getRequest(
    '19/pointInfo/info',
    params
  )
}

// 监控点动态表头
function pointInfoTableHead (params) {
  return getRequest(
    '19/pointInfo/tableHead',
    params
  )
}

// 监控点数据列表
function pointInfoList (params) {
  return getRequest(
    '19/pointInfo/tableBody',
    params
  )
}

// 监控点数据图表
function pointInfoCharts (params) {
  return getRequest(
    '/pointInfo/charts',
    params
  )
}

// 查询监控点树型列表
function pointInfoTree () {
  return getRequest(
    '19/pointInfo/tree'
  )
}

// 动态管控列表
function pointInfoCodeList (params) {
  return getRequest(
    '19/pointInfo/infocode/list',
    params
  )
}

// 动态管控详情
function pointInfoCodeDetailed (params) {
  return getRequest(
    '19/pointInfo/infocode/detailed',
    params
  )
}

// 统计数据动态表头
function busHisDataTableHead (params) {
  return postRequest(
    '18/busHisData/tableHead',
    params
  )
}

// 统计数据图表查询
function busHisDataCharts (params) {
  return postRequest(
    '18/busHisData/charts',
    params
  )
}

// 统计数据导出接口
function busHisDataExpRtd (params) {
  return getExcelRequest(
    '18/busHisData/download',
    params
  )
}

// 统计数据查询
function busHisDataList (params) {
  return postRequest(
    '18/busHisData/listJson',
    params
  )
}

// 实时数据动态表头
function busRtdDataTableHead (params) {
  return postRequest(
    '18/busRtdData/getTableHeads',
    params
  )
}

// 查询日报表和月报表数据
function busHisDataSelectData (params) {
  return postRequest(
    '/busHisData/selectExportTemplateData',
    params
  )
}

// 导出日报表和月报表数据
function busHisDataExport (params) {
  return getExcelRequest(
    '/busHisData/exportTemplate',
    params
  )
}

// 实时数据图表
function busRtdDataCharts (params) {
  return postRequest(
    '18/busRtdData/getCharts',
    params
  )
}

// 实时数据导出
function busRtdDataExpRtd (params) {
  return getExcelRequest(
    '18/busRtdData/expRtd',
    params
  )
}

// 实时数据查询
function busRtdDataList (params) {
  return postRequest(
    '18/busRtdData/listJson',
    params
  )
}

// 05国标反控发送
function counterControlSend05 (params) {
  return postRequest(
    '/ReverseControl05/commonSend',
    params
  )
}

// 17国标反控发送
function counterControlSend17 (params) {
  return postRequest(
    '/ReverseControl17/commonSend',
    params
  )
}

// 国标轮询接口
function counterControlPoll (params) {
  return postRequest(
    '/ReverseControl17/commonQuery',
    params
  )
}

// 污染物因子
function ContaminantFactor (params) {
  return getRequest(
    '/sysInfoCode/queryInfoCodeByPointIdAndPollId',
    params
  )
}

// 排放额度列表
function emissionLimit (params) {
  return getRequest(
    '28/busEmission/selectLog',
    params
  )
}

// 新增排放额度
function emissionLimitAdd (params) {
  return getRequest(
    '28/busEmission/addEmissionAllowance',
    params
  )
}

// 总量数据列表
function busTotalData (params) {
  return getRequest(
    '27/busPollantSumval/table',
    params
  )
}

// 阀门反控列表
function valveList (params) {
  return getRequest(
    '/valveChangeLog/queryValveStateAndChangeRecords',
    params
  )
}

// 提取阀门
function valveDraw (params) {
  return getRequest(
    '/ReverseControlBocon/commonSend',
    params
  )
}

// 打开/关闭阀门
function valveSwitch (params) {
  return getRequest(
    '/ReverseControlBocon/commonSend',
    params
  )
}

// 删除额度
function deleteEmissionAllowance (params) {
  return getRequest(
    'busEmission/deleteEmissionAllowance',
    params
  )
}

// 删减额度污染物列表
function queryEmissionAllowance (poiId) {
  return getRequest(
    'busEmission/querySuccessPollant',
    poiId
  )
}

// 查询监控点led配置
function queryLedConfig (poiId) {
  return getRequest(
    'sysLedConfig/queryLedConfig',
    poiId
  )
}

// 站点信息
function queryDictionaryLed () {
  return getRequest(
    'sysDictionary/queryDictionaryLed'
  )
}

// 修改led配置
function updateLedConfig (params) {
  return postRequest(
    'sysLedConfig/updateLedConfig',
    params
  )
}

// 监控点led展示的数据
function ledConfigData (poiId) {
  return getRequest(
    'sysLedConfig/ledConfigData',
    poiId
  )
}

export default {
  pointInfo,
  pointInfoList,
  pointInfoCharts,
  pointInfoTableHead,
  pointInfoTree,
  pointInfoCodeList,
  pointInfoCodeDetailed,
  busHisDataTableHead,
  busHisDataCharts,
  busHisDataExpRtd,
  busHisDataList,
  busRtdDataTableHead,
  busHisDataSelectData,
  busHisDataExport,
  busRtdDataCharts,
  busRtdDataExpRtd,
  busRtdDataList,
  counterControlSend05,
  counterControlSend17,
  counterControlPoll,
  ContaminantFactor,
  emissionLimit,
  emissionLimitAdd,
  busTotalData,
  valveList,
  valveDraw,
  valveSwitch,
  deleteEmissionAllowance,
  queryEmissionAllowance,
  queryLedConfig,
  queryDictionaryLed,
  updateLedConfig,
  ledConfigData
}

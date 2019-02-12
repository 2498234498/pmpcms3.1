/**
 * 日志查询
 */
import { getRequest, getExcelRequest } from '../config'

// 操作日志-查询
function sysOperateLogListJson (params) {
  return getRequest(
    '20/sysOperateLog/listJson',
    params
  )
}

// 操作日志-日志类型列表
function sysOperateLogType () {
  return getRequest(
    '20/sysOperateLogType/listAllJson'
  )
}

// 操作日志-导出
function sysOperateLogExport (params) {
  return getExcelRequest(
    'sysOperateLog/download',
    params
  )
}

// 报文日志-查询
function busDataPacketListJson (params) {
  return getRequest(
    '20/busDataPacket/listJson',
    params
  )
}

// 报文日志-导出
function busDataPacketExport (params) {
  return getExcelRequest(
    'busDataPacket/download',
    params
  )
}

// 平台运行日志-查询
function sysRunningStatusListJSON (params) {
  return getRequest(
    '20/sysRunningStatus/listJSON',
    params
  )
}

// 平台运行日志-数据列表详情
function sysRunningListDetails (params) {
  return getRequest(
    'sysRunningRecord/listJSON',
    params
  )
}

// 平台运行日志-echarts数据
function sysRunningRecordListChart (rsId) {
  return getRequest(
    'sysRunningRecord/listChart',
    rsId
  )
}

// 反控日志-查询
function busReversecontrolLogListJson (params) {
  return getRequest(
    'busReversecontrolLog/listJson',
    params
  )
}

// 反控日志-导出
function busReversecontrolLogExport (params) {
  return getExcelRequest(
    'busReversecontrolLog/download',
    params
  )
}

// 反控日志-详情
function busReversecontrolResultSelectByQn (qn) {
  return getRequest(
    'busReversecontrolResult/selectByQn',
    qn
  )
}

export default {
  sysOperateLogListJson,
  sysOperateLogType,
  busDataPacketListJson,
  sysRunningStatusListJSON,
  sysOperateLogExport,
  sysRunningListDetails,
  sysRunningRecordListChart,
  busDataPacketExport,
  busReversecontrolLogListJson,
  busReversecontrolLogExport,
  busReversecontrolResultSelectByQn
}

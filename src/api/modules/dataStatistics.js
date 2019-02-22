/**
 * 数据统计
 */

import { getRequest, getExcelRequest } from '../config'

// 数据完整率日列表
function statisDataCompDayList (params) {
  return getRequest(
    '/busDataCompleteRate/selectPageCompleteRate',
    params
  )
}

// 数据完整率月列表
function statisDataCompMonthList (params) {
  return getRequest(
    '/busDataCompleteRate/selectPageCompleteRatePoint',
    params
  )
}

// 数据完整率月列表的子列
function statisDataComMonthListChild (params) {
  return getRequest(
    '/busDataCompleteRate/selectCompleteRate',
    params
  )
}

// 数据完整率导出
function statisDataComExport (params) {
  return getExcelRequest(
    '/busDataCompleteRate/exportExcel',
    params
  )
}

export default {
  statisDataCompDayList,
  statisDataCompMonthList,
  statisDataComMonthListChild,
  statisDataComExport
}

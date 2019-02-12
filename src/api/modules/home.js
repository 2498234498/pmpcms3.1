/**
 * 首页
 */

import { getRequest } from '../config'

// 动态表头
function homeTableHead (params) {
  return getRequest(
    '21/cacheIndexPage/queryDynamicTableHead',
    params
  )
}

// 表数据
function homeTableData (params) {
  return getRequest(
    '21/cacheIndexPage/queryDynamicTableData',
    params
  )
}

// 行业类型
function sysIndustryList () {
  return getRequest(
    '/sysIndustry/list'
  )
}

export default {
  homeTableHead,
  homeTableData,
  sysIndustryList
}

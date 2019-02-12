'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const adaptation = require('./adaptation')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL: '"/api"',
  adaptation,
  // ACTUAL_URL: '"http://192.168.1.227:8080/mockjsdata/"'
  // ACTUAL_URL: '"http://192.168.1.201:8080/pmpcms_web/"' // 黄健林本地服务器
  // ACTUAL_URL: '"http://192.168.1.155:8080/pmpcms_web/"' //罗雷君本地服务器
  ACTUAL_URL: '"http://192.168.1.106/pmpcms/"' // 测试服务器地址
  // ACTUAL_URL: '"http://192.168.1.164:8081/pmpcms_web/"' // 赖枢龙本地服务器
  // ACTUAL_URL: '"http://192.168.1.179:80/pmpcms_web/"' // 王健本地服务器
  // ACTUAL_URL: '"http://192.168.1.221:8888/pmpcms_web"' // 梁财本地
})

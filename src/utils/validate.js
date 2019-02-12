/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername (str) {
  const validMap = ['admin', 'editor']
  return validMap.indexOf(str.trim()) >= 0
}

/* 合法uri */
export function validateURL (textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母 */
export function validateLowerCase (str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母 */
export function validateUpperCase (str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母 */
export function validateAlphabets (str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

// 必须是字母、下划线、数字，至少1位
export function validateText (str) {
  const reg = /^[a-zA-z_0-9]{1,}$/
  return reg.test(str)
}

// 验证手机号
export function validatePhone (str) {
  const reg = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/
  return reg.test(str)
}

// 验证邮箱
export function validateEmail (str) {
  const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
  return reg.test(str)
}

// 9位数字或字母
export function validateCode (str) {
  const reg = /^[a-zA-z0-9]{9}$/
  return reg.test(str)
}

// 正数、小数、负数、最多两位小数
export function validateNums (str) {
  const reg = /^(-|\+)?\d+(\.\d{1,2})?$/
  return reg.test(str)
}

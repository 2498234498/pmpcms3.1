const is = false // true:开启，false:关闭

/**
 * 判断是否开启mock
 */
export function isMock (url) {
  if (is) {
    return url
  } else {
    return url.replace(/^\d+/, '')
  }
}

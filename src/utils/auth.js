import Cookies from 'js-cookie'

export const TokenKey = `token${window.location.port}`

// 过期时间，30分钟
// const timer = 1 / 48
// 过期时间 1天
const timer = 1

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token, { expires: timer })
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

import axios from 'axios'
import store from '@/store'
import qs from 'qs'
import prompt from './prompt'
import { getToken } from '@/utils/auth'
import Message from '@/config/customElement/message'
import { isMock } from '@/utils/mock'
require('es6-promise').polyfill()

const http = axios.create()

// 请求头
http.defaults.baseURL = process.env.BASE_URL

// 超时，10s
http.defaults.timeout = 60000

// 取消请求
const CancelToken = axios.CancelToken

/**
 * 取消请求方法
 * @param {Object} msg - 异常提示语 {message: '', code: ''}
 */
const cancelAxios = (msg, fn) => new CancelToken((cancel) => {
  msg && cancel(msg)
  fn && fn(cancel)
})

const pending = [] // 声明一个数组用于存储每一个ajax请求的取消函数和ajax标识

/**
 * 取消请求方法
 */
const removeRending = (config) => {
  for (let p in pending) {
    if (pending[p].u === config.url + '&' + config.method) { // 当前请求在数组中存在时执行函数体
      pending[p].f(prompt[13].text) // 执行取消操作
      pending.splice(p, 1) // 把这条记录从数组中移除
    }
  }
}

// 处理发送ajax请求前操作
http.interceptors.request.use(
  config => {
    removeRending(config) // 在一个ajax发送前执行一下取消操作
    config.cancelToken = cancelAxios(null, (c) => {
      // 这里的ajax标识我是用请求地址&请求方式拼接的字符串, 当然你可以选择其他的一些方式
      pending.push({ u: config.url + '&' + config.method, f: c })
    })
    config.url = isMock(config.url)
    if (config.method === 'put' || config.method === 'delete' || config.method === 'post') {
      config.data = qs.stringify(config.data)
    }
    // 判断进来的地址是不是需要权限
    if (config.url.indexOf('/login') < 0 && !store.getters.token) {
      // 取消请求
      config.cancelToken = cancelAxios(prompt[4].text)
    } else if (store.getters.token) {
      config.headers['token'] = getToken()
    }

    return config
  },
  err => {
    Message.error(prompt[10].text)
    return Promise.reject(err)
  }
)

// 处理接口返回时操作
http.interceptors.response.use(
  data => {
    // 在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
    removeRending(data.config)
    // data.data = typeof data.data === 'string' ? JSON.parse(data.data) : data.data
    // 判断是否取消请求
    if (!data.config.cancelToken.reason) {
      // 如果不等于0，则都是有异常
      if (prompt[data.data.state]) {
        // TODO
        Message.error(prompt[data.data.state].text)
        prompt[data.data.state].fn && prompt[data.data.state].fn()
        return Promise.reject(new Error('error'))
      }
    } else if (data.config.cancelToken.reason) {
      const message = data.config.cancelToken.reason.message
      Message.error(message.message)
      return Promise.reject(data.config.cancelToken.reason)
    }

    return data.data
  }, err => {
    if (err.message !== prompt[13].text && err.message !== prompt[4].text) {
      // TODO
      if (err.message.indexOf('timeout') >= 0) {
        // 超时
        Message.error(prompt[11].text)
      } else if (!err.response) {
        // 后台错误
        Message.error(prompt[12].text)
      } else if (prompt[err.response.status]) {
        // http通常拦截规则
        Message.error(prompt[err.response.status].text)
      } else {
        Message.error(prompt[12].text)
      }
    } else if (err.message === prompt[4].text) {
      // 登录失效
      Message.error(err.message)
      prompt[4].fn && prompt[4].fn()
    } else if (err.message !== prompt[13].text) {
      err.message && Message.error(err.message)
    }
    console.log(err)
    return Promise.reject(err)
  }
)

/**
 * post请求
 * @param url
 * @param params
 * @returns {AxiosPromise}
 */
export const postRequest = (url, params) => {
  return http({
    method: 'post',
    url: url,
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  })
}

/**
 * 上传文件请求
 * @param url
 * @param params
 * @returns {AxiosPromise}
 */
export const uploadFileRequest = (url, params) => {
  return http({
    method: 'post',
    url: url,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * put请求(分片)
 * @param url
 * @param params
 * @returns {AxiosPromise}
 */
export const putRequest = (url, params) => {
  return http({
    method: 'put',
    url: url,
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  })
}

/**
 * delete请求
 * @param url
 * @returns {AxiosPromise}
 */
export const deleteRequest = (url, params) => {
  return http({
    method: 'delete',
    url: url,
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  })
}

/**
 * get请求
 * @param url
 * @returns {AxiosPromise}
 */
export const getRequest = (url, params) => {
  return http({
    method: 'get',
    url: url,
    params
  })
}

/**
 * get请求导出文件流
 * @param url
 * @param params
 */
export const getExcelRequest = (url, params) => {
  return http({
    method: 'get',
    url: url,
    params,
    responseType: 'blob'
  })
}

/**
 * post请求导出文件流
 * @param url
 * @param params
 */
export const postExcelRequest = (url, params) => {
  return http({
    method: 'post',
    url: url,
    data: params,
    headers: {
      'Content-Type': 'application/json'
    },
    responseType: 'blob'
  })
}

/**
 * get请求图片流
 * @param url
 * @param params
 */
export const getPicRequest = (url, params) => {
  return http({
    method: 'get',
    url: url,
    data: params,
    responseType: 'arraybuffer'
  }).then(response => {
    return 'data:image/png;base64,' + btoa(
      new Uint8Array(response).reduce((data, byte) => data + String.fromCharCode(byte), '')
    )
  })
}

/**
 * post formData参数
 * @param url
 * @param params
 * @returns {AxiosPromise}
 */
export const postFormDataRequest = (url, params) => {
  return http({
    method: 'post',
    url: url,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

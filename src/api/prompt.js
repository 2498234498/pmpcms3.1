import store from '@/store'

const prompt = {
  2: {
    text: '系统异常'
  },
  3: {
    text: '参数异常'
  },
  4: {
    text: '登录失效',
    fn () {
      setTimeout(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload()// 为了重新实例化vue-router对象 避免bug
        })
      }, 500)
    }
  },
  10: {
    text: '网络异常'
  },
  11: {
    text: '请求超时，请检查网络'
  },
  12: {
    // 服务端异常
    text: '系统异常'
  },
  13: {
    text: '取消请求'
  },
  400: {
    // 前端请求参数错误
    text: '参数异常'
  },
  404: {
    // 请求地址不存在
    text: '请求地址不存在，请联系管理人员'
  },
  500: {
    // 后台异常
    text: '系统异常'
  }
}

export default prompt

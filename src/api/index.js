/**
 * ! 注意1
 *  1. import api from '@/api' //这样即可
 *  2. import login from '@/api/modules/login' //这种也可以，但只会用login的模块
 * ! 注意2
 * modules下各个函数名称不可重复
 */
import prompt from './prompt'

const requireAll = requireContext => requireContext.keys().reduce((prev, cur) => {
  return Object.assign(prev, requireContext(cur).default)
}, {})
const req = require.context('./modules', false, /\.js$/)
export default requireAll(req) || {}

/**
 * 判断不是重复请求返回的，关闭loading
 * @param {Array, Object} err
 * @param {Funtion} fn - 回调函数
 */
export const isRepeat = (err, fn) => {
  try {
    if (!Array.isArray(err)) {
      err = [err]
    }
    if (err.every(e => !(typeof e === 'object' && e.message === prompt[13].text))) {
      // console.log(err)
      fn && fn()
    }
  } catch (error) {
    fn && fn()
  }
}

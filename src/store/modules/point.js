import * as types from '../types'
import api, { isRepeat } from '@/api'
import message from '@/config/customElement/message'
import { findTreeData } from '@/utils'

const tagsView = {
  state: {
    loading: false,
    data: [],
    check: {},
    state: '', // 搜索状态
    filterText: '', // 搜索值
    isLoad: false,
    loadNum: 0 // 加载次数
  },
  mutations: {
    [types.SET_POINT]: (state, data) => {
      state.data = data
    },
    [types.SET_POINT_CHECK]: (state, data) => {
      sessionStorage.setItem('pointCheck', JSON.stringify(data))
      state.check = data || {}
    },
    [types.SET_POINT_LOAD]: (state, data) => {
      state.isLoad = data
    },
    [types.SET_POINT_LOADING]: (state, data) => {
      state.loading = data
    },
    [types.SET_POINT_STATE]: (state, data) => {
      state.state = data
    },
    [types.SET_POINT_TEXT]: (state, data) => {
      state.filterText = data
    },
    [types.SET_LOAD_NUM]: (state, data) => {
      if (data === 'add') {
        state.loadNum += 1
      } else {
        if (state.loadNum) {
          state.loadNum -= 1
        }
      }
    }
  },
  actions: {
    // 加载树型监控点列表
    async QueryPoint ({ commit, getters }) {
      let res = null
      commit('SET_POINT_LOADING', true)
      commit('SET_POINT_STATE', '')
      commit('SET_POINT_TEXT', '')
      try {
        res = await api.pointInfoTree()
        // console.log(res)
        if (res.state === 0) {
          res.data = Object.freeze(res.data || [])
          commit('SET_POINT', res.data)
          let { id } = getters.pointCheck
          if (!id) {
            // 当有选择时，则不找最近一个
            commit('SET_POINT_CHECK', getChildrenId(res.data))
          } else {
            let check = findTreeData(res.data, id)
            if (!check) {
              // 已有选择，但找不到匹配
              message.error('找不到该监控点')
            }
            commit('SET_POINT_CHECK', check || {})
          }
          commit('SET_POINT_LOAD', true)
        } else if (res.state === 101) {
          message.error('当前用户不存在，请重新登录')
        }
        commit('SET_POINT_LOADING', false)
      } catch (error) {
        isRepeat(error, () => {
          commit('SET_POINT_LOADING', false)
        })
      }
      return res
    },
    /**
     * 判断监控列表是否加载完成
     * ! 此用方法用于回调每个页面的created或者mounted内容
     */
    async IsPointLoad ({ dispatch, state, getters }) {
      if (state.isLoad) {
        return getters.pointCheck
      } else {
        let res = await dispatch('QueryPoint') || {}
        if (res.state === 0 && Array.isArray(res.data) && !res.data.length) {
          message('暂无监控点数据')
        }
        return getters.pointCheck
      }
    }
  }
}

// 获取children的默认选择数据
function getChildrenId (array, obj = null) {
  for (let i = 0; i < array.length; i++) {
    const e = array[i]
    if (!e.children || obj) {
      obj = obj || e
      break
    } else {
      obj = getChildrenId(e.children, obj)
    }
  }
  return obj
}

export default tagsView

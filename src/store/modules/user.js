import * as types from '../types'
import api from '@/api'
import md5 from 'md5'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { presetRouter } from '@/router'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    userInfo: {},
    menuIds: [] // 后台给的权限key
  },

  mutations: {
    [types.SET_TOKEN]: (state, token) => {
      state.token = token
    },
    [types.SET_NAME]: (state, name) => {
      state.name = name
    },
    [types.SET_AVATAR]: (state, avatar) => {
      state.avatar = avatar
    },
    [types.SET_ROLES]: (state, roles) => {
      localStorage.setItem('roles', JSON.stringify(roles))
      state.roles = roles
    },
    [types.SET_USERINFO]: (state, userInfo) => {
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      state.userInfo = userInfo
    },
    [types.SET_MEMUIDS]: (state, menuIds) => {
      localStorage.setItem('menuIds', JSON.stringify(menuIds))
      state.menuIds = menuIds
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      const userName = userInfo.userName.trim()
      const password = md5(userInfo.password).toUpperCase()
      return new Promise((resolve, reject) => {
        api.login(userName, password).then(response => {
          if (response.state === 0) {
            let { token, userName, menuIds = { row: [] }, user } = response.data
            setToken(response.data.token)
            commit('SET_TOKEN', token || '')
            commit('SET_NAME', userName || '')
            commit('SET_MEMUIDS', menuIds.rows)
            commit('SET_USERINFO', user || {})
            commit('SET_POINT_CHECK', {})
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 前端 登出
    FedLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_USERINFO', {})
        commit('SET_MEMUIDS', [])
        removeToken()
        resolve()
      })
    },

    // 生成权限表
    async GenerateRoutes ({
      commit, getters
    }) {
      let menuIds = getters.menuIds
      let role = filterRole(presetRouter, menuIds)
      commit('SET_ROLES', role)

      return true
    }
  }
}

export default user

/**
 * 筛选数据生成权限表
 * @param {Array} array - 预备路由数据
 * @param {Array} menuIds - 权限ID列表
 */
function filterRole (array, menuIds, first = true) {
  for (let i = 0; i < array.length; i++) {
    const e = array[i]
    if (!e.meta || !e.meta.id || (!menuIds.includes(e.meta.id) && e.meta.id !== 'all')) {
      array.splice(i, 1)
      i--
    } else if (Array.isArray(e.children)) {
      e.children = filterRole(e.children, menuIds, false)
    }
  }

  // 设置二级路由的重定向
  if (first) {
    array[0].children.forEach(e => {
      if (Array.isArray(e.children) && e.children[0]) {
        e['redirect'] = { name: e.children[0].name }
      }
    })
  }
  return array
}

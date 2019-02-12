import { getToken } from '@/utils/auth'
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => [...new Set(state.tagsView.cachedViews)],
  token: state => {
    if (getToken()) {
      state.user.token = getToken()
    }
    return state.user.token
  },
  avatar: state => state.user.avatar,
  name: state => {
    try {
      if (JSON.parse(localStorage.getItem('userInfo')).usrFullname) {
        state.user.name = JSON.parse(localStorage.getItem('userInfo')).usrFullname
      }
      return state.user.name
    } catch (error) {
      return ''
    }
  },
  userInfo: state => {
    try {
      if (JSON.parse(localStorage.getItem('userInfo'))) {
        state.user.userInfo = JSON.parse(localStorage.getItem('userInfo'))
      }
      return state.user.userInfo
    } catch (error) {
      return {}
    }
  },
  roles: state => state.user.roles,
  menuIds: state => {
    try {
      if (JSON.parse(localStorage.getItem('menuIds'))) {
        state.user.menuIds = JSON.parse(localStorage.getItem('menuIds'))
      }
      return state.user.menuIds
    } catch (error) {
      return []
    }
  },

  loadingColor: state => state.loadingColor,

  pointData: state => state.point.data,
  pointCheck: state => {
    try {
      let pointCheck = JSON.parse(sessionStorage.getItem('pointCheck'))
      if (pointCheck) state.point.check = pointCheck
      return state.point.check || {}
    } catch (error) {
      return {}
    }
  },
  pointLoad: state => state.point.isLoad,
  pointLoadNum: state => state.point.loadNum
}
export default getters

import * as types from '../types'
import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop'
  },
  mutations: {
    [types.TOGGLE_SIDEBAR]: (state, device) => {
      if (device !== undefined) {
        Cookies.set('sidebarStatus', device)
        state.sidebar.opened = !!device
      } else {
        if (state.sidebar.opened) {
          Cookies.set('sidebarStatus', 1)
        } else {
          Cookies.set('sidebarStatus', 0)
        }
        state.sidebar.opened = !state.sidebar.opened
      }
      state.sidebar.withoutAnimation = false
    },
    [types.CLOSE_SIDEBAR]: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    [types.TOGGLE_DEVICE]: (state, device) => {
      state.device = device
    }
  },
  actions: {
    ToggleSideBar: ({ commit }, device) => {
      commit('TOGGLE_SIDEBAR', device)
    },
    CloseSideBar ({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice ({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    }
  }
}

export default app

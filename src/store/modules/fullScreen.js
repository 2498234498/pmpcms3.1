import * as types from '../types'

export default {
  state: {
    fullScreen: {}
  },
  mutations: {
    [types.SET_FULLSCREEN_DATA]: (state, data) => {
      state.fullScreen = data
    }
  },
  actions: {
    setFullScreenState ({commit}, params) {
      commit('SET_FULLSCREEN_DATA', params)
    }
  }
}

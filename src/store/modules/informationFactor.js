import * as types from '../types'
import api from '@/api'

export default {
  state: {
    polluteInforList: []
  },
  mutations: {
    [types.SET_POLLUTE_INFO_LIST]: (state, data) => {
      state.polluteInforList = data
    }
  },
  actions: {
    async getPolluteInfoList ({commit}, params) {
      try {
        let res = await api.queryAllInfoCode(params)
        commit('SET_POLLUTE_INFO_LIST', res.data || [])
        return res.data || []
      } catch (error) {
        console.log(error)
      }
    }
  }
}

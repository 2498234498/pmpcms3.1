import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'
import point from './modules/point'
import information from './modules/informationFactor'
import codeData from './modules/codeData'
import fullScreen from './modules/fullScreen'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 统一loading
    loadingColor: 'rgba(0, 0, 0, 0.3)'
  },
  modules: {
    app,
    user,
    tagsView,
    point,
    information,
    codeData,
    fullScreen
  },
  getters
})

export default store

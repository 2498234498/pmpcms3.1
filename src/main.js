import Vue from 'vue'
import 'normalize.css/normalize.css'
// A modern alternative to CSS resets

import './config/ElementUI'
import 'element-ui/lib/theme-chalk/index.css'
// import '@/iconfont/iconfont.css'

import '@/styles/index.scss' // global css

import 'v-charts/lib/style.css'
import VeBmap from 'v-charts/lib/bmap.common'
import VeLine from 'v-charts/lib/line.common'
import Vegauge from 'v-charts/lib/gauge.common'
import VePie from 'v-charts/lib/pie.common'

import App from './App'
import router from './router'
import store from './store'
import api, { isRepeat } from './api'
import axios from 'axios'

import '@/icons' // icon
import '@/config/permission' // permission control
import BaseBtn from '@/components/BaseBtn'
import QueryBar from '@/components/QueryBar'

import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'

import cache from './mixins/cache'

import bus from './utils/bus'

import './utils/common'
require('es6-promise').polyfill()

Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 99999
  }
})

Vue.component(BaseBtn.name, BaseBtn)
Vue.component(QueryBar.name, QueryBar)

Vue.component(VeBmap.name, VeBmap)
Vue.component(VeLine.name, VeLine)
Vue.component(Vegauge.name, Vegauge)
Vue.component(VePie.name, VePie)

Vue.config.productionTip = false

Vue.prototype.$api = api // this.$api...
Vue.prototype.$isRepeat = isRepeat // 取消请求判断

Vue.use(bus)

/**
 * 获取配置信息
 */
const getAdaptation = async () => {
  Vue.prototype.$adaptation = {}
  if (process.env.NODE_ENV !== 'development') {
    try {
      let res = await axios.get(`./static/adaptation.json?${new Date().getTime()}`)
      for (const [key, value] of Object.entries(res.data)) {
        Vue.prototype.$adaptation[key] = value
      }
    } catch (error) {
      console.log(error)
    }
  } else {
    for (const [key, value] of Object.entries(process.env.adaptation)) {
      Vue.prototype.$adaptation[key] = value
    }
  }
  return true
}

Vue.mixin(cache)

/* eslint-disable no-new */
const main = async () => {
  await getAdaptation()
  new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
  })
}

main()

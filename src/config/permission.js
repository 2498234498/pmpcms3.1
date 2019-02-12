/* eslint-disable */
import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/', '/404'] // 路由白名单
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  if (!whiteList.includes(to.path)) {
    if (getToken()) { 
      // TODO 根据进来的用户权限，最终进入到哪个页面
      if (store.getters.roles.length === 0) {
        await store.dispatch('GenerateRoutes')
        router.addRoutes(store.getters.roles)
        next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
        NProgress.done()
      } else {
        next()
      }
    } else {
      next('/')
      NProgress.done()
    }
  }
  next ()
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})

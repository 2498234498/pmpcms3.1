import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '../views/layout/Layout'
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    isFirst: false,              是否第一次进来，默认false：第一次进来，true：不是第一次进来
    mobile: true                 是否隐藏系统菜单，默认不隐藏false
  }
* query: {
    isQuery: false               有缓存的页面，传这个值，强制执行页面内的逻辑
  }
**/
export const constantRouterMap = [
  { path: '/login', redirect: '/', hidden: true },
  {
    path: '/fullScreen',
    name: 'FullScreen',
    component: () => import('@/views/Point/FullScreenPublicity/FullScreen'),
    meta: { title: 'LED全屏公示', isLogin: true, id: 'all', noCache: true, hidden: true }
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/Redirect/index')
      }
    ]
  },
  { path: '/', component: () => import('@/views/Login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true }
]

export const presetRouter = [
  {
    path: '/main',
    component: Layout,
    redirect: '/main/home',
    meta: { isLogin: true, id: 'all', isFirst: false },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/Home/index'),
        meta: { title: '首页', icon: 'home', isLogin: true, id: 'all' }
      }
    ]
  },

  {
    path: '/point',
    component: Layout,
    name: 'Point',
    redirect: '/point/pointInfo',
    alwaysShow: true,
    meta: { title: '监控点总览', icon: 'location', isLogin: true, id: 'M020000' },
    children: [
      {
        path: 'pointInfo',
        name: 'PointInfo',
        component: () => import('@/views/Point/index'),
        meta: { title: '站点信息', isLogin: true, mobile: true, id: 'M020100' }
      },
      {
        path: 'dataQuery',
        name: 'DataQuery',
        component: () => import('@/views/Point/DataQuery'),
        meta: { title: '数据查询导出', isLogin: true, mobile: true, id: 'M020200', children: [{ id: 'M020201', bId: 'B10003' }, { id: 'M020202', bId: 'B10005' }] }
      },
      // {
      //   path: 'videoInfo',
      //   name: 'VideoInfo',
      //   component: () => import('@/views/Point/VideoInfo'),
      //   meta: { title: '视频信息', isLogin: true, id: 'all' }
      // },
      {
        path: 'equipmentCont',
        name: 'EquipmentCont',
        component: () => import('@/views/Point/EquipmentCont'),
        meta: { title: '设备反控运维', isLogin: true, mobile: true, id: 'M020400' }
      },
      {
        path: 'pointExperience',
        name: 'PointExperience',
        component: () => import('@/views/Point/PointExperience'),
        meta: { title: '监控点体检', isLogin: true, id: 'M020500' }
      },
      {
        path: 'totalControl',
        name: 'TotalControl',
        component: () => import('@/views/Point/TotalControl'),
        meta: { title: '总量控制', isLogin: true, mobile: true, id: 'M020600' }
      },
      {
        path: 'fullScreenPublicity',
        name: 'FullScreenPublicity',
        component: () => import('@/views/Point/FullScreenPublicity'),
        meta: { title: '全屏公示', isLogin: true, id: 'M020700' }
      }
    ]
  },

  // TODO
  // {
  //   path: '/dataAnalysis',
  //   component: Layout,
  //   name: 'DataAna',
  //   redirect: '/dataAnalysis/dataAnalysis',
  //   alwaysShow: true,
  //   meta: { isLogin: true, id: 'all' },
  //   children: [
  //     {
  //       path: 'dataAnalysis',
  //       name: 'DataAnalysis',
  //       component: () => import('@/views/DataAnalysis'),
  //       meta: { title: '数据分析', icon: 'datamanage', isLogin: true, id: 'all' }
  //     }
  //   ]
  // },

  // TODO
  // {
  //   path: '/operationWord',
  //   component: Layout,
  //   name: 'OperationWord',
  //   redirect: '/operationWord/PersonnelManagement',
  //   alwaysShow: true,
  //   meta: { title: '运维工作管理', icon: 'operations', isLogin: true, id: 'all' },
  //   children: [
  //     {
  //       path: 'personnelManagement',
  //       name: 'PersonnelManagement',
  //       component: () => import('@/views/OperationWord'),
  //       meta: { title: '人员管理', isLogin: true, id: 'all' }
  //     },
  //     {
  //       path: 'vehicleManagement',
  //       name: 'VehicleManagement',
  //       component: () => import('@/views/OperationWord/VehicleManagement'),
  //       meta: { title: '车辆管理', isLogin: true, id: 'all' }
  //     },
  //     {
  //       path: 'eventManagement',
  //       name: 'EventManagement',
  //       component: () => import('@/views/OperationWord/EventManagement'),
  //       meta: { title: '运维事件管理', isLogin: true, id: 'all' }
  //     }
  //   ]
  // },

  {
    path: '/journal',
    component: Layout,
    name: 'Journal',
    redirect: '/journal/pointJournal',
    alwaysShow: true,
    meta: { title: '日志查询', icon: 'logmanage', isLogin: true, id: 'M070000' },
    children: [
      {
        path: 'pointJournal',
        name: 'PointJournal',
        component: () => import('@/views/Journal'),
        meta: { title: '监控点报文日志', isLogin: true, id: 'M070100', children: [{ id: 'M070101', bId: 'B10005' }, { id: 'M070102', bId: 'B10003' }] }
      },
      {
        path: 'counterControlLog',
        name: 'CounterControlLog',
        component: () => import('@/views/Journal/CounterControlLog'),
        meta: { title: '监控点反控日志', isLogin: true, id: 'M070300', children: [{ id: 'M070301', bId: 'B10005' }, { id: 'M070302', bId: 'B10003' }] }
      },
      {
        path: 'userJournal',
        name: 'UserJournal',
        component: () => import('@/views/Journal/UserJournal'),
        meta: { title: '用户操作日志', isLogin: true, id: 'M070200', children: [{ id: 'M070201', bId: 'B10005' }, { id: 'M070202', bId: 'B10003' }] }
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    name: 'System',
    redirect: '/system/userManagement',
    alwaysShow: true,
    meta: { title: '系统管理', icon: 'sysmanage', isLogin: true, id: 'M060000' },
    children: [
      {
        path: 'userManagement',
        name: 'UserManagement',
        component: () => import('@/views/System'),
        meta: { title: '用户管理', isLogin: true, id: 'M060200', children: [{ id: 'M060201', bId: 'B10001' }, { id: 'M060202', bId: 'B10002' }, { id: 'M060203', bId: 'B10004' }, { id: 'M060204', bId: 'B10005' }, { id: 'M060205', bId: 'B10003' }] }
      },
      {
        path: 'userTypeManagement',
        name: 'UserTypeManagement',
        component: () => import('@/views/System/UserTypeManagement'),
        meta: { title: '用户类型管理', isLogin: true, id: 'M060100' }
      },
      {
        path: 'operationManagement',
        name: 'OperationManagement',
        component: () => import('@/views/System/OperationManagement'),
        meta: { title: '运维商配置管理', isLogin: true, id: 'M060400', children: [{ id: 'M060401', bId: 'B10001' }, { id: 'M060402', bId: 'B10002' }, { id: 'M060403', bId: 'B10004' }, { id: 'M060404', bId: 'B10003' }] }
      },
      {
        path: 'enterpriseManagement',
        name: 'EnterpriseManagement',
        component: () => import('@/views/System/EnterpriseManagement'),
        meta: { title: '企业配置管理', isLogin: true, id: 'M060300', children: [{ id: 'M060301', bId: 'B10001' }, { id: 'M060302', bId: 'B10002' }, { id: 'M060303', bId: 'B10004' }, { id: 'M060304', bId: 'B10003' }] }
      },
      {
        path: 'pointManagement',
        name: 'PointManagement',
        component: () => import('@/views/System/PointManagement'),
        meta: { title: '监控点配置管理', isLogin: true, id: 'M060500', children: [{ id: 'M060502', bId: 'B10001' }, { id: 'M060503', bId: 'B10002' }, { id: 'M060504', bId: 'B10004' }, { id: 'M060508', bId: 'B10005' }, { id: 'M060510', bId: 'B10007' }, { id: 'M060508', bId: 'B10003' }] }
      },
      {
        path: 'contaminantsManagement',
        name: 'ContaminantsManagement',
        component: () => import('@/views/System/ContaminantsManagement'),
        meta: { title: '污染物管理', isLogin: true, id: 'M060600', children: [{ id: 'M060601', bId: 'B10001' }, { id: 'M060602', bId: 'B10002' }, { id: 'M060603', bId: 'B10004' }, { id: 'M060604', bId: 'B10005' }, { id: 'M060605', bId: 'B10003' }] }
      },
      {
        path: 'dictionaryTable',
        name: 'DictionaryTable',
        component: () => import('@/views/System/DictionaryTable'),
        meta: { title: '字典表管理', isLogin: true, id: 'all' }
      },
      {
        path: 'smsConfig',
        name: 'SmsConfig',
        component: () => import('@/views/System/SmsConfig'),
        meta: { title: '短信配置', isLogin: true, id: 'all' }
      },
      {
        path: 'versionInfo',
        name: 'VersionInfo',
        component: () => import('@/views/System/VersionInfo'),
        meta: { title: '版本信息', isLogin: true, id: 'M060700' }
      },
      {
        path: 'help',
        name: 'Help',
        component: () => import('@/views/System/Help'),
        meta: { title: '帮助说明', isLogin: true, id: 'M060800' }
      }
    ]
  },

  {
    path: '/dataStatistics',
    component: Layout,
    name: 'DataStatistics',
    redirect: '/dataStatistics/dataIntegrity',
    alwaysShow: true,
    meta: { title: '数据统计', icon: 'shujutongji', isLogin: true, id: 'all' },
    children: [
      {
        path: 'dataIntegrity',
        name: 'DataIntegrity',
        component: () => import('@/views/DataStatistics/index'),
        meta: { title: '数据完整率', isLogin: true, id: 'all' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true, meta: { id: 'all' } }
]

// constantRouterMap.push(...presetRouter)

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '首页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'el-icon-s-home' }
    }]
  },

  {
    path: '/memberinfo',
    component: Layout,
    children: [
      {
        path: 'memberinfo',
        name: 'Member Info',
        component: () => import('@/views/memberInfo/index'),
        meta: { title: '用户列表', icon: 'user' }
      }
    ]
  },

  {
    path: '/article',
    component: Layout,
    children: [
      {
        path: 'artilce',
        name: 'ArticleList',
        component: () => import('@/views/article/index'),
        meta: { title: '文章列表', icon: 'el-icon-s-shop' }
      }
    ]
  },
  {
    path: '/transaction',
    component: Layout,
    meta: { title: '记录查询', icon: 'el-icon-s-finance' },
    children: [
      {
        path: 'fun_record',
        name: 'Fun Record',
        component: () => import('@/views/funrecord/index'),
        meta: { title: '资金记录', icon: 'el-icon-s-goods' }
      },
      {
        path: 'loglist',
        name: 'LogList',
        component: () => import('@/views/log/index'),
        meta: { title: '日志记录', icon: 'el-icon-question' }
      },
      {
        path: 'optionlist',
        name: 'OptionList',
        component: () => import('@/views/option/index'),
        meta: { title: '操作记录', icon: 'el-icon-question' }
      },
      {
        path: 'withdrawlist',
        name: 'WithdrawList',
        component: () => import('@/views/withdraw/index'),
        meta: { title: '提现记录', icon: 'el-icon-question' }
      }
    ]
  },

  {
    path: '/config',
    component: Layout,
    redirect: '/config/carolist',
    name: 'ConfigManage',
    meta: { title: '系统设置', icon: 'el-icon-more' },
    children: [
      {
        path: 'carolist',
        name: 'CarouselList',
        component: () => import('@/views/carousel/index'),
        meta: { title: '轮播图管理', icon: 'el-icon-picture' }
      },
      {
        path: 'allsettting',
        name: 'All Setting',
        component: () => import('@/views/allsetting/index'),
        meta: { title: '系统设置管理', icon: 'el-icon-s-tools' }
      }
    ]
  },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

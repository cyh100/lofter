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
    icon: 'svg-name'             the icon show in the sidebar
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
    path: '/',
    redirect: '/playlist/playlist'
  },

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
    path: '/playlist',
    component: Layout,
    meta: { title: '歌单管理', icon: 'table' },
    children: [
      {
        path: 'playlist2',
        name: 'playlist2',
        component: () => import('@/views/playlist/playlist2'),
        meta: { title: '歌单管理分页版', icon: 'table' }
      },
      {
        path: 'playlist',
        name: 'playlist',
        component: () => import('@/views/playlist/playlist'),
        meta: { title: '歌单管理单页版', icon: 'table' }
      },
      {
        path: 'edit/:id',
        name: 'edit',
        component: () => import('@/views/playlist/edit'),
        meta: { title: '歌单编辑页', icon: 'table' },
        hidden: true
      }]
  },

  {
    path: '/swiper',
    component: Layout,
    meta: { title: '轮播图管理', icon: 'table' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/swiper/list'),
        meta: { title: '轮播图管理', icon: 'tree' }
      },
      {
        path: 'upload',
        component: () => import('@/views/swiper/upload'),
        meta: { title: '轮播图上传', icon: 'tree' }
      }
    ]
  },

  {
    path: '/microblog',
    component: Layout,
    children: [
      {
        path: 'list',
        component: () => import('@/views/microblog/list'),
        meta: { title: '微博管理', icon: 'form' }
      }
    ]
  },

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

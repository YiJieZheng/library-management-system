
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import layout from '../components/layout.vue';
import login from '../components/login.vue';
import register from '../components/register.vue';
import book_collection_software from '../views/book_collection_software.vue';
import index from '../views/index.vue';
import loan_record from '../views/loan_record.vue';
import mine_borrow from '../views/mine_borrow.vue';
import personal_information from '../views/personal_information.vue';
import user_management from '../views/user_management.vue';
//无需权限页面
const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    meta: {
      hidden: true
    },
    component: login
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      hidden: true
    },
    component: register
  },
  {
    path: '/',
    redirect: '/main',
    name: 'index',
    meta: {
      hidden: false
    },
    component: layout,
    children: [
      {
        path: '/main',
        name: 'home',
        meta: {
          icon: '',
          title: '首页',
          hidden: false
        },
        component: index
      }]
  },
  {
    path: '/book',
    name: 'book',
    meta: {
      hidden: false
    },
    component: layout,
    children: [
      {
        path: '/book-management',
        name: 'book-management',
        meta: {
          icon: 'icon-tushuqikan',
          title: '图书管理',
          hidden: false
        },
        component: book_collection_software
      }]
  },
  {
    path: '/mine',
    name: 'mine',
    meta: {
      hidden: false
    },
    component: layout,
    children: [
      {
        path: '/borrow',
        name: 'borrow',
        meta: {
          icon: 'icon-book-information-i-borrow',
          title: '我的借阅',
          hidden: false
        },
        component: mine_borrow
      }]
  },
  {
    path: '/personal',
    name: 'personal',
    meta: {
      hidden: false
    },
    component: layout,
    children: [
      {
        path: '/information',
        name: 'information',
        meta: {
          icon: 'icon-gerenxinxi',
          title: '个人信息',
          hidden: false
        },
        component: personal_information
      },
    ]
  }
]
// admin routers
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/loan',
    name: 'loan',
    meta: {
      hidden: false
    },
    component: layout,
    children: [
      {
        path: '/record',
        name: 'loan-record',
        meta: {
          icon: 'icon-jieyuejilu',
          title: '借阅记录',
          role: ['admin'],
          hidden: false
        },
        component: loan_record
      },
    ]
  },
  {
    path: '/user',
    name: 'user',
    meta: {
      hidden: false
    },
    component: layout,
    children: [
      {
        path: '/user-management',
        name: 'user-management',
        meta: {
          icon: 'icon-yonghuguanli',
          title: '用户管理',
          role: ['admin'],
          hidden: false
        },
        component: user_management
      },
    ]
  },

]
export let router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes
})
export const resetRouter = (): void => {
  console.log('重置路由')
  const resetWhiteNameList = ['home', 'book-management', 'borrow', 'information', 'personal', 'mine', 'book', 'index', 'login']
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
  // router = createRouter({
  //   history: createWebHistory(import.meta.env.BASE_URL),
  //   routes: []
  // })
}

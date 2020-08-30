import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Register from '../views/Register'
import HomePage from '../views/HomePage'
import Hot from '../views/Hot'
import Cate from '../views/Cate'
import Chart from '../views/Chart'
import User from '../views/User'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/home',
    name: 'home',
    component: HomePage,
    // 重定向到热门页面
    redirect:'/home/hot',
    children:[
      {
        path: 'hot',
        name: 'hot',
        component: Hot
      },
      {
        path: 'cate',
        name: 'cate',
        component: Cate
      },
      {
        path: 'chart',
        name: 'chart',
        component: Chart
      },
      {
        path: 'user',
        name: 'user',
        component: User
      },
    ]
  },
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

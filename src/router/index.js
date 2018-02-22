import Vue from 'vue'
import Router from 'vue-router'
// MAIN
import Home from '@/components/Home'
import Info from '@/components/info/Info'
// AUTH
import Signin from '@/components/auth/Signin'
import Signup from '@/components/auth/Signup'
import Account from '@/components/auth/Account'
import AuthGuard from '@/router/auth-guard'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/signin',
      name: 'signin',
      component: Signin
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/account',
      name: 'account',
      component: Account,
      beforeEnter: AuthGuard
    },
    {
      path: '/logout',
      name: 'logout',
      beforeEnter: AuthGuard
    },
    {
      path: '/info',
      name: 'info',
      component: Info
    }
  ],
  mode: 'history'
})

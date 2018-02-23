import Vue from 'vue'
import Router from 'vue-router'
// MAIN
import Home from '@/components/Home'
import Info from '@/components/info/Info'
import ShoppingCart from '@/components/user/ShoppingCart'
// AUTH
import Signin from '@/components/auth/Signin'
import Signup from '@/components/auth/Signup'
import Account from '@/components/user/Account'
import AuthGuard from '@/router/auth-guard'
// SHOP
import Man from '@/components/shop/Man'
import Women from '@/components/shop/Women'
import Kids from '@/components/shop/Kids'

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
      path: '/cart',
      name: 'cart',
      component: ShoppingCart
    },
    {
      path: '/info',
      name: 'info',
      component: Info
    },
    {
      path: '/man',
      name: 'man',
      component: Man
    },
    {
      path: '/women',
      name: 'women',
      component: Women
    },
    {
      path: '/kids',
      name: 'kids',
      component: Kids
    }
  ],
  mode: 'history'
})

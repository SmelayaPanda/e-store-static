// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// CORE
import Vue from 'vue'
import App from './App'
import router from './router'
import {store} from './store'
// import {sync} from 'vuex-router-sync'
import * as firebase from 'firebase'
// UI
import ElementUI from 'element-ui'
import Vuetify from 'vuetify'
import 'element-ui/lib/theme-chalk/index.css'
import 'vuetify/dist/vuetify.min.css'
// FILTERS
import DateFilter from './filters/date'
import AdminDateFilter from './filters/admin_date'
import Snippet from './filters/snippet'
// MIXINS
import {authMixin} from './mixins/autentication'
import {image} from './mixins/image'
import {isLoading} from './mixins/loading'
import {mailing} from './mixins/mailing'
// SHARED
import AlertComp from './components/shared/Alert'
import Loader from './components/shared/Loader'
import HelpTooltip from './components/shared/HelpTooltip'
// USE
Vue.mixin(authMixin)
Vue.mixin(image)
Vue.mixin(isLoading)
Vue.mixin(mailing)
Vue.filter('date', DateFilter)
Vue.filter('admin_date', AdminDateFilter)
Vue.filter('snippet', Snippet)
Vue.component('app-alert', AlertComp)
Vue.component('app-loader', Loader)
Vue.component('app-help-tooltip', HelpTooltip)

Vue.use(ElementUI)
Vue.use(Vuetify, {
  theme: {
    primary: '#409EFF',
    secondary: '#2c3e50',
    success: '#67c23a',
    warning: '#e6a23c',
    danger: '#f56c6c',
    info: '#909399'
  }
})
// Sync vue-router's current $route as part of vuex store's state.
// const unsync = sync(store, router)
// unsync()
// -----------------------------
Vue.config.productionTip = false
// FIREBASE
let config
// if (process.env.NODE_ENV === 'development') {
config = {
  apiKey: 'AIzaSyDWYuL9ChkfHkLiINoz7ZdDuQntk4eWrI8',
  authDomain: 'e-store-dev.firebaseapp.com',
  databaseURL: 'https://e-store-dev.firebaseio.com',
  projectId: 'e-store-dev',
  storageBucket: 'e-store-dev.appspot.com',
  messagingSenderId: '252391298748'
}
// } else if (process.env.NODE_ENV === 'production') {
//   config = {
//     apiKey: 'AIzaSyA_xtUXZm6kZAKDJ4j1phpAlkqukVg_7Uo',
//     authDomain: 'e-store-prod.firebaseapp.com',
//     databaseURL: 'https://e-store-prod.firebaseio.com',
//     projectId: 'e-store-prod',
//     storageBucket: 'e-store-prod.appspot.com',
//     messagingSenderId: '117902843738'
//   }
// }

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>',
  created: function () {
    firebase.initializeApp(config)
    firebase.auth().onAuthStateChanged(
      user => {
        if (user) {
          this.$store.dispatch('autoSignIn', user)
          // console.log(user)
        }
        this.$store.dispatch('fetchProducts', {})
        this.$store.dispatch('fetchUserCart')
        this.$store.dispatch('fetchUserOrders')
        this.$store.dispatch('fetchAllOrders')
      })
  }
})

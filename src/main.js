// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import Vuetify from 'vuetify'
import 'element-ui/lib/theme-chalk/index.css'
import 'vuetify/dist/vuetify.min.css'

// USE
Vue.use(ElementUI)
Vue.use(Vuetify, {
  theme: {
    primary: '#bced96',
    secondary: '#faaf94',
    accept: '#19be6b',
    accent: '#8c9eff',
    error: '#b71c1c',
    readable: '#333'
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

import Vue from 'vue'
import Vuex from 'vuex'

import user from './user/index'
import shared from './shared/index'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    user: user,
    shared: shared
  }
})

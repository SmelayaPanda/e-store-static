import Vue from 'vue'
import Vuex from 'vuex'

import shared from './shared/index'
import user from './user/index'
import cart from './shopping-cart/index'
import products from './products/index'
import orders from './orders/index'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    user: user,
    shared: shared,
    cart: cart,
    products: products,
    orders: orders
  }
})

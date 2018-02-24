import * as firebase from 'firebase'

export default {
  state: {
    products: {}
  },
  mutations: {
    setProducts:
      (state, payload) => {
        state.products = payload
      }
  },
  actions: {
    fetchProducts:
      ({commit}) => {
        commit('LOADING', true)
        firebase.database().ref('/products/').once('value')
          .then(
            (data) => {
              commit('setProducts', data.val())
              commit('LOADING', false)
            })
          .catch(
            error => {
              commit('LOADING', false)
              console.log(error)
            })
      },
    addNewProduct:
      ({commit, getters}, payload) => {
        commit('LOADING', true)
        firebase.database().ref('/products/').push(payload)
          .then(data => {
            let products = getters.getProducts
            products[data.key] = payload
            commit('setProducts', products)
          })
          .catch(err => {
            console.log(err)
          })
      }
  },
  // Getters  ---------------------------------------------------
  getters: {
    getProducts:
      state => {
        return state.products
      },
    getProductsById:
      state => (productId) => {
        return state.products[productId]
      }
  }
}

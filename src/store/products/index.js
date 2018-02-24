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
              console.log(error)
              commit('LOADING', false)
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
            commit('LOADING', false)
          })
          .catch(err => {
            console.log(err)
            commit('LOADING', false)
          })
      },
    editProduct:
      ({commit, getters}, payload) => {
        commit('LOADING', true)
        let id = payload.id
        delete payload.id
        firebase.database().ref('products').child(id).update(payload)
          .then(() => {
            console.log('success')
            let products = getters.getProducts
            products[id] = payload
            commit('setProducts', products)
            commit('LOADING', false)
          })
          .catch(err => {
            console.log(err)
            commit('LOADING', false)
          })
      },
    deleteProduct:
      ({commit, getters}, payload) => {
        commit('LOADING', true)
        let products = getters.getProducts
        delete products[payload]
        firebase.database().ref('products').child(payload).remove()
          .then(() => {
            console.log('Product removed')
            commit('setProducts', products)
            commit('LOADING', false)
          })
          .catch(err => {
            console.log(err)
            commit('LOADING', false)
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

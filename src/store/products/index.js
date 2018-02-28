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
        firebase.database().ref('products').once('value')
          .then(
            (data) => {
              console.log('Products data fetched')
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
        let products = getters.products ? getters.products : {}
        firebase.database().ref('products').push(payload)
          .then(data => {
            return data.key
          })
          .then(key => {
            payload.productId = key
            products[key] = payload
            return firebase.database().ref('products').child(key).update(payload)
          })
          .then(() => {
            commit('setProducts', products)
            commit('LOADING', false)
            window.location.reload()
          })
          .catch(err => {
            console.log(err)
            commit('LOADING', false)
          })
      },
    editProduct:
      ({commit, getters}, payload) => {
        commit('LOADING', true)
        firebase.database().ref('products').child(payload.productId).update(payload)
          .then(() => {
            console.log('success')
            let products = getters.products
            products[payload.productId] = payload
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
        let products = getters.products
        delete products[payload]
        firebase.database().ref('products').child(payload).remove()
          .then(() => {
            commit('setProducts', products)
            console.log('Product was removed')
            commit('LOADING', false)
            window.location.reload()
          })
          .catch(err => {
            console.log(err)
            commit('LOADING', false)
          })
      }
  },
  // Getters  ---------------------------------------------------
  getters: {
    products:
      state => {
        return state.products
      },
    productById:
      state => (productId) => {
        return state.products[productId] ? state.products[productId] : {}
      }
  }
}

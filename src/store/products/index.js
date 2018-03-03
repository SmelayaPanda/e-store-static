import * as firebase from 'firebase'
import 'firebase/firestore'

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
        firebase.firestore().collection('products').orderBy('price').limit(6).get()
          .then(
            (snapshot) => {
              let products = []
              snapshot.forEach(doc => {
                products.push(doc.data())
              })
              console.log(products)
              console.log('Products data fetched')
              commit('setProducts', products)
              commit('LOADING', false)
            })
          .catch(
            error => {
              console.log(error)
              commit('LOADING', false)
            })
      },
    filterProducts:
      ({commit}, payload) => {
        console.log(payload.size)
        let query = firebase.firestore().collection('products').orderBy('price')
          .where('price', '>=', payload.minPrice)
          .where('price', '<=', payload.maxPrice)
        if (payload.size !== null) {
          query = firebase.firestore().collection('products').orderBy('price')
            .where('price', '>=', payload.minPrice)
            .where('price', '<=', payload.maxPrice)
            .where('size', '==', payload.size)
        }
        if (payload.color !== null) {
          query = firebase.firestore().collection('products').orderBy('price')
            .where('price', '>=', payload.minPrice)
            .where('price', '<=', payload.maxPrice)
            .where('color', '==', payload.color)
        }
        if (payload.size !== null && payload.color !== null) {
          query = firebase.firestore().collection('products').orderBy('price')
            .where('price', '>=', payload.minPrice)
            .where('price', '<=', payload.maxPrice)
            .where('size', '==', payload.size)
            .where('color', '==', payload.color)
        }
        query.get()
          .then(
            (snapshot) => {
              let products = []
              snapshot.forEach(doc => {
                products.push(doc.data())
              })
              console.log(products)
              commit('setProducts', products)
            })
          .catch(
            error => {
              console.log(error)
            })
      },
    addNewProduct:
      ({commit, getters}, payload) => {
        commit('LOADING', true)
        let products = getters.products ? getters.products : {}
        firebase.firestore().collection('products').add(payload)
          .then(data => {
            return data.id
          })
          .then(id => {
            payload.productId = id
            products[id] = payload
            return firebase.firestore().collection('products').doc(id).set(payload)
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
        firebase.firestore().collection('products').doc(payload.productId).set(payload)
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
        console.log(payload)
        firebase.firestore().collection('products').doc(payload).delete()
          .then(() => {
            commit('setProducts', products)
            console.log('Product was removed')
            commit('LOADING', false)
            // window.location.reload()
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

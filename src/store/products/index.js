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
        let query = firebase.firestore().collection('products').orderBy('price')
        // TODO: How I can rewrite it?
        if (payload.category && payload.size && payload.color) {
          query = query
            .where('category', '==', payload.category)
            .where('color', '==', payload.color)
            .where('size', '==', payload.size)
            .where('price', '>=', payload.minPrice)
            .where('price', '<=', payload.maxPrice)
        } else if (payload.size && payload.color) {
          query = query
            .where('color', '==', payload.color)
            .where('size', '==', payload.size)
            .where('price', '>=', payload.minPrice)
            .where('price', '<=', payload.maxPrice)
        } else if (payload.category && payload.color) {
          query = query
            .where('category', '==', payload.category)
            .where('color', '==', payload.color)
            .where('price', '>=', payload.minPrice)
            .where('price', '<=', payload.maxPrice)
        } else if (payload.size && payload.category) {
          query = query
            .where('category', '==', payload.category)
            .where('size', '==', payload.size)
            .where('price', '>=', payload.minPrice)
            .where('price', '<=', payload.maxPrice)
        } else if (payload.size) {
          query = query
            .where('size', '==', payload.size)
            .where('price', '>=', payload.minPrice)
            .where('price', '<=', payload.maxPrice)
        } else if (payload.category) {
          query = query
            .where('category', '==', payload.category)
            .where('price', '>=', payload.minPrice)
            .where('price', '<=', payload.maxPrice)
        } else if (payload.color) {
          query = query
            .where('color', '==', payload.color)
            .where('price', '>=', payload.minPrice)
            .where('price', '<=', payload.maxPrice)
        } else {
          query = query
            .where('price', '>=', payload.minPrice)
            .where('price', '<=', payload.maxPrice)
        }

        query.get()
          .then(
            (snapshot) => {
              let products = []
              snapshot.forEach(doc => {
                products.push(doc.data())
              })
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

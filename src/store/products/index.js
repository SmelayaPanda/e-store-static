import * as firebase from 'firebase'
import 'firebase/firestore'

export default {
  state: {
    products: {},
    lastVisibleId: '',
    isAllLoaded: false
  },
  mutations: {
    setProducts:
      (state, payload) => {
        state.products = payload
      },
    setLastVisible:
      (state, payload) => {
        state.lastVisibleId = payload
      },
    isAllLoaded: // to avoid infinitive load more
      (state, payload) => {
        state.isAllLoaded = payload
      }
  },
  actions: {
    fetchProducts:
      ({commit, getters}, payload) => {
        let query = firebase.firestore().collection('products')
        if (payload.maxPrice) {
          query = query
            .where('price', '>=', payload.minPrice)
            .where('price', '<=', payload.maxPrice)
        }
        if (payload.size) {
          query = query.where('size', '==', payload.size)
        }
        if (payload.category) {
          query = query.where('category', '==', payload.category)
        }
        if (payload.color) {
          query = query.where('color', '==', payload.color)
        }
        query = query.orderBy('price', payload.sortAsc ? 'asc' : 'desc')
        if (getters.lastVisibleId) {
          query = query.startAfter(getters.lastVisibleId)
        }

        query
          .limit(9)
          .get()
          .then((snapshot) => {
            let products = payload.loadMore ? getters.products : []
            if (!getters.isAllLoaded) {
              if (snapshot.size < 9) {
                commit('isAllLoaded', true)
              }
              snapshot.forEach(doc => {
                products.push(doc.data())
              })
              let lastVisible = snapshot.docs[snapshot.docs.length - 1]
              commit('setLastVisible', lastVisible)
            }
            commit('setProducts', products)
          })
          .catch(
            error => {
              console.log(error)
            })
      },
    resetLastVisible:
      ({commit}) => {
        commit('isAllLoaded', false)
        commit('setLastVisible', null)
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
    lastVisibleId:
      state => {
        return state.lastVisibleId
      },
    isAllLoaded:
      state => {
        return state.isAllLoaded
      },
    productById:
      state => (productId) => {
        return state.products[productId] ? state.products[productId] : {}
      }
  }
}

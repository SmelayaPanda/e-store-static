import * as firebase from 'firebase'

export default {
  state: {
    cart: []
  },
  mutations: {
    setCart:
      (state, payload) => {
        state.cart = payload
      }
  },
  actions: {
    addToCart:
      ({commit, getters}, payload) => {
        commit('LOADING', true)
        const user = getters.user
        let cart = getters.cart
        if (!user) {
          commit('LOADING', false)
          return
        }
        payload.qty = 1
        firebase.firestore().collection('users').doc(user.uid).collection('cart').add(payload)
          .then((docRef) => {
            payload.cartId = docRef.id
            cart.push(payload)
            commit('setCart', cart)
            commit('LOADING', false)
          })
          .catch(err => {
            console.log(err)
            commit('LOADING', false)
          })
      },
    removeFromCart:
      ({commit, getters}, payload) => {
        commit('LOADING', true)
        const user = getters.user
        if (!user) {
          commit('LOADING', false)
          return
        }
        firebase.firestore().collection('users').doc(user.uid).collection('cart').doc(payload).delete()
          .then(() => {
            let cart = getters.cart
            let idx = cart.findIndex(el => el.cartId === payload)
            cart.splice(idx, 1)
            commit('setCart', cart)
            commit('LOADING', false)
          })
          .catch(
            error => {
              console.log(error)
              commit('LOADING', false)
            })
      },
    fetchUserCart:
      ({commit, getters}) => {
        commit('LOADING', true)
        const user = getters.user
        if (!user) {
          commit('LOADING', false)
          return
        }
        firebase.firestore().collection('users').doc(user.uid).collection('cart').get()
          .then(snapshot => {
            let cart = []
            let item
            snapshot.docs.forEach(doc => {
              item = doc.data()
              item.cartId = doc.id
              cart.push(item)
            })
            commit('setCart', cart)
            commit('LOADING', false)
            console.log('Cart data fetched')
          })
          .catch(
            error => {
              console.log(error)
              commit('LOADING', false)
            })
      }
  },
  getters: {
    cart:
      state => {
        return state.cart.filter(obj => {
          return obj.isPayed !== true
        })
      }
  }
}

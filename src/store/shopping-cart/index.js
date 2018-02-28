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
        let cartId
        firebase.database().ref(`users/${user.uid}/carts`).push(payload)
          .then((data) => {
            cartId = data.key
            payload.cartId = cartId
            return firebase.database().ref(`users/${user.uid}/carts`).child(cartId).update({cartId: cartId})
          })
          .then(() => {
            return firebase.database().ref('cart_user').update({[cartId]: user.uid})
          })
          .then(() => {
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
        firebase.database().ref(`users/${user.uid}/carts`).child(payload).remove()
          .then(
            () => {
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
        firebase.database().ref(`users/${user.uid}/carts`).once('value')
          .then(
            (data) => {
              console.log('Cart data fetched')
              if (data.val()) {
                commit('setCart', Object.values(data.val()))
              }
              commit('LOADING', false)
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

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
        if (!user) {
          commit('LOADING', false)
          return
        }
        firebase.database().ref(`users/${user.uid}/cart`).push(payload)
          .then((data) => {
            let cart = getters.cart
            payload.cartId = data.key
            firebase.database().ref(`users/${user.uid}/cart`).child(data.key).update(payload)
              .then(() => {
                cart.push(payload)
                commit('setCart', cart)
                commit('LOADING', false)
              })
              .catch(err => {
                console.log(err)
                commit('LOADING', false)
              })
          })
          .catch(
            err => {
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
        firebase.database().ref(`users/${user.uid}/cart`).child(payload).remove()
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
        firebase.database().ref(`users/${user.uid}/cart`).once('value')
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
        return state.cart
      }
  }
}

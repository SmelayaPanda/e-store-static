import * as firebase from 'firebase'

export default {
  state: {
    cart: []
  },
  mutations: {
    setCart:
      (state, payload) => {
        state.cart = payload
        console.log('state will be changed')
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
        firebase.database().ref(`users/${user.id}/cart`).push(payload)
          .then((data) => {
            return data.key
          })
          .then(key => {
            let cart = getters.cart
            payload.cartId = key
            cart.push(payload)
            commit('setCart', cart)
            return firebase.database().ref(`users/${user.id}/cart`).child(key).update(payload)
          })
          .then(() => {
            commit('LOADING', false)
          })
          .catch(
            error => {
              console.log(error)
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
        firebase.database().ref(`users/${user.id}/cart`).child(payload).remove()
          .then(
            () => {
              let cart = getters.cart
              cart.splice(payload, 1)
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
        firebase.database().ref(`users/${user.id}/cart`).once('value')
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

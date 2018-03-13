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
    updateCart:
      ({commit, getters}, payload) => {
        commit('LOADING', true)
        const user = getters.user
        if (!user) {
          commit('LOADING', false)
          return
        }
        let cart = getters.cart
        if (payload.operation === 'add') {
          cart.push(payload.productId)
        } else if (payload.operation === 'remove') {
          cart.splice(cart.indexOf(payload), 1)
        }
        firebase.firestore().collection('users').doc(user.uid).update({cart: cart})
          .then(() => {
            commit('setCart', cart)
            commit('LOADING', false)
          })
          .catch(err => {
            console.log(err)
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
        firebase.firestore().collection('users').doc(user.uid).get()
          .then(snapshot => {
            let cart = snapshot.data().cart
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
        return state.cart
      }
  }
}

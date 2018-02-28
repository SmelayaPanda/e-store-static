import * as firebase from 'firebase'

export default {
  state: {
    orders: []
  },
  mutations: {
    setOrders:
      (state, payload) => {
        state.orders = payload
      }
  },
  actions: {
    fetchUserOrders:
      ({commit, getters}) => {
        commit('LOADING', true)
        const user = getters.user
        if (!user) {
          commit('LOADING', false)
          return
        }
        firebase.database().ref(`users/${user.uid}/orders`).once('value')
          .then(
            (data) => {
              console.log('Orders data fetched')
              if (data.val()) {
                commit('setOrders', Object.values(data.val()))
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
    orders:
      state => {
        return state.orders
      }
  }
}

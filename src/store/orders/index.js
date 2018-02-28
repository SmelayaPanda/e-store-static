import * as firebase from 'firebase'

export default {
  state: {
    orders: [],
    allOrders: []
  },
  mutations: {
    setOrders:
      (state, payload) => {
        state.orders = payload
      },
    setAllOrders:
      (state, payload) => {
        state.allOrders = payload
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
      },
    fetchAllOrders:
      ({commit, getters}) => {
        commit('LOADING', true)
        firebase.database().ref('users').once('value')
          .then(data => {
            let allUsersData = data.val()
            // let userIds = Object.keys(data.val())
            // console.log(userIds)
            let allOrders = []
            for (let userData in allUsersData) {
              if (allUsersData.hasOwnProperty(userData) && allUsersData[userData].orders) {
                let userOrders = Object.values(allUsersData[userData].orders)
                for (let order in userOrders) {
                  allOrders.push(userOrders[order])
                }
              }
            }
            console.log(allOrders)
            console.log('All Orders data fetched')
            commit('setAllOrders', allOrders)
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
      },
    allOrders:
      state => {
        return state.allOrders
      }
  }
}

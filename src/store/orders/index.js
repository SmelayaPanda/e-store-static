import * as firebase from 'firebase'
import router from '../../router'

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
        firebase.firestore().collection('users').doc(user.uid).collection('orders').get()
          .then(
            (snapshot) => {
              let orders = []
              snapshot.docs.forEach(doc => {
                let order = doc.data()
                order.id = doc.id
                orders.push(order)
              })
              console.log(orders)
              commit('setOrders', orders)
              commit('LOADING', false)
            })
          .catch(
            error => {
              console.log(error)
              commit('LOADING', false)
            })
      },
    // fetchAllOrders:
    //   ({commit, getters}) => {
    //     commit('LOADING', true)
    //     firebase.database().ref('users').once('value')
    //       .then(data => {
    //         let allUsersData = data.val()
    //         // let userIds = Object.keys(data.val())
    //         // console.log(userIds)
    //         let allOrders = []
    //         for (let userData in allUsersData) {
    //           if (allUsersData.hasOwnProperty(userData) && allUsersData[userData].orders) {
    //             let userOrders = Object.values(allUsersData[userData].orders)
    //             for (let order in userOrders) {
    //               allOrders.push(userOrders[order])
    //             }
    //           }
    //         }
    //         console.log('All Orders data fetched')
    //         commit('setAllOrders', allOrders)
    //         commit('LOADING', false)
    //       })
    //       .catch(
    //         error => {
    //           console.log(error)
    //           commit('LOADING', false)
    //         })
    //   },
    checkout:
      ({commit, getters}, payload) => {
        commit('LOADING', true)
        const user = getters.user
        if (!user) {
          commit('LOADING', false)
          return
        }
        firebase.firestore().collection('users').doc(user.uid).collection('orders').add(payload)
          .then((snapshot) => {
            let orderId = snapshot.id
            commit('LOADING', false)
            console.log(orderId)
            console.log('Order added')
            router.push('/account')
          })
          .catch(err => {
            console.log(err)
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

import * as firebase from 'firebase'
import router from '../../router'

export default {
  state: {
    orders: [],
    allOrders: [],
    orderStatistics: {
      payPending: 0,
      sentPending: 0,
      sent: 0,
      delivered: 0,
      refused: 0,
      totalOrders: 0
    }
  },
  mutations: {
    setOrders:
      (state, payload) => {
        state.orders = payload
      },
    setAllOrders:
      (state, payload) => {
        state.allOrders = payload
      },
    orderStatistics:
      (state, payload) => {
        state.orderStatistics = payload
      }
  },
  actions: {
    fetchOrders:
      ({commit, getters}, payload) => {
        commit('LOADING', true)
        let query = firebase.firestore().collection('orders')
        if (payload.userId) {
          query = query.where('userId', '==', payload.userId)
        }
        if (payload.status) {
          query = query.where('status', '==', payload.status)
        }
        query.orderBy('checkoutDate', 'desc').get()
          .then(
            (snapshot) => {
              let orders = []
              snapshot.docs.forEach(doc => {
                let order = doc.data()
                order.id = doc.id
                order.showDetails = false
                orders.push(order)
              })
              console.log('Orders data fetched')
              commit('setOrders', orders)
              commit('LOADING', false)
            })
          .catch(
            error => {
              console.log(error)
              commit('LOADING', false)
            })
      },
    checkout:
      ({commit, getters}, payload) => {
        commit('LOADING', true)
        const user = getters.user
        if (!user) {
          commit('LOADING', false)
          return
        }
        let orders = getters.orders ? getters.orders : []
        payload.userId = user.uid
        firebase.firestore().collection('orders').add(payload)
          .then((docRef) => {
            payload.id = docRef.id
            orders.unshift(payload)
            let actions = []
            // 1. remove items from user cart
            // 2. decrease totalQty of each products
            let updateCart = function (cart) {
              return firebase.firestore().collection('users').doc(user.uid).update({cart: cart})
            }
            let decreaseTotalQty = function (productId, totalQty) {
              return firebase.firestore().collection('products').doc(productId).update({totalQty: totalQty})
            }
            let cart = getters.cart
            let product
            for (let p of payload.products) {
              cart.splice(cart.indexOf(p.productId))
              product = getters.productById(p.productId)
              let isEndedProducts = product.totalQty - p.qty < 0
              if (isEndedProducts) {
                this.$notify({
                  title: 'Ahh...',
                  message: 'Probably while you were buying the goods it ended. ' +
                  'Our administrator will contact you to clarify the remaining quantity',
                  type: 'error',
                  showClose: true,
                  duration: 30000,
                  offset: 50
                })
              }
              actions.push(decreaseTotalQty(p.productId,
                isEndedProducts ? 0 : product.totalQty - p.qty))
            }
            actions.push(updateCart(cart))
            return Promise.all(actions)
          })
          .then(() => {
            commit('setOrders', orders)
            commit('LOADING', false)
            console.log('Order added')
            router.push('/cart')
          })
          .catch(err => {
            console.log(err)
            commit('LOADING', false)
          })
      },
    updateOrder:
      ({commit, getters}, payload) => {
        commit('LOADING', true)
        let orders = getters.orders
        firebase.firestore().collection('orders').doc(payload.orderId).update(payload.updateData)
          .then(() => {
            if (payload.updateData.status === 'refused') {
              // TODO: increase product totalQty ?
              // return firebase.firestore().collection('products')
              // .doc(payload.productId).update({totalQty: payload.totalQty})
            }
          })
          .then(() => {
            orders.splice(orders.indexOf(payload.orderId), 1)
            console.log('Order updated')
            commit('setOrders', orders)
            commit('LOADING', false)
          })
          .catch(err => {
            console.log(err)
            commit('LOADING', false)
          })
      },
    fetchOrderStatistics:
      ({commit}) => {
        firebase.firestore().collection('statistics').doc('orders').get()
          .then(snapshot => {
            console.log('Orders statistics fetched')
            commit('orderStatistics', snapshot.data())
          })
          .catch(err => {
            console.log(err)
          })
      }
  },
  getters: {
    orders:
      state => {
        return state.orders
      },
    orderById:
      state => (id) => {
        return state.orders.find(el => {
          return el.id === id
        })
      },
    allOrders:
      state => {
        return state.allOrders
      },
    orderStatistics:
      state => {
        return state.orderStatistics
      }
  }
}

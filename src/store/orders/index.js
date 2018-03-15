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

import * as firebase from 'firebase'

export default {
  state: {
    products: {}
  },
  mutations: {
    setProducts:
      (state, payload) => {
        state.products = payload
      }
  },
  actions: {
    fetchProducts:
      ({commit, getters}) => {
        commit('LOADING', true)
        firebase.database().ref('/products/').once('value')
          .then(
            (data) => {
              const dataPairs = data.val() // val() - to transform onto js valid form object!!
              console.log(dataPairs)
              // let registeredMeetups = []
              // let swappedPairs = {}
              // for (let key in dataPairs) {
              //   registeredMeetups.push(dataPairs[key]) // dataPairs[key] = meetupId
              //   swappedPairs[dataPairs[key]] = key
              // }
              // const updatedUser = {
              //   id: getters.user.id,
              //   registeredMeetups: registeredMeetups,
              //   fbKeys: swappedPairs,
              //   emailVerified: getters.user.emailVerified
              // }
              commit('LOADING', false)
              commit('setProducts', '')
            })
          .catch(
            error => {
              commit('LOADING', false)
              console.log(error)
            })
      }
  },
  // Getters  ---------------------------------------------------
  getters: {
    getProducts:
      state => {
        return state.products
      },
    getProductsById:
      state => (productId) => {
        return state.products.find((p) => {
          return p.id === productId
        })
      }
  }
}

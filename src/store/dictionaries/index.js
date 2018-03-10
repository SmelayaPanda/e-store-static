import * as firebase from 'firebase'

export default {
  state: {
    brands: [],
    colors: []
  },
  mutations: {
    setBrands:
      (state, payload) => {
        state.brands = payload
      },
    setColors:
      (state, payload) => {
        state.colors = payload
      }
  },
  actions: {
    fetchBrands:
      ({commit, getters}) => {
        commit('LOADING', true)
        firebase.firestore().collection('dictionaries').doc('brands').get()
          .then(snapshot => {
            console.log(snapshot.data().all)
            commit('setBrands', snapshot.data().all)
            commit('LOADING', false)
          })
          .catch(err => {
            console.log(err)
            commit('LOADING', false)
          })
      },
    uploadBrands:
      ({commit, getters}, payload) => {
        commit('LOADING', true)
        firebase.firestore().collection('dictionaries').doc('brands').set({all: payload})
          .then(() => {
            console.log('Brand uploaded')
            commit('setBrands', payload)
            commit('LOADING', false)
          })
          .catch(err => {
            console.log(err)
            commit('LOADING', false)
          })
      }
  },
  getters: {
    brands:
      state => {
        return state.brands
      },
    colors:
      state => {
        return state.colors
      }
  }
}

import * as firebase from 'firebase'

export default {
  state: {
    oneclick: []
  },
  mutations: {
    setOneClick:
      (state, payload) => {
        state.oneclick = payload
      }
  },
  actions: {
    fetchOneClick:
      ({commit}, payload) => {
        commit('LOADING', true)
        let query = firebase.firestore().collection('oneclick')
        if (payload) {
          query = query.where('status', '==', payload)
        }
        query.orderBy('creationDate').get()
          .then(snapshot => {
            let oneclick = []
            snapshot.docs.forEach(doc => {
              let item = doc.data()
              item.id = doc.id
              oneclick.push(item)
            })
            // console.log(oneclick)
            console.log('Oneclick fetched')
            commit('setOneClick', oneclick)
            commit('LOADING', false)
          })
          .catch(err => {
            console.log(err)
            commit('LOADING', false)
          })
      },
    updateOneClick:
      ({commit, getters}, payload) => {
        let name = payload.name
        delete payload.dictionary
        commit('LOADING', true)
        firebase.firestore().collection('dictionaries').doc(name).set({all: payload.data})
          .then(() => {
            console.log('Dictionary updated')
            commit('setBrands', payload.data)
            commit('LOADING', false)
          })
          .catch(err => {
            console.log(err)
            commit('LOADING', false)
          })
      }
  },
  getters: {
    oneclick:
      state => {
        return state.oneclick
      }
  }
}

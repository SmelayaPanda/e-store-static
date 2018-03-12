import * as firebase from 'firebase'

export default {
  state: {
    oneClick: []
  },
  mutations: {
    setOneClick:
      (state, payload) => {
        state.oneClick = payload
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
            let oneClick = []
            snapshot.docs.forEach(doc => {
              let item = doc.data()
              item.id = doc.id
              oneClick.push(item)
            })
            // console.log(oneclick)
            console.log('Oneclick fetched')
            commit('setOneClick', oneClick)
            commit('LOADING', false)
          })
          .catch(err => {
            console.log(err)
            commit('LOADING', false)
          })
      },
    updateOneClick:
      ({commit, getters}, payload) => {
        commit('LOADING', true)
        firebase.firestore().collection('oneclick').doc(payload.id).update(payload)
          .then(() => {
            console.log('One Click updated')
            commit('LOADING', false)
          })
          .catch(err => {
            console.log(err)
            commit('LOADING', false)
          })
      }
  },
  getters: {
    oneClick:
      state => {
        return state.oneClick
      },
    oneClickById:
      state => (id) => {
        return state.oneClick.find(el => {
          return el.id === id
        })
      }
  }
}

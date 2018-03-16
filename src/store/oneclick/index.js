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
        let oneClick = getters.oneClick
        firebase.firestore().collection('oneclick').doc(payload.oneClickId).update(payload.updateData)
          .then(() => {
            if (payload.updateData.status === 'processed') {
              return firebase.firestore().collection('products') // operator can add if absent
                .doc(payload.productId).update({totalQty: payload.totalQty > 0 ? payload.totalQty : 0})
            }
          })
          .then(() => {
            oneClick.splice(oneClick.indexOf(payload.oneClickId), 1)
            console.log('One Click updated')
            commit('setOneClick', oneClick)
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

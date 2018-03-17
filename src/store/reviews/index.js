import * as firebase from 'firebase'

export default {
  state: {
    reviews: []
  },
  mutations: {
    setReviews:
      (state, payload) => {
        state.reviews = payload
      }
  },
  actions: {
    fetchReviews:
      ({commit}, payload) => {
        commit('LOADING', true)
        let query = firebase.firestore().collection('reviews')
        if (payload.status) {
          query = query.where('status', '==', payload.status)
        }
        query.get()
          .then(snapshot => {
            let reviews = []
            snapshot.docs.forEach(doc => {
              let item = doc.data()
              item.id = doc.id
              reviews.push(item)
            })
            commit('setReviews', reviews)
            commit('LOADING', false)
            console.log('Review data fetched')
          })
          .catch(
            error => {
              console.log(error)
              commit('LOADING', false)
            })
      },
    addReview:
      ({commit, getters}, payload) => {
        commit('LOADING', true)
        firebase.firestore().collection('reviews').add(payload)
          .then((docRef) => {
            let reviews = getters.reviews
            reviews[docRef.id] = payload
            commit('setReviews', reviews)
            commit('LOADING', false)
            console.log('Review added')
          })
          .catch(err => {
            console.log(err)
            commit('LOADING', false)
          })
      },
    updateReview:
      ({commit, getters}, payload) => {
      }
  },
  getters: {
    reviews:
      state => {
        return state.reviews
      }
  }
}
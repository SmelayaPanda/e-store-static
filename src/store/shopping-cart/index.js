import * as firebase from 'firebase'

export default {
  // State ---------------------------------------------------
  state: {
    user: null, // new user creates only with firebase auth()
    isAdmin: false
  },
  // Mutations ---------------------------------------------------
  mutations: { // to change state
    registerUserForMeetup:
      (state, payload) => {
        const id = payload.id
        if (state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >= 0) {
          return
        }
        state.user.registeredMeetups.push(id)
        state.user.fbKeys[id] = payload.fbKey
      },
    unregisterUserFromMeetup:
      (state, payload) => {
        const registeredMeetups = state.user.registeredMeetups
        registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1)
        Reflect.deleteProperty(state.user.fbKeys, payload)
      }
  },
  // Actions ---------------------------------------------------
  actions: { // specify the mutation
    registerUserForMeetup:
      ({commit, getters}, payload) => {
        commit('LOADING', true)
        const user = getters.user
        firebase.database().ref('/users/' + user.id).child('/registrations/')
          .push(payload)
          .then(
            data => {
              commit('LOADING', false)
              commit('registerUserForMeetup', {id: payload, fbKey: data.key})
            })
          .catch(
            error => {
              console.log(error)
              commit('LOADING', false)
            })
      },
    unregisterUserFromMeetup:
      ({commit, getters}, payload) => {
        commit('LOADING', true)
        const user = getters.user
        if (!user.fbKeys) {
          return
        }
        const fbKey = user.fbKeys[payload]
        firebase.database().ref('/users/' + user.id + '/registrations/').child(fbKey)
          .remove()
          .then(
            () => {
              commit('LOADING', false)
              commit('unregisterUserFromMeetup', payload)
            })
          .catch(
            error => {
              console.log(error)
              commit('LOADING', false)
            })
      },
    fetchUserData:
      ({commit, getters}) => {
        commit('LOADING', true)
        firebase.database().ref('/users/' + getters.user.id + '/registrations/').once('value')
          .then(
            (data) => {
              const dataPairs = data.val() // val() - to transform onto js valid form object!!
              let registeredMeetups = []
              let swappedPairs = {}
              for (let key in dataPairs) {
                registeredMeetups.push(dataPairs[key]) // dataPairs[key] = meetupId
                swappedPairs[dataPairs[key]] = key
              }
              const updatedUser = {
                id: getters.user.id,
                registeredMeetups: registeredMeetups,
                fbKeys: swappedPairs,
                emailVerified: getters.user.emailVerified
              }
              commit('LOADING', false)
              commit('setUser', updatedUser)
            })
          .catch(
            error => {
              commit('LOADING', false)
              console.log(error)
            })
      }
  },
  // Getters  ---------------------------------------------------
  getters: {}
}

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
      },
    setUser:
      (state, payload) => {
        state.user = payload
        console.log(payload.user)
      },
    setAdmin:
      (state, payload) => {
        state.isAdmin = payload
      }
  },
  // Actions ---------------------------------------------------
  actions: { // specify the mutation
    registerUserForMeetup:
      ({commit, getters}, payload) => {
        commit('setLoading', true)
        const user = getters.user
        firebase.database().ref('/users/' + user.id).child('/registrations/')
          .push(payload)
          .then(
            data => {
              commit('setLoading', false)
              commit('registerUserForMeetup', {id: payload, fbKey: data.key})
            })
          .catch(
            error => {
              console.log(error)
              commit('setLoading', false)
            })
      },
    unregisterUserFromMeetup:
      ({commit, getters}, payload) => {
        commit('setLoading', true)
        const user = getters.user
        if (!user.fbKeys) {
          return
        }
        const fbKey = user.fbKeys[payload]
        firebase.database().ref('/users/' + user.id + '/registrations/').child(fbKey)
          .remove()
          .then(
            () => {
              commit('setLoading', false)
              commit('unregisterUserFromMeetup', payload)
            })
          .catch(
            error => {
              console.log(error)
              commit('setLoading', false)
            })
      },
    // Firebase authentication
    signUserUp:
      ({commit}, payload) => {
        commit('setLoading', true) // start loading process
        commit('clearError')
        // return a Promise
        firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(payload.email, payload.password)
          .then(
            user => {
              commit('setLoading', false) // we have user == loading complete
              commit('clearError')
              const newUser = {
                id: user.uid,
                registeredMeetups: [], // new user don't have registered meetups yet
                fbKeys: {},
                emailVerified: payload.emailVerified
              }
              commit('setUser', newUser) // setUser - invoke mutation
              firebase.auth().currentUser.sendEmailVerification().then(function () {
                alert('Email Verification Sent!')
              })
            }
          )
          .catch(
            error => {
              commit('setLoading', false) // we have error == loading complete
              commit('setError', error) // in this case it is the specific object from firebase with message property
              console.log(error)
            }
          )
      },
    signUserIn:
      ({commit}, payload) => {
        commit('setLoading', true)
        commit('clearError')
        firebase.auth().signInAndRetrieveDataWithEmailAndPassword(payload.email, payload.password)
          .then(
            user => {
              commit('setLoading', false)
              commit('clearError')
              const registeredUser = {
                id: user.uid,
                registeredMeetups: [], // initially empty< but later will loaded from firebase
                fbKeys: {},
                emailVerified: payload.emailVerified
              }
              commit('setUser', registeredUser)
              console.log('Succesful login')
            }
          )
          .catch(
            error => {
              commit('setLoading', false)
              commit('setError', error)
              console.log(error)
            }
          )
        // TODO: admin list to fetch from firebase
        let user = firebase.auth().currentUser
        if (user != null) {
          user.providerData.forEach(function (profile) {
            if (profile.email === 'montessoriberdsk@gmail.com') {
              commit('setAdmin', true)
            } else {
              commit('setAdmin', false)
            }
          })
        }
      },
    autoSignIn:
      ({commit}, payload) => {
        commit('setLoading', true)
        commit('setUser', {
          id: payload.uid,
          registeredMeetups: [],
          fbKeys: {},
          emailVerified: payload.emailVerified
        })
        commit('setLoading', false)
        let user = payload
        if (user != null) {
          user.providerData.forEach(function (profile) {
            if (profile.email === 'montessoriberdsk@gmail.com') {
              commit('setAdmin', true)
            } else {
              commit('setAdmin', false)
            }
          })
        }
      },
    fetchUserData:
      ({commit, getters}) => {
        commit('setLoading', true)
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
              commit('setLoading', false)
              commit('setUser', updatedUser)
            })
          .catch(
            error => {
              commit('setLoading', false)
              console.log(error)
            })
      },
    logout:
      ({commit}) => {
        firebase.auth().signOut()
        commit('setUser', null)
        window.location.reload()
      }
  },
  // Getters  ---------------------------------------------------
  getters: {
    user:
      state => {
        return state.user
      },
    isAdmin:
      state => {
        return state.isAdmin
      }
  }
}

import * as firebase from 'firebase'
import router from '../../router'
import { Message, Notification } from 'element-ui'

export default {
  // State ---------------------------------------------------
  state: {
    user: null,
    isAdmin: false
  },
  // Mutations ---------------------------------------------------
  mutations: { // change state
    setUser:
      (state, payload) => {
        state.user = payload
      },
    setAdmin:
      (state, payload) => {
        state.isAdmin = payload
      }
  },
  // Actions ---------------------------------------------------
  actions: { // specify the mutation
    signUserUp:
      ({commit}, payload) => {
        commit('LOADING', true)
        commit('CLEAR_ERR')
        firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(payload.email, payload.password)
          .then(
            user => {
              commit('LOADING', false)
              commit('CLEAR_ERR')
              const newUser = {
                id: user.uid,
                registeredMeetups: [],
                fbKeys: {},
                emailVerified: payload.emailVerified
              }
              commit('setUser', newUser)
              firebase.auth().currentUser.sendEmailVerification()
                .then(function () {
                  Notification({
                    title: 'Congratulations',
                    message: 'The account was created!',
                    type: 'success',
                    showClose: true,
                    duration: 10000,
                    offset: 50
                  })
                })
            }
          )
          .catch(
            error => {
              commit('LOADING', false)
              commit('ERR', error)
              console.log(error)
            }
          )
      },
    signUserIn:
      ({commit}, payload) => {
        if (firebase.auth().currentUser) {
          firebase.auth().signOut()
        }
        commit('LOADING', true)
        commit('CLEAR_ERR')
        firebase.auth().signInAndRetrieveDataWithEmailAndPassword(payload.email, payload.password)
          .then(
            user => {
              commit('LOADING', false)
              commit('CLEAR_ERR')
              const registeredUser = {
                id: user.uid,
                registeredMeetups: [],
                fbKeys: {},
                emailVerified: payload.emailVerified
              }
              commit('setUser', registeredUser)
              console.log('Successful Login')
            }
          )
          .catch(
            error => {
              commit('LOADING', false)
              commit('ERR', error)
              console.log(error)
            }
          )
        let user = firebase.auth().currentUser
        if (user != null) {
          user.providerData.forEach(function (profile) {
            if (profile.email === 'admin@gmail.com') {
              commit('setAdmin', true)
            } else {
              commit('setAdmin', false)
            }
          })
        }
      },
    autoSignIn:
      ({commit}, payload) => {
        commit('CLEAR_ERR')
        commit('LOADING', true)
        commit('setUser', {
          id: payload.uid,
          registeredMeetups: [],
          fbKeys: {},
          emailVerified: payload.emailVerified
        })
        commit('LOADING', false)
        let user = payload
        if (user != null) {
          user.providerData.forEach(function (profile) {
            if (profile.email === 'admin@gmail.com') {
              commit('setAdmin', true)
            } else {
              commit('setAdmin', false)
            }
          })
        }
      },
    resetPassword:
      ({commit}, payload) => {
        firebase.auth().sendPasswordResetEmail(payload).then(function () {
          Notification({
            title: 'Info',
            message: `Reset password form sent to your email: ${payload}!`,
            type: 'info',
            showClose: true,
            duration: 20000,
            offset: 50
          })
        }).catch(function (error) {
          let errorCode = error.code
          let errorMessage = error.message
          if (errorCode === 'auth/invalid-email') {
            Message({
              type: 'error',
              showClose: true,
              message: errorMessage,
              duration: 10000
            })
          } else if (errorCode === 'auth/user-not-found') {
            Message({
              type: 'error',
              showClose: true,
              message: errorMessage,
              duration: 10000
            })
          }
          console.log(error)
        })
      },
    logout:
      ({commit}) => {
        firebase.auth().signOut()
          .then(() => {
            commit('setUser', '')
            router.push('/')
            window.location.reload()
          })
          .catch(err => {
            console.log(err)
          })
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

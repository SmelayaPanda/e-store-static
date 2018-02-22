import * as firebase from 'firebase'
import router from '../../router'
import { Message } from 'element-ui'

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
        commit('LOADING', true) // start loading process
        commit('CLEAR_ERR')
        // return a Promise
        firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(payload.email, payload.password)
          .then(
            user => {
              commit('LOADING', false) // we have user == loading complete
              commit('CLEAR_ERR')
              const newUser = {
                id: user.uid,
                registeredMeetups: [], // new user don't have registered meetups yet
                fbKeys: {},
                emailVerified: payload.emailVerified
              }
              commit('setUser', newUser) // setUser - invoke mutation
              firebase.auth().currentUser.sendEmailVerification()
                .then(function () {
                  Message({
                    showClose: true,
                    message: 'Congratulations, the account was created!',
                    type: 'success',
                    duration: 10000
                  })
                })
            }
          )
          .catch(
            error => {
              commit('LOADING', false) // we have error == loading complete
              commit('ERR', error) // in this case it is the specific object from firebase with message property
              console.log(error)
            }
          )
      },
    signUserIn:
      ({commit}, payload) => {
        if (firebase.auth().currentUser) {
          firebase.auth().signOut()
        }
        console.log(payload)
        commit('LOADING', true)
        commit('CLEAR_ERR')
        firebase.auth().signInAndRetrieveDataWithEmailAndPassword(payload.email, payload.password)
          .then(
            user => {
              commit('LOADING', false)
              commit('CLEAR_ERR')
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
              commit('LOADING', false)
              commit('ERR', error)
              console.log(error)
            }
          )
        // TODO: admin list to fetch from firebase
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
          Message({
            showClose: true,
            message: 'Password Reset Email Sent!',
            duration: 10000,
            type: 'success'
          })
        }).catch(function (error) {
          let errorCode = error.code
          let errorMessage = error.message
          if (errorCode === 'auth/invalid-email') {
            Message({
              showClose: true,
              message: errorMessage,
              duration: 10000
            })
          } else if (errorCode === 'auth/user-not-found') {
            Message({
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

import * as firebase from 'firebase'
import router from '../../router'
import {Message, Notification} from 'element-ui'

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
        commit('CLEAR_ERR')
        commit('LOADING', true)
        let user
        firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(payload.email, payload.password)
          .then(data => {
            user = {
              cart: [],
              orders: [],
              oneclick: [],
              uid: data.user.uid,
              email: data.user.email,
              emailVerified: data.user.emailVerified,
              isAnonymous: data.user.isAnonymous,
              phoneNumber: data.user.phoneNumber
            }
            return firebase.firestore().collection('users').doc(user.uid).set(user)
          })
          .then(() => {
            Notification({
              title: 'Congratulations',
              message: 'The account was created!',
              type: 'success',
              showClose: true,
              duration: 10000,
              offset: 50
            })
            return firebase.auth().currentUser.sendEmailVerification()
          })
          .then(() => {
            console.log('User register. Email verification sent.')
            commit('LOADING', false)
          })
          .catch(err => {
            commit('LOADING', false)
            commit('ERR', err)
            console.log(err)
          })
      },
    signUserIn:
      ({commit}, payload) => {
        if (firebase.auth().currentUser) {
          firebase.auth().signOut()
        }
        commit('CLEAR_ERR')
        commit('LOADING', true)
        firebase.auth().signInAndRetrieveDataWithEmailAndPassword(payload.email, payload.password)
          .then(() => { // onAuthStateChanged works
            console.log('Successful Login')
            commit('LOADING', false)
          })
          .catch(
            error => {
              commit('ERR', error)
              commit('LOADING', false)
            })
      },
    signInAnonymously:
      () => {
        firebase.auth().signInAnonymouslyAndRetrieveData()
          .then(() => { // onAuthStateChanged works
            console.log('You are sign in anonymously')
          })
          .catch(err => {
            console.log(err)
          })
      },
    autoSignIn:
      ({commit}, payload) => {
        commit('setUser', payload)
      },
    setAdmin:
      ({commit}, payload) => {
        commit('setAdmin', payload)
      },
    logout:
      () => {
        firebase.auth().signOut()
          .then(() => {
            router.push('/')
            window.location.reload()
          })
          .catch(err => {
            console.log(err)
          })
      },
    resetPassword:
      ({commit}, payload) => {
        commit('CLEAR_ERR')
        firebase.auth().sendPasswordResetEmail(payload)
          .then(function () {
            Notification({
              title: 'Info',
              message: `Reset password form sent to your email: ${payload}!`,
              type: 'info',
              showClose: true,
              duration: 20000,
              offset: 50
            })
          })
          .catch(function (err) {
            let errorCode = err.code
            let errorMessage = err.message
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

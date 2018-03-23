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
      ({commit, dispatch}, payload) => {
        commit('CLEAR_ERR')
        commit('LOADING', true)
        dispatch('upgradeAnonymousAccount', payload)
          .then(() => {
            Notification({
              title: 'Congratulations',
              message: 'The account was created!',
              type: 'success',
              showClose: true,
              duration: 10000,
              offset: 50
            })
            router.push('/account')
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
    // All users initially register as anonymous
      () => {
        firebase.auth().signInAnonymouslyAndRetrieveData()
          .then((data) => { // onAuthStateChanged works
            return firebase.firestore().collection('users').doc(data.user.uid)
              .set({ // initialize user for quick update
                cart: [],
                orders: [],
                oneclick: [],
                isAnonymous: data.user.isAnonymous
              })
          })
          .then(() => {
            console.log('You are sign in anonymously')
          })
          .catch(err => {
            console.log(err)
          })
      },

    upgradeAnonymousAccount:
      ({commit, dispatch}, payload) => {
        let credential = firebase.auth.EmailAuthProvider.credential(payload.email, payload.password)
        firebase.auth().currentUser.linkWithCredential(credential)
          .then(user => {
            user.sendEmailVerification()
            commit('setUser', {...user})
            console.log('User register. Email verification sent.')
            console.log('Anonymous account successfully upgraded', user)
            return firebase.firestore().collection('users').doc(user.uid).update({
              email: user.email,
              emailVerified: user.emailVerified,
              isAnonymous: false
            })
          })
          .catch(err => {
            console.log('Error upgrading anonymous account', err)
          })
      },
    updateEmailVerification:
      ({commit}, payload) => {
        firebase.firestore().collection('users').doc(payload.uid).update({emailVerified: payload.emailVerified})
          .catch((err) => console.log(err))
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

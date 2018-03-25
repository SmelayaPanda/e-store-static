import * as firebase from 'firebase'
import {Message} from 'element-ui'

export default {
  state: {
    chat: {
      props: {
        lastOnline: 0, // timestamp (0 - online)
        onlineFrom: 0, // timestamp (0 - offline)
        isTypingUser: 0,
        isTypingAdmin: 0,
        isCollapsedUser: 1,
        isCollapsedAdmin: 1,
        unreadByUser: 0,
        unreadByAdmin: 0,
        userEmail: null
      },
      messages: {},
      events: {} // user action on site
    },
    liveChats: {} // for admin
    // chatId -> msgId: { msg: "", date: "", creator: 1/0 }
    //
    // 1. chatId equals to userId
    // 2. creator: 1 - user, 0 - admin
    // 3. date in timestamp format ( new Date().getTime() )
  },
  mutations: {
    setLiveChats:
      (state, payload) => {
        state.liveChats = payload
      },
    setChatMessages:
      (state, payload) => {
        state.chat.messages = payload
      },
    setUserEvents:
      (state, payload) => {
        state.chat.events = payload
      },
    setChatProp:
      (state, payload) => {
        state.chat.props[payload.propName] = payload.propValue
      }
  },
  actions: {
    observeUserConnection:
      ({commit}, payload) => {
        let chatRef = firebase.database().ref(`liveChats/${payload}/props`)
        let connectedRef = firebase.database().ref('.info/connected')
        connectedRef.on('value', function (snap) {
          if (snap.val() === true) {
            // online
            chatRef.update({
              lastOnline: 0,
              onlineFrom: new Date().getTime() // TODO: to server time
            })
            // offline
            chatRef.onDisconnect().update({
              lastOnline: new Date().getTime(),
              onlineFrom: 0
            })
          }
        })
      },
    fetchAllChats: // for admin
      ({commit, dispatch}) => {
        firebase.database().ref('liveChats').once('value')
          .then(snapshot => {
            commit('setLiveChats', snapshot.val())
            console.log('Fetched: live chat messages')
          })
          .then(() => {
            dispatch('subscribeToAllChats')
          })
          .catch(err => console.log(err))
      },
    notifyAdminAboutNewMessage:
      ({commit, getters}, payload) => {
        if (getters.liveChats[payload.key].props.unreadByAdmin !== payload.val().props.unreadByAdmin &&
          getters.liveChats[payload.key].props.isCollapsedAdmin) {
          let userName
          let audio = new Audio(require('@/assets/sounds/iphone_notification.mp3'))
          audio.setAttribute('crossorigin', 'anonymous')
          if (getters.liveChats[payload.key].props.userEmail) {
            userName = getters.liveChats[payload.key].props.userEmail
          } else {
            userName = `Anonymous ( ${payload.key.substring(0, 5)} )`
          }
          Message({
            type: 'success',
            showClose: true,
            message: `New message from ${userName}`,
            duration: 10000
          })
          audio.play()
        }
      },
    subscribeToAllChats: // for admin
      ({commit, getters, dispatch}) => {
        firebase.database().ref('liveChats').on('child_changed',
          data => {
            let liveChats = {...getters.liveChats}
            liveChats[data.key] = data.val()
            dispatch('notifyAdminAboutNewMessage', data)
            commit('setLiveChats', liveChats)
          })
      },
    subscribeToChat:
      ({commit, getters}, payload) => {
        let chatRef = firebase.database().ref(`liveChats/${payload}`)
        chatRef.child('messages').on('child_added', data => {
          if (data.val()) {
            let chatMessages = {...getters.chatMessages}
            chatMessages[data.key] = data.val()
            commit('setChatMessages', chatMessages)
          }
        })
        chatRef.child('events').on('child_added', data => {
          if (data.val()) {
            let userEvents = {...getters.userEvents}
            userEvents[data.key] = data.val()
            commit('setUserEvents', userEvents)
          }
        })
        chatRef.child('props').on('child_changed', data => {
          commit('setChatProp', {
            propName: data.key,
            propValue: data.val()
          })
        })
      },
    unsubscribeFromChat:
      ({commit, getters}, payload) => {
        let chatRef = firebase.database().ref(`liveChats/${payload}`)
        chatRef.child('messages').off()
        chatRef.child('events').off()
        chatRef.child('props').off()
      },
    initializeChat:
      ({commit, getters, dispatch}, payload) => {
        let chatRef = firebase.database().ref(`liveChats/${payload.chatId}`)
        chatRef.once('value')
          .then(data => {
            if (!data.val()) {
              console.log('New chat initialized!')
              return chatRef.child('props').set({
                lastOnline: 0,
                onlineFrom: 0,
                isTypingUser: 0,
                isTypingAdmin: 0,
                isCollapsedUser: 1,
                isCollapsedAdmin: 1,
                unreadByUser: 0,
                unreadByAdmin: 0,
                userEmail: payload.userEmail
              })
            } else { // load chat data
              commit('setChatMessages', data.val().messages ? data.val().messages : [])
              commit('setUserEvents', data.val().events ? data.val().events : [])
              commit('setChatProp', {
                propName: 'unreadByUser',
                propValue: data.val().props.unreadByUser
              })
            }
          })
          .then(() => {
            dispatch('subscribeToChat', payload.chatId)
            dispatch('observeUserConnection', payload.chatId)
          })
          .catch(err => console.log(err))
      },
    openChat: // for admin
      ({commit, dispatch}, payload) => {
        firebase.database().ref(`liveChats/${payload}`).once('value')
          .then(data => {
            commit('setChatMessages', data.val().messages ? data.val().messages : [])
            commit('setUserEvents', data.val().events ? data.val().events : [])
          })
          .then(() => {
            dispatch('subscribeToChat', payload)
          })
          .catch(err => console.log(err))
      },
    sendChatMessage:
      ({commit, getters}, payload) => {
        let newMsg = {
          msg: payload.msg,
          creator: payload.creator,
          date: new Date().getTime()
        }
        firebase.database().ref(`liveChats/${payload.chatId}/messages`).push(newMsg)
          .then((data) => {
            let chatMessages = {...getters.chatMessages}
            chatMessages[data.key] = newMsg
            commit('setChatMessages', chatMessages)
          })
          .catch(err => console.log(err))
      },
    USER_EVENT:
      ({commit, getters}, payload) => {
        let newEvent = {
          name: payload,
          date: new Date().getTime()
        }
        firebase.database().ref(`liveChats/${getters.user.uid}/events`).push(newEvent)
          .then((data) => {
            let userEvents = {...getters.userEvents}
            userEvents[data.key] = newEvent
            commit('setUserEvents', userEvents)
          })
          .catch(err => console.log(err))
      },
    setChatProp:
      ({commit, getters}, payload) => {
        firebase.database().ref(`liveChats/${payload.chatId}/props`)
          .update({
            [payload.props]: payload.value
          })
          .then(() => {
            commit('setChatProp', {
              propName: payload.props,
              propValue: payload.value
            })
          })
          .catch(err => console.log(err))
      }
  },
  getters: {
    chatMessages:
      state => {
        return state.chat.messages
      },
    userEvents:
      state => {
        return state.chat.events
      },
    chatPropByName:
      state => (name) => {
        return state.chat.props[name]
      },
    liveChats:
      state => {
        return state.liveChats
      }
  }
}

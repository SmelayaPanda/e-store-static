import * as firebase from 'firebase'

export default {
  state: {
    chat: {
      props: {
        isOnlineUser: false, // handle it (delete chat if user is offline)
        isOnlineAdmin: false, // handle it
        isTypingUser: false, // to 0 and 1 - firebase JSON
        isTypingAdmin: false,
        isCollapsedUser: true,
        isCollapsedAdmin: true,
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
    subscribeToAllChats: // for admin
      ({commit, getters}) => {
        firebase.database().ref('liveChats').on('child_changed',
          data => {
            let liveChats = {...getters.liveChats}
            liveChats[data.key] = data.val()
            commit('setLiveChats', liveChats)
          })
      },
    subscribeToChat:
      ({commit, getters}, payload) => {
        let chatRef = firebase.database().ref('liveChats/' + payload)
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
        let chatRef = firebase.database().ref('liveChats/' + payload)
        chatRef.child('messages').off()
        chatRef.child('events').off()
        chatRef.child('props').off()
      },
    initializeChat:
      ({commit, getters, dispatch}, payload) => {
        let chatRef = firebase.database().ref('liveChats/' + payload.chatId)
        chatRef.once('value')
          .then(data => {
            if (!data.val()) {
              console.log('New chat initialized!')
              return chatRef.child('props').set({
                isTypingUser: false,
                isTypingAdmin: false,
                isCollapsedUser: true,
                isCollapsedAdmin: true,
                unreadByUser: 0,
                unreadByAdmin: 0,
                userEmail: payload.userEmail
              })
            } else { // load chat data
              commit('setChatMessages', data.val().messages ? data.val().messages : [])
              commit('setUserEvents', data.val().events ? data.val().events : [])
            }
          })
          .then(() => {
            dispatch('subscribeToChat', payload.chatId)
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

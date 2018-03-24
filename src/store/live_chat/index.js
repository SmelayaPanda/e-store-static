import * as firebase from 'firebase'

export default {
  state: {
    chat: {
      props: {
        isTypingUser: false,
        isTypingAdmin: false,
        isCollapsedUser: true,
        isCollapsedAdmin: true,
        unreadByUser: 0,
        unreadByAdmin: 0,
        userEmail: null
      },
      messages: []
    },
    allChats: {} // for admin
    // chatId -> msgId: { msg: "", date: "", creator: 1/0 }
    //
    // 1. chatId equals to userId
    // 2. creator: 1 - user, 0 - admin
    // 3. date in timestamp format ( new Date().getTime() )
  },
  mutations: {
    setAllChats:
      (state, payload) => {
        state.allChats = payload
      },
    setChatMessages:
      (state, payload) => {
        state.chat.messages = payload
      },
    setChatProp:
      (state, payload) => {
        state.chat.props[payload.propName] = payload.propValue
      }
  },
  actions: {
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
            } else { // update chat for admin
              commit('setChatMessages', data.val().messages ? data.val().messages : [])
            }
          })
          .then(() => {
            // TODO: detach from on (off) when user offline
            chatRef.child('messages').on('child_added', data => {
              if (data.val()) {
                let chatMessages = {...getters.chatMessages}
                chatMessages[data.key] = data.val()
                commit('setChatMessages', chatMessages)
              }
            })
            chatRef.child('props').on('child_changed', data => {
              commit('setChatProp', {
                propName: data.key,
                propValue: data.val()
              })
            })
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
      },
    fetchAllChats:
      ({commit}) => {
        firebase.database().ref('liveChats').once('value')
          .then(snapshot => {
            commit('setAllChats', snapshot.val())
            console.log('Fetched: live chat messages')
          })
          .catch(err => console.log(err))
      }
  },
  getters: {
    chatMessages:
      state => {
        return state.chat.messages
      },
    chatPropByName:
      state => (name) => {
        return state.chat.props[name]
      },
    allChats:
      state => {
        return state.allChats
      }
  }
}

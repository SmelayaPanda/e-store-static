import * as firebase from 'firebase'

export default {
  state: {
    isTypingUser: false,
    isTypingAdmin: false,
    allChats: {}, // for admin
    chatMessages: {} // for single user only
    // chatId: { msg: "", date: "", creator: 1/0 }
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
        state.chatMessages = payload
      },
    isTypingUser:
      (state, payload) => {
        state.isTypingUser = payload
      },
    isTypingAdmin:
      (state, payload) => {
        state.isTypingAdmin = payload
      }
  },
  actions: {
    initializeChat:
      ({commit, getters, dispatch}, payload) => {
        let chatRef = firebase.database().ref('liveChat/' + payload.chatId)
        chatRef.once('value')
          .then(data => {
            if (!data.val()) {
              console.log('New chat initialized!')
              return chatRef.set({isTypingUser: false, isTypingAdmin: false})
            } else {
              let chatMessages = data.val()
              delete chatMessages.isTypingUser
              delete chatMessages.isTypingAdmin
              commit('setChatMessages', chatMessages)
            }
          })
          .then(() => {
            // Add new messages listener:
            // TODO: detatch from on (off) when user offline
            return chatRef.on('child_added', data => {
              if (data.val()) {
                let chatMessages = {...getters.chatMessages}
                chatMessages[data.key] = data.val()
                delete chatMessages.isTypingUser
                delete chatMessages.isTypingAdmin
                commit('setChatMessages', chatMessages)
              }
            })
          })
          .then(() => {
            // Add typing listener: data.key = 'isTypingAdmin' || 'isTypingUser'
            return chatRef.on('child_changed', data => {
              commit(data.key, data.val())
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
        firebase.database().ref('liveChat/' + payload.chatId).push(newMsg)
          .then((data) => {
            let chatMessages = {...getters.chatMessages} // new object for vuex watch
            chatMessages[data.key] = newMsg
            commit('setChatMessages', chatMessages)
            console.log('Message added')
          })
          .catch(err => console.log(err))
      },
    setTyping:
      ({commit, getters}, payload) => {
        firebase.database().ref('liveChat/' + payload.chatId).update({[payload.whoTyping]: payload.value})
          .then(() => {
            commit(payload.whoTyping, payload.value)
          })
          .catch(err => console.log(err))
      },
    fetchAllChats:
      ({commit, getters}, payload) => {
        firebase.database().ref('liveChat').once('value')
          .then(snapshot => {
            commit('setAllChats', snapshot.val())
            console.log('Fetched: live chat messages')
          })
          .catch(err => console.log(err))
      }
  },
  getters: {
    allChats:
      state => {
        return state.allChats
      },
    chatMessages:
      state => {
        return state.chatMessages
      },
    isTypingUser:
      state => {
        return state.isTypingUser
      },
    isTypingAdmin:
      state => {
        return state.isTypingAdmin
      }
  }
}

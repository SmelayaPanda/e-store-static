import * as firebase from 'firebase'

export default {
  state: {
    chat: {
      props: {
        isTypingUser: false,
        isTypingAdmin: false
      },
      messages: []
    },
    allChats: {} // for admin
    // msgId: { msg: [], date: "", creator: 1/0 }
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
    isTypingUser:
      (state, payload) => {
        state.chat.props.isTypingUser = payload
      },
    isTypingAdmin:
      (state, payload) => {
        state.chat.props.isTypingAdmin = payload
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
              return chatRef.child('props').set({isTypingUser: false, isTypingAdmin: false})
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
        firebase.database().ref(`liveChat/${payload.chatId}/messages`).push(newMsg)
          .then((data) => {
            let chatMessages = {...getters.chatMessages}
            chatMessages[data.key] = newMsg
            commit('setChatMessages', chatMessages)
          })
          .catch(err => console.log(err))
      },
    setTyping:
      ({commit, getters}, payload) => {
        firebase.database().ref(`liveChat/${payload.chatId}/props`)
          .update({
            [payload.whoTyping]: payload.value
          })
          .then(() => {
            commit(payload.whoTyping, payload.value)
          })
          .catch(err => console.log(err))
      },
    fetchAllChats:
      ({commit}) => {
        firebase.database().ref('liveChat').once('value')
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
    isTypingUser:
      state => {
        return state.chat.props.isTypingUser
      },
    isTypingAdmin:
      state => {
        return state.chat.props.isTypingAdmin
      },
    allChats:
      state => {
        return state.allChats
      }
  }
}

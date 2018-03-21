import * as firebase from 'firebase'

export default {
  state: {
    allMessages: {}, // for admin
    chatMessages: {} // for single user only
    // chatId: { msg: "", date: "", creator: 1/0 }
    //
    // 1. chatId equals to userId
    // 2. creator: 1 - user, 0 - admin
    // 3. date in timestamp format ( new Date().getTime() )
  },
  mutations: {
    setAllMessages:
      (state, payload) => {
        state.allMessages = payload
      },
    setChatMessages:
      (state, payload) => {
        state.chatMessages = payload
      }
  },
  actions: {
    fetchMessages:
      ({commit}, payload) => {
        firebase.database().ref('messages/' + payload.chatId).once('value')
          .then(data => {
            commit('setChatMessages', data.val())
            console.log('Messages fetched')
          })
          .catch(err => console.log(err))
      },
    sendMessage:
      ({commit, getters}, payload) => {
        let newMsg = {
          msg: payload.msg,
          creator: payload.creator,
          date: new Date().getTime()
        }
        firebase.database().ref('messages/' + payload.chatId).push(newMsg)
          .then((data) => {
            let chatMessages = {...getters.chatMessages} // new object for vuex watch
            chatMessages[data.key] = newMsg
            commit('setChatMessages', chatMessages)
            console.log('Message added')
          })
          .catch(err => console.log(err))
      }
  },
  getters: {
    allMessages:
      state => {
        return state.allMessages
      },
    chatMessages:
      state => {
        return state.chatMessages
      }
  }
}

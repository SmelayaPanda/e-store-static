<template>
  <transition name="bounce">
    <v-btn fab class="primary collapsed_chat"
           v-if="isCollapsedChat"
           @click="isCollapsedChat = false"
    >
      <v-icon>chat</v-icon>
    </v-btn>
    <v-card v-if="!isCollapsedChat" class="live_chat">
      <v-card-title class="chat_header primary">
        <el-button type="text" class="right"
                   style="margin: 0; padding: 0;"
                   @click="isCollapsedChat = true"
        >
          <v-icon class="white--text">close</v-icon>
        </el-button>
        <h3 class="ml-3 white--text">
          Live Chat
        </h3>
        <transition name="fade">
            <span v-if="isUserSide ? isTypingAdmin : isTypingUser" class="ml-4 white--text">
                <span v-if="!isUserSide">User is typing</span>
                <span v-if="isUserSide">Admin is typing</span>
                ...<v-icon size="medium" class="pb-1 white--text">edit</v-icon>
            </span>
        </transition>
      </v-card-title>
      <v-card-text ref="chatMessages" class="chat_messages">
          <span v-if="Object.keys(chatMessages).length === 0">
            <h2 class="mt-5 info--text">Have question?</h2>
          </span>
        <div v-for="(chat, key) in chatMessages"
             :key="key"
        >
          <el-row>
            <el-col :span="24" class="info--text" style="font-size: 10px">
                <span :class="chat.creator ? 'left' : 'right'">
                {{chat.creator ? 'You' : 'ReHigh' }}:
                {{ new Date(chat.date) | chatTime }}
                </span>
            </el-col>
          </el-row>
          <el-row :class="chat.creator ? 'left' : 'right'">
            <el-col :span="24">
              <p :class="chat.creator ? 'pr-4 primary--text' : 'pl-4 success--text'"
                 style="white-space: pre-wrap; text-align: left"
              >{{ chat.msg }}</p>
            </el-col>
          </el-row>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
      <textarea v-model="msg"
                cols="40" rows="3"
                placeholder="Type..."
                class="chat_input"
                @input="detectTyping"
                @keydup.shift.enter="msg+='\n'"
                @keydup.ctrl.enter="msg+='\n'"
                @keydup.alt.enter="msg+='\n'"
                @keydup.meta.enter="msg+='\n'"
                @keydup.down="msg+='\n'"
                @keyup.enter.exact="sendChatMessage"></textarea>
      </v-card-actions>
    </v-card>
  </transition>
</template>

<script>
import chatTime from '@/filters/chatTime'

export default {
  name: 'LiveChat',
  // isUserSide === false -> admin
  props: ['chatId', 'isUserSide'],
  data () {
    return {
      msg: '',
      isTyping: false,
      isCollapsedChat: this.isUserSide
    }
  },
  filters: {chatTime},
  methods: {
    sendChatMessage () {
      this.$store.dispatch('sendChatMessage', {
        chatId: this.chatId,
        msg: this.msg,
        creator: this.isUserSide ? 1 : 0
      })
        .then(() => {
          this.$nextTick(function () {
            this.msg = ''
            this.$forceUpdate()
            this.scrollToBottom()
          })
        })
    },
    detectTyping () {
      this.isTyping = true
      this.setTyping()
      setTimeout(() => {
        this.isTyping = false
        this.setTyping()
      }, 4000)
    },
    setTyping () {
      this.$store.dispatch('setTyping', {
        chatId: this.chatId,
        whoTyping: this.isUserSide ? 'isTypingUser' : 'isTypingAdmin',
        value: this.isTyping
      })
    },
    scrollToBottom () {
      if (this.$refs.chatMessages) {
        let chat = this.$refs.chatMessages
        chat.scrollTop = chat.scrollHeight
      }
    }
  },
  computed: {
    chatMessages () {
      return this.$store.getters.chatMessages
    },
    isTypingUser () {
      return this.$store.getters.isTypingUser
    },
    isTypingAdmin () {
      return this.$store.getters.isTypingAdmin
    }
  },
  watch: {
    chatMessages () {
      this.$nextTick(function () {
        this.scrollToBottom()
      })
    }
  }
}
</script>

<style scoped>
  .chat_header {
    margin-bottom: 1px;
    padding-bottom: 12px;
  }

  .chat_messages {
    width: 100%;
    height: 280px;
    overflow: scroll;
  }

  .chat_input {
    padding: 5px;
  }

  .live_chat {
    position: fixed;
    bottom: 30px;
    right: 40px;
    width: 320px;
    height: 400px;
  }

  .collapsed_chat {
    position: fixed;
    bottom: 30px;
    right: 40px;
  }

  textarea {
    border: 1px solid lightgrey;
    border-radius: 3px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */
  {
    opacity: 0;
  }

  .bounce-enter-active {
    animation: bounce-in .5s;
  }

  .bounce-leave-active {
    animation: bounce-in .5s reverse;
  }

  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
</style>

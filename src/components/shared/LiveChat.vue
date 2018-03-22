<template>
  <el-row type="flex" justify="center" style="flex-wrap: wrap">
    <el-col :span="8">
      <el-card>
        <div class="chat_header">
          <h3>Live Chat</h3>
        </div>
        <div class="chat_messages">
          <div v-for="(chat, key) in chatMessages"
               :key="key">
            <el-row>
              <el-col :span="24" class="info--text" style="font-size: 10px">
                <span :class="chat.creator ? 'left' : 'right'">
                {{chat.creator ? 'You' : 'ReHigh' }}:
                {{ new Date(chat.date) | chatTime }}
                </span>
              </el-col>
            </el-row>
            <el-row :class="chat.creator ? 'left' : 'right'"
                    style="word-wrap: break-word;">
              <el-col :span="24">
                <span :class="chat.creator ? 'primary--text' : 'success--text'">
                  {{ chat.msg }}
                </span>
              </el-col>
            </el-row>
          </div>
        </div>
        <span v-if="isTyping">
          User is typing
          ...<v-icon size="medium" class="pb-1">edit</v-icon>
        </span>
        <v-text-field v-model="msg" @input="detectTyping"></v-text-field>
        <el-button @click="sendChatMessage">Add message</el-button>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import chatTime from '@/filters/chatTime'

export default {
  name: 'LiveChat',
  data () {
    return {
      msg: '',
      isTyping: false
    }
  },
  filters: {chatTime},
  methods: {
    sendChatMessage () {
      this.$store.dispatch('sendChatMessage', {
        chatId: this.user.uid,
        msg: this.msg,
        creator: 1
      })
        .then(() => {
          this.$nextTick(function () {
            this.msg = ''
            this.$forceUpdate()
          })
        })
    },
    detectTyping () {
      this.isTyping = true
      this.$store.dispatch('setTyping', {
        chatId: this.$store.getters.user.uid,
        whoTyping: 'isTypingUser',
        value: this.isTyping
      })
      setTimeout(() => {
        this.isTyping = false
        this.$store.dispatch('setTyping', {
          chatId: this.$store.getters.user.uid,
          whoTyping: 'isTypingUser',
          value: this.isTyping
        })
      }, 3000)
    }
  },
  computed: {
    chatMessages () {
      return this.$store.getters.chatMessages
    },
    user () {
      return this.$store.getters.user
    }
  }
}
</script>

<style scoped>
  .chat_header {
    border-bottom: 1px solid grey;
    margin-bottom: 1px;
    padding-bottom: 12px;
  }

  .chat_messages {
    width: 100%;
    height: 320px;
    overflow: scroll;
  }
</style>

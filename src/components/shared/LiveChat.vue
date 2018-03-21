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
        <el-input v-model="msg"></el-input>
        <el-button @click="sendMessage">Add message</el-button>
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
      msg: ''
    }
  },
  filters: {chatTime},
  methods: {
    sendMessage () {
      this.$store.dispatch('sendMessage', {
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
    }
  },
  computed: {
    chatMessages () {
      console.log(this.$store.getters.chatMessages)
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

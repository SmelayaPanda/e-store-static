<template>
  <div>
    <el-row type="flex" justify="left" style="flex-wrap: wrap">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" class="pl-2 pr-2 mt-2">
        <h2 class="mb-2 mt-1">Live Chat Users</h2>
        <el-card v-for="(chat, chatId) of allChats" :key="chatId">
          <el-button type="text" @click="openChat(chatId)">
            {{ chat.props.userEmail ? ( chat.props.userEmail ) : `Anonymous ( ${chatId.substring(0, 5)} )` }}
          </el-button>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" class="pl-2 pr-2 mt-2"
              v-if="userEvents"
      >
        <h2 class="mb-2 mt-1">User events</h2>
        <el-card>
          <div ref="userEvents" class="event_messages">
            <el-row v-for="(event, idx) in userEvents"
                    :key="idx"
                    justify="left">
              <el-col :span="6" class="info--text left pr-1">{{ new Date(event.date) | chatTime }}</el-col>
              <el-col :span="18" align="left">{{ event.name }}</el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <live-chat :chatId="chatId"
                 :isUserSide="false"
                 :isCollapsed="false">
      </live-chat>
    </el-row>
  </div>
</template>

<script>
import LiveChat from '@/components/shared/LiveChat'

export default {
  name: 'AdminLiveChat',
  components: {
    LiveChat
  },
  data () {
    return {
      chatId: ''
    }
  },
  methods: {
    fetchAllChats () {
      this.$store.dispatch('fetchAllChats')
    },
    openChat (chatId) {
      // CLOSE OLD CHAT
      if (this.chatId && this.chatId !== chatId) {
        this.$store.dispatch('setChatProp', {
          chatId: this.chatId,
          props: 'isCollapsedAdmin',
          value: true
        })
        console.log(`Chat ${this.chatId} closed`)
      }
      // OPEN NEW CHAT
      this.$store.dispatch('setChatProp', {
        chatId: chatId,
        props: 'isCollapsedAdmin',
        value: false
      })
      this.$store.dispatch('initializeChat', {chatId: chatId})
      this.chatId = chatId
      console.log(`Chat ${chatId} opened`)
    },
    scrollEventsToBottom () {
      if (this.$refs.userEvents) {
        let events = this.$refs.userEvents
        events.scrollTop = events.scrollHeight
      }
    }
  },
  computed: {
    allChats () {
      return this.$store.getters.allChats
    },
    userEvents () {
      return this.$store.getters.userEvents
    }
  },
  watch: {
    userEvents () {
      this.$nextTick(function () {
        this.scrollEventsToBottom()
      })
    }
  },
  created () {
    this.fetchAllChats()
  }
}
</script>

<style scoped>
  .event_messages {
    width: 100%;
    height: 480px;
    overflow: scroll;
  }
</style>

<template>
  <div>
    <el-row type="flex" justify="left" style="flex-wrap: wrap">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" class="pl-2 pr-2 mt-2">
        <h2 class="mb-2">Live Chat Rooms</h2>
        <el-card v-for="(chat, chatId) of allChats" :key="chatId">
          <el-button type="text" @click="openChat(chatId)">
            {{ chat.props.userEmail ? ( chat.props.userEmail ) : `Anonymous ( ${chatId.substring(0, 5)} )` }}
          </el-button>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" class="pl-2 pr-2 mt-2"
              v-if="userEvents"
      >
        <h2 class="mb-2">User events</h2>
        <el-card v-for="(event, idx) in userEvents"
                 :key="idx"
                 :body-style="{ paddingBottom: '7px', paddingTop: '7px' }"
        >
          <el-tag type="info" class="left mr-3 mt-1">{{ new Date(event.date) | chatTime }}</el-tag>
          <p align="left">{{ event.name }}</p>
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
  created () {
    this.fetchAllChats()
  }
}
</script>

<style scoped>
</style>

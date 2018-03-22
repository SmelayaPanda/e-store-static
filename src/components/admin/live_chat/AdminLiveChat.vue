<template>
  <div>
    <el-row type="flex" justify="left" style="flex-wrap: wrap">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" class="pl-2 pr-2 mt-2">
        <h2 class="mb-2">Live Chat Rooms</h2>
        <el-card v-for="(messages, chatId) of allChats" :key="chatId">
          <el-button type="text" @click="openChat(chatId)">{{ chatId }}</el-button>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" class="pl-2 pr-2 mt-2"
              v-if="chatId"
      >
        <live-chat :chatId="chatId" :isUserSide="false"></live-chat>
      </el-col>
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
      console.log('Open ' + chatId)
      this.$store.dispatch('initializeChat', {chatId: chatId})
      this.chatId = chatId
    }
  },
  computed: {
    allChats () {
      return this.$store.getters.allChats
    }
  },
  created () {
    this.fetchAllChats()
  }
}
</script>

<style scoped>

</style>

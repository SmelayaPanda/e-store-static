<template>
  <div class="hello">
    <h1 style="font-size: 72px">re:<span class="primary--text">High</span></h1>

    <h1 style="font-size: 72px">Store</h1>
    <img src="@/assets/placeholders/people.jpg" alt="" width="500px" style="opacity: 0.9">
    <div>
      <el-button @click="getFBData">SayHi</el-button>
    </div>
    <p style="font-size: 48px">{{ msg }}</p>
    <el-row type="flex" justify="left" style="flex-wrap: wrap">
      <!--LIVE CHAT-->
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" class="pl-2 pr-2 mt-2"
              v-if="this.$store.getters.user"
      >
        <live-chat :chatId="this.$store.getters.user.uid" :isUserSide="true"></live-chat>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as firebase from 'firebase'
import LiveChat from '@/components/shared/LiveChat'

export default {
  name: 'HelloWorld',
  components: {
    LiveChat
  },
  data () {
    return {
      msg: '',
      checked: true
    }
  },
  methods: {
    getFBData: function () {
      firebase.database().ref('greeting').once('value')
        .then(data => {
          this.msg = data.val()
        })
        .catch(err => {
          this.msg = err
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>

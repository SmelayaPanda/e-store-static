<template>
  <div>
    <!--Loading circular-->
    <v-container v-if="this.isLoading">
      <app-loader></app-loader>
    </v-container>
    <div v-else>
      <div v-if="user.emailVerified">
        <!--Personal card-->
        <div></div>
        <el-row type="flex" justify="center" style="flex-wrap: wrap">
          <el-col :xs="24" :sm="6" :md="5" :lg="4" :xl="3" class="ml-1 mr-1 mb-2">
            <el-card :body-style="{ padding: '0px' }">
              <img src="@/assets/placeholders/person_placeholder.png" height="200px">
              <div style="padding: 14px;">
                <span>I'm wonderful</span>
                <div class="bottom clearfix">
                  <el-button type="text" class="button">Operating button</el-button>
                </div>
              </div>
            </el-card>
            <el-card class="mt-2" :body-style="{ padding: '0px' }">
              <div style="padding: 14px;">
                Earth, Heart of the mountains 42, Soul of the forest 5/1
              </div>
            </el-card>
            <el-card class="mt-2" :body-style="{ padding: '0px' }">
              <div style="padding: 14px;">
                {{ this.user.email }}
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="17" :md="15" :lg="12" :xl="9" class="ml-1 mr-1">
            <el-card>
              <h2 class="mb-2">Contact info</h2>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div v-else-if="!this.isAnonymousUser">
        <h3>
          <i class="el-icon-info"></i>
          Confirm your email address to continue
        </h3>
        <p>Email with verification link sent to address: <br><span>{{ user.email }}</span></p>
      </div>
      <div v-if="this.isAnonymousUser">
        <h2 class="mb-2">You are sign in as anonymous user.</h2>
        <p>Section "Account" is accessible only for
          <router-link to="/signup">
            <span class="primary--text">
              registered users!
            </span>
          </router-link>
        </p>
        <p class="error--text">* Attention, your items in shopping cart may be lost if you click logout!</p>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Account',
  data () {
    return {}
  },
  components: {},
  computed: {
    user () {
      return this.$store.getters.user
    },
    userOrders () {
      return this.$store.getters.orders
    }
  }
}
</script>

<style scoped>

</style>

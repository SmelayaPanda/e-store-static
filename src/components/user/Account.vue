<template>
  <div>
    <!--Loading circular-->
    <v-container v-if="this.isLoading">
      <app-loader></app-loader>
    </v-container>
    <div v-else>
      <div v-if="isVerifiedEmail">
        <!--Personal card-->
        <div></div>
        <el-row type="flex" justify="center" style="flex-wrap: wrap">
          <el-col :xs="24" :sm="6" :md="5" :lg="4" :xl="3" class="ml-1 mr-1 mb-2">
            <el-card :body-style="{ padding: '0px' }">
              <img src="@/assets/placeholders/person_placeholder.png" height="200px">
              <div style="padding: 14px;">
                <span>Smelaya Panda</span>
                <div class="bottom clearfix">
                  <el-button type="text" class="button">Operating button</el-button>
                </div>
              </div>
            </el-card>
            <el-card class="mt-2" :body-style="{ padding: '0px' }">
              <div style="padding: 14px;">
                Novosibisk, Akademgorodok
                <span>Sirenevaya 31</span>
              </div>
            </el-card>
            <el-card class="mt-2" :body-style="{ padding: '0px' }">
              <div style="padding: 14px;">
                8 999 467 78 57
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="17" :md="13" :lg="11" :xl="9" class="ml-1 mr-1">
            <el-card>
              <h2 class="mb-2">My orders history</h2>
              <el-collapse accordion v-for="(order, idx) in userOrders" :key="idx">
                <el-collapse-item name="1">
                  <template slot="title">
                    {{ order.item_name1 }}  {{ order.item_name2 }}  {{ order.item_name3 }}
                    <i class="header-icon el-icon-info"></i>
                  </template>
                  <div v-for="el in order" :key="el.tnx_id">
                    {{ el }}
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div v-else-if="!this.isAnonymousUser">
        <h3>
          <i class="el-icon-info"></i>
          Confirm your email address to continue
        </h3>
        <p>Email with verification link sent to address: <br><span>{{ userEmail }}</span></p>
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
    isVerifiedEmail: function () {
      if (this.$store.getters.user) {
        return this.$store.getters.user.emailVerified
      }
    },
    userEmail () {
      return this.$store.getters.user.email
    },
    userOrders () {
      return this.$store.getters.orders
    }
  }
}
</script>

<style scoped>

</style>

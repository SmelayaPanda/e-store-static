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
              <el-collapse accordion>
                <el-collapse-item name="1">
                  <template slot="title">
                    Beats headphones <i class="header-icon el-icon-info"></i>
                  </template>
                  <div>Consistent with real life: in line with the process and logic of real life, and comply with
                    languages and habits that the users are used to;
                  </div>
                  <div>Consistent within interface: all elements should be consistent, such as: design style, icons and
                    texts, position of elements, etc.
                  </div>
                </el-collapse-item>
                <el-collapse-item title="Sony camera X450" name="2">
                  <div>Operation feedback: enable the users to clearly perceive their operations by style updates and
                    interactive effects;
                  </div>
                  <div>Visual feedback: reflect current state by updating or rearranging elements of the page.</div>
                </el-collapse-item>
                <el-collapse-item title="Alcatel Phone" name="3">
                  <div>Simplify the process: keep operating process simple and intuitive;</div>
                  <div>Definite and clear: enunciate your intentions clearly so that the users can quickly understand
                    and make decisions;
                  </div>
                  <div>Easy to identify: the interface should be straightforward, which helps the users to identify and
                    frees them from memorizing and recalling.
                  </div>
                </el-collapse-item>
                <el-collapse-item title="ReStore Helicopter" name="4">
                  <div>Decision making: giving advices about operations is acceptable, but do not make decisions for the
                    users;
                  </div>
                  <div>Controlled consequences: users should be granted the freedom to operate, including canceling,
                    aborting or terminating current operation.
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
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <div>
    <!--Loading circular-->
    <v-container v-if="this.isLoading">
      <app-loader></app-loader>
    </v-container>
    <div v-else>
      <div v-if="isVerifiedEmail">
        Welcome to personal Account
       </div>
       <div v-else>
          <h2>Confirm your email</h2>
       </div>
     </div>
  </div>
</template>

<script>
export default {
  name: 'Account',
  computed: {
    isVerifiedEmail: function () {
      if (this.$store.getters.user) {
        return this.$store.getters.user.emailVerified
      }
    }
  }
}
</script>

<style scoped>

</style>

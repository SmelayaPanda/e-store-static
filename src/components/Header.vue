<template>
  <div class="mb-3">
    <!--Toolbar-->
    <el-row type="flex" justify="center" class="hidden-xs-only">
      <el-menu :default-active="'1'"
               :router="true"
               mode="horizontal">
        <el-menu-item index="1" route="/">ReHigh Store</el-menu-item>
        <el-menu-item index="2" route="/man">Man</el-menu-item>
        <el-menu-item index="3" route="/women">Women</el-menu-item>
        <el-menu-item index="4" route="/kids">Kids</el-menu-item>
        <el-menu-item index="5" route="/info"> Info</el-menu-item>
        <el-menu-item index="6" route="/cart">
          Cart
          <el-tag size="mini" class="mb-1">0</el-tag>
        </el-menu-item>
        <el-submenu index="7">
          <template slot="title"> User</template>
          <el-menu-item index="7-1" route="/account"
                        v-if="this.isAuthenticatedUser">
            Account
          </el-menu-item>
          <el-menu-item index="7-2" route="/signin"
                        v-if="!this.isAuthenticatedUser">
            Sign in
          </el-menu-item>
          <el-menu-item index="7-3" route="/signup"
                        v-if="!this.isAuthenticatedUser">
            Sign up
          </el-menu-item>
          <el-menu-item index="7-4" route="/logout"
                        v-if="this.isAuthenticatedUser"
                        @click="onLogout"> Logout
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-row>
    <!--Mobile toolbar-->
    <v-toolbar class="hidden-sm-and-up primary white--text">
      <v-toolbar-side-icon
        @click="sideNav = !sideNav"
        class="hidden-sm-and-up white--text">
      </v-toolbar-side-icon>
      <h2>ReHigh Store</h2>
    </v-toolbar>
    <!--Navigation drawer-->
    <v-navigation-drawer temporary absolute v-model="sideNav" height="100vh">
      <v-list>
        <v-list-tile
          v-for="item in menuItems"
          :key="item.title"
          :to="item.link"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      sideNav: false,
      menuItems: [
        {title: 'Home', link: '/', icon: 'home'},
        {title: 'Category', link: '/about', icon: 'list'},
        {title: 'Info', link: '/info', icon: 'info'},
        {title: 'About', link: '/services', icon: 'loyalty'},
        {title: 'Account', link: '/account', icon: 'people'},
        {title: 'Sing in', link: '/signin', icon: 'perm_identity'}
      ]
    }
  },
  methods: {
    onLogout:
        function () {
          this.$store.dispatch('logout')
          // window.location.reload()
        }
  }
}
</script>

<style scoped lang="sass">
  .app-header
    height: 60px

</style>

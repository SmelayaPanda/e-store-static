<template>
  <v-app light>

    <!--Navigation drawer-->
    <v-navigation-drawer temporary absolute v-model="sideNav">
      <v-list>
        <v-list-tile v-for="item in menuItems"
                     :key="item.title"
                     :to="item.link"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        <!--Logout-->
        <v-list-tile v-if="this.isAuthenticatedUser"
                     @click="onLogout"
        >
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Logout</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <!--Toolbar-->
    <v-toolbar dark class="primary">
      <v-toolbar-title>
        <router-link to="/admin" class="title">
          {{ mainTitle }}
        </router-link>
      </v-toolbar-title>
      <v-toolbar-side-icon
        @click="sideNav = !sideNav"
        class="hidden-md-and-up"
      ></v-toolbar-side-icon>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">

        <!--Go Home-->
        <v-btn flat @click="goHome" class="primary white--text">
          <v-icon left dark>home</v-icon>
          Home
        </v-btn>

        <v-btn flat
               v-for="item in menuItems"
               :key="item.title"
               :to="item.link"
               class="primary white--text"
        >
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>

        <!--Logout-->
        <v-btn flat
               v-if="this.isAuthenticatedUser"
               @click="onLogout"
               class="primary white--text"
        >
          <v-icon left dark>exit_to_app</v-icon>
          Logout
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <!--Admin panel content-->
    <div v-if="this.isAdmin">
      <nav-menu class="left"></nav-menu>
    </div>

    <!--No admin case-->
    <v-container v-else>
      <v-card>

        <!--Alert message-->
        <v-layout row v-if="error">
          <v-flex xs12>
            <!--My component from shared/Alert registered in main.js
            :text it is a property of Alert.vue-->
            <app-alert
              v-on:dismissed="onDismissed"
              :text="error.message"
            ></app-alert>
          </v-flex>
        </v-layout>

        <v-card-title>For admin access:</v-card-title>
        <v-card-text>
          <p>Alexey Azarov</p>
          <p>8 (999) 467 78 57</p>
          <p>smelayapandagm@gmail.com</p>
        </v-card-text>
      </v-card>
    </v-container>

    <!--Main-->
    <main>
      <router-view></router-view>
    </main>

  </v-app>
</template>

<script>
import AdminTabs from './AdminTabs'

export default {
  components: {
    NavMenu: AdminTabs
  },
  data: function () {
    return {
      sideNav: false,
      mainTitle: 'Admin Panel'
    }
  },
  computed: {
    menuItems:
        function () {
          let menuItems = []
          if (!this.isAuthenticatedUser) {
            menuItems = [
              {icon: 'account_circle', title: 'Singup', link: '/signup'},
              {icon: 'lock_open', title: 'Singin', link: '/signin'}
            ]
          }
          return menuItems
        },
    error:
        function () {
          return this.$store.getters.error
        }
  },
  methods: {
    onLogout:
        function () {
          this.$store.dispatch('logout')
        },
    goHome:
        function () {
          this.$router.push('/')
          window.location.reload()
        },
    onDismissed:
        function () {
          this.$store.dispatch('CLEAR_ERR') // action
        }
  }
}
</script>

<style scoped>
  .title {
    cursor: pointer;
    color: white;
    text-decoration: none
  }
</style>

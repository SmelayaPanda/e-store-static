<template>
  <div>
    <!--Toolbar-->
    <el-row type="flex" justify="center" class="hidden-xs-only">
      <el-menu :default-active="'1'"
               :router="true"
               mode="horizontal"
               @select="handleSelect">
        <el-menu-item index="1" :route="{name:'HelloWorld'}">ReHigh Store</el-menu-item>
        <el-submenu index="2">
          <template slot="title">Categori</template>
          <el-menu-item index="2-1" :route="{name:'man'}">item one</el-menu-item>
          <el-menu-item index="2-2" :route="{name:'women'}">item two</el-menu-item>
          <el-menu-item index="2-3" :route="{name:'kids'}">item three</el-menu-item>
        </el-submenu>
        <el-menu-item index="3" :route="{name:'info'}">
          Info
        </el-menu-item>
        <el-menu-item index="4" :route="{name:'orders'}">Orders</el-menu-item>
        <el-menu-item index="5" :route="{name:'signin'}">Sign in</el-menu-item>
      </el-menu>
    </el-row>
    <!--Mobile toolbar-->
    <v-toolbar class="hidden-sm-and-up primary">
      <v-toolbar-side-icon
        @click="sideNav = !sideNav"
        class="hidden-sm-and-up">
      </v-toolbar-side-icon>
      <h2>ReHigh Store</h2>
    </v-toolbar>
    <!--Navigation drawer-->
    <v-navigation-drawer temporary v-model="sideNav" height="100vh">
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
        {title: 'Orders', link: '/services', icon: 'loyalty'},
        {title: 'Sing in', link: '/signin', icon: 'perm_identity'}
      ]
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style scoped lang="sass">

</style>

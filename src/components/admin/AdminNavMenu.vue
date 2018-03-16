<template>
  <div align="left">
    <el-button type="text" @click="isCollapse = !isCollapse" class="mt-2 ml-3 pl-1">
      <v-icon v-if="isCollapse">hdr_strong</v-icon>
      <v-icon v-if="!isCollapse">hdr_weak</v-icon>
    </el-button>
    <el-menu
      :default-active="this.$router.history.current.fullPath"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
      :router="true"
    >
      <el-menu-item index="/admin" route="/admin">
        <v-icon>insert_chart</v-icon>
        <span slot="title">Dashboard</span>
      </el-menu-item>
      <el-menu-item index="/admin/products" route="/admin/products">
        <v-icon>playlist_add</v-icon>
        <span slot="title">Products</span>
      </el-menu-item>
      <el-menu-item index="/admin/orders" route="/admin/orders">
        <v-icon class="pb-1">description</v-icon>
        <span slot="title">Orders</span>
      </el-menu-item>
      <el-menu-item index="/admin/oneClick" route="/admin/oneClick">
        <v-icon>touch_app</v-icon>
        <span slot="title">One Click</span>
      </el-menu-item>
      <el-menu-item index="/admin/dictionaries" route="/admin/dictionaries">
        <v-icon>text_format</v-icon>
        <span slot="title">Dictionaries</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import AdminProducts from './products/AdminProducts'
import AdminOrders from './orders/AdminOrders'
import Dictionaries from './dictionaries/Dictionaries'
import AdminOneClick from './oneclick/AdminOneClick'

export default {
  name: 'NavMenu',
  components: {
    AdminOneClick,
    AdminProducts,
    AdminOrders,
    Dictionaries
  },
  data () {
    return {
      isCollapse: false
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style scoped>
</style>

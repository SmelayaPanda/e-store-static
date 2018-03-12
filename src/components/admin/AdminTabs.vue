<template>
  <el-tabs tab-position="left" class="admin_tabs">
    <el-tab-pane label="Products">
      <admin-products></admin-products>
    </el-tab-pane>
    <el-tab-pane label="Orders">
      <admin-orders></admin-orders>
    </el-tab-pane>
    <el-tab-pane label="One Click">
      <admin-one-click></admin-one-click>
    </el-tab-pane>
    <el-tab-pane label="Dictionaries">
      <dictionaries></dictionaries>
    </el-tab-pane>
    <el-tab-pane label="Contacts">Contacts</el-tab-pane>
  </el-tabs>
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
    }
  }
}
</script>

<style scoped>
  .admin_tabs {
    margin: 25px;
  }

</style>

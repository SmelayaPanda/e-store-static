<template>
  <el-tabs tab-position="left" class="admin_tabs">
    <el-tab-pane label="Products">
      <admin-products></admin-products>
    </el-tab-pane>
    <el-tab-pane label="Orders">
      <admin-orders></admin-orders>
    </el-tab-pane>
    <el-tab-pane label="Settings">Task</el-tab-pane>
    <el-tab-pane label="Info">Role</el-tab-pane>
  </el-tabs>
</template>

<script>
import AdminProducts from './products/AdminProducts'
import AdminOrders from './orders/AdminOrders'
export default {
  name: 'NavMenu',
  components: {
    AdminProducts,
    AdminOrders
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

<template>
  <el-tabs tab-position="left" class="admin_tabs">
    <el-tab-pane label="Products">
      <admin-products></admin-products>
    </el-tab-pane>
    <el-tab-pane label="Orders">Config</el-tab-pane>
    <el-tab-pane label="Settings">Task</el-tab-pane>
    <el-tab-pane label="Info">Role</el-tab-pane>
  </el-tabs>
</template>

<script>
import AdminProducts from './products/AdminProducts'
export default {
  name: 'NavMenu',
  components: {
    AdminProducts
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

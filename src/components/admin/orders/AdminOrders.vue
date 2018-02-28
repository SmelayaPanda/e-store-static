<template>
  <div>
    <h1>All orders info</h1>
  <el-table
    :data="ordersData"
    highlight-current-row
    size="small"
    style="width: 100%">
    <el-table-column
      prop="txn_id"
      label="PayPal txn_id"
      width="170">
    </el-table-column>
    <el-table-column
      prop="mc_gross"
      label="Gross"
      width="100">
    </el-table-column>
    <el-table-column
      prop="mc_currency"
      label="Currency"
      width="80">
    </el-table-column>
    <el-table-column
      prop="payment_date"
      label="Payment Date"
      width="150">
    </el-table-column>
    <el-table-column
      prop="payer_email"
      label="Email"
      width="150">
    </el-table-column>
    <el-table-column label="Delivery Info">
      <el-table-column
        prop="address_country"
        label="Country"
        width="120">
      </el-table-column>
      <el-table-column label="Address Info">
        <el-table-column
          prop="address_city"
          label="City"
          width="120">
        </el-table-column>
        <el-table-column
          prop="address_street"
          label="Street"
          width="300">
        </el-table-column>
        <el-table-column
          prop="address_zip"
          label="Zip"
          width="100">
        </el-table-column>
      </el-table-column>
    </el-table-column>
  </el-table>
  </div>
</template>

<script>
export default {
  name: 'AdminProducts',
  data () {
    return {
    }
  },
  computed: {
    ordersData () {
      return this.$store.getters.allOrders
    }
  }
}
</script>

<style scoped>

</style>

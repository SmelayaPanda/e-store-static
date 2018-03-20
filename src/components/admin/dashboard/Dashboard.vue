<template>
  <div>
    <el-row type="flex" justify="left" style="flex-wrap: wrap">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" class="pl-2 pr-2">
        <el-card>
          <div slot="header" class="clearfix">
            <h3>
              <v-icon>description</v-icon>
              Orders statistics
            </h3>
          </div>
          <div>
            <p>Pay Pending: <el-tag>{{ orderStatistics.payPending }}</el-tag></p>
            <p>Sent Pending: <el-tag type="danger">{{ orderStatistics.sentPending }}</el-tag></p>
            <p>Sent: <el-tag>{{ orderStatistics.sent }}</el-tag></p>
            <p>Delivered: <el-tag type="success">{{ orderStatistics.delivered }}</el-tag></p>
            <p>Refused: <el-tag type="warning">{{ orderStatistics.refused }}</el-tag></p>
            <p>Total orders count: <el-tag type="info">{{ orderStatistics.totalOrders }}</el-tag></p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" class="pl-2 pr-2">
        <el-card>
          <div slot="header" class="clearfix">
            <h3>
              <v-icon>playlist_add</v-icon>
              Products statistics
            </h3>
          </div>
          <div>
            <p>Average price: <el-tag type="info">{{ productStatistics.avgPrice }} RUB</el-tag></p>
            <p>Max price: <el-tag type="info">{{ productStatistics.maxPrice }} RUB</el-tag></p>
            <p>Unique Products Qty: <el-tag type="info">{{ productStatistics.uniqueProductQty }}</el-tag></p>
            <p>Total Products Qty: <el-tag type="info">{{ productStatistics.totalProductQty }}</el-tag></p>
            <p>Total Store coast: <el-tag type="info">{{ productStatistics.totalStoreCoast }} RUB</el-tag></p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  computed: {
    productStatistics () {
      return this.$store.getters.productStatistics
    },
    orderStatistics () {
      return this.$store.getters.orderStatistics
    }
  }
}
</script>

<style scoped>

</style>

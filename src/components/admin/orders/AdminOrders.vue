<template>
  <!--
ORDER STATUS CHAIN:
  1. payPending  - ожидает оплаты
  2. sentPending - ожидает отправки ( товар с оплатой при получении попадает сразу в данный статус )
  3. sent        - товар отправлен
  4. delivered   - товар доставлен
  5. refused     - отказ
  -->
  <div v-if="orders">
    <el-row type="flex" justify="start" align="middle" class="mb-4">
      <h2 class="ml-3 mr-2">Status</h2>
      <el-select filterable
                 no-match-text="Status is missing"
                 v-model="status"
                 placeholder="Brand"
                 @change="loadOrdersWithStatus"
      >
        <el-option
          v-for="val in statuses"
          :key="val"
          :label="val"
          :value="val">
        </el-option>
      </el-select>
    </el-row>
    <el-table
      ref="categoryTable"
      :data="orders"
      :highlight-current-row="true"
      empty-text="No data"
      style="width: 100vw; text-align: left;"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-row>
            <el-col :span="12" class="pl-1">
              <p><span>Database order id:</span>
                <el-tag size="mini" type="success">{{ props.row.id }}</el-tag>
              </p>
              <h3><i class="el-icon-info"></i>
                Product info:
              </h3>
              <p>
                Title: {{ props.row.products[0].title }}<br>
                SKU: {{ props.row.products[0].SKU }}<br>
                Price: {{ props.row.products[0].price }}<br>
                <span v-if="props.row.products[0].qty">Total Qty: {{ props.row.products[0].qty }}</span>
              </p>
              <span v-if="props.row.comments">
                <h3><i class="el-icon-warning"></i>
                  Comments:
                </h3>
                {{ props.row.comments }}<br>
              </span>
            </el-col>
            <el-col :span="12">
              <span v-if="props.row.shipping">
                <h3><i class="el-icon-location"></i>
                  Shipping info:
                </h3>
                <p>
                  Country: {{ props.row.shipping.country }}<br>
                  City: {{ props.row.shipping.city }}<br>
                  Street: {{ props.row.shipping.street }}<br>
                  Build: {{ props.row.shipping.build }}<br>
                  House: {{ props.row.shipping.house }}<br>
                  Post Code: {{ props.row.shipping.postCode }}<br>
                </p>
              </span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <h3 class="mt-3">Status history:</h3>
              <span>
                  <el-tag type="info">Checkout
                    <p>
                      {{ props.row.checkoutDate | date }}<br>
                      <span v-if="props.row.checkoutDate">
                        ------------------------------
                      </span>
                    </p>
                  </el-tag>
                </span>
              <!--SENT-->
              <span v-if="props.row.sentDate">
                  <i class="el-icon-caret-right"></i>
                    <el-tag type="info">Sent
                      <p>
                        {{ props.row.sentDate | date }}<br>
                        {{(Math.abs(props.row.sentDate - props.row.checkoutDate) / 36e5).toFixed(1) }} hours
                      </p>
                    </el-tag>
                </span>
              <!--DELIVERED-->
              <span v-if="props.row.deliveryDate">
                  <i class="el-icon-caret-right"></i>
                    <el-tag type="info">Delivered
                      <p>
                        {{ props.row.deliveryDate | date }}<br>
                        {{(Math.abs(props.row.deliveryDate - props.row.sentDate) / 36e5).toFixed(1) }} hours
                      </p>
                    </el-tag>
                </span>
              <!--REFUSE-->
              <span v-if="props.row.refuseDate">
                  <i class="el-icon-caret-right"></i>
                    <el-tag type="info">Refused
                      <p>
                        {{ props.row.refuseDate | date }}<br>
                        {{(Math.abs(props.row.refuseDate - props.row.checkoutDate) / 36e5).toFixed(1) }} hours (from checkout)
                      </p>
                    </el-tag>
                </span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!--CREATION DATE-->
      <el-table-column
        label="Date"
        width="200">
        <template slot-scope="scope">
          <span><el-tag type="success">{{ scope.row.checkoutDate | date }}</el-tag></span>
        </template>
      </el-table-column>
      <!--Title-->
      <el-table-column
        label="Title"
        width="300">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>Title: {{ scope.row.products[0].title }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.products[0].title | snippet(40) }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!--NAME-->
      <el-table-column
        label="Name"
        width="150">
        <template slot-scope="scope">
          <p>
            {{ scope.row.buyer.firstname | snippet(20) }}
            {{ scope.row.buyer.lastname | snippet(20) }}
          </p>
        </template>
      </el-table-column>
      <!--PHONE-->
      <el-table-column
        label="Phone"
        width="140">
        <template slot-scope="scope">
          <p>{{ scope.row.buyer.phone }}</p>
        </template>
      </el-table-column>
      <!--EMAIL-->
      <el-table-column
        label="Email"
        width="200">
        <template slot-scope="scope">
          <p>{{ scope.row.buyer.email }}</p>
        </template>
      </el-table-column>
      <!--Process-->
      <el-table-column
        width="150"
        label="Action">
        <template slot-scope="scope">
          <!--CHANGE STATUS-->
          <change-order-status :orderId="scope.row.id"></change-order-status>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import ChangeOrderStatus from './ChangeOrderStatus'

export default {
  components: {ChangeOrderStatus},
  name: 'AdminOrders',
  data () {
    return {
      status: 'payPending'
    }
  },
  methods: {
    loadOrdersWithStatus () {
      this.$store.dispatch('fetchOrders', {status: this.status})
    }
  },
  computed: {
    orders () {
      return this.$store.getters.orders
    },
    statuses () {
      return [
        this.PAY_PEND,
        this.SENT_PEND,
        this.SENT,
        this.DELIVERED,
        this.REFUSED
      ]
    }
  },
  created () {
    this.loadOrdersWithStatus()
  }
}
</script>

<style scoped>
</style>

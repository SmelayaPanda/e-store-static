<template>
  <!--STATUS:
1. payPending - ожидает оплаты
2. sentPending - ожидает отправки ( товар с оплатой при получении попадает сразу в данный статус )
3. sent - товар отправлен
4. delivered - товар доставлен
5. returned - возвращен
6. refusal - отказ
-->
  <div v-if="orders">
    <!--Loading circular-->
    <v-container v-if="this.isLoading">
      <app-loader></app-loader>
    </v-container>
    <div v-else>
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
        style="width: 100vw; text-align: left"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row>
              <el-col :span="12">
                <p><span>Database one click id:</span>
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
                  <el-tag type="info">Created
                    <p>
                      {{ props.row.creationDate | date }}<br>
                      <span v-if="props.row.checkoutDate">
                        ------------------------------
                      </span>
                    </p>
                  </el-tag>
                </span>
                <!--PROCESS-->
                <span v-if="props.row.checkoutDate">
                  <i class="el-icon-caret-right"></i>
                    <el-tag type="info">Checkout Date
                      <p>
                        {{ props.row.checkoutDate | date }}<br>
                        {{(Math.abs(props.row.checkoutDate - props.row.creationDate) / 36e5).toFixed(1) }} hours
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
                <span v-if="props.row.deliverDate">
                  <i class="el-icon-caret-right"></i>
                    <el-tag type="info">Delivered
                      <p>
                        {{ props.row.deliverDate | date }}<br>
                        {{(Math.abs(props.row.deliverDate - props.row.sentDate) / 36e5).toFixed(1) }} hours
                      </p>
                    </el-tag>
                </span>
                <!--RETURNED-->
                <span v-if="props.row.returnDate">
                  <i class="el-icon-caret-right"></i>
                    <el-tag type="info">Returned
                      <p>
                        {{ props.row.returnDate | date }}<br>
                        {{(Math.abs(props.row.returnDate - props.row.deliverDate) / 36e5).toFixed(1) }} hours
                      </p>
                    </el-tag>
                </span>
                <!--REFUSE-->
                <span v-if="props.row.refuseDate">
                  <i class="el-icon-caret-right"></i>
                    <el-tag type="info">Refuse
                      <p>
                        {{ props.row.refuseDate | date }}<br>
                        {{(Math.abs(props.row.refuseDate - props.row.creationDate) / 36e5).toFixed(1) }} hours (from creation)
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
            <!--<el-row type="flex" justify="start">-->
              <!--<process-one-click :oneClickId="scope.row.id"-->
                                 <!--v-if="status === 'created'"-->
              <!--&gt;-->
              <!--</process-one-click>-->
              <!--<sent-one-click :oneClickId="scope.row.id"-->
                              <!--:comments="scope.row.comments"-->
                              <!--v-if="status === 'processed'"-->
              <!--&gt;-->
              <!--</sent-one-click>-->
              <!--<deliver-one-click :oneClickId="scope.row.id"-->
                                 <!--:comments="scope.row.comments"-->
                                 <!--v-if="status === 'sent'"-->
              <!--&gt;-->
              <!--</deliver-one-click>-->
              <!--<refuse-one-click :oneClickId="scope.row.id"-->
                                <!--:comments="scope.row.comments"-->
                                <!--v-if="status !== 'refused' && status !== 'delivered' && status !== 'returned'"-->
              <!--&gt;-->
              <!--</refuse-one-click>-->
              <!--<return-one-click :oneClickId="scope.row.id"-->
                                <!--:comments="scope.row.comments"-->
                                <!--v-if="status === 'delivered'"-->
              <!--&gt;-->
              <!--</return-one-click>-->
            <!--</el-row>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  name: 'AdminOrders',
  data () {
    return {
      status: 'payPending',
      statuses: ['payPending', 'sentPending', 'sent', 'delivered', 'returned', 'refused']
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
    }
  }
}
</script>

<style scoped>
</style>

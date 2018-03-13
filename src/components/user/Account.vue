<template>
  <div>
    <!--Loading circular-->
    <v-container v-if="this.isLoading">
      <app-loader></app-loader>
    </v-container>
    <div v-else>
      <div v-if="isVerifiedEmail">
        <!--Personal card-->
        <div></div>
        <el-row type="flex" justify="center" style="flex-wrap: wrap">
          <el-col :xs="24" :sm="6" :md="5" :lg="4" :xl="3" class="ml-1 mr-1 mb-2">
            <el-card :body-style="{ padding: '0px' }">
              <img src="@/assets/placeholders/person_placeholder.png" height="200px">
              <div style="padding: 14px;">
                <span>Smelaya Panda</span>
                <div class="bottom clearfix">
                  <el-button type="text" class="button">Operating button</el-button>
                </div>
              </div>
            </el-card>
            <el-card class="mt-2" :body-style="{ padding: '0px' }">
              <div style="padding: 14px;">
                Novosibisk, Akademgorodok
                <span>Sirenevaya 31</span>
              </div>
            </el-card>
            <el-card class="mt-2" :body-style="{ padding: '0px' }">
              <div style="padding: 14px;">
                8 999 467 78 57
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="17" :md="15" :lg="11" :xl="9" class="ml-1 mr-1">
            <el-card>
              <h2 class="mb-2">My orders history</h2>
              <el-table
                default-expand-all
                ref="orderTable"
                :data="userOrders"
                v-if="userOrders"
                :highlight-current-row="true"
                empty-text="No data"
                style="width: 100vw; text-align: left"
              >
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-row>
                      <el-col :span="12">
                        <p><span>SKU:</span>
                          <el-tag size="mini" type="success">{{ props.row.products[0].SKU }}</el-tag>
                        </p>
                        <h3><i class="el-icon-info"></i>
                          Product info:
                        </h3>
                        <p>
                          Title: {{ props.row.products[0].name }}<br>
                          SKU: {{ props.row.products[0].SKU }}<br>
                          Price: {{ props.row.products[0].price }}<br>
                          <span v-if="props.row.products">Quantity: {{ props.row.products[0].quantity }}</span>
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
                </p>
              </span>
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>
                <!--Order Id-->
                <el-table-column
                  label="Order Id"
                  width="180">
                  <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                      <p>Order id: {{ scope.row.id }}</p>
                      <div slot="reference" class="name-wrapper">
                        <el-tag size="medium" type="success">{{ scope.row.id | snippet(40) }}</el-tag>
                      </div>
                    </el-popover>
                  </template>
                </el-table-column>
                <!--Products-->
                <el-table-column
                  label="Total price"
                  width="120">
                  <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                      <p>Total price: {{ scope.row.totalPrice }} {{ scope.row.currency }}</p>
                      <div slot="reference" class="name-wrapper">
                        <el-tag size="medium">
                          {{ scope.row.totalPrice }} {{ scope.row.currency }}
                        </el-tag>
                      </div>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Order date"
                  width="180">
                  <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                      <p>Order date: {{ scope.row.orderDate }}</p>
                      <div slot="reference" class="name-wrapper">
                        <el-tag size="medium" type="info">
                          {{ scope.row.orderDate | date }}
                        </el-tag>
                      </div>
                    </el-popover>
                  </template>
                </el-table-column>
                <!--Process-->
                <el-table-column
                  width="150"
                  label="Action">
                  <template slot-scope="scope">
                    <el-row type="flex" justify="start">
                      <el-button>Pay</el-button>
                    </el-row>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div v-else-if="!this.isAnonymousUser">
        <h3>
          <i class="el-icon-info"></i>
          Confirm your email address to continue
        </h3>
        <p>Email with verification link sent to address: <br><span>{{ userEmail }}</span></p>
      </div>
      <div v-if="this.isAnonymousUser">
        <h2 class="mb-2">You are sign in as anonymous user.</h2>
        <p>Section "Account" is accessible only for
          <router-link to="/signup">
            <span class="primary--text">
              registered users!
            </span>
          </router-link>
        </p>
        <p class="error--text">* Attention, your items in shopping cart may be lost if you click logout!</p>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Account',
  data () {
    return {}
  },
  components: {},
  computed: {
    isVerifiedEmail: function () {
      if (this.$store.getters.user) {
        return this.$store.getters.user.emailVerified
      }
    },
    userEmail () {
      return this.$store.getters.user.email
    },
    userOrders () {
      return this.$store.getters.orders
    }
  }
}
</script>

<style scoped>

</style>

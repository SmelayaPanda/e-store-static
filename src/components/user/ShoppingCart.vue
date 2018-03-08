<template>
  <div>
    <!--Loading circular-->
    <v-container v-if="this.isLoading">
      <app-loader></app-loader>
    </v-container>
    <el-row v-else el-row type="flex" justify="center">
      <el-col :xs="24" :sm="20" :md="16" :lg="14" :xl="8" type="flex" align="middle">
        <el-card v-if="userCart">
          <p class="mb-3" style="font-size: 18px;">
            <span v-if="userCart.length === 0">Your cart is empty</span>
            <span v-else>My shopping cart</span>
          </p>
          <i class="el-icon-goods mb-3" style="transform: scale(2)"></i>
          <p>
            <router-link to="/shop">
              <el-button type="text" v-if="userCart.length === 0">Go to shop</el-button>
            </router-link>
          </p>
          <!--PRODUCTS-->
          <el-row v-for="product in userCart" :key="product.cartId"
                  type="flex"
                  justify="center"
                  class="mb-3"
                  style="flex-wrap: wrap">
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" align="left">
              <router-link :to="'/product/' + product.productId">
                <h3>{{ product.title }}</h3>
              </router-link>
              <i class="mb-0">Parameters:</i>
              <p class="mb-0">Color: {{ product.color }}</p>
              <p class="mb-0">Size: {{ product.size }}</p>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" align="right">
              <p>{{ parseFloat(product.qty * product.price).toFixed(2) }} {{ product.currency }}</p>
              <el-input-number size="small"
                               v-model="product.qty"
                               :min="0"
                               :max="1000">
              </el-input-number>
              <el-button type="secondary" size="small" @click="removeFromCart(product.cartId)">
                <i class="el-icon-delete"></i>
              </el-button>
              <buy btn-name="Buy"
                   :currency="'RUB'"
                   :amount="parseFloat(product.price * product.qty).toFixed(2)"
                   :order-items="[{
                  name: product.title.substring(0, 124),
                  quantity: product.qty,
                  price: parseFloat(product.price).toFixed(2),
                  currency: 'RUB',
                  description: product.cartId
              }]"
              >
              </buy>
            </el-col>
          </el-row>
          <div v-if="userCart.length > 1">
            <v-divider></v-divider>
            <p class="pt-3">Total price: {{ parseFloat(totalPrice).toFixed(2) }} RUB </p>
            <div class="paypal_total_btn">
              <buy btn-name="Buy all"
                   :currency="'RUB'"
                   :amount="parseFloat(totalPrice).toFixed(2)"
                   :order-items="totalItems">
              </buy>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PayPal from 'vue-paypal-checkout'
import Buy from './Buy'
// NOTE: description of items = IPN <<transaction_subject>> = "cartId1, cartId2, ..."
// ( all items descriptions will be concatenated )
// TODO: check cart no more than 10 items
export default {
  name: 'ShoppingCart',
  components: {
    PayPal,
    Buy
  },
  data () {
    return {
      cartProduct: ''
    }
  },
  computed: {
    userCart () {
      return this.$store.getters.cart
    },
    totalPrice () {
      let total = 0
      let cart = this.userCart
      for (let product in cart) {
        total += cart[product].qty * cart[product].price
      }
      return total
    },
    totalItems () {
      let items = []
      let cart = this.userCart
      for (let el in cart) {
        let item = {}
        item.name = cart[el].title
        item.price = cart[el].price
        item.quantity = cart[el].qty
        item.currency = cart[el].currency
        item.description = cart[el].cartId + ',' // (,) - delimiter of <<transaction_subject>>
        items.push(item)
      }
      return items
    }
  },
  methods: {
    removeFromCart (cartId) {
      this.$store.dispatch('removeFromCart', cartId)
    }
  }
}
</script>

<style scoped>
</style>

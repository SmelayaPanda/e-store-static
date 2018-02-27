<template>
  <el-row el-row type="flex" justify="center">
    <el-col :xs="24" :sm="20" :md="16" :lg="14" :xl="8" type="flex" align="middle">
      <el-card v-if="userCart">
        <h2 class="mb-3">My shopping cart</h2>
        <!--PRODUCTS-->
        <el-row v-for="product in userCart" :key="product.cartId"
                type="flex"
                justify="center"
                class="mb-3"
                style="flex-wrap: wrap">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" align="left">
            <el-tooltip placement="top">
              <div slot="content">{{ product.description }}</div>
              <h3>{{ product.title }}</h3>
            </el-tooltip>
            <i class="mb-0">Parameters:</i>
            <p class="mb-0">Color: {{ product.color }}</p>
            <p class="mb-0">Size: {{ product.size }}</p>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" align="right">
            <p>{{ product.qty * product.price }} {{ product.currency }}</p>
            <el-input-number size="small"
                             v-model="product.qty"
                             :min="0"
                             :max="1000">
            </el-input-number>
            <el-button type="secondary" size="small" @click="removeFromCart(product.cartId)">
              <i class="el-icon-delete"></i>
            </el-button>
            <buy-one :order-item="{
              currency: 'RUB',
              amount: parseFloat(product.price * product.qty).toFixed(2),
              items:{
                  name: product.title.substring(0, 124),
                  quantity: product.qty,
                  price: parseFloat(product.price).toFixed(2),
                  currency: 'RUB',
                  description: product.cartId
              }
            }">
            </buy-one>
            <!--<div class="paypal_btn">-->
              <!--<PayPal-->
                <!--env="sandbox"-->
                <!--locale="en_US"-->
                <!--currency="RUB"-->
                <!--:items="[{-->
                  <!--name: product.title.substring(0, 124),-->
                  <!--quantity: product.qty,-->
                  <!--price: parseFloat(product.price).toFixed(2),-->
                  <!--currency: 'RUB',-->
                  <!--description: product.cartId-->
                <!--}]"-->
                <!--:amount="parseFloat(product.price * product.qty).toFixed(2)"-->
                <!--:client="credentials"-->
                <!--:buttonStyle="btnStyle"-->
                <!--notify-url="https://us-central1-e-store-dev.cloudfunctions.net/processPayPal"-->
              <!--&gt;-->
              <!--</PayPal>-->
            <!--</div>-->
          </el-col>
        </el-row>
        <v-divider></v-divider>
        <p class="pt-3">Total price: {{ parseFloat(totalPrice).toFixed(2) }} RUB </p>
        <!--Total items object: {{ totalItems }}-->
        <div class="paypal_total_btn">
          <PayPal
            env="sandbox"
            locale="en_US"
            currency="RUB"
            :items="totalItems"
            :amount="parseFloat(totalPrice).toFixed(2)"
            :client="credentials"
            :buttonStyle="btnStyle"
            notify-url="https://us-central1-e-store-dev.cloudfunctions.net/processPayPal"
          >
          </PayPal>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import PayPal from 'vue-paypal-checkout'
import BuyOne from './BuyOne'
// NOTE: description of items = IPN <<transaction_subject>> = "cartId1, cartId2, ..."
// ( all items descriptions will be concatenated )
// TODO: check cart no more than 10 items
export default {
  name: 'ShoppingCart',
  components: {
    PayPal,
    BuyOne
  },
  data () {
    return {
      cartProduct: '',
      credentials: {
        sandbox: 'AaTdJiFck5jx4xpaVOjFHkfNO8XZjflSRzYZ3yGbXEHZ43J7upAFabAkRhv1NJPPfDR49F9mqf8rbud4',
        production: 'someId'
      },
      btnStyle: {
        label: 'checkout',
        size: 'responsive', // small | medium | large | responsive
        shape: 'rect', // pill | rect
        color: 'silver' // gold | blue | silver | black
      }
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
  .paypal_btn {
    margin-top: 10px;
    width: 80px;
    height: 40px;
  }

  .paypal_total_btn {
    width: 140px;
    height: 40px;
  }
</style>

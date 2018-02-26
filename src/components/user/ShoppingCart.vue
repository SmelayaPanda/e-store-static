<template>
  <el-row el-row type="flex" justify="center">
    <el-col :xs="24" :sm="20" :md="16" :lg="14" :xl="8" type="flex" align="middle">
      <el-card v-if="userCart">
        <h2 class="mb-3">My shopping cart</h2>
        <!--PRODUCTS-->
        <el-row v-for="product in userCart" :key="product.cartId"
                type="flex"
                justify="center"
                style="flex-wrap: wrap">
          {{product}}
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
            <div class="paypal_btn">
              <PayPal
                payment_method="credit_card"
                locale="en_US"
                env="sandbox"
                :id="product.productId"
                :amount="parseFloat(product.price * product.qty).toFixed(2)"
                :currency="product.currency"
                :client="credentials"
                :buttonStyle="btnStyle"
                notify-url="https://us-central1-e-store-dev.cloudfunctions.net/processPayPal"
              >
              </PayPal>
            </div>
          </el-col>
        </el-row>
        <v-divider></v-divider>
        <div v-on:paypal-paymentCompleted="alert(1)"></div>
        <div v-on:paypal-paymentAuthorized="alert(1)"></div>
        <div v-on:paypal-paymentCancelled="alert(1)"></div>
        <p class="pt-3">Total price: {{ parseFloat(totalPrice).toFixed(2) }} RUB </p>
        <div class="paypal_total_btn">
          <PayPal
            payment_method="credit_card"
            env="sandbox"
            locale="en_US"
            currency="RUB"
            :amount="parseFloat(totalPrice).toFixed(2)"
            :client="credentials"
            :buttonStyle="btnStyle"
            notify-url="https://us-central1-e-store-dev.cloudfunctions.net/processPayPal"
          >
          </PayPal>
          <!--:items="items"-->
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import PayPal from 'vue-paypal-checkout'

export default {
  name: 'ShoppingCart',
  components: {
    PayPal
  },
  data () {
    return {
      qty: 1,
      credentials: {
        sandbox: 'AZEbas_YdmFwegi2_I5Lz_563v3gqPdtR-bDEFGdH6_8an1VVtWdkQAmU4sNNf-FSOzAPTRgO3g5-t1u',
        production: 'someId'
      },
      btnStyle: {
        label: 'checkout',
        size: 'responsive', // small | medium | large | responsive
        shape: 'rect', // pill | rect
        color: 'silver' // gold | blue | silver | black
      },
      items: [
        {
          quantity: '1',
          name: 'item 1',
          price: '44',
          currency: 'RUB',
          description: 'item 1 description',
          tax: '1'
        },
        {
          quantity: '1',
          name: 'item 2',
          price: '100',
          currency: 'RUB',
          description: 'item 2 description',
          tax: '1'
        }]
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

<template>
  <el-row el-row type="flex" justify="center">
    <el-col :xs="24" :sm="20" :md="16" :lg="14" :xl="8" type="flex" align="middle">
      <el-card>
        <h2 class="mb-3">My shopping cart</h2>
        <!--PRODUCTS-->
        <el-row v-if="userCart"
                v-for="product in userCart" :key="product.cartId"
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
            <el-button type="primary" size="small" class="ml-0" :disabled="product.qty === 0">Buy</el-button>
          </el-col>
        </el-row>
        <el-row>
          <v-divider></v-divider>
          <el-row type="flex">
            <el-col>
              <p class="pt-3">Total price: {{ totalPrice }} </p>
              <el-button type="primary" size="small" class="ml-0 mt-2 right">Buy all</el-button>
            </el-col>
          </el-row>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'ShoppingCart',
  data () {
    return {
      qty: 1
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

</style>

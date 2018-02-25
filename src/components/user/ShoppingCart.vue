<template>
  <el-row el-row type="flex" justify="center">
    <el-col :xs="24" :sm="18" :md="14" :lg="12" :xl="6" type="flex" align="middle">
      <el-card class="mb-2">
        <h2 class="mb-3">My shopping cart</h2>
        <!--PRODUCTS-->
        <el-row v-for="product in userCart" :key="product.cartId"
                type="flex"
                justify="center"
                style="flex-wrap: wrap"
                class="mb-2">
          {{product}}
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" align="left">
            <h3>{{ product.title }}</h3>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" align="right">
            <el-input-number size="small"
                             :v-model="product.qty"
                             :min="0"
                             :max="10">
            </el-input-number>
            <el-button type="secondary" size="small">
              <i class="el-icon-delete"></i>
            </el-button>
            <el-button type="primary" size="small" class="ml-0">Buy</el-button>
          </el-col>
        </el-row>
        <el-row>
          <v-divider></v-divider>
          <el-col align="right">
            <el-button type="primary" size="small" class="ml-0 mt-2">Buy all</el-button>
          </el-col>
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
    }
  }
}
</script>

<style scoped>

</style>

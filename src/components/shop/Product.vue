<template>
  <div>
    <!--Loading circular-->
    <v-container v-if="this.isLoading">
      <app-loader></app-loader>
    </v-container>
    <div v-else>
      <el-row el-row type="flex" justify="center">
        <el-col :xs="24" :sm="20" :md="18" :lg="16" :xl="14" type="flex" align="middle">
          <el-card style="height: 700px">
            <el-row type="flex">
              <el-col :span="12">
                <div class="img_wrapper">
                  <img src="@/assets/placeholders/people.jpg" class="main_img"/>
                </div>
              </el-col>
              <el-col :span="12" v-model="product">
                <h2>Info</h2>
                <v-divider class="mb-3 mt-3"></v-divider>
                <div style="text-align: left; margin-left: 40px;">
                  <p>Id: {{ this.id }}</p>
                  <p>Title: {{ product.title }} </p>
                  <p>Description: {{ product.description }} </p>
                  <p>Price: {{ product.price }} {{ product.currency }}</p>
                  <p>Quantity: {{ product.qty }} </p>
                  <p>Color: {{ product.color }} </p>
                  <p>Color: {{ product.size }} </p>
                  <p>Weight: {{ product.weight }} {{ product.weightMeasure }}</p>
                  <p>Date: {{ product.date | date }}</p>
                </div>
                <v-divider class="mb-3 mt-4"></v-divider>
                <el-button v-if="!alreadyAddedProduct"
                           size="mini"
                           type="primary"
                           @click="addToCart">
                  <span style="font-size: 14px">Add to cart</span>
                  <v-icon class="white--text ml-1">shopping_cart</v-icon>
                </el-button>
                <!--ELSE-->
                <div v-else>
                  <router-link to="/cart">
                    <el-tag type="text" class="mb-2">
                      Already added to cart!
                      <i class="el-icon-d-arrow-right"></i>
                    </el-tag>
                  </router-link>
                  <br>
                  <el-button size="mini" @click="removeFromCart">
                    <v-icon>remove_shopping_cart</v-icon>
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

export default {
  props: ['id'],
  name: 'ManId',
  data () {
    return {}
  },
  computed: {
    product () {
      return this.$store.getters.productById(this.id)
    },
    cart () {
      return this.$store.getters.cart
    },
    alreadyAddedProduct () {
      return this.$store.getters.cart.find(el => {
        return el.productId === this.id
      })
    }
  },
  methods: {
    addToCart () {
      this.$store.dispatch('addToCart', this.product)
    },
    removeFromCart () {
      this.$store.dispatch('removeFromCart', this.alreadyAddedProduct.cartId)
    }
  }
}
</script>

<style scoped>
  img {
    width: 100%;
    height: 500px;
    border: 1px solid grey;
    object-fit: cover;
  }

  .img_wrapper {
    width: 100%;
    height: 500px;
    padding: 10px;
  }

  .main_img {
    object-fit: cover;
  }
</style>

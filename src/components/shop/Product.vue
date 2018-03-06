<template>
  <div>
    <!--Loading circular-->
    <v-container v-if="this.isLoading">
      <app-loader></app-loader>
    </v-container>
    <div v-else>
      <el-row el-row type="flex" justify="center" v-if="product">
        <el-col :xs="24" :sm="20" :md="18" :lg="16" :xl="14" type="flex" align="middle">
          <el-card style="height: 700px">
            <el-row type="flex">
              <el-col :span="12">
                <div class="img_wrapper">
                  <img :src="product.img_0.original" class="main_img"/>
                </div>
                <el-row style="margin-top: 80px">
                  <p style="font-size: 24px">
                    <i class="el-icon-minus"></i>
                    Re<span class="primary--text">High</span> Store
                    <i class="el-icon-minus"></i>
                  </p>
                </el-row>
              </el-col>
              <el-col :span="12" v-model="product">
                <h2 class="mt-3">Info</h2>
                <v-divider class="mb-3 mt-3"></v-divider>
                <div style="text-align: left; margin-left: 40px;">
                  <p>Id: {{ product.productId }}</p>
                  <p>Title: {{ product.title }} </p>
                  <p>Description: {{ product.description }} </p>
                  <p>Price: {{ product.price }} {{ product.currency }}</p>
                  <p>Total Quantity: {{ product.qty }} </p>
                  <p>Color: {{ product.color }} </p>
                  <p>Size: {{ product.size }} </p>
                  <p>Weight: {{ product.weight }} {{ product.weightMeasure }}</p>
                </div>
                <v-divider class="mb-3 mt-4"></v-divider>
                <!--Authentication dialog-->
                <el-dialog
                  title="One second please!"
                  :visible.sync="dialogVisible"
                  width="30%"
                  center
                >
                  <span>To continue shopping please register on the site!</span>
                  <span slot="footer" class="dialog-footer">
                    <router-link to="/signup">
                      <el-button>Sing up</el-button>
                    </router-link>
                    <el-button type="primary" @click="signInAnonymously">Anonymously</el-button>
                  </span>
                </el-dialog>
                <!--Add to cart-->
                <el-button v-if="!alreadyAddedProduct"
                           size="mini"
                           type="primary"
                           class="mt-3"
                           @click="addToCart">
                  <span style="font-size: 14px">
                    Add to cart
                  </span>
                  <v-icon class="white--text ml-1">shopping_cart</v-icon>
                </el-button>
                <!--ELSE-->
                <div v-if="alreadyAddedProduct">
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
    return {
      dialogVisible: false
    }
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
      if (!this.isAuthenticatedUser) {
        this.dialogVisible = true
      }
      let orderProduct = {}
      orderProduct.productId = this.id
      orderProduct.qty = 1
      orderProduct.title = this.product.title
      orderProduct.color = this.product.color
      orderProduct.size = this.product.size
      orderProduct.price = this.product.price
      orderProduct.currency = this.product.currency
      this.$store.dispatch('addToCart', orderProduct)
    },
    removeFromCart () {
      this.$store.dispatch('removeFromCart', this.alreadyAddedProduct.cartId)
    },
    signInAnonymously () {
      this.dialogVisible = false
      this.$store.dispatch('signInAnonymously')
    }
  }
}
</script>

<style scoped>
  img {
    width: 100%;
    height: 500px;
    /*border: 1px solid grey;*/
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

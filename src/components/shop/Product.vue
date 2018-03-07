<template>
  <div>
    <!--Loading circular-->
    <v-container v-if="this.isLoading">
      <app-loader></app-loader>
    </v-container>
    <div v-else>
      <el-row el-row type="flex" justify="center" v-if="product" style="flex-wrap: wrap">
        <el-col :span="1">
          <router-link to="/shop">
            <el-button type="text" style="margin-left: -10px;" class="hidden-sm-and-down">
              <p class="back_to_shop">
                Back to Shop
              </p>
            </el-button>
          </router-link>
        </el-col>
        <el-col :xs="24" :sm="20" :md="18" :lg="16" :xl="14" type="flex" align="middle">
          <el-card>
            <el-row type="flex" style="flex-wrap: wrap">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <zoom-on-hover :img-normal="viewImage ? viewImage : product.img_0.original"
                               :img-zoom="viewImage ? viewImage : product.img_0.original"
                               class="main_img">
                </zoom-on-hover>
                <el-row class="mt-3">
                  <img v-if="product.img_0.thumbnail" :src="product.img_0.thumbnail" @click="loadOriginal('img_0')"
                       ref="img_0" class="thumb_img active"/>
                  <img v-if="product.img_1.thumbnail" :src="product.img_1.thumbnail" @click="loadOriginal('img_1')"
                       ref="img_1" class="thumb_img"/>
                  <img v-if="product.img_2.thumbnail" :src="product.img_2.thumbnail" @click="loadOriginal('img_2')"
                       ref="img_2" class="thumb_img"/>
                  <img v-if="product.img_3.thumbnail" :src="product.img_3.thumbnail" @click="loadOriginal('img_3')"
                       ref="img_3" class="thumb_img"/>
                  <img v-if="product.img_4.thumbnail" :src="product.img_4.thumbnail" @click="loadOriginal('img_4')"
                       ref="img_4" class="thumb_img"/>
                </el-row>
                <el-row class="mt-4">
                  <p style="font-size: 24px">
                    <i class="el-icon-minus"></i>
                    Re<span class="primary--text">High</span> Store
                    <i class="el-icon-minus"></i>
                  </p>
                </el-row>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12"
                      v-model="product">
                <h2 class="mt-3">{{ product.title }}</h2>
                <v-divider class="mb-3 mt-3"></v-divider>
                <div class="product_info">
                  <!--<p>Id: {{ product.productId }}</p>-->
                  <p>Description: {{ product.description }} </p>
                  <p>Total Quantity: {{ product.qty }} </p>
                  <p>Color: {{ product.color }} </p>
                  <p>Size: {{ product.size }} </p>
                  <p>Weight: {{ product.weight }} {{ product.weightMeasure }}</p>
                </div>
                <v-divider class="mb-3 mt-4"></v-divider>
                <p>Price: {{ product.price }} {{ product.currency }}</p>
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
                           size="medium"
                           type="primary"
                           class="mt-3"
                           @click="addToCart">
                  <span style="font-size: 14px">
                    Add to cart
                  </span>
                  <i class="el-icon-goods ml-2" style="transform: scale(1.5)"></i>
                </el-button>
                <el-button v-if="!alreadyAddedProduct"
                           size="medium"
                           class="mt-3"
                           @click="buyOneClick">
                  <span style="font-size: 14px">
                    Buy one click
                  </span>
                  <i class="el-icon-check ml-2" style="transform: scale(1.5)"></i>
                </el-button>
                <!--ELSE-->
                <div v-if="alreadyAddedProduct">
                  <router-link to="/cart">
                    <el-button type="text" class="mb-2 success--text">
                      Already added to cart!
                      <i class="el-icon-d-arrow-right"></i>
                    </el-button>
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
import ZoomOnHover from '@/components/shared/ZoomOnHover.vue'

export default {
  props: ['id'],
  name: 'ManId',
  components: {ZoomOnHover},
  data () {
    return {
      dialogVisible: false,
      viewImage: ''
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
    buyOneClick () {
    },
    removeFromCart () {
      this.$store.dispatch('removeFromCart', this.alreadyAddedProduct.cartId)
    },
    signInAnonymously () {
      this.dialogVisible = false
      this.$store.dispatch('signInAnonymously')
    },
    loadOriginal (name) {
      for (let i = 0; i < 5; i++) {
        if (this.$refs['img_' + i]) {
          this.$refs['img_' + i].classList.remove('active')
        }
      }
      this.$refs[name].classList.add('active')
      this.viewImage = this.product[name].original
    }
  }
}
</script>

<style scoped>
  .main_img {
    width: 100%;
    height: 480px;
    object-fit: cover;
  }

  .thumb_img {
    height: 90px;
    width: 78px;
    object-fit: cover;
    margin-right: 1px;
    margin-left: 1px;
  }

  .thumb_img:hover {
    cursor: pointer;
  }

  .active {
    transition: all 0.5s;
    transform: scale(1.08);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .back_to_shop {
    writing-mode: vertical-rl;
    font-size: 16px;
  }

  .product_info {
    text-align: left;
    margin-left: 40px;
    height: 300px;
  }
</style>

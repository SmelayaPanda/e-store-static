<template>
  <div>
    <!--Loading circular-->
    <v-container v-if="this.isLoading">
      <app-loader></app-loader>
    </v-container>
    <div v-else>
      <el-row el-row type="flex" justify="center">
        <el-col :xs="24" :sm="20" :md="18" :lg="16" :xl="14" type="flex" align="middle">
          <!--FILTER-->
          <el-collapse v-model="activeName" accordion style="margin-left: 12px; margin-right: 12px">
            <!--PRICE FILTER-->
            <el-collapse-item title="Filter" name="1">
              <span class="pr-4">Price</span>
              <div class="ml-3 mr-3">
                <el-slider
                  v-model="sliderValues"
                  @change="filterProducts"
                  range
                  :step="100"
                  :min="0"
                  :max="1000">
                </el-slider>
              </div>
              <!--SIZE FILTER-->
              <div>
                <el-radio-group v-model="selectedSize" size="small" @change="filterProducts" class="mb-2">
                  <el-radio-button label="All sizes"></el-radio-button>
                  <el-radio-button label="XXS"></el-radio-button>
                  <el-radio-button label="XS"></el-radio-button>
                  <el-radio-button label="S"></el-radio-button>
                  <el-radio-button label="M"></el-radio-button>
                  <el-radio-button label="L"></el-radio-button>
                  <el-radio-button label="XL"></el-radio-button>
                  <el-radio-button label="XXL"></el-radio-button>
                </el-radio-group>
              </div>
              <!--COLOR FILTER-->
              <div>
                <el-radio-group v-model="selectedColor" size="small" @change="filterProducts">
                  <el-radio-button label="All colors"></el-radio-button>
                  <el-radio-button label="red"></el-radio-button>
                  <el-radio-button label="green"></el-radio-button>
                  <el-radio-button label="grey"></el-radio-button>
                  <el-radio-button label="gold"></el-radio-button>
                  <el-radio-button label="blue"></el-radio-button>
                  <el-radio-button label="black"></el-radio-button>
                  <el-radio-button label="pink"></el-radio-button>
                </el-radio-group>
              </div>
            </el-collapse-item>
          </el-collapse>
          <el-row>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8"
                    v-for="(p,key) in products" :key="key"
            >
              <div @click="viewId(key)" class="card_wrapper">
                <el-card class="main_card"
                         :body-style="{ padding: '0px' }">
                  <img src="@/assets/placeholders/man_placeholder.png"
                       class="image" height="300px">
                  <div class="card_body">
                    <span>{{ p.title }}</span>
                    <div>
                      <time class="time">{{ p.price }} {{ p.currency }}</time>
                    </div>
                  </div>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Men',
  data () {
    return {
      activeName: 1,
      sliderValues: [0, 100000],
      selectedSize: 'All sizes',
      selectedColor: 'All colors'
    }
  },
  methods: {
    viewId (id) {
      this.$router.push('/product/' + id)
    },
    filterProducts () {
      return this.$store.dispatch('filterProducts', {
        minPrice: this.sliderValues[0],
        maxPrice: this.sliderValues[1],
        color: this.selectedColor === 'All colors' ? null : this.selectedColor,
        size: this.selectedSize === 'All sizes' ? null : this.selectedSize
      })
    }
  },
  computed: {
    products () {
      return this.$store.getters.products
    },
    maxPrice () {
      let max = 0
      for (let p in this.products) {
        if (Number(this.products[p].price) > max) {
          max = Number(this.products[p].price)
        }
      }
      return max
    }
  }
}
</script>

<style scoped>
  .main_card {
    margin: 10px;
    padding: 0 0 10px;
  }

  .card_body {
    padding: 10px;
  }

  .card_wrapper:hover {
    cursor: pointer;
  }
</style>

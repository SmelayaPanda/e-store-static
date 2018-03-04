<template>
  <div>
    <!--Loading circular-->
    <v-container v-if="this.isLoading">
      <app-loader></app-loader>
    </v-container>
    <div v-else>
      <el-row type="flex" justify="left" style="flex-wrap: wrap">
        <el-col :xs="24" :sm="24" :md="6" :lg="4" :xl="4">
          <el-radio-group v-model="isCollapse" style="margin-bottom: 20px; margin-top: 4px; margin-left: 10px;">
            <el-radio-button :label="false">expand</el-radio-button>
            <el-radio-button :label="true">collapse</el-radio-button>
          </el-radio-group>
          <el-menu default-active="All groups"
                   class="el-menu-vertical-demo"
                   @select="changeCategory"
                   :collapse="isCollapse">
            <el-menu-item index="All groups" @click="filterProducts">
              <i class="el-icon-star-on"></i>
              <span slot="title">All groups</span>
            </el-menu-item>
            <el-submenu index="Category A">
              <template slot="title" >
                <i class="el-icon-news"></i>
                <span slot="title">Category A</span>
              </template>
              <el-menu-item-group>
                <span slot="title">Group One</span>
                <el-menu-item index="Category A1" @click="filterProducts">Category A1</el-menu-item>
                <el-menu-item index="Category A2" @click="filterProducts">Category A2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="Group Two">
                <el-menu-item index="Category A3" @click="filterProducts">Category A3</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="Category B" @click="filterProducts">
              <i class="el-icon-picture-outline"></i>
              <span slot="title">Category B</span>
            </el-menu-item>
            <el-menu-item index="Category C" @click="filterProducts">
              <i class="el-icon-location"></i>
              <span slot="title">Category C</span>
            </el-menu-item>
            <el-menu-item index="Category D" @click="filterProducts">
              <i class="el-icon-view"></i>
              <span slot="title">Category D</span>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :xs="24" :sm="24" :md="18" :lg="16" :xl="14" type="flex" align="middle">
          <!--FILTER-->
          <el-collapse v-model="activeName" accordion style="margin-left: 12px; margin-right: 12px">
            <!--PRICE FILTER-->
            <el-collapse-item title="Filter" name="1">
              <el-button type="text" class="pr-4 pb-0" @click="sortByPrice">
                <span class="ml-3">Price</span>
                <el-tag size="mini">
                  <i class="el-icon-caret-top" v-if="!this.sortAsc"></i>
                  <i class="el-icon-caret-bottom" v-else></i>
                </el-tag>
              </el-button>
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
              <div @click="viewProduct(p.productId)" class="card_wrapper">
                <v-card class="main_card" height="410px">
                  <v-card-media :src="p.imageUrl" height="300px"></v-card-media>
                    <v-card-title>
                      <span class="grey--text">{{ p.price }} {{ p.currency }}</span>
                    </v-card-title>
                    <p>{{ p.title | snippet(60) }}</p>
                </v-card>
              </div>
            </el-col>
          </el-row>
          <div class="mb-4 mt-3">
            <el-button type="text" @click="loadMore" v-if="!this.$store.getters.isAllLoaded">Load more</el-button>
          </div>
        </el-col>
      </el-row>
      <back-to-top visibleOffset="500" :right="60" :bottom="30">
        <el-button round><el-icon class="el-icon-arrow-up"></el-icon></el-button>
      </back-to-top>
    </div>
  </div>
</template>

<script>
import BackToTop from 'vue-backtotop'

export default {
  name: 'Men',
  components: {
    BackToTop
  },
  data () {
    return {
      sortAsc: true,
      activeName: 1,
      isCollapse: false,
      sliderValues: [1, 1000],
      selectedSize: 'All sizes',
      selectedColor: 'All colors',
      selectedCategory: 'All groups'
    }
  },
  methods: {
    sortByPrice () {
      this.sortAsc = !this.sortAsc
      this.filterProducts()
    },
    viewProduct (id) {
      this.$router.push('/product/' + id)
    },
    changeCategory (key) {
      this.selectedCategory = key
    },
    filterProducts () {
      this.$store.dispatch('resetLastVisible')
      this.filter(false)
    },
    loadMore () {
      this.filter(true)
    },
    filter (loadMore) {
      return this.$store.dispatch('fetchProducts', {
        loadMore: loadMore,
        sortAsc: this.sortAsc,
        minPrice: this.sliderValues[0],
        maxPrice: this.sliderValues[1],
        category: this.selectedCategory === 'All groups' ? null : this.selectedCategory,
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

  .card_wrapper:hover {
    cursor: pointer;
  }

  .btn-to-top {
    width: 60px;
    height: 60px;
    padding: 10px 16px;
    border-radius: 50%;
    font-size: 22px;
    line-height: 22px;
  }
</style>

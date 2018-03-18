<template>
  <div>
    <!--Loading circular-->
    <!-- TODO: Need Cool Loader!-->
    <!--<v-container v-if="this.isLoading">-->
      <!--<app-loader></app-loader>-->
    <!--</v-container>-->
    <div>
      <el-row type="flex" justify="left" style="flex-wrap: wrap">
        <el-col :xs="24" :sm="6" :md="5" :lg="4" :xl="4" align="left">
          <el-button type="text" @click="isCollapse = !isCollapse" class="mt-2 ml-3 pl-1">
            <v-icon v-if="isCollapse">hdr_strong</v-icon>
            <v-icon v-if="!isCollapse">hdr_weak</v-icon>
          </el-button>
          <el-menu default-active="all"
                   @select="changeCategory"
                   :collapse="isCollapse">
            <el-menu-item index="all" @click="filterProducts">
              <!--<i class="el-icon-star-on"></i>-->
              <v-icon>view_week</v-icon>
              <span slot="title">All categories</span>
            </el-menu-item>
            <el-submenu index="Category A">
              <template slot="title">
                <!--<i class="el-icon-news"></i>-->
                <v-icon>looks_one</v-icon>
                <span slot="title">Group A</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="Group A" @click="filterProducts">All in Group A</el-menu-item>
              </el-menu-item-group>
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
              <v-icon>looks_two</v-icon>
              <span slot="title">Category B</span>
            </el-menu-item>
            <el-menu-item index="Category C" @click="filterProducts">
              <v-icon>looks_3</v-icon>
              <span slot="title">Category C</span>
            </el-menu-item>
            <el-menu-item index="Category D" @click="filterProducts">
              <v-icon>looks_4</v-icon>
              <span slot="title">Category D</span>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :xs="24" :sm="18" :md="18" :lg="16" :xl="14" type="flex" align="middle">
          <!--FILTER-->
          <el-collapse v-model="activeName" accordion style="margin-left: 12px; margin-right: 12px">
            <!--PRICE FILTER-->
            <el-collapse-item title="Filter" name="1">
              <el-button type="text" class="pr-4 pb-0" @click="sortByPrice">
                <span class="pl-3">Price</span>
                <el-tag size="mini">
                  <i class="el-icon-caret-top" v-if="!this.sortAsc"></i>
                  <i class="el-icon-caret-bottom" v-else></i>
                </el-tag>
              </el-button>
              <div class="pl-3 pr-3">
                <el-slider
                  v-model="sliderValues"
                  @change="filterProducts"
                  range
                  :step="100"
                  :min="0"
                  :max="2000">
                </el-slider>
                <!--TODO: dinamyc max price-->
              </div>
              <!--BRAND-->
              <el-row type="flex" justify="center" style="flex-wrap: wrap" class="pt-2">
                <el-col :span="12" align="right" class="pr-1">
                  <el-select filterable
                             clearable
                             no-match-text="Brand is missing"
                             v-model="selectedBrand"
                             placeholder="Brand"
                             @change="filterProducts"
                             v-if="brands">
                    <el-option
                      v-for="val in brands"
                      :key="val"
                      :label="val"
                      :value="val">
                    </el-option>
                  </el-select>
                </el-col>
                <!--COLOR-->
                <el-col :span="12" align="left" class="pl-1">
                  <el-select filterable
                             clearable
                             no-match-text="Color is missing"
                             v-model="selectedColor"
                             placeholder="Color"
                             @change="filterProducts"
                             v-if="colors">
                    <el-option
                      v-for="val in colors"
                      :key="val"
                      :label="val"
                      :value="val">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
          <el-row type="flex" justify="center" style="flex-wrap: wrap">
            <el-col :xs="23" :sm="12" :md="8" :lg="8" :xl="8"
                    v-for="(p,key) in products" :key="key"
            >
              <div @click="viewProduct(p.productId)" class="card_wrapper">
                <v-card class="main_card" height="410px">
                  <v-card-media :src="p.img_0.card" height="300px"></v-card-media>
                  <v-card-title>
                    <span class="grey--text">{{ p.price }} {{ p.currency }}</span>
                  </v-card-title>
                  <p class="pl-2 pr-2">{{ p.title | snippet(60) }}</p>
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
        <el-button round>
          <el-icon class="el-icon-arrow-up"></el-icon>
        </el-button>
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
      isCollapse: true,
      sliderValues: [1, 2000],
      selectedBrand: null,
      selectedColor: null,
      selectedGroup: null,
      selectedCategory: 'all',
      formLabelWidth: '120px'
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
      if (['Group A', 'Group B', '...'].indexOf(key) !== -1) { // extends for other groups
        this.selectedGroup = key
        this.selectedCategory = null
      } else {
        this.selectedCategory = key
        this.selectedGroup = null
      }
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
        limit: 15,
        loadMore: loadMore,
        sortAsc: this.sortAsc,
        minPrice: this.sliderValues[0],
        maxPrice: this.sliderValues[1],
        category: this.selectedCategory === 'all' ? null : this.selectedCategory,
        group: this.selectedGroup,
        color: this.selectedColor,
        brand: this.selectedBrand
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
    },
    brands () {
      return this.$store.getters.brands
    },
    colors () {
      return this.$store.getters.colors
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

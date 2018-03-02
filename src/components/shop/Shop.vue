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
          <el-collapse v-model="activeName" accordion style="margin-left: 12px; margin-right: 12px" v-if="maxPrice">
            <!--PRICE FILTER-->
            <el-collapse-item title="Filter" name="1">
              <span class="pr-4">Price</span>
              <div class="ml-3 mr-3">
                <el-slider
                  v-model="sliderValues"
                  range
                  :min="0"
                  :max="maxPrice">
                </el-slider>
              </div>
              <!--SIZE FILTER-->
              <div>
                <el-radio-group v-model="size" size="small">
                  <el-radio-button label="All sizes"></el-radio-button>
                  <el-radio-button label="small"></el-radio-button>
                  <el-radio-button label="medium"></el-radio-button>
                  <el-radio-button label="big" disabled></el-radio-button>
                  <el-radio-button label="large"></el-radio-button>
                </el-radio-group>
              </div>
              <!--COLOR SELECT-->
              <el-select
                class="mt-2 pt-2"
                v-model="colorsFilter"
                auto-complete
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="Color">
                <el-option
                  v-for="item in colors"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-collapse-item>
          </el-collapse>
          <el-row>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8"
                    v-for="(p,key) in products" :key="key"
            >
              <div @click="viewId(key)" class="card_wrapper">
                <el-card v-show="(p.price > sliderValues[0] && p.price < sliderValues[1]) &&
                                 ((p.size === size) || size === 'All sizes' ) &&
                                 ((p.color === colorsFilter[0] || p.color === colorsFilter[1] || p.color === colorsFilter[2] || p.color === colorsFilter[3]|| p.color === colorsFilter[4]|| p.color === colorsFilter[5] ) ||
                                 (!colorsFilter[0]))"
                         class="main_card"
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
      size: 'All sizes',
      colors: [{
        value: 'green',
        label: 'green'
      }, {
        value: 'red',
        label: 'red'
      }, {
        value: 'grey',
        label: 'grey'
      }, {
        value: 'blue',
        label: 'blue'
      }, {
        value: 'gold',
        label: 'gold'
      }, {
        value: 'black',
        label: 'black'
      }],
      colorsFilter: []
    }
  },
  methods: {
    viewId (id) {
      this.$router.push('/product/' + id)
    }
  },
  computed: {
    products () {
      return this.$store.getters.products
    },
    maxPrice () {
      let max = 0
      for (let p in this.products) {
        console.log(this.products[p].price)
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

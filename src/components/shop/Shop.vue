<template>
  <div>
    <el-row el-row type="flex" justify="center">
      <el-col :xs="24" :sm="20" :md="18" :lg="16" :xl="14" type="flex" align="middle">
        <h3>Yes!</h3>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor dolorem eligendi et fugiat libero nisi porro
        possimus quas tempora tempore! Assumenda beatae consequatur itaque molestias non omnis placeat sapiente
        voluptate?
        <!---->
        <el-row>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8"
                  v-for="(p,key) in products" :key="key"
          >
            {{ key }}
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
</template>

<script>
export default {
  name: 'Men',
  methods: {
    viewId (id) {
      this.$router.push('/product/' + id)
    }
  },
  computed: {
    products () {
      return this.$store.getters.getProducts
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

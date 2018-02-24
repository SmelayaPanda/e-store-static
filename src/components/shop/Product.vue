<template>
  <div>
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
              <div style="text-align: left; margin-left: 20px;">
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
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  props: ['id'],
  name: 'ManId',
  data () {
    return {
    }
  },
  computed: {
    product () {
      return this.$store.getters.getProductsById(this.id)
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

<template>
  <div v-if="products">
    <h1 class="mb-2">All products</h1>
    <add-product></add-product>
    <el-table
      :data="products"
      :highlight-current-row="true"
      empty-text="No data"
      size="small"
      style="width: 100vw; text-align: left"
    >
      <!--THUMBNAIL-->
      <el-table-column
        label="Image"
        width="70">
        <template slot-scope="scope">
          <img :src="scope.row.mainImage.thumbnail" height="40px" width="auto">
        </template>
      </el-table-column>
      <!--ID-->
      <el-table-column
        label="id"
        width="100">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>Id: {{ scope.row.productId }}</p>
            <span>* unique database parameter</span>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.productId | snippet(6) }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!--DESCRIPTION-->
      <el-table-column
        label="Title/Description"
        width="260">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>Title: {{ scope.row.title }}</p>
            <p>Description: {{ scope.row.description }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.title | snippet(32) }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!--PRICE-->
      <el-table-column
        label="Price"
        width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.price }} {{ scope.row.currency }}</span>
        </template>
      </el-table-column>
      <!--QUANTITY-->
      <el-table-column
        label="Quantity"
        width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.qty }}</span>
        </template>
      </el-table-column>
      <!--COLORS-->
      <el-table-column
        label="Color"
        width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.color }}</span>
        </template>
      </el-table-column>
      <!--SIZE-->
      <el-table-column
        label="Size"
        width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.size }}</span>
        </template>
      </el-table-column>
      <!--WEIGHT-->
      <el-table-column
        label="Weight"
        width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.weight }} {{ scope.row.weightMeasure }}</span>
        </template>
      </el-table-column>
      <!--DATE-->
      <el-table-column
        label="Creation Date"
        width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.creationDate | date }}</span>
        </template>
      </el-table-column>
      <!--EDIT/DELETE-->
      <el-table-column
        width="150"
        label="Operations">
        <template slot-scope="scope">
          <el-row type="flex">
            <edit-product-image :id="scope.row.productId"></edit-product-image>
            <edit-product :editProduct="scope.row"></edit-product>
            <delete-product :id="scope.row.productId" :title="scope.row.title"></delete-product>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import AddProduct from './crud/AddProduct'
import EditProduct from './crud/EditProduct'
import EditProductImage from './crud/EditProductImage'
import DeleteProduct from './crud/DeleteProducts'

export default {
  components: {
    EditProductImage,
    EditProduct,
    AddProduct,
    DeleteProduct
  },
  name: 'AdminProducts',
  data () {
    return {
    }
  },
  methods: {},
  computed: {
    products () {
      let arr = []
      let prodObj = this.$store.getters.products
      for (let key in prodObj) {
        let pushObj = prodObj[key]
        pushObj.id = key
        arr.push(pushObj)
      }
      return arr
    }
  }
}
</script>

<style scoped>

</style>

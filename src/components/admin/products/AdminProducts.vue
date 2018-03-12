<template>
  <div v-if="products">
    <!--Loading circular-->
    <v-container v-if="this.isLoading">
      <app-loader></app-loader>
    </v-container>
    <div v-else>
      <el-row type="flex" justify="start" align="middle" class="mb-4">
        <el-cascader
          :options="options"
          filterable
          placeholder="Select category"
          v-model="productOption"
          @change="loadCategoryProducts">
        </el-cascader>
        <el-col class="left" style="width: 100px;">
          <add-product :group="productOption[0]" :category="productOption[1]"></add-product>
        </el-col>
      </el-row>
      <el-table
        ref="categoryTable"
        :data="products"
        :highlight-current-row="true"
        empty-text="No data"
        style="width: 100vw; text-align: left"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <p><span>Database id:</span> <el-tag size="mini" type="success">{{ props.row.productId }}</el-tag></p>
            <p>Description: {{ props.row.description }}</p>
            <p>Color: {{ props.row.color }}</p>
            <p>Creation date: {{ props.row.creationDate | date }}</p>
            <p>Last edit date: {{ props.row.editDate | date }}</p>
          </template>
        </el-table-column>
        <!--THUMBNAIL-->
        <el-table-column
          label="Image"
          width="70">
          <template slot-scope="scope">
            <img :src="scope.row.img_0.thumbnail" height="40px" width="auto">
          </template>
        </el-table-column>
        <!--Vendor Code-->
        <el-table-column
          label="Vendor Code"
          width="120">
          <template slot-scope="scope">
            <span><el-tag type="success">{{ scope.row.vendorCode }}</el-tag></span>
          </template>
        </el-table-column>
        <!--Title-->
        <el-table-column
          label="Title"
          width="300">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>Title: {{ scope.row.title }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.title | snippet(40) }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <!--BRAND-->
        <el-table-column
          label="Brand"
          width="120">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>Brand: {{ scope.row.brand }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium" type="info">{{ scope.row.brand | snippet(20) }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <!--PRICE-->
        <el-table-column
          label="Price"
          width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.price }} {{ scope.row.currency }}</span>
          </template>
        </el-table-column>
        <!--QUANTITY-->
        <el-table-column
          label="Quantity"
          width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.qty }}</span>
          </template>
        </el-table-column>
        <!--EDIT/DELETE-->
        <el-table-column
          width="150"
          label="Operations">
          <template slot-scope="scope">
            <el-row type="flex" justify="center">
              <edit-product-image :editProduct="scope.row"></edit-product-image>
              <edit-product :editProduct="scope.row"></edit-product>
              <delete-product :id="scope.row.productId" :title="scope.row.title"></delete-product>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
      productOption: ['Group A', 'Category A1'], // don't fordet change main js
      options: [{
        value: 'Group A',
        label: 'Group A',
        children: [{
          value: 'Category A1',
          label: 'Category A1'
        }, {
          value: 'Category A2',
          label: 'Category A2'
        }, {
          value: 'Category A3',
          label: 'Category A3'
        }]
      },
      {
        value: 'Group B',
        label: 'Group B',
        children: [{
          value: 'Category B',
          label: 'Category B'
        }]
      }, {
        value: 'Group C',
        label: 'Group C',
        children: [{
          value: 'Category C',
          label: 'Category C'
        }]
      }, {
        value: 'Group D',
        label: 'Group D',
        children: [{
          value: 'Category D',
          label: 'Category D'
        }]
      }]
    }
  },
  methods: {
    loadCategoryProducts () {
      this.$store.dispatch('resetLastVisible')
      this.$store.dispatch('fetchProducts', {
        category: this.productOption[1],
        sortAsc: true
      })
    }
  },
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
  .el-cascader {
    width: 400px !important;
  }
</style>

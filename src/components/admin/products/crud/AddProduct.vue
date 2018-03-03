<template>
  <div>
    <v-btn class="primary" fab @click="dialogFormVisible = true">
      <v-icon class="white--text">add</v-icon>
    </v-btn>

    <el-dialog title="New product info" :visible.sync="dialogFormVisible" width="100%" :fullscreen="true">
      <el-form :model="product">
        <el-form-item label="Category" :label-width="formLabelWidth">
          <el-select v-model="product.category" placeholder="Select a currency">
            <el-option label="Category A" value="Category A"></el-option>
            <el-option label="Category B" value="Category B"></el-option>
            <el-option label="Category C" value="Category C"></el-option>
            <el-option label="Category D" value="Category D"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Title" :label-width="formLabelWidth">
          <el-input v-model="product.title"></el-input>
        </el-form-item>
        <el-form-item label="Description" :label-width="formLabelWidth">
          <el-input v-model="product.description"></el-input>
        </el-form-item>
        <el-row type="flex">
          <el-form-item label="Price" :label-width="formLabelWidth">
            <el-input type="number" v-model="product.price"></el-input>
          </el-form-item>
          <el-form-item label="Currency" :label-width="formLabelWidth">
            <el-select v-model="product.currency" placeholder="Select a currency">
              <el-option label="RUB" value="RUB"></el-option>
              <el-option label="USD" value="USD" disabled></el-option>
              <el-option label="EUR" value="EUR" disabled></el-option>
              <el-option label="GBP" value="GBP" disabled></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row type="flex">
          <el-form-item label="Weight" :label-width="formLabelWidth">
            <el-input type="number" v-model="product.weight"></el-input>
          </el-form-item>
          <el-form-item label="Measure" :label-width="formLabelWidth">
            <el-select v-model="product.weightMeasure" placeholder="Select a measure">
              <el-option label="kg" value="kg"></el-option>
              <el-option label="gr" value="gr"></el-option>
              <el-option label="mg" value="mg"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row type="flex">
          <el-form-item label="Color" :label-width="formLabelWidth">
            <el-input v-model="product.color"></el-input>
          </el-form-item>
          <el-form-item label="Size" :label-width="formLabelWidth">
            <el-select v-model="product.size" placeholder="Select a size">
              <el-option label="XXS" value="XXS"></el-option>
              <el-option label="XS" value="XS" ></el-option>
              <el-option label="S" value="S"></el-option>
              <el-option label="M" value="M"></el-option>
              <el-option label="L" value="L"></el-option>
              <el-option label="XL" value="XL"></el-option>
              <el-option label="XXL" value="XXL"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row type="flex">
          <el-form-item label="Quantity" :label-width="formLabelWidth">
            <el-input type="number" v-model="product.qty"></el-input>
          </el-form-item>
          <el-form-item label="Priority" :label-width="formLabelWidth">
            <el-input type="number" v-model="product.priority"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="addNewProduct">Ok</el-button>
          <el-button class="mr-5" @click="dialogFormVisible = false">Cancel</el-button>
        </el-row>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AddProduct',
  data () {
    return {
      dialogFormVisible: false,
      product: {
        category: 'Category A',
        title: 'Some product name',
        description: 'And awesome description',
        priority: 1,
        currency: 'RUB',
        price: '100',
        qty: 10,
        color: 'green',
        size: 'XL',
        weight: 0.5,
        weightMeasure: 'kg',
        date: '2016-05-03'
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    addNewProduct () {
      let newProduct = {
        category: this.product.category,
        title: this.product.title,
        description: this.product.description,
        priority: this.product.priority,
        price: parseFloat(this.product.price),
        currency: this.product.currency,
        qty: this.product.qty,
        color: this.product.color,
        size: this.product.size,
        weight: this.product.weight,
        weightMeasure: this.product.weightMeasure,
        creationDate: new Date()
      }
      console.log(newProduct)
      this.dialogFormVisible = false
      this.$store.dispatch('addNewProduct', newProduct)
    }
  }
}
</script>

<style scoped>

</style>

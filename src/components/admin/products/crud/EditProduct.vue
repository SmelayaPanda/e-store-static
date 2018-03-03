<template>
  <div>
    <el-button size="mini" @click="dialogFormVisible = true">
      <i class="el-icon-edit"></i>
    </el-button>

    <el-dialog title="Edit product info" :visible.sync="dialogFormVisible" width="100%" :fullscreen="true">
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
              <el-option label="Small" value="small"></el-option>
              <el-option label="Medium" value="medium"></el-option>
              <el-option label="Big" value="big"></el-option>
              <el-option label="Large" value="large"></el-option>
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
          <el-button type="primary" @click="edit">Ok</el-button>
          <el-button class="mr-5" @click="dialogFormVisible = false">Cancel</el-button>
        </el-row>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'EditProduct',
  props: ['editProduct'],
  data () {
    return {
      product: this.editProduct,
      dialogFormVisible: false,
      formLabelWidth: '120px'
    }
  },
  methods: {
    edit () {
      let editedObj = {
        category: this.product.category,
        productId: this.editProduct.id,
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
        creationDate: this.product.creationDate,
        editDate: new Date()
      }
      console.log(editedObj)
      this.$store.dispatch('editProduct', editedObj)
      this.dialogFormVisible = false
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <div>
    <el-button @click="dialogFormVisible = true">Add</el-button>

    <el-dialog title="Product info" :visible.sync="dialogFormVisible" width="100%" :fullscreen="true">
      <el-form :model="product">
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
              <el-option label="RUR" value="RUR"></el-option>
              <el-option label="USA" value="USA"></el-option>
              <el-option label="EUR" value="EUR"></el-option>
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
    <el-button @click="dialogFormVisible = false">Cancel</el-button>
    <el-button type="primary" @click="addNewProduct">Confirm</el-button>
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
        title: 'Some product name',
        description: 'And awesome description',
        priority: 1,
        currency: 'RUR',
        price: '100',
        qty: 10,
        color: 'green',
        size: 'big',
        weight: 0.5,
        weightMeasure: 'kg',
        date: '2016-05-03'
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    addNewProduct () {
      let creationDate = new Date()
      let newProduct = {
        title: this.product.title,
        description: this.product.description,
        priority: this.product.priority,
        currency: this.product.currency,
        price: this.product.price,
        qty: this.product.qty,
        color: this.product.color,
        size: this.product.size,
        weight: this.product.weight,
        weightMeasure: this.product.weightMeasure,
        date: creationDate.toISOString()
      }
      console.log(newProduct)
      this.dialogFormVisible = false
    }
  }
}
</script>

<style scoped>

</style>

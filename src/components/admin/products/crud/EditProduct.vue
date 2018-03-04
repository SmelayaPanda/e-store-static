<template>
  <div>
    <el-button size="mini" @click="dialogFormVisible = true">
      <i class="el-icon-edit"></i>
    </el-button>

    <el-dialog title="Edit product info" :visible.sync="dialogFormVisible" width="100%" :fullscreen="true">
      <el-form :model="product">
        <el-row type="flex" justify="center">
          <el-form-item>
            <el-select v-model="product.category" placeholder="Select a currency">
              <el-option label="Category A1" value="Category A1"></el-option>
              <el-option label="Category A2" value="Category A2"></el-option>
              <el-option label="Category A3" value="Category A3"></el-option>
              <el-option label="Category B" value="Category B"></el-option>
              <el-option label="Category C" value="Category C"></el-option>
              <el-option label="Category D" value="Category D"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-form-item label="Title" :label-width="formLabelWidth">
          <el-input v-model="product.title"
                    placeholder="Product title (max 100 symbols)"
                    :maxlength="100"
          ></el-input>
        </el-form-item>
        <el-form-item label="Description" :label-width="formLabelWidth">
          <el-input v-model="product.description"
                    type="textarea"
                    placeholder="Product description (max 400 symbols)"
                    :autosize="{ minRows: 3, maxRows: 7}"
                    :maxlength="400"
          ></el-input>
        </el-form-item>
        <el-row type="flex">
          <el-form-item label="Price" :label-width="formLabelWidth">
            <el-input-number v-model="product.price" :min="1" :max="1000000"></el-input-number>
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
            <el-input-number v-model="product.weight" :min="1" :max="1000000"></el-input-number>
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
              <el-option label="XS" value="XS"></el-option>
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
            <el-input-number v-model="product.qty" :min="0" :max="1000000"></el-input-number>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="edit" :disabled="!isValidForm">Edit</el-button>
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
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
      let editObj = {
        category: this.product.category,
        title: this.product.title,
        description: this.product.description,
        price: parseFloat(this.product.price),
        currency: this.product.currency,
        qty: this.product.qty,
        color: this.product.color,
        size: this.product.size,
        weight: this.product.weight,
        weightMeasure: this.product.weightMeasure,
        editDate: new Date(), // old fields ->
        productId: this.editProduct.productId,
        imageUrl: this.editProduct.imageUrl,
        creationDate: this.editProduct.creationDate
      }
      this.dialogFormVisible = false
      this.$store.dispatch('editProduct', editObj)
    },
    onPickFile:
        function () {
          this.$refs.fileInput.click()
        },
    onFilePicked:
        function (event) {
          const files = event.target.files // files[0] because it may be multiselect of files, take first
          const filename = files[0].name
          if (filename.indexOf('.') <= 0) { // file have an extension
            return alert('Please, pick a valid file')
          }
          const fileReader = new FileReader() // native js future for client file work
          fileReader.addEventListener('load', () => {
            this.imageUrl = fileReader.result
          })
          fileReader.readAsDataURL(files[0])
          this.image = files[0]
        }
  },
  computed: {
    isValidForm () {
      return this.product.title !== '' && this.product.description !== '' && this.product.color !== ''
    }
  }
}
</script>

<style scoped>

</style>

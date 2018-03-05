<template>
  <div>
    <v-btn class="primary" @click="dialogFormVisible = true">
      <v-icon class="white--text">add</v-icon>
    </v-btn>

    <el-dialog :title="'New product in: ' + category" :visible.sync="dialogFormVisible" width="100%" :fullscreen="true">
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-form :model="product">
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
            <el-row type="flex" style="flex-wrap: wrap">
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
            <el-row type="flex" style="flex-wrap: wrap">
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
            <el-row type="flex" style="flex-wrap: wrap">
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
            <el-row type="flex" style="flex-wrap: wrap">
              <el-form-item label="Quantity" :label-width="formLabelWidth">
                <el-input-number v-model="product.qty" :min="0" :max="1000000"></el-input-number>
              </el-form-item>
            </el-row>
            <!--Image-->
            <el-row type="flex" justify="center" class="mb-2">
              <el-button @click="onPickFile">
                Image
                <i class="el-icon-picture-outline ml-2" style="transform: scale(1.7)"></i>
              </el-button>
              <input
                type="file"
                style="display: none;"
                ref="fileInput"
                accept="image/*"
                @change="onFilePicked"
              >
            </el-row>
            <!--Image preview-->
            <el-row>
              <img :src="imageUrl" :height="this.imageHeight">
            </el-row>
          </el-form>
            <el-button type="primary" @click="addNewProduct" :disabled="!isValidForm">Create</el-button>
            <el-button @click="dialogFormVisible = false">Cancel</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AddProduct',
  props: ['category'],
  data () {
    return {
      dialogFormVisible: false,
      image: null,
      imageUrl: '',
      product: {
        category: 'Category A1',
        title: '',
        description: '',
        currency: 'RUB',
        price: 100,
        qty: 10,
        color: 'green',
        size: 'XL',
        weight: 0.5,
        weightMeasure: 'kg',
        date: new Date()
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    addNewProduct () {
      let newProduct = {
        category: this.category,
        title: this.product.title,
        description: this.product.description,
        price: parseFloat(this.product.price),
        currency: this.product.currency,
        qty: this.product.qty,
        color: this.product.color,
        size: this.product.size,
        weight: this.product.weight,
        weightMeasure: this.product.weightMeasure,
        creationDate: new Date(),
        image: this.image
      }
      this.dialogFormVisible = false
      this.$store.dispatch('addNewProduct', newProduct)
    },
    onPickFile:
        function () {
          this.$refs.fileInput.click()
        },
    onFilePicked:
        function (event) {
          const files = event.target.files // files[0] because it may be multiselect of files, take first
          if (files[0].name.indexOf('.') <= 0) { // file have an extension
            return alert('File name without extension!')
          }
          if (files[0].size > 1500000) {
            return alert('File size must be less than 1.5 MB!')
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
      return this.imageUrl !== '' && this.product.title !== '' &&
          this.product.description !== '' && this.product.color !== ''
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <div>
    <v-btn class="primary" @click="dialogFormVisible = true">
      <v-icon class="white--text">add</v-icon>
    </v-btn>

    <el-dialog :title="`New product in: ${group} / ${category}`" :visible.sync="dialogFormVisible" width="100%"
               :fullscreen="true">
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-form :model="product">
            <el-form-item label="Title" :label-width="formLabelWidth">
              <el-input v-model="product.title"
                        placeholder="(max 100 symbols)"
                        :maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item label="Description" :label-width="formLabelWidth">
              <el-input v-model="product.description"
                        type="textarea"
                        placeholder="(max 400 symbols)"
                        :autosize="{ minRows: 3, maxRows: 7}"
                        :maxlength="400"
              ></el-input>
            </el-form-item>
            <el-form-item label="Article" :label-width="formLabelWidth">
              <el-input v-model="product.article"
                        placeholder="(max 20 symbols)"
                        :maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item label="Brand" :label-width="formLabelWidth">
              <el-input v-model="product.brand"
                        placeholder="(max 50 symbols)"
                        :maxlength="50"
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
  props: ['group', 'category'],
  data () {
    return {
      dialogFormVisible: false,
      product: {
        group: 'Group A',
        category: 'Category A1',
        title: '',
        description: '',
        article: '',
        brand: '',
        currency: 'RUB',
        price: 100,
        qty: 10,
        color: 'green',
        size: 'XL',
        date: new Date()
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    addNewProduct () {
      let newProduct = {
        group: this.group,
        category: this.category,
        title: this.product.title,
        description: this.product.description,
        article: this.product.article,
        brand: this.product.brand,
        price: parseFloat(this.product.price).toFixed(2),
        currency: this.product.currency,
        qty: this.product.qty,
        color: this.product.color,
        size: this.product.size,
        creationDate: new Date()
      }
      this.dialogFormVisible = false
      this.$store.dispatch('addNewProduct', newProduct)
    }
  },
  computed: {
    isValidForm () {
      return this.product.title !== '' && this.product.description !== '' &&
          this.product.color !== '' && this.product.article !== '' && this.product.brand !== ''
    }
  }
}
</script>

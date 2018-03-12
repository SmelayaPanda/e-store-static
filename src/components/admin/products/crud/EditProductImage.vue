<template>
  <div>
    <el-button size="small" @click="dialogFormVisible = true">
      <i class="el-icon-picture-outline"></i>
    </el-button>
    <!--Image-->
    <el-dialog title="Product images" :visible.sync="dialogFormVisible" width="100%" :fullscreen="true" center>
      <el-row type="flex" justify="center" class="mb-3" style="flex-wrap: wrap">
        <!--Image-->
        <!-- fileUploaded custom event from UploadProductImage.vue-->
        <upload-product-image img-name="img_0" @fileUploaded="loadFileData" img-btn-name="Main Image" :cur-img="editProduct.img_0.thumbnail"/>
        <upload-product-image img-name="img_1" @fileUploaded="loadFileData" img-btn-name="Add Image 1" :cur-img="editProduct.img_1.thumbnail"/>
        <upload-product-image img-name="img_2" @fileUploaded="loadFileData" img-btn-name="Add Image 2" :cur-img="editProduct.img_2.thumbnail"/>
        <upload-product-image img-name="img_3" @fileUploaded="loadFileData" img-btn-name="Add Image 3" :cur-img="editProduct.img_3.thumbnail"/>
        <upload-product-image img-name="img_4" @fileUploaded="loadFileData" img-btn-name="Add Image 4" :cur-img="editProduct.img_4.thumbnail"/>
      </el-row>
      <el-row type="flex" justify="center">
        <el-button type="primary" @click="edit" :disabled="!isValidForm">Ok</el-button>
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import UploadProductImage from './UploadProductImage'

export default {
  name: 'EditProductImage',
  components: {UploadProductImage},
  props: ['editProduct'],
  data () {
    return {
      dialogFormVisible: false,
      images: {},
      imageUrl: ''
    }
  },
  methods: {
    loadFileData (val) {
      // val.imgName="img_0 ... 4"
      this.images[val.imgName] = val.image
    },
    edit () {
      let editObj = {
        productId: this.editProduct.productId,
        images: this.images
      }
      this.dialogFormVisible = false
      this.$store.dispatch('editProductImage', editObj)
    }
  },
  computed: {
    isValidForm () {
      return true
    }
  }
}
</script>

<style scoped>

</style>

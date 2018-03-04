<template>
  <div>
    <el-button size="mini" @click="dialogFormVisible = true">
      <i class="el-icon-picture-outline"></i>
    </el-button>
    <!--Image-->
    <el-dialog title="Edit product image" :visible.sync="dialogFormVisible" width="100%" :fullscreen="true">
      <el-row type="flex" justify="center">
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
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="edit" :disabled="!isValidForm">Create</el-button>
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
        </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'EditProductImage',
  props: ['id'],
  data () {
    return {
      dialogFormVisible: false,
      image: null,
      imageUrl: ''
    }
  },
  methods: {
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
        },
    edit () {
      let editObj = {
        productId: this.id,
        image: this.image
      }
      this.dialogFormVisible = false
      this.$store.dispatch('editProductImage', editObj)
    }
  },
  computed: {
    isValidForm () {
      return this.imageUrl !== ''
    }
  }
}
</script>

<style scoped>

</style>

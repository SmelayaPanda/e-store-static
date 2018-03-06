<template>
  <div>
    <el-row type="flex" justify="center" class="mb-2">
        <el-button @click="onPickFile">
            {{ this.imgBtnName }}
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
    <el-row>
        <img :src="imageUrl" :height="this.imageHeight">
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'AddProductImage',
  props: ['imgName', 'imgBtnName'],
  data () {
    return {
      imageUrl: '',
      image: null
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
        this.$emit('fileUploaded', {imgName: this.imgName, image: this.image})
      }
  }
}
</script>

<template>
  <div class="ml-5">
      <h2>Brands</h2>
      <v-btn class="primary"
             @click="addDialogVisible = true">
        <v-icon class="white--text">add</v-icon>
      </v-btn>
    <!--ADD-->
    <el-dialog
      title="Add new brand"
      :visible.sync="addDialogVisible"
      width="30%">
      <el-input v-model="item"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">Cancel</el-button>
        <el-button type="primary"
                   @click="addBrand">Add</el-button>
      </span>
    </el-dialog>
    <!--EDIT-->
    <el-dialog
      :title="`Delete brand ${item}`"
      :visible.sync="deleteDialogVisible"
      width="30%">
      <el-input v-model="item"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="deleteBrand">Delete</el-button>
      </span>
    </el-dialog>

    <el-select v-model="item" placeholder="Brands" v-if="brands">
      <el-option
        v-for="b in brands"
        :key="b"
        :label="b"
        :value="b">
      </el-option>
    </el-select>

    <v-btn class="info" @click="deleteDialogVisible = true" :disabled="!this.item">
      <v-icon class="white--text">delete</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'Brands',
  data () {
    return {
      item: '',
      addDialogVisible: false,
      deleteDialogVisible: false
    }
  },
  methods: {
    addBrand () {
      this.addDialogVisible = false
      let brands = this.brands
      if (brands.indexOf(this.item) === -1) {
        brands.push(this.item)
      }
      this.$store.dispatch('uploadBrands', brands)
    },
    deleteBrand () {
      this.deleteDialogVisible = false
      let brands = this.brands
      brands.splice(brands.indexOf(this.item), 1)
      this.item = ''
      this.$store.dispatch('uploadBrands', brands)
    }
  },
  computed: {
    brands () {
      return this.$store.getters.brands
    }
  }
}
</script>

<style scoped>

</style>

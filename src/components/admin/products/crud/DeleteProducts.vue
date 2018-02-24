<template>
  <div>
    <el-button size="mini"
               type="danger"
               style="margin-left: 2px"
               @click="centerDialogVisible = true">
      <i class="el-icon-delete"></i>
    </el-button>

    <el-dialog
      title="Remove product!"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <p>You want to remove this product?</p>
      <p><b>id: {{ this.id }}</b></p>
      <p><b>Title: {{ this.title }}</b></p>
      <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">Cancel</el-button>
    <el-button type="danger" @click="deleteProduct">Confirm</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'DeleteProduct',
  props: ['id', 'title'],
  data () {
    return {
      centerDialogVisible: false
    }
  },
  methods: {
    deleteProduct () {
      this.$store.dispatch('deleteProduct', this.id)
      this.centerDialogVisible = false
    }
  }
}
</script>

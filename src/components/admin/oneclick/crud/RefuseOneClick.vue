<template>
  <div>
    <el-button type="info" @click="dialogVisible = true">
      <i class="el-icon-close"></i>
    </el-button>
    <el-dialog
      title="Refuse product?"
      :visible.sync="dialogVisible"
      width="500px"
      center>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="danger" @click="refuseOneClick">Confirm</el-button>
      </span>
    </el-dialog>
</div>
</template>

<script>
export default {
  name: 'RefuseOneClick',
  props: ['oneClickId', 'comments'],
  data () {
    return {
      editComments: this.comments,
      dialogVisible: false
    }
  },
  methods: {
    refuseOneClick () {
      this.dialogVisible = false
      let obj = {}
      obj.status = 'refused'
      obj.comments = this.editComments
      obj.refuseDate = new Date()
      this.$store.dispatch('updateOneClick', {
        updateData: obj,
        oneClickId: this.oneClickId
      })
      return true
    }
  },
  computed: {
    oneClick () {
      return this.$store.getters.oneClickById(this.oneClickId)
    }
  }
}
</script>

<style scoped>

</style>

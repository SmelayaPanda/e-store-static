<template>
  <div>
    <el-button @click="dialogVisible = true">
      <v-icon small>flight_land</v-icon>
    </el-button>
    <el-dialog
      title="Product is delivered?"
      :visible.sync="dialogVisible"
      width="500px"
      center>
      <b>Comments:</b><br>
      <el-input v-model="editComments"
                type="textarea"
                placeholder="(max 400 symbols)"
                :autosize="{ minRows: 3, maxRows: 7}"
                :maxlength="400"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="danger" @click="deliverOneClick">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'DeliverOneClick',
  props: ['oneClickId', 'comments'],
  data () {
    return {
      editComments: this.comments,
      dialogVisible: false
    }
  },
  methods: {
    deliverOneClick () {
      this.dialogVisible = false
      let obj = {}
      obj.status = 'delivered'
      obj.comments = this.editComments
      obj.deliveryDate = new Date()
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

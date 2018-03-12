<template>
  <div>
    <el-button type="info" @click="dialogVisible = true">
      <i class="el-icon-close"></i>
    </el-button>
    <el-dialog
      title="Refuse one click!"
      :visible.sync="dialogVisible"
      width="30%"
      center>
      <h3>You want to decline the "Оne Сlick" request?</h3>
      <v-divider class="mt-2 mb-2"></v-divider>
      <p>
        <b v-if="oneClick">
          {{ oneClick.product.title }}
        </b>
      </p>
      <b>From:</b><br> {{ oneClick.nickname }}<br>
      <i class="el-icon-phone"></i> {{ oneClick.phone }}<br>
      <i class="el-icon-message"></i> {{ oneClick.email }}
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
  props: ['oneClickId'],
  data () {
    return {
      dialogVisible: false
    }
  },
  methods: {
    refuseOneClick () {
      this.dialogVisible = false
      let obj = this.oneClick
      obj.status = 'refused'
      obj.refuseDate = new Date()
      this.$store.dispatch('updateOneClick', obj)
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

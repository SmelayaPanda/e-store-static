<template>
  <div>
    <el-button @click="dialogVisible = true">
      <v-icon small>flight_takeoff</v-icon>
    </el-button>
    <el-dialog
      title="Sent product!"
      :visible.sync="dialogVisible"
      width="30%"
      center>
      <p>
        <b v-if="oneClick">
          {{ oneClick.product.title }}
        </b><br>
        {{ oneClick.product.price }} x {{ oneClick.product.qty }} = {{ oneClick.product.price * oneClick.product.qty }} RUB
      </p>
      <b>For:</b><br>
      {{ oneClick.nickname }}<br>
      <i class="el-icon-phone"></i> {{ oneClick.phone }}<br>
      <i class="el-icon-message"></i> {{ oneClick.email }}
      <v-divider class="mt-2 mb-2"></v-divider>
      <b>Address:</b><br>
      City: {{ oneClick.shipping.city }}<br>
      Street: {{ oneClick.shipping.street }}<br>
      Build: {{ oneClick.shipping.build }}<br>
      House: {{ oneClick.shipping.house }}
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="danger" @click="sentOneClick">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SentOneClick',
  props: ['oneClickId'],
  data () {
    return {
      dialogVisible: false
    }
  },
  methods: {
    sentOneClick () {
      this.dialogVisible = false
      let obj = this.oneClick
      obj.status = 'sent'
      obj.sentDate = new Date()
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

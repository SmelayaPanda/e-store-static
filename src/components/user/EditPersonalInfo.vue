<template>
  <span>
    <el-button @click="dialogVisible = true"
               type="text"
               class="button mt-2">
      <i class="el-icon-edit"></i>
      edit info
    </el-button>
  <el-dialog title="Edit personal info"
             width="360px"
             :visible.sync="dialogVisible">
    <el-row type="flex" justify="center">
      <el-col :span="20">
        <el-form label-position="top" label-width="80px">
          <el-form-item label="Firstname">
            <el-input v-model="firstname"></el-input>
          </el-form-item>
          <el-form-item label="Lastname">
            <el-input v-model="lastname"></el-input>
          </el-form-item>
          <el-form-item label="Birthday" prop="birthday">
          <el-date-picker
            v-model="birthday"
            type="date"
            format="yyyy/MM/dd"
            placeholder="Pick a birthday"
            default-value="2000-01-01">
          </el-date-picker>
          </el-form-item>
        </el-form>
          <el-button type="primary"
                     @click="editPersonalInfo"
                     :disabled="!isValidForm">
            Save
          </el-button>
          <el-button @click="dialogVisible = false">Cancel</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</span>
</template>

<script>
export default {
  name: 'EditUserInfo',
  data () {
    let user = this.$store.getters.user
    return {
      dialogVisible: false,
      firstname: user.firstname,
      lastname: user.lastname,
      birthday: user.birthday
    }
  },
  methods: {
    editPersonalInfo () {
      this.dialogVisible = false
      console.log(this.birthday)
      console.log(new Date(this.birthday))
      this.$store.dispatch('editPersonalInfo', {
        firstname: this.firstname,
        lastname: this.lastname,
        birthday: this.birthday
      })
    }
  },
  computed: {
    isValidForm () {
      return this.firstname && this.lastname && this.birthday
    }
  }
}
</script>

<style scoped>

</style>

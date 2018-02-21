<template>
  <v-container>

    <!--Authentication form-->
    <el-row type="flex" justify="center">
      <el-col :xs="24" :sm="14" :md="12" :lg="10" :xl="8">
        <app-alert v-if="error" :text="error.message"></app-alert>
        <el-card>
          <h2>Sign in</h2>
            <v-container>

              <el-form :model="formRule"
                       status-icon
                       :rules="rules"
                       auto-complete="on"
                       ref="formRule"
              >
                <el-form-item label="Email" prop="email">
                  <el-input type="email"
                            :autofocus="true"
                            v-model="formRule.email"
                            auto-complete="on"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="Password" prop="password">
                  <el-input type="password"
                            v-model="formRule.password"
                            auto-complete="off">
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary"
                             :disabled="loading"
                             @click="submitForm('formRule')">Sign In</el-button>
                  <el-button @click="clearForm('formRule')">Clear</el-button>
                </el-form-item>
              </el-form>
            </v-container>
        </el-card>
      </el-col>
    </el-row>
  </v-container>
</template>

<script>
export default {
  name: 'signin',
  data () {
    let checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('Please input the Email'))
      }
      setTimeout(() => {
        if (!this.isValidEmail(value)) {
          callback(new Error('Email is not valid'))
        } else {
          callback()
        }
      }, 1000)
    }
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password'))
      } else {
        if (this.formRule.checkPass !== '') {
          this.$refs.formRule.validateField('checkPass')
        }
        callback()
      }
    }
    return {
      formRule: {
        password: '',
        checkPass: '',
        email: ''
      },
      rules: {
        password: [
          {validator: validatePass, trigger: 'blur'}
        ],
        email: [
          {validator: checkEmail, trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    user:
        function () {
          return this.$store.getters.user
        },
    error:
        function () {
          return this.$store.getters.error
        },
    loading:
        function () {
          return this.$store.getters.loading
        }
  },
  watch: {
    user:
        function (value) {
          if (value !== null && value !== undefined) {
            this.$router.push('/account')
          }
        }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('signUserIn', {email: this.formRule.email, password: this.formRule.password})
        } else {
          return this.$store.dispatch('setError', { message: 'Please, fill in the fields correctly' })
        }
      })
    },
    clearForm (formName) {
      this.$refs[formName].resetFields()
    },
    isValidEmail: function (email) {
      return /^\S+@\S+\.\S+$/.test(email)
    }
  }
}
</script>

<style scoped>
</style>

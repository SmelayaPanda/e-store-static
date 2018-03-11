<template>
<span>
    <el-button v-if="!alreadyAddedProduct"
               size="medium"
               class="mt-3"
               @click="buyOneClick">
    <span style="font-size: 14px">
      Buy one click
    </span>
    <i class="el-icon-check ml-2" style="transform: scale(1.5)"></i>
  </el-button>
  <el-dialog
    :title="`Buy one click: ${productTitle}`"
    width="100%"
    :visible.sync="dialogVisible">
    <!--<h2>{{ productId }}</h2>-->
    <!--<h2>{{ productTitle }}</h2>-->
    <el-row type="flex" justify="center">
      <el-col :xs="23" :sm="14" :md="10" :lg="8" :xl="6">
        <el-form :model="oneClickForm"
                 status-icon
                 :rules="formRules"
                 ref="oneClickForm"
                 label-width="120px"
                 label-position="top"
                 class="demo-ruleForm">
          <el-form-item label="Nickname" prop="nickname">
            <el-input type="text" v-model="oneClickForm.nickname" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input type="email" v-model="oneClickForm.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="Phone" prop="phone">
            <masked-input v-model="oneClickForm.phone"
                          class="el-input__inner"
                          required
                          mask="\+\7 (111) 111-11-11"
                          placeholder="Phone number"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="submitForm('oneClickForm')"
                       :disabled="!isValidForm"
            >
              One Click!
            </el-button>
            <el-button @click="dialogVisible = false">Cancel</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-dialog>
</span>
</template>

<script>
export default {
  name: 'OneClick',
  props: ['alreadyAddedProduct', 'productId', 'productTitle'],
  data () {
    let validateNickname = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input nickname'))
      } else {
        callback()
      }
    }
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
    return {
      dialogVisible: false,
      oneClickForm: {
        nickname: '',
        email: '',
        phone: ''
      },
      formRules: {
        nickname: [
          {validator: validateNickname, trigger: 'blur'}
        ],
        email: [
          {validator: checkEmail, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    buyOneClick () {
      this.dialogVisible = true
    },
    submitForm (formName) {
      this.dialogVisible = false
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    isValidEmail () {
      return /^\S+@\S+\.\S+$/.test(this.oneClickForm.email)
    },
    isValidPhone: function () {
      return this.oneClickForm.phone.replace(/[^0-9]/g, '').length === 11
    }
  },
  computed: {
    isValidForm () {
      return this.isValidPhone() && this.isValidEmail() && this.oneClickForm.nickname
    }
  }
}
</script>

<style scoped>
</style>

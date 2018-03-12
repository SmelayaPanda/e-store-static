<template>
  <span style="text-align: center">
    <el-button size="small" type="primary" @click="dialogFormVisible = true">
      {{ btnName }}
    </el-button>
    <el-dialog title="CHECKOUT"
               v-if="orderItems"
               width="100%"
               :visible.sync="dialogFormVisible"
               :fullscreen="true">
      <el-row style="height: 450px" type="flex" justify="center">
        <el-col :span="12">
          <!--Stepper-->
          <el-row class="mt-4">
          <el-steps :active="activeStep" align-center>
            <el-step title="Personal Details" icon="el-icon-info"></el-step>
            <el-step title="Shipping" icon="el-icon-location"></el-step>
            <el-step title="Review order" icon="el-icon-document"></el-step>
            <el-step title="Payment" icon="el-icon-circle-check-outline"></el-step>
          </el-steps>
          </el-row>
          <!---------->
          <!--Form 1-->
          <el-row type="flex" justify="center" class="mt-5">
            <el-col :span="18">
            <div class="form_1" v-if="activeStep === 1">
              <el-form label-position="top"
                       label-width="100px"
                       status-icon
                       ref="form_1"
                       :rules="formRules_1"
                       :model="form_1">
                <!--EMAIL-->
              <el-form-item label="Email" prop="email">
                <el-input type="email" v-model="form_1.email" auto-complete="on"></el-input>
              </el-form-item>
                <!--NAME-->
                <el-row>
                  <el-col :span="12" class="pr-1">
                    <el-form-item label="Firstname" prop="firstname">
                      <el-input type="text" v-model="form_1.firstname" auto-complete="off"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" class="pl-1">
                    <el-form-item label="Last name" prop="lastname">
                      <el-input v-model="form_1.lastname"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!--PHONE-->
                <el-form-item label="Phone" prop="phone">
                <masked-input v-model="form_1.phone"
                              class="el-input__inner"
                              required
                              mask="\+\7 (111) 111-11-11"
                              placeholder="Phone number"
                />
              </el-form-item>
              </el-form>
            </div>
            </el-col>
          </el-row>
          <!---------->
          <!--Step 2-->
          <el-row type="flex" justify="center">
            <el-col :span="18">
            <div class="form_2" v-if="activeStep === 2">
              <el-form label-position="top"
                       label-width="100px"
                       status-icon
                       ref="form_2"
                       :rules="formRules_2"
                       v-if="activeStep === 2"
                       :model="form_2">
                  <!--COUNTRY-->
                <el-row type="flex">
                  <el-col :span="12" class="pr-1">
                    <el-form-item label="Coutry" prop="country">
                      <el-input v-model="form_2.country"></el-input>
                    </el-form-item>
                  </el-col>
                  <!--CITY-->
                  <el-col :span="12" class="pl-1">
                    <el-form-item label="City" prop="city">
                      <el-input v-model="form_2.city"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!--STREET-->
                <el-form-item label="Street" prop="street">
                  <el-input v-model="form_2.street"></el-input>
                </el-form-item>
                <el-row type="flex">
                <!--HOUSE-->
                  <el-col :span="12" class="pr-1">
                    <el-form-item label="House" prop="house">
                      <el-input v-model="form_2.house"></el-input>
                    </el-form-item>
                  </el-col>
                  <!--POST CODE-->
                  <el-col :span="12" class="pl-1">
                    <el-form-item label="Post code" prop="postCode">
                      <el-input v-model="form_2.postCode"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            </el-col>
          </el-row>
          <!---------->
          <!--Step 3-->
          <el-row type="flex" justify="center">
            <el-col :span="18">
              <div class="form_3" v-if="activeStep === 3">
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur cumque cupiditate dignissimos dolore esse est exercitationem, expedita, labore magnam minima minus molestias nam nobis nostrum officia placeat quisquam ratione sit.</p>
                <el-checkbox class="mb-5">I agree</el-checkbox>
              </div>
            </el-col>
          </el-row>
          <!---------->
          <!--Step 4-->
          <el-row type="flex" justify="center">
              <el-col :span="18">
                <div class="form_4 buy_button" v-if="activeStep === 4">
                    <PayPal
                      env="sandbox"
                      locale="en_US"
                      currency="RUB"
                      :items="this.orderItems"
                      :amount="this.amount"
                      :client="credentials"
                      :buttonStyle="btnStyle"
                      notify-url="https://us-central1-e-store-dev.cloudfunctions.net/processPayPal"
                    >
                    </PayPal>
                </div>
              </el-col>
            </el-row>
            <el-button @click="prevStep" v-if="activeStep !== 1">Prev step</el-button>
            <el-button @click="nextStep"
                       v-if="activeStep !== 4"
                       :type="isValidForm_1 ? 'success' : 'info'"
                       :disabled="!isValidForm_1 || (activeStep === 2 && !isValidForm_2)">
              Next step
             </el-button>
        </el-col>
        <!--ITEMS INFO-->
        <el-col :span="8" class="mt-3 pl-4">
          <el-card>
          <div style="font-size: 16px; margin-bottom: 20px;: 0; padding-top: 0;"
               v-for="item in orderItems" :key="item.description"
          >
            <span style="font-weight: bold;">{{ item.name }}: </span><br>
            <el-tag>{{ item.price }}</el-tag>
            x
            <el-tag>{{ item.quantity }}</el-tag>
            =
            <el-tag class="mb-2">{{ parseFloat(item.price * item.quantity).toFixed(2) }} {{ currency }}</el-tag>
          </div>
          <p>Total: {{ this.amount }} {{ currency }}</p>
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>
  </span>
</template>

<script>
import PayPal from 'vue-paypal-checkout'

export default {
  name: 'BuyOne',
  components: {
    PayPal
  },
  props: ['order-items', 'amount', 'btn-name', 'currency'],
  data () {
    let notEmptyString = (rule, value, callback) => {
      if (!value) {
        callback(new Error('Please fill in the field'))
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
      credentials: {
        sandbox: 'AaTdJiFck5jx4xpaVOjFHkfNO8XZjflSRzYZ3yGbXEHZ43J7upAFabAkRhv1NJPPfDR49F9mqf8rbud4',
        production: 'someId'
      },
      btnStyle: {
        label: 'checkout',
        size: 'responsive', // small | medium | large | responsive
        shape: 'rect', // pill | rect
        color: 'silver' // gold | blue | silver | black
      },
      dialogFormVisible: false,
      activeStep: 1,
      form_1: {
        firstname: 'Alexey',
        lastname: 'Azarov',
        email: 'smelayapanda@mail.ru',
        phone: '999 232 32 3233'
      },
      form_2: {
        country: 'Russia',
        city: 'Novosibirsk',
        street: 'Sirenevaya',
        house: '31',
        postCode: '630090'
      },
      formRules_1: {
        firstname: [
          {validator: notEmptyString, trigger: 'blur'}
        ],
        lastname: [
          {validator: notEmptyString, trigger: 'blur'}
        ],
        email: [
          {validator: checkEmail, trigger: 'blur'}
        ]
      },
      formRules_2: {
        country: [
          {validator: notEmptyString, trigger: 'blur'}
        ],
        city: [
          {validator: notEmptyString, trigger: 'blur'}
        ],
        street: [
          {validator: notEmptyString, trigger: 'blur'}
        ],
        house: [
          {validator: notEmptyString, trigger: 'blur'}
        ],
        postCode: [
          {validator: notEmptyString, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    nextStep () {
      if (this.activeStep < 4) {
        this.activeStep++
      }
    },
    prevStep () {
      if (this.activeStep > 1) {
        this.activeStep--
      }
    },
    isValidEmail () {
      return /^\S+@\S+\.\S+$/.test(this.form_1.email)
    },
    isValidPhone: function () {
      return this.form_1.phone.replace(/[^0-9]/g, '').length === 11
    }
  },
  computed: {
    isValidForm_1 () {
      return this.isValidPhone() && this.isValidEmail() && this.form_1.firstname && this.form_1.lastname
    },
    isValidForm_2 () {
      return this.form_2.country && this.form_2.city && this.form_2.street && this.form_2.house && this.form_2.postCode
    }
  }
}
</script>

<style scoped>
  .buy_button {
    width: 200px;
    height: 100px;
    display:block;
    margin: 30px auto 0;
  }
</style>

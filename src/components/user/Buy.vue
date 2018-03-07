<template>
  <span style="text-align: center">
    <el-button size="small" type="primary" @click="dialogFormVisible = true">
      {{ btnName }}
    </el-button>
    <el-dialog title="CHECKOUT FORM"
               v-if="orderItems"
               width="100%"
               :visible.sync="dialogFormVisible"
               :fullscreen="true">
      <div style="font-size: 18px; margin-bottom: 20px;: 0; padding-top: 0;"
           v-for="item in orderItems" :key="item.description"
      >
        <span style="font-weight: bold;">{{ item.name }}: </span>
        <el-tag>{{ item.price }}</el-tag>
        x
        <el-tag>{{ item.quantity }}</el-tag>
        =
        <el-tag class="mb-2">{{ parseFloat(item.price * item.quantity).toFixed(2) }} {{ currency }}</el-tag>
      </div>
      <p>Total: {{ this.amount }} {{ currency }}</p>
      <!--Stepper-->
      <el-steps :active="activeStep" align-center>
        <el-step title="Personal Details" icon="el-icon-edit"></el-step>
        <el-step title="Shipping" icon="el-icon-location"></el-step>
        <el-step title="Review order" icon="el-icon-document"></el-step>
        <el-step title="Payment" icon="el-icon-circle-check-outline"></el-step>
      </el-steps>
      <el-row style="height: 500px" class="mt-5" type="flex" justify="center">
        <!--Step 1-->
        <div class="form_1" v-if="activeStep === 1">
          <el-form label-position="top" label-width="100px" :model="form_1">
            <el-form-item label="Email" prop="email">
              <el-input type="email"
                        id="email"
                        v-model="form_1.email"
                        auto-complete="on"
              >
              </el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="First name">
                  <el-input v-model="form_1.firstname"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Last name">
                  <el-input v-model="form_1.lastname"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="Birthday">
              <el-input v-model="form_1.birthday"></el-input>
            </el-form-item>
            <el-form-item label="Phone">
              <el-input v-model="form_1.phone"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <!--Step 2-->
        <div class="form_1" v-if="activeStep === 2">
          <el-form label-position="top" label-width="100px" :model="form_2">
            <el-form-item label="Coutry">
              <el-input v-model="form_2.country"></el-input>
            </el-form-item>
            <el-form-item label="City">
              <el-input v-model="form_2.city"></el-input>
            </el-form-item>
            <el-form-item label="Street">
              <el-input v-model="form_2.street"></el-input>
            </el-form-item>
            <el-row type="flex">
              <el-col :span="12">
                <el-form-item label="Home">
                  <el-input v-model="form_2.street"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Post code">
                  <el-input v-model="form_2.post"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!--Step 3-->
        <div class="form_3" v-if="activeStep === 3">
          <el-row type="flex" justify="center">
            <el-col :span="16">
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur cumque cupiditate dignissimos dolore esse est exercitationem, expedita, labore magnam minima minus molestias nam nobis nostrum officia placeat quisquam ratione sit.</p>
            </el-col>
          </el-row>
          <el-checkbox>I agree</el-checkbox>
        </div>
        <!--Step 4-->
        <div class="form_4" v-if="activeStep === 4">
          <div class="buy_button">
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
        </div>
      </el-row>
      <el-button @click="prevStep" v-if="activeStep !== 1">Prev step</el-button>
      <el-button @click="nextStep">Next step</el-button>
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
    return {
      credentials: {
        sandbox: 'AaTdJiFck5jx4xpaVOjFHkfNO8XZjflSRzYZ3yGbXEHZ43J7upAFabAkRhv1NJPPfDR49F9mqf8rbud4',
        production: 'someId'
      },
      btnStyle: {
        label: 'checkout',
        size: 'responsive', // small | medium | large | responsive
        shape: 'rect', // pill | rect
        color: 'blue' // gold | blue | silver | black
      },
      dialogFormVisible: false,
      activeStep: 1,
      form_1: {
        firstname: '',
        lastname: '',
        birthday: '',
        phone: ''
      },
      form_2: {
        country: '',
        city: '',
        street: '',
        home: '',
        post: ''
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
    }
  }
}
</script>

<style scoped>
  .form_1 {
    width: 500px
  }

  .buy_button {
    width: 400px;
    height: 200px;
    margin-top: 50px;
  }
</style>

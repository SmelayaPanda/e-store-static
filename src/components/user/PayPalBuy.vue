<template>
  <div class="buy_button">
    <PayPal
      env="sandbox"
      locale="en_US"
      currency="RUB"
      :items="orderItems"
      :amount="amount"
      :client="credentials"
      :buttonStyle="btnStyle"
      notify-url="https://us-central1-e-store-dev.cloudfunctions.net/processPayPal"
    >
    </PayPal>
  </div>
</template>

<script>
import PayPal from 'vue-paypal-checkout'

export default {
  props: ['orderItems', 'amount'],
  name: 'PayPalBuy',
  components: {
    PayPal
  },
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
        color: 'silver' // gold | blue | silver | black
      }
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

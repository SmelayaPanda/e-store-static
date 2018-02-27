// Function for Handle IPN Notification
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.processPayPal = functions.https.onRequest((req, res) => {
  console.log('-------------------------------------------------------------------------------------------------------')
  const payInfo = req.body
  console.log(payInfo)

  let orderId
  let ordersIds
  admin.database().ref('ordersIds').once('value')
    .then(data => {
      if(!payInfo.txn_id) {
        throw new Error('No valid request object!')
      }
      // [ CHECK TXN ]
      ordersIds = data.val()
      if (ordersIds) {
        for (let order in ordersIds) {
          if (ordersIds.hasOwnProperty(order) && ordersIds[order].txn_id === payInfo.txn_id) {
            throw new Error(`Order ${payInfo.txn_id} already added!`)
          }
        }
      }
      // [ ADD ORDER TO FIREBASE ]
      return admin.database().ref('orders').push(payInfo)
    })
    .then((data) => {
      orderId = data.key
      return admin.database().ref('ordersIds').push({orderId: orderId, txn_id: payInfo.txn_id})
    })
    .then(() => {
      console.log(`PayPal transaction id: ${payInfo.txn_id} / Order farebaseId: ${orderId} /  added!`)
      console.log(`Payer: ${payInfo.first_name} ${payInfo.last_name} ${payInfo.payer_email} -
                            ${payInfo.mc_gross} ${payInfo.mc_currency}`)
      return res.sendStatus(200)
    })
    .catch(err => {
      console.log(err)
      return res.sendStatus(500)
    })
})
// PayPal Instant Payment Notification (IPN) example:

/*
  mc_gross: '33.00',
  mc_currency: 'RUB',
  mc_fee: '11.29',

  item_name: '',
  item_number: '',
  quantity: '1',

  txn_id: '2WF37480SF103400W',
  txn_type: 'express_checkout',

  payment_date: '05:47:49 Feb 27, 2018 PST',
  payment_status: 'Completed',               / Pending, Completed
  payment_type: 'instant',
  payment_fee: '',
  payment_gross: '',

  payer_id: 'WMBNWF9MFNXZ8',
  payer_status: 'verified',
  payer_email: 'person_panda@gmail.com',
  first_name: 'Vika',
  last_name: 'Zayceva',
  address_state: 'Москва',
  address_country: 'Russia',
  address_city: 'Москва',
  address_zip: '127001',
  address_country_code: 'RU',
  address_name: 'Zayceva Vika',
  address_status: 'confirmed',
  address_street: 'улица Первая, дом 1, квартира 2',


  business: 'business_panda@gmail.com',
  receiver_email: 'business_panda@gmail.com',
  receiver_id: 'GKSKY7AXVQ48S',


  protection_eligibility: 'Eligible',
  charset: 'KOI8_R',
  notify_version: '3.9',
  custom: '',
  verify_sign: 'AZrBO1E8R-CynzOZ1Cjgvc7kA38xAWL1aMAiNY85I0gS-5OW1AvZseYY',


  residence_country: 'RU',
  test_ipn: '1',
  transaction_subject: '',
  ipn_track_id: '3b21f369b7bab'
* */

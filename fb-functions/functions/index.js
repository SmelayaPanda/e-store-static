/* eslint-disable promise/always-return */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.processPayPal = functions.https.onRequest((req, res) => {
  console.log('----------------------------------------------------------')
  const payInfo = req.body

  let orderId
  let ordersIds
  admin.database().ref('ordersIds').once('value')
    .then(data => {
      if(!payInfo.txn_id) {
        throw new Error('No valid request object!')
      }
      // [ CHECK TXN ]
      ordersIds = data.val()
      if(ordersIds) {
        for (let order in ordersIds) {
          if (ordersIds[order].txn_id === payInfo.txn_id) {
            throw new Error(`Order ${payInfo.txn_id} already added!`)
          }
        }
      }
    })
    // [ ADD ORDER TO FIREBASE ]
    .then(() => {
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


//  ALL RESPONSE PARAMETERS
// -------------------------
// Info about the PAYMENT:
//   mc_gross: '540.00',
//   mc_currency: 'RUB',
//   quantity: '1',
//   item_name: '',
//   item_number: '',
//   payment_date: '02:54:17 Feb 26, 2018 PST',
//   payment_status: 'Pending',

// ---------------------------------------------------
//   payment_status: 'Completed', --- changed when business verified
// ---------------------------------------------------

//   payment_type: 'instant',
//   payment_gross: '',
//   txn_id: '6TT03235VV6182257', // transaction ID (Keep this ID to avoid processing the transaction twice!)
//   custom: '',                  // Your custom field
//
//
//   // Info about PAYER
//   address_status: 'confirmed',
//   address_street: '1 Main St',
//   address_zip: '95131',
//   address_state: 'CA',
//   address_city: 'San Jose',
//   address_country: 'United States',
//   address_name: 're high',
//   address_country_code: 'US',
//
//   first_name: 're',
//   last_name: 'high',
//   payer_id: 'T7SZQ2MZWEYTN',
//   payer_email: 'rehigh_p@gmail.com',
//   payer_status: 'verified',
//
//
//   // BUSINESS
//   business:       'rehigh_b@gmail.com',
//   receiver_email: 'rehigh_b@gmail.com',
//   receiver_id:    '6M9996XM7LWL6',
//   pending_reason: 'paymentreview',
//
//   // OTHER
//   verify_sign: 'AfQZ8JXN3447m31txmgI-snkBnbFAZ6K3UBgGiwRtsbpTBGCVUqGVVrE',
//   txn_type: 'express_checkout',
//   residence_country: 'US',
//   test_ipn: '1',              -- Testing with the Sandbox
//   transaction_subject: '',
//   ipn_track_id: '13ece3426cd23'
//   notify_version: '3.9',
//   charset: 'windows-1252',
//   protection_eligibility: 'Eligible',

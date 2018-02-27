
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


// [ COMPLETED ]


// { id: 'WH-4YK32483B38864445-4LK20675K3768162K',
//   event_version: '1.0',
//   create_time: '2018-02-27T07:46:03.387Z',
//   resource_type: 'sale',
//   event_type: 'PAYMENT.SALE.COMPLETED',
//   summary: 'A RUB 144.0 RUB pending sale payment was completed',
//   resource:
//   { id: '4VN03939SP657040R',
//     state: 'completed',
//     amount: { total: '144.00', currency: 'RUB', details: [Object] },
//     payment_mode: 'INSTANT_TRANSFER',
//     protection_eligibility: 'ELIGIBLE',
//     protection_eligibility_type: 'ITEM_NOT_RECEIVED_ELIGIBLE,UNAUTHORIZED_PAYMENT_ELIGIBLE',
//     transaction_fee: { value: '14.18', currency: 'RUB' },
//     invoice_number: '',
//     parent_payment: 'PAY-9FN11423NA051033PLKKQXVI',
//     create_time: '2018-02-27T07:42:50Z',
//     update_time: '2018-02-27T07:45:35Z',
//     links: [ [Object], [Object], [Object] ] },
//   links:
//     [ { href: 'https://api.sandbox.paypal.com/v1/notifications/webhooks-events/WH-4YK32483B38864445-4LK20675K3768162K',
//       rel: 'self',
//       method: 'GET' },
//       { href: 'https://api.sandbox.paypal.com/v1/notifications/webhooks-events/WH-4YK32483B38864445-4LK20675K3768162K/resend',
//         rel: 'resend',
//         method: 'POST' } ] }

// [ PENDING ]

//{ id: 'WH-21L98311904404408-13S91423KV893502M',
//   event_version: '1.0',
//   create_time: '2018-02-27T07:43:03.222Z',
//   resource_type: 'sale',
//   event_type: 'PAYMENT.SALE.PENDING',
//   summary: 'Payment pending for RUB 144.0 RUB',
//   resource:
//    { id: '4VN03939SP657040R',
//      state: 'pending',
//      amount: { total: '144.00', currency: 'RUB', details: [Object] },
//      payment_mode: 'INSTANT_TRANSFER',
//      reason_code: 'RECEIVING_PREFERENCE_MANDATES_MANUAL_ACTION',
//      protection_eligibility: 'ELIGIBLE',
//      protection_eligibility_type: 'ITEM_NOT_RECEIVED_ELIGIBLE,UNAUTHORIZED_PAYMENT_ELIGIBLE',
//      invoice_number: '',
//      parent_payment: 'PAY-9FN11423NA051033PLKKQXVI',
//      create_time: '2018-02-27T07:42:50Z',
//      update_time: '2018-02-27T07:42:50Z',
//      links: [ [Object], [Object], [Object] ] },
//   links:
//    [ { href: 'https://api.sandbox.paypal.com/v1/notifications/webhooks-events/WH-21L98311904404408-13S91423KV893502M',
//        rel: 'self',
//        method: 'GET' },
//      { href: 'https://api.sandbox.paypal.com/v1/notifications/webhooks-events/WH-21L98311904404408-13S91423KV893502M/resend',
//        rel: 'resend',
//        method: 'POST' } ] }



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

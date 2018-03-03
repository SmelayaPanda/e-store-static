exports.handler = function (req, res, db) {
  console.log('-------------------------------------------------------------------------------------------------------');
  const payInfo = req.body;

  let handlePaymentOrder = new Promise((resolve, reject) => {
    if (!payInfo.txn_id) {
      reject(Error('Invalid payment order!'))
    } else if (!payInfo.transaction_subject) {
      reject(Error('Transaction subject is Empty!'))
    } else {
      resolve(payInfo.transaction_subject.split(','))
    }
  });

  let userId;
  let orderId;
  let cartIds;

  handlePaymentOrder
    .then((data) => {
      cartIds = data;
      console.log(cartIds);
      return db.ref('cart_user').child(cartIds[0]).once('value')
    })
    .then(data => {
      userId = data.val();
      return db.ref(`users/${userId}/orders`).push(payInfo)
    })
    .then((data) => {
      orderId = data.key;
      return db.ref('order_user').update({[orderId]: userId})
    })
    .then(() => {
      cartIds.forEach(cartId => {
        if (cartId) { // can be empty string
          db.ref(`users/${userId}/carts`).child(cartId).update({isPayed: true, orderId: orderId})
        }
      });
      logPaymentInfo(payInfo, orderId);
      return res.sendStatus(200)
    })
    .catch(err => {
      console.log(err);
      return res.sendStatus(500)
    })
};

function logPaymentInfo(payInfo, orderId) {
  console.log(`PayPal transaction id: ${payInfo.txn_id} / Order farebaseId: ${orderId} /  added!`);
  console.log(`Payer: ${payInfo.first_name} ${payInfo.last_name} ${payInfo.payer_email} -
                            ${payInfo.mc_gross} ${payInfo.mc_currency}`)
}

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

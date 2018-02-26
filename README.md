# e-store-static

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


PayPal response

{
    // Info about the PAYMENT:
  mc_gross: '540.00',
  mc_currency: 'RUB',
  quantity: '1',
  item_name: '',
  item_number: '',
  payment_date: '02:54:17 Feb 26, 2018 PST',
  payment_status: 'Pending',
  payment_type: 'instant',
  payment_gross: '',
  txn_id: '6TT03235VV6182257', // transaction ID (Keep this ID to avoid processing the transaction twice!)
  custom: '',   // Your custom field



    // Info about PAYER
  address_status: 'confirmed',
  address_street: '1 Main St',
  address_zip: '95131',
  address_state: 'CA',
  address_city: 'San Jose',
  address_country: 'United States',
  address_name: 're high',
  address_country_code: 'US',

  first_name: 're',
  last_name: 'high',
  payer_id: 'T7SZQ2MZWEYTN',
  payer_email: 'rehigh_p@gmail.com',
  payer_status: 'verified',


  // BUSINESS
  business:       'rehigh_b@gmail.com',
  receiver_email: 'rehigh_b@gmail.com',
  receiver_id:    '6M9996XM7LWL6',
  pending_reason: 'paymentreview',

  // OTHER
  verify_sign: 'AfQZ8JXN3447m31txmgI-snkBnbFAZ6K3UBgGiwRtsbpTBGCVUqGVVrE',
  txn_type: 'express_checkout',
  residence_country: 'US',
  test_ipn: '1',              -- Testing with the Sandbox
  transaction_subject: '',
  ipn_track_id: '13ece3426cd23'
  notify_version: '3.9',
  charset: 'windows-1252',
  protection_eligibility: 'Eligible',
   }

// After accepting -

{ mc_gross: '540.00',
  settle_amount: '15.42',     ---- add
  protection_eligibility: 'Ineligible',  --- changed
  address_status: 'confirmed',
  payer_id: 'T7SZQ2MZWEYTN',
  tax: '0.00',                   --- add
  address_street: '1 Main St',
  payment_date: '02:54:17 Feb 26, 2018 PST',

  ---------------------------------------------------
  payment_status: 'Completed', --------------- changed
  ---------------------------------------------------

  charset: 'windows-1252',
  address_zip: '95131',
  first_name: 're',
  mc_fee: '25.66',             ----- added
  address_country_code: 'US',
  exchange_rate: '0.0299944',  ----- added
  address_name: 're high',
  notify_version: '3.9',
  settle_currency: 'USD',
  custom: '',
  payer_status: 'verified',
  address_country: 'United States',
  address_city: 'San Jose',
  quantity: '1',
  verify_sign: 'AJ5elIYM5D9HHOkI9idy6dxdP9I3ASp0pCte3IDx.dgVMgoAREF.Wp9V',
  payer_email: 'rehigh_p@gmail.com',
  txn_id: '6TT03235VV6182257',
  payment_type: 'instant',
  last_name: 'high',
  address_state: 'CA',
  receiver_email: 'rehigh_b@gmail.com',
  payment_fee: '',
  shipping_discount: '0.00',
  insurance_amount: '0.00',
  receiver_id: '6M9996XM7LWL6',
  txn_type: 'express_checkout',
  item_name: '',
  discount: '0.00',
  mc_currency: 'RUB',
  item_number: '',
  residence_country: 'US',
  test_ipn: '1',
  shipping_method: 'Default',
  handling_amount: '0.00',
  transaction_subject: '',
  payment_gross: '',
  shipping: '0.00',
  ipn_track_id: 'c98c1e9f46312' }

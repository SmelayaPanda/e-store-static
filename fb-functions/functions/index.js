// Function for Handle IPN Notification
'use strict'
const processPayPal = require('./sub_functions/processPayPal')
const generateProductImages = require('./sub_functions/generateProductImages')
const oneClickNotification = require('./sub_functions/oneClickNotification')
const productHandlers = require('./sub_functions/productHandlers')
const orderHandlers = require('./sub_functions/orderHandlers')

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

global.ADMIN_EMAIL = 'SmelayaPandaGM@gmail.com'
let nodemailer = require('nodemailer')
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ADMIN_EMAIL,
    pass: '***'
  }
});

// ---------------------------[ ALL FUNCTIONS ]---------------------------
// PAYPAL
exports.processPayPal = functions.https.onRequest((req, res) => {
  processPayPal.handler(req, res, admin, transporter)
})

// ONE CLICK
exports.oneClickNotification = functions.https.onRequest((req, res) => {
  oneClickNotification.handler(req, res, admin, transporter)
})

// PRODUCT IMAGES
exports.generateProductImages = functions.storage.object().onChange((event) => {
  return generateProductImages.handler(event, admin)
})

// PRODUCT HANDLERS:
// 1. ALGOLIA SEARCH
// 2. STATISTICS
// Now, product updated after insertion (.onWrite not necessary)
exports.onProductUpdated = functions.firestore.document('products/{productId}').onUpdate((event) => {
  return productHandlers.updateProductHandler(event, functions, admin)
})
exports.onProductDeleted = functions.firestore.document('products/{productId}').onDelete((event) => {
  return productHandlers.deleteProductHandler(event, functions, admin)
})


// ORDER HANDLERS:
// 1. STATISTICS
exports.onOrderUpdated = functions.firestore.document('orders/{orderId}').onUpdate((event) => {
  return orderHandlers.updateOrderHandler(event, functions, admin)
})

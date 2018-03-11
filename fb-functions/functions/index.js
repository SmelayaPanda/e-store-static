// Function for Handle IPN Notification
'use strict'
const processPayPal = require('./sub_functions/processPayPal')
const generateProductImages = require('./sub_functions/generateProductImages')
const oneClickNotification = require('./sub_functions/oneClickNotification')

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.database();

// PAYPAL
exports.processPayPal = functions.https.onRequest((req, res) => {
  processPayPal.handler(req, res, db)
})

// ONE CLICK
exports.oneClickNotification = functions.https.onRequest((req, res) => {
  oneClickNotification.handler(req, res, db)
})

// PRODUCT IMAGES
exports.generateProductImages = functions.storage.object().onChange((event) => {
  return generateProductImages.handler(event, admin)
})

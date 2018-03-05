// Function for Handle IPN Notification
'use strict'
const processPayPal = require('./sub_functions/processPayPal')
const generateProductThumbnail = require('./sub_functions/generateProductThumbnail')

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.database();

exports.processPayPal = functions.https.onRequest((req, res) => {
  processPayPal.handler(req, res, db)
})

exports.generateProductThumbnail = functions.storage.object().onChange((event) => {
  generateProductThumbnail.handler(event, admin)
})

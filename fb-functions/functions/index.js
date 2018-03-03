// Function for Handle IPN Notification
'use strict'
const processPayPal = require('./sub_functions/processPayPal')

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.database();

exports.processPayPal = functions.https.onRequest((req, res) => {
  console.log(req.body)
  processPayPal.handler(req, res, db)
})

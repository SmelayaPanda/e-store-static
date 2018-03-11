const cors = require('cors')({origin: true});

exports.handler = function (req, res, admin) {
  cors(req, res, () => {
    // console.log(req.query.text)
    let info = req.body
    info.creationDate = new Date()
    admin.firestore().collection('oneclick').add(info)
      .then(() => {
        console.log('One click message added into database!')
        return sendOneClickEmailNotification(info)
      })
      .then(() => {
        return res.status(200).send('OK')
      })
      .catch(err => {
        console.log(err)
        return res.status(500).send('Error saving into database!')
      })
  });
}

function sendOneClickEmailNotification(info) {
  let nodemailer = require('nodemailer')

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'SmelayaPandaGM@gmail.com',
      pass: '***'
    }
  });

  let mailOptions = {
    from: 'SmelayaPandaGM@gmail.com',
    to: 'SmelayaPanda@mail.ru',
    subject: `New one click message from ${info.nickname}`,
    text:
      `Re:High Store One Click message:
     
       WHO:
       Nickname ........... ${info.nickname}
       Email .................. ${info.email}
       Phone ................. ${info.phone}
       
       
       WANT TO BUY:
       Vendor Code ....... ${info.product.vendorCode}
       Title ...................... ${info.product.title}
       Price .................... ${info.product.price} RUB
       `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

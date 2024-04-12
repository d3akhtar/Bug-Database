var nodemailer = require('nodemailer');
var webMail = 'bugbytes123@gmail.com';
var webMailPass = 'ppmzynniahaneegl';   // Find secure way to hold this (hash,bycrypt)
var subjectList = ['Bug #id has been resolved', 'Bug #id has been modified'];

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: webMail,
    pass: webMailPass
  }
});

var singleSend = {
  from: webMail,
  to: 'myfriend@yahoo.com',
  subject: subjectList[0],
  text: 'Glad, that was over!'
};

var multipleSend = {
  from: webMail,
  to: 'myfriend@yahoo.com, myotherfriend@yahoo.com',
  subject: subjectList[1],
  text: 'Here are some changes, view the site for more details: '
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

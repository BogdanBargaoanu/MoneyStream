const nodemailer = require('nodemailer');
require('dotenv').config();

// Transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 587, // Replace with your SMTP server port
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER, // Replace with your SMTP server email
        pass: process.env.SMTP_PASS // Replace with your SMTP server password
    }
});

const sendEmail = (to, subject, text, html) => {
    const mailOptions = {
        from: `"MoneyStream" <${process.env.SMTP_USER}>`, // Replace with your sender address
        to: to, // List of receivers
        subject: subject, // Subject line
        text: text, // Plain text body
        html: html // HTML body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
};

module.exports = sendEmail;
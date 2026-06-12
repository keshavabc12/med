const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Configure the transporter
    // NOTE: This requires EMAIL_USER and EMAIL_PASS in backend/.env
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'cherishyapharma@gmail.com',
        pass: process.env.EMAIL_PASS || '', 
      },
    });

    // If no password is provided in .env, simulate the email send to prevent crashing
    if (!process.env.EMAIL_PASS) {
      console.warn("EMAIL_PASS not found in .env. Simulating email sending for dev purposes:");
      console.log(`From: ${name} <${email}>\nTo: cherishyapharma@gmail.com\nMessage: ${message}`);
      return res.status(200).json({ success: true, message: 'Message logged (Simulated Email).' });
    }

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: 'cherishyapharma@gmail.com', // Sent to company email
      subject: `Website Enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: 'Failed to send email. Please check your credentials.' });
  }
});

module.exports = router;

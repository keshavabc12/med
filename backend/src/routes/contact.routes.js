const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const emailUser = (process.env.EMAIL_USER || 'cherishyapharma@gmail.com').trim();
    const emailPass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');
    const companyEmail = (process.env.COMPANY_EMAIL || 'cherishyapharma@gmail.com').trim();

    // If no app password is configured, simulate the send for dev purposes
    if (!emailPass) {
      console.warn('⚠️  EMAIL_PASS not set in .env — simulating email send.');
      console.log(`── Simulated Email ──`);
      console.log(`From: ${name} <${email}>`);
      console.log(`To: ${companyEmail}`);
      console.log(`Subject: Website Enquiry from ${name}`);
      console.log(`Body:\n${message}`);
      console.log(`─────────────────────`);
      return res.status(200).json({
        success: true,
        message: 'Message received successfully! (Email simulated in dev mode)',
      });
    }

    // Configure the Gmail transporter using App Password
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // false for 587 (STARTTLS)
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        rejectUnauthorized: false, // avoids issues with self-signed certificates or cloud firewalls
      },
      connectionTimeout: 15000, // 15 seconds timeout
      greetingTimeout: 15000,
      socketTimeout: 15000,
      debug: true,
      logger: true,
    });

    const mailOptions = {
      // Gmail ignores arbitrary "from" — always sends as the authenticated user.
      // We put the visitor's info in Reply-To so the company can reply directly.
      from: `"Cherishya Pharma Website" <${emailUser}>`,
      replyTo: `"${name}" <${email}>`,
      to: companyEmail,
      subject: `Website Enquiry from ${name}`,
      text: [
        `You received a new enquiry from your website.`,
        ``,
        `Name:    ${name}`,
        `Email:   ${email}`,
        ``,
        `Message:`,
        `${message}`,
      ].join('\n'),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0d9488, #065f46); padding: 24px; border-radius: 12px 12px 0 0;">
            <h2 style="color: #fff; margin: 0;">New Website Enquiry</h2>
          </div>
          <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 80px;">Name:</td>
                <td style="padding: 8px 0; color: #1e293b;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #0d9488;">${email}</a></td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
            <p style="color: #64748b; font-weight: 600; margin-bottom: 8px;">Message:</p>
            <p style="color: #1e293b; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 16px;">
            Sent via Cherishya Pharma website contact form
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({
      error: 'Failed to send your message. Please try again later.',
    });
  }
});

module.exports = router;

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
    const brevoApiKey = (process.env.BREVO_API_KEY || '').trim();

    const emailHtml = `
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
    `;

    // 1. If Brevo API key is available, use Brevo's HTTP API (highly recommended for Render free tier)
    if (brevoApiKey) {
      console.log('Sending email via Brevo HTTP API...');
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': brevoApiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'Cherishya Pharma Website', email: emailUser },
          to: [{ email: companyEmail, name: 'Cherishya Pharma' }],
          replyTo: { email: email, name: name },
          subject: `Website Enquiry from ${name}`,
          htmlContent: emailHtml,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Brevo API responded with status ${response.status}: ${errText}`);
      }

      return res.status(200).json({ success: true, message: 'Email sent successfully via Brevo!' });
    }

    // 2. If no App Password or Brevo API Key is configured, simulate the send in Dev Mode
    if (!emailPass) {
      console.warn('⚠️ EMAIL_PASS and BREVO_API_KEY not set — simulating email send.');
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

    // 3. Fallback to Nodemailer SMTP (e.g. for localhost)
    console.log('Sending email via Nodemailer SMTP...');
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // false for 587 (STARTTLS)
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
      debug: true,
      logger: true,
    });

    const mailOptions = {
      from: `"Cherishya Pharma Website" <${emailUser}>`,
      replyTo: `"${name}" <${email}>`,
      to: companyEmail,
      subject: `Website Enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: emailHtml,
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

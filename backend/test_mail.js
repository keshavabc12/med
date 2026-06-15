require('dotenv').config();
const nodemailer = require('nodemailer');

async function test() {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  
  console.log("USER:", emailUser);
  console.log("PASS:", emailPass);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  try {
    await transporter.verify();
    console.log("Transporter is ready");
    const info = await transporter.sendMail({
      from: emailUser,
      to: process.env.COMPANY_EMAIL,
      subject: "Test",
      text: "Test email"
    });
    console.log("Sent", info.response);
  } catch(e) {
    console.error("Error:", e);
  }
}

test();

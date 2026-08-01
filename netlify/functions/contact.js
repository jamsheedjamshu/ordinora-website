import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_TO'];

function getBody(req) {
  if (!req || !req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch (error) {
      return {};
    }
  }
  return req.body;
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Method not allowed.' })
    };
  }

  const missingEnv = requiredEnv.filter((key) => !process.env[key]);
  if (missingEnv.length) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Missing environment variables: ${missingEnv.join(', ')}`
      })
    };
  }

  const body = getBody(req);
  const { fullName, companyName = '', email, service, message } = body || {};

  if (!fullName || !email || !service || !message) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Please complete all required fields.' })
    };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Please enter a valid email address.' })
    };
  }

  const recipient = process.env.SMTP_TO || 'info.ordinorabn@gmail.com';
  const now = new Date();
  const date = now.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: recipient,
    replyTo: email,
    subject: 'New Enquiry from Ordinora Website',
    text: `--------------------------------------------------\nNew Enquiry Received\n\nFull Name:\n${fullName}\n\nCompany Name:\n${companyName || 'N/A'}\n\nEmail Address:\n${email}\n\nService of Interest:\n${service}\n\nMessage:\n${message}\n\nSubmitted On:\n${date} ${time}\n--------------------------------------------------`
  };

  try {
    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Enquiry sent successfully.' })
    };
  } catch (error) {
    console.error('Contact form submission failed:', error);

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Sorry, there was a problem sending your enquiry. Please try again later.'
      })
    };
  }
}

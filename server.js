import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
console.log(dotenv.config());
console.log("SMTP_HOST:", process.env.SMTP_HOST);

const app = express();
const port = process.env.PORT || 3001;

const requiredEnv = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_TO'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length) {
  console.warn(`Warning: Missing environment variables: ${missingEnv.join(', ')}`);
}

app.use(express.json({ limit: '1mb' }));

app.post('/api/contact', async (req, res) => {
  try {
    const { fullName, companyName = '', email, service, message } = req.body || {};

    if (!fullName || !email || !service || !message) {
      return res.status(400).json({ message: 'Please complete all required fields.' });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
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

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Enquiry sent successfully.' });
  } catch (error) {
    console.error('Contact form submission failed:', error);
    return res.status(500).json({
      message: 'Sorry, there was a problem sending your enquiry. Please try again later.'
    });
  }
});

app.listen(port, () => {
  console.log(`Email server listening on http://localhost:${port}`);
});

import nodemailer from "nodemailer";

const requiredEnv = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_TO"
];

export default async (request) => {
  // Only allow POST requests
  if (request.method !== "POST") {
    return Response.json(
      { message: "Method not allowed." },
      { status: 405 }
    );
  }

  // Check environment variables
  const missingEnv = requiredEnv.filter((key) => !process.env[key]);

  if (missingEnv.length) {
    return Response.json(
      {
        message: `Missing environment variables: ${missingEnv.join(", ")}`
      },
      { status: 500 }
    );
  }

  let body;

  try {
    body = await request.json();
  } catch (err) {
    return Response.json(
      { message: "Invalid request body." },
      { status: 400 }
    );
  }

  const {
    fullName,
    companyName = "",
    email,
    service,
    message
  } = body;

  if (!fullName || !email || !service || !message) {
    return Response.json(
      {
        message: "Please complete all required fields."
      },
      { status: 400 }
    );
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return Response.json(
      {
        message: "Please enter a valid email address."
      },
      { status: 400 }
    );
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const now = new Date();

  const date = now.toLocaleDateString("en-CA");

  const time = now.toLocaleTimeString("en-GB", {
    hour12: false
  });

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.SMTP_TO,
    replyTo: email,
    subject: "New Enquiry from Ordinora Website",
    text: `
--------------------------------------------------
New Enquiry Received

Full Name:
${fullName}

Company Name:
${companyName || "N/A"}

Email Address:
${email}

Service of Interest:
${service}

Message:
${message}

Submitted On:
${date} ${time}

--------------------------------------------------
`
  };

  try {
    await transporter.sendMail(mailOptions);

    const confirmationMailOptions = {
      from: "Ordinora Business Services <info@ordinorabs.com>",
      to: email,
      replyTo: "info@ordinorabs.com",
      subject: "Thank you for contacting Ordinora Business Services",
      text: `Dear ${fullName},\n\nThank you for contacting Ordinora Business Services Sdn Bhd.\n\nWe have successfully received your enquiry.\n\nOur team will review your request and respond as soon as possible.\n\nWe appreciate the opportunity to assist you.\n\nSubmitted Details:\nName: ${fullName}\nCompany: ${companyName || "N/A"}\nEmail: ${email}\nService Requested: ${service}\nMessage: ${message}\nDate & Time: ${date} ${time}\n\nEmail: info@ordinorabs.com\nWebsite: https://ordinorabs.com\n\nThank you for choosing Ordinora.\n\nIntegrity • Professionalism • Business Excellence\n\n© Ordinora Business Services Sdn Bhd`,
      html: `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0; padding:32px 16px; background-color:#F6F5EF; font-family:Arial, Helvetica, sans-serif; color:#13251B;">
    <div style="max-width:600px; margin:0 auto;">
      <div style="background-color:#FFFFFF; border-radius:20px; overflow:hidden; box-shadow:0 14px 32px rgba(14,44,33,0.08); border:1px solid rgba(14,44,33,0.08);">
        <div style="background:linear-gradient(135deg, #0E2C21 0%, #163D2D 100%); padding:32px 24px 28px; text-align:center;">
          <img
            src="https://ordinorabs.com/assets/images/logo.png"
            alt="Ordinora Business Services Sdn Bhd"
            width="180"
            style="display:block; margin:0 auto 24px; max-width:180px; height:auto;"
          >
          <h1 style="margin:0; color:#FFFFFF; font-size:28px; line-height:1.2; font-weight:700; letter-spacing:0.5px; text-align:center;">THANK YOU!</h1>
          <p style="margin:12px 0 0; color:#BE7A3D; font-size:15px; line-height:1.6; font-weight:700; text-align:center;">Your enquiry has been received successfully.</p>
        </div>

        <div style="padding:32px 28px 20px;">
          <p style="margin:0 0 18px; font-size:18px; color:#13251B; line-height:1.6; text-align:center;">Dear ${fullName},</p>

          <p style="margin:0 0 18px; font-size:16px; color:#13251B; line-height:1.8; text-align:left;">
            Thank you for contacting Ordinora Business Services Sdn Bhd.
          </p>

          <p style="margin:0 0 18px; font-size:16px; color:#13251B; line-height:1.8; text-align:left;">
            We have successfully received your enquiry and our team will review it as soon as possible.
          </p>

          <p style="margin:0 0 24px; font-size:16px; color:#13251B; line-height:1.8; text-align:left;">
            We appreciate the opportunity to assist you and look forward to speaking with you soon.
          </p>

          <div style="background-color:#F6F5EF; border:1px solid rgba(19,37,27,0.12); border-radius:16px; padding:20px; margin:0 0 24px; box-shadow:inset 0 1px 0 rgba(255,255,255,0.7);">
            <h2 style="margin:0 0 18px; font-size:20px; color:#0E2C21; font-weight:700;">Submitted Details</h2>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse; font-size:14px; color:#13251B;">
              <tr>
                <td style="padding:10px 0; font-weight:700; width:40%; color:#0E2C21; vertical-align:top;">Name</td>
                <td style="padding:10px 0; color:#13251B;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding:10px 0; font-weight:700; color:#0E2C21; vertical-align:top;">Company</td>
                <td style="padding:10px 0; color:#13251B;">${companyName || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding:10px 0; font-weight:700; color:#0E2C21; vertical-align:top;">Email</td>
                <td style="padding:10px 0; color:#13251B;">${email}</td>
              </tr>
              <tr>
                <td style="padding:10px 0; font-weight:700; color:#0E2C21; vertical-align:top;">Service Requested</td>
                <td style="padding:10px 0; color:#13251B;">${service}</td>
              </tr>
              <tr>
                <td style="padding:10px 0; font-weight:700; color:#0E2C21; vertical-align:top;">Message</td>
                <td style="padding:10px 0; color:#13251B; line-height:1.6;">${message.replace(/\n/g, "<br />")}</td>
              </tr>
              <tr>
                <td style="padding:10px 0; font-weight:700; color:#0E2C21; vertical-align:top;">Date &amp; Time</td>
                <td style="padding:10px 0; color:#13251B;">${date} ${time}</td>
              </tr>
            </table>
          </div>

          <div style="text-align:center; margin:0 0 22px;">
            <a href="https://ordinorabs.com" style="display:inline-block; background-color:#0E2C21; color:#FFFFFF; text-decoration:none; font-size:14px; font-weight:700; padding:12px 24px; border-radius:999px;">Visit Our Website</a>
          </div>

          <div style="border-top:2px solid rgba(190,122,61,0.25); padding-top:18px; margin-bottom:18px;">
            <p style="margin:0 0 10px; font-size:15px; color:#13251B; line-height:1.7; text-align:left;">
              <strong style="color:#0E2C21;">Email:</strong> info@ordinorabs.com<br>
              <strong style="color:#0E2C21;">Website:</strong> https://ordinorabs.com
            </p>
          </div>

          <div style="text-align:center; padding-top:8px;">
            <p style="margin:0 0 10px; font-size:13px; font-weight:700; color:#0E2C21;">Follow Us</p>
            <div style="display:inline-block;">
              <a href="https://www.facebook.com" style="color:#0E2C21; text-decoration:none; margin:0 8px; font-weight:700;">Facebook</a>
              <a href="https://www.instagram.com" style="color:#0E2C21; text-decoration:none; margin:0 8px; font-weight:700;">Instagram</a>
              <a href="https://www.linkedin.com" style="color:#0E2C21; text-decoration:none; margin:0 8px; font-weight:700;">LinkedIn</a>
            </div>
          </div>
        </div>

        <div style="padding:0 28px 30px; text-align:center; background-color:#FFFFFF;">
          <p style="margin:0; color:#0E2C21; font-size:15px; font-weight:700;">Thank you for choosing Ordinora.</p>
          <p style="margin:12px 0 0; color:#BE7A3D; font-size:13px; font-weight:700; letter-spacing:0.5px;">Integrity • Professionalism • Business Excellence</p>
          <p style="margin:18px 0 0; color:#13251B; font-size:12px;">Kind regards,<br><strong>Ordinora Business Services Sdn Bhd</strong><br>© Ordinora Business Services Sdn Bhd</p>
        </div>
      </div>
    </div>
  </body>
</html>`
    };

    try {
      await transporter.sendMail(confirmationMailOptions);
      console.log("Confirmation email sent successfully.");
    } catch (err) {
      console.error("Confirmation email failed:", err);
    }

    console.log("Email sent successfully.");

    return Response.json(
      {
        message: "Enquiry sent successfully."
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("SMTP Error:", error);

    return Response.json(
      {
        message:
          "Sorry, there was a problem sending your enquiry. Please try again later."
      },
      { status: 500 }
    );
  }
};
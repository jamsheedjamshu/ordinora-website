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
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      replyTo: process.env.SMTP_TO || process.env.SMTP_USER,
      subject: "Thank You for Contacting Ordinora Business Services",
      text: `Dear ${fullName},\n\nThank you for contacting Ordinora Business Services Sdn Bhd.\n\nWe have successfully received your enquiry.\n\nOur team will review your request and respond as soon as possible.\n\nWe appreciate the opportunity to assist you.\n\nSubmitted Details:\nName: ${fullName}\nCompany: ${companyName || "N/A"}\nEmail: ${email}\nService Requested: ${service}\nMessage: ${message}\nDate & Time: ${date} ${time}\n\nEmail: info@ordinorabs.com\nWebsite: https://ordinorabs.com\n\nThank you for choosing Ordinora.\n\nIntegrity • Professionalism • Business Excellence\n\n© Ordinora Business Services Sdn Bhd`,
      html: `<!DOCTYPE html>
<html lang="en">
  <body style="margin: 0; padding: 32px 20px; background-color: #F6F5EF; font-family: Arial, Helvetica, sans-serif; color: #13251B;">
    <div style="max-width: 600px; margin: 0 auto;">
      <div style="background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 12px 32px rgba(14, 44, 33, 0.08); border: 1px solid rgba(14, 44, 33, 0.08);">
        <div style="background: linear-gradient(135deg, #0E2C21 0%, #163D2D 100%); padding: 36px 32px 28px; text-align: center;">
          <div style="font-size: 12px; letter-spacing: 2px; color: #BE7A3D; font-weight: 700; margin-bottom: 12px;">ORDINORA</div>
          <h1 style="margin: 0; color: #FFFFFF; font-size: 30px; line-height: 1.2; letter-spacing: 0.5px; font-weight: 700;">ORDINORA BUSINESS SERVICES SDN BHD</h1>
          <p style="margin: 12px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Professional Business Solutions</p>
        </div>

        <div style="padding: 32px;">
          <p style="margin: 0 0 18px; font-size: 18px; color: #13251B; line-height: 1.6;">Dear ${fullName},</p>

          <p style="margin: 0 0 18px; font-size: 16px; color: #13251B; line-height: 1.8;">
            Thank you for contacting Ordinora Business Services Sdn Bhd.
          </p>

          <p style="margin: 0 0 18px; font-size: 16px; color: #13251B; line-height: 1.8;">
            We have successfully received your enquiry.
          </p>

          <p style="margin: 0 0 18px; font-size: 16px; color: #13251B; line-height: 1.8;">
            Our team will review your request and respond as soon as possible.
          </p>

          <p style="margin: 0 0 24px; font-size: 16px; color: #13251B; line-height: 1.8;">
            We appreciate the opportunity to assist you.
          </p>

          <div style="background-color: #F6F5EF; border: 1px solid rgba(19, 37, 27, 0.12); border-radius: 16px; padding: 20px; margin: 0 0 24px; box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);">
            <h2 style="margin: 0 0 18px; font-size: 20px; color: #0E2C21; font-weight: 700;">Submitted Details</h2>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse; font-size: 14px; color: #13251B;">
              <tr>
                <td style="padding: 10px 0; font-weight: 700; width: 40%; color: #0E2C21;">Name</td>
                <td style="padding: 10px 0; color: #13251B;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: 700; color: #0E2C21;">Company</td>
                <td style="padding: 10px 0; color: #13251B;">${companyName || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: 700; color: #0E2C21;">Email</td>
                <td style="padding: 10px 0; color: #13251B;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: 700; color: #0E2C21;">Service Requested</td>
                <td style="padding: 10px 0; color: #13251B;">${service}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: 700; color: #0E2C21; vertical-align: top;">Message</td>
                <td style="padding: 10px 0; color: #13251B; line-height: 1.6;">${message.replace(/\n/g, "<br />")}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: 700; color: #0E2C21;">Date &amp; Time</td>
                <td style="padding: 10px 0; color: #13251B;">${date} ${time}</td>
              </tr>
            </table>
          </div>

          <div style="border-top: 2px solid rgba(190, 122, 61, 0.25); padding-top: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; font-size: 16px; color: #13251B; line-height: 1.7;">
              <strong style="color: #0E2C21;">Email:</strong> info@ordinorabs.com<br>
              <strong style="color: #0E2C21;">Website:</strong> https://ordinorabs.com
            </p>
          </div>
        </div>

        <div style="padding: 0 32px 30px; text-align: center; background-color: #FFFFFF;">
          <p style="margin: 0; color: #0E2C21; font-size: 15px; font-weight: 700;">Thank you for choosing Ordinora.</p>
          <p style="margin: 12px 0 0; color: #BE7A3D; font-size: 13px; font-weight: 700; letter-spacing: 0.5px;">Integrity • Professionalism • Business Excellence</p>
          <p style="margin: 18px 0 0; color: #13251B; font-size: 12px;">© Ordinora Business Services Sdn Bhd</p>
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
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
    position = "",
    country = "",
    email,
    phone = "",
    investorType = "",
    investmentCapacity = "",
    areaOfInterest = "",
    preferredContactMethod = "",
    opportunityReference = "",
    opportunityTitle = "",
    informationConfirmation = "",
    contactConsent = "",
    submissionDate = "",
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

  if (service === "Investor & Business Partner Facilitation" && (!country || !phone || !investorType || contactConsent !== "Agreed")) {
    return Response.json({ message: "Please complete all required Expression of Interest fields and consent." }, { status: 400 });
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
    subject: opportunityReference ? `Expression of Interest: ${opportunityReference}` : "New Enquiry from Ordinora Website",
    html: `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0; padding:32px 16px; background-color:#F6F5EF; font-family:Arial, Helvetica, sans-serif; color:#13251B;">
    <div style="max-width:600px; margin:0 auto;">
      <div style="background-color:#FFFFFF; border-radius:20px; overflow:hidden; box-shadow:0 14px 32px rgba(14,44,33,0.08); border:1px solid rgba(14,44,33,0.08);">
        <div style="background:linear-gradient(135deg, #0E2C21 0%, #163D2D 100%); padding:28px 24px 24px; text-align:center;">
          <img
            src="https://ordinorabs.com/assets/images/logo.png"
            alt="Ordinora Business Services Sdn Bhd"
            width="180"
            style="display:block; margin:0 auto 20px; max-width:180px; height:auto;"
          >
          <div style="font-size:12px; letter-spacing:2px; color:#BE7A3D; font-weight:700; margin-bottom:10px;">ORDINORA</div>
          <h1 style="margin:0; color:#FFFFFF; font-size:28px; line-height:1.2; font-weight:700; letter-spacing:0.5px; text-align:center;">NEW WEBSITE ENQUIRY RECEIVED</h1>
        </div>

        <div style="padding:28px 24px 20px;">
          <p style="margin:0 0 20px; font-size:14px; line-height:1.7; color:#13251B; font-weight:700;">A new enquiry has been submitted through the website.</p>

          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse; background-color:#FFFFFF; border:1px solid rgba(14,44,33,0.08); border-radius:12px; overflow:hidden; font-size:14px; color:#13251B; margin:0 0 24px;">
            <tr>
              <td style="padding:12px 14px; border-bottom:1px solid rgba(14,44,33,0.08); font-weight:700; width:40%; color:#0E2C21;">Full Name</td>
              <td style="padding:12px 14px; border-bottom:1px solid rgba(14,44,33,0.08);">${fullName}</td>
            </tr>
            <tr>
              <td style="padding:12px 14px; border-bottom:1px solid rgba(14,44,33,0.08); font-weight:700; color:#0E2C21;">Company Name</td>
              <td style="padding:12px 14px; border-bottom:1px solid rgba(14,44,33,0.08);">${companyName || "N/A"}</td>
            </tr>
            <tr>
              <td style="padding:12px 14px; border-bottom:1px solid rgba(14,44,33,0.08); font-weight:700; color:#0E2C21;">Email Address</td>
              <td style="padding:12px 14px; border-bottom:1px solid rgba(14,44,33,0.08);">${email}</td>
            </tr>
            <tr>
              <td style="padding:12px 14px; border-bottom:1px solid rgba(14,44,33,0.08); font-weight:700; color:#0E2C21;">Service Requested</td>
              <td style="padding:12px 14px; border-bottom:1px solid rgba(14,44,33,0.08);">${service}</td>
            </tr>
            <tr>
              <td style="padding:12px 14px; border-bottom:1px solid rgba(14,44,33,0.08); font-weight:700; color:#0E2C21;">Date</td>
              <td style="padding:12px 14px; border-bottom:1px solid rgba(14,44,33,0.08);">${date}</td>
            </tr>
            <tr>
              <td style="padding:12px 14px; font-weight:700; color:#0E2C21;">Time</td>
              <td style="padding:12px 14px;">${time}</td>
            </tr>
          </table>

          <div style="background-color:#F6F5EF; border:1px solid rgba(14,44,33,0.08); border-radius:12px; padding:18px; margin:0 0 24px;">
            <p style="margin:0 0 10px; font-size:14px; line-height:1.6; color:#0E2C21; font-weight:700;">Customer Message</p>
            <div style="font-size:14px; line-height:1.8; color:#13251B; white-space:pre-wrap;">${message}</div>
          </div>

          <div style="text-align:center; margin:0 0 22px;">
            <a href="mailto:${email}" style="display:inline-block; background-color:#BE7A3D; color:#FFFFFF; text-decoration:none; font-weight:700; font-size:14px; padding:12px 22px; border-radius:999px;">Reply to Customer</a>
          </div>
        </div>

        <div style="padding:0 24px 30px; text-align:center; background-color:#FFFFFF;">
          <p style="margin:0; color:#BE7A3D; font-size:13px; font-weight:700; letter-spacing:0.5px;">Organized • Integrated • Accountable</p>
          <p style="margin:18px 0 8px; color:#13251B; font-size:12px; line-height:1.6;">
            Ordinora Business Services Sdn Bhd<br>
            https://ordinorabs.com<br>
            info@ordinorabs.com<br>
            +673 819 9924
          </p>
        </div>
      </div>
    </div>
  </body>
</html>`,
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

Opportunity Reference:
${opportunityReference || "N/A"}

Opportunity Title:
${opportunityTitle || "N/A"}

Position:
${position || "N/A"}

Country:
${country || "N/A"}

Phone:
${phone || "N/A"}

Investor / Partner Type:
${investorType || "N/A"}

Investment Capacity:
${investmentCapacity || "N/A"}

Area of Interest:
${areaOfInterest || "N/A"}

Preferred Contact Method:
${preferredContactMethod || "N/A"}

Information Confirmation: ${informationConfirmation || "N/A"}
Contact Consent: ${contactConsent || "N/A"}

Submission Date:
${submissionDate || `${date} ${time}`}

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

          <div style="text-align:center; margin:0 0 22px; padding-top:18px; border-top:2px solid rgba(190,122,61,0.25);">
            <p style="margin:0 0 16px; font-size:15px; font-weight:700; color:#0E2C21;">Connect With Us</p>
            <div style="display:inline-flex; flex-wrap:wrap; justify-content:center; gap:12px;">
              <a href="https://www.facebook.com/profile.php?id=61592071780994" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; justify-content:center; gap:8px; background-color:#0E2C21; color:#FFFFFF; text-decoration:none; font-size:14px; font-weight:700; padding:12px 18px; border-radius:999px; min-width:132px;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="display:block;"><path d="M13.5 22v-8h2.7l.4-3h-3.1V7.3c0-.9.3-1.5 1.7-1.5h1.8V2.9c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.7-4.5 4.7V11H7v3h2.8v8h3.7Z"/></svg>
                Facebook
              </a>
              <a href="https://www.instagram.com/ordinorabusiness/?__pwa=1" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; justify-content:center; gap:8px; background-color:#0E2C21; color:#FFFFFF; text-decoration:none; font-size:14px; font-weight:700; padding:12px 18px; border-radius:999px; min-width:132px;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="display:block;"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.3A5.7 5.7 0 1 1 6.3 13 5.7 5.7 0 0 1 12 7.3Zm0 2A3.7 3.7 0 1 0 15.7 13 3.7 3.7 0 0 0 12 9.3Zm5.3-3.1a1.3 1.3 0 1 1-1.3 1.3 1.3 1.3 0 0 1 1.3-1.3Z"/></svg>
                Instagram
              </a>
              <a href="https://www.linkedin.com/company/143034542/admin/dashboard/" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; justify-content:center; gap:8px; background-color:#0E2C21; color:#FFFFFF; text-decoration:none; font-size:14px; font-weight:700; padding:12px 18px; border-radius:999px; min-width:132px;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="display:block;"><path d="M6.94 8.36A1.39 1.39 0 1 1 6.94 5.58a1.39 1.39 0 0 1 0 2.78ZM5.37 9.94h3.14v8.51H5.37zm5.05 0h3.01v1.16h.04c.42-.79 1.45-1.63 2.99-1.63 3.2 0 3.79 2.1 3.79 4.84v4.14h-3.14v-3.88c0-1.05-.02-2.4-1.46-2.4-1.47 0-1.7 1.14-1.7 2.32v3.96h-3.14V9.94Z"/></svg>
                LinkedIn
              </a>
            </div>
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
          <p style="margin:12px 0 0; color:#BE7A3D; font-size:13px; font-weight:700; letter-spacing:0.5px;">Organized • Integrated • Accountable</p>
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
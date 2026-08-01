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
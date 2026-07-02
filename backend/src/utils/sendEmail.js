const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

const sendEmail = async (options) => {
  // We reload .env on every email send using override: true.
  // This guarantees that if the user updates their App Password in .env,
  // the email starts working instantly WITHOUT needing to restart the Node.js server!
  dotenv.config({ override: true });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `Dayal Food Orders <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: " + info.messageId);
    return { success: true, info };
  } catch (error) {
    console.error("Error sending email: ", error);
    return { success: false, error };
  }
};

module.exports = sendEmail;

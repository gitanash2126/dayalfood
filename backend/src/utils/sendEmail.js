const nodemailer = require("nodemailer");

// Create a reusable transporter outside the function
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: true, // Use pooled connections for faster subsequent emails
  maxConnections: 1,
  maxMessages: 100,
});

const sendEmail = async (options) => {
  // Define email options
  const mailOptions = {
    from: `Dayal Food Orders <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  // Send the email
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

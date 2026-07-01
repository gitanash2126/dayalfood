require('dotenv').config();
const sendEmail = require('./src/utils/sendEmail');

async function testEmail() {
  console.log("Testing email with user:", process.env.EMAIL_USER);
  const result = await sendEmail({
    to: process.env.EMAIL_USER,
    subject: "Test Email from Dayal Food",
    html: "<h1>This is a test email</h1><p>If you receive this, the email configuration is working perfectly.</p>"
  });

  if (result.success) {
    console.log("SUCCESS: Email sent perfectly!");
  } else {
    console.error("FAILED to send email:", result.error.message || result.error);
  }
}

testEmail();

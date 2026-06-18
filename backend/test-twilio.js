require("dotenv").config();
const twilio = require("twilio");

console.log("Account SID:", process.env.TWILIO_ACCOUNT_SID);
console.log("From:", process.env.TWILIO_WHATSAPP_NUMBER);
console.log("To:", process.env.OWNER_WHATSAPP_NUMBER);

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

client.messages.create({
  from: process.env.TWILIO_WHATSAPP_NUMBER,
  to: process.env.OWNER_WHATSAPP_NUMBER,
  body: "Test message from backend"
})
.then(msg => console.log("Success! Message SID:", msg.sid))
.catch(err => {
  console.error("Failed to send message!");
  console.error(err.message);
});

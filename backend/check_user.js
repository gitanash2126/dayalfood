require('dotenv').config();
const mongoose = require('mongoose');

async function checkUser() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const db = mongoose.connection.db;

  const user1 = await db.collection('users').findOne({ phone: "8574125403" });
  const user2 = await db.collection('users').findOne({ phone: "7991253359" });

  console.log("User 1:", user1);
  console.log("User 2:", user2);

  if (user1) {
    const addr1 = await db.collection('addresses').find({ user: user1._id }).toArray();
    console.log("Addresses for User 1:", addr1);
  }

  if (user2) {
    const addr2 = await db.collection('addresses').find({ user: user2._id }).toArray();
    console.log("Addresses for User 2:", addr2);
  }

  mongoose.connection.close();
}

checkUser().catch(console.error);

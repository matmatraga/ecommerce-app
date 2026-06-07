require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Users = require("../models/Users");

async function seed() {
  const uri = process.env.MONGODB_STRING;
  if (!uri) {
    console.error("MONGODB_STRING is required in server/.env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@aster.dev";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin1234!";

  let admin = await Users.findOne({ email: adminEmail });
  if (!admin) {
    admin = new Users({
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 10),
      isAdmin: true,
    });
    await admin.save();
    console.log(`Admin created: ${adminEmail}`);
  } else {
    console.log(`Admin exists: ${adminEmail}`);
  }

  console.log("\nSeed complete. Admin login:", adminEmail);
  console.log("Add products via Admin Dashboard or POST /products when authenticated as admin.");
  console.log("Set SEED_ADMIN_PASSWORD in .env to customize the password.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

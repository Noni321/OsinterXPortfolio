
import { storage } from "./server/storage";
import bcrypt from "bcryptjs";

async function createAdmin() {
  try {
    const username = "admin";
    const password = "admin123"; // Change this to your desired password

    const existingUser = await storage.getUserByUsername(username);
    if (existingUser) {
      console.log("Admin user already exists!");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await storage.insertUser({ username, password: hashedPassword });

    console.log("✅ Admin user created successfully!");
    console.log("Username:", username);
    console.log("Password:", password);
    console.log("User ID:", user.id);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  }
  process.exit(0);
}

createAdmin();

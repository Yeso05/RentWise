const { Pool } = require("pg");
const fs = require("fs");
require("dotenv").config();

// First, connect to default postgres DB to create our database
const adminPool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: "postgres", // Connect to default postgres DB
  password: process.env.DB_PASSWORD || "root",
  port: process.env.DB_PORT || 5432,
});

// Then connect to our app database
const appPool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "rentwise_db",
  password: process.env.DB_PASSWORD || "root",
  port: process.env.DB_PORT || 5432,
});

async function initializeDatabase() {
  try {
    console.log("🔧 Initializing RentWise Database...\n");

    // Step 1: Create the database if it doesn't exist
    console.log("📦 Creating database...");
    try {
      await adminPool.query(
        `CREATE DATABASE "${process.env.DB_NAME || "rentwise_db"}";`
      );
      console.log(`✅ Database "${process.env.DB_NAME || "rentwise_db"}" created.\n`);
    } catch (err) {
      if (err.message.includes("already exists")) {
        console.log(
          `✅ Database "${process.env.DB_NAME || "rentwise_db"}" already exists.\n`
        );
      } else {
        throw err;
      }
    }

    // Step 2: Connect to our database and create tables
    console.log("📋 Creating tables...");
    const schemaPath = "./db/schema.sql";
    const schema = fs.readFileSync(schemaPath, "utf8");

    // Split by semicolon and execute each statement
    const statements = schema
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    for (const statement of statements) {
      await appPool.query(statement);
    }

    console.log("✅ All tables created successfully.\n");

    // Step 3: Insert sample users for testing
    console.log("👤 Inserting sample users...");
    const bcrypt = require("bcrypt");

    const landlordPassword = await bcrypt.hash("password123", 10);
    const tenantPassword = await bcrypt.hash("password123", 10);

    try {
      await appPool.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES 
         ($1, $2, $3, $4),
         ($5, $6, $7, $8)
         ON CONFLICT (email) DO NOTHING`,
        [
          "Aarthi",
          "aarthi@gmail.com",
          landlordPassword,
          "Landlord",
          "Rahul",
          "rahul@gmail.com",
          tenantPassword,
          "Tenant",
        ]
      );
      console.log("✅ Sample users inserted.\n");
    } catch (err) {
      if (err.message.includes("already exists")) {
        console.log("✅ Sample users already exist.\n");
      } else {
        throw err;
      }
    }

    console.log("🎉 Database initialization complete!\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await adminPool.end();
    await appPool.end();
  }
}

initializeDatabase();

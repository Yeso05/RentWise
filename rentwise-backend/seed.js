const pool = require('./db');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    console.log("Seeding started...");

    const passwordHash = await bcrypt.hash("123456", 10);

    // 1️⃣ Insert Users
    await pool.query(
      `INSERT INTO users (full_name, email, password, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      ['Aarthi', 'aarthi@gmail.com', passwordHash, 'landlord']
    );

    await pool.query(
      `INSERT INTO users (full_name, email, password, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      ['Rahul', 'rahul@gmail.com', passwordHash, 'tenant']
    );

    // 2️⃣ Insert Property (avoid duplicate)
    let propertyId;

    const existingProperty = await pool.query(
      `SELECT id FROM properties 
       WHERE title = $1 AND landlord_email = $2`,
      ['Tech Hub Studio 11', 'aarthi@gmail.com']
    );

    if (existingProperty.rows.length > 0) {
      propertyId = existingProperty.rows[0].id;
    } else {
      const newProperty = await pool.query(
        `INSERT INTO properties (title, location, rent, status, landlord_email)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        ['Tech Hub Studio 11', 'Chennai', 15000, 'occupied', 'aarthi@gmail.com']
      );
      propertyId = newProperty.rows[0].id;
    }

    // 3️⃣ Insert Tenant (link to property)
    await pool.query(
      `INSERT INTO tenants (full_name, email, password, property_id)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      ['Rahul', 'rahul@gmail.com', passwordHash, propertyId]
    );

    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error.message);
  } finally {
    await pool.end(); // close DB connection properly
    process.exit();
  }
}

seed();
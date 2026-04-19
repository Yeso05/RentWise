const pool = require('./db');
const fs = require('fs');
const path = require('path');

async function migrate() {
    try {
        console.log("Checking database connection...");
        await pool.query('SELECT NOW()');
        console.log("Connected to PostgreSQL.");

        console.log("Recreating properties table...");
        const sql = `
            DROP TABLE IF EXISTS properties CASCADE;
            CREATE TABLE properties (
                id SERIAL PRIMARY KEY,
                title VARCHAR(100) NOT NULL,
                location VARCHAR(100) NOT NULL,
                rent INTEGER NOT NULL,
                status VARCHAR(20) DEFAULT 'vacant' CHECK (status IN ('occupied', 'vacant', 'maintenance')),
                landlord_email VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await pool.query(sql);
        console.log("Properties table ready.");

        // Insert sample data if empty
        const countRes = await pool.query('SELECT COUNT(*) FROM properties');
        if (parseInt(countRes.rows[0].count) === 0) {
            console.log("Inserting sample data...");
            await pool.query(`
                INSERT INTO properties (title, location, rent, status, landlord_email)
                VALUES 
                ('Sea View Apartment 4B', 'Marine Drive, Mumbai', 85000, 'occupied', 'aarthi@gmail.com'),
                ('Tech Hub Studio 11', 'Hitech City, Hyderabad', 25000, 'vacant', 'aarthi@gmail.com')
            `);
            console.log("Sample data inserted.");
        }

        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrate();

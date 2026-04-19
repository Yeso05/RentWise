const pool = require('./db');
const bcrypt = require('bcrypt');

async function migrate() {
    try {
        console.log("Recreating tenants table...");
        await pool.query('DROP TABLE IF EXISTS tenants CASCADE');
        
        await pool.query(`
            CREATE TABLE tenants (
                id SERIAL PRIMARY KEY,
                full_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                property_id INT REFERENCES properties(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Tenants table created.");

        // Insert sample tenant
        const hashedPassword = await bcrypt.hash('123456', 10);
        await pool.query(`
            INSERT INTO tenants (full_name, email, password, property_id)
            VALUES ($1, $2, $3, $4)
        `, ['Rahul', 'rahul@gmail.com', hashedPassword, 2]);
        
        console.log("Sample tenant 'Rahul' (rahul@gmail.com / 123456) linked to Tech Hub Studio 11.");
        
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrate();

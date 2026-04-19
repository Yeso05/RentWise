const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

// ADD TENANT (Landlord action)
router.post('/', async (req, res) => {
    try {
        const { full_name, email, password, property_id } = req.body;
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await pool.query(
            'INSERT INTO tenants (full_name, email, password, property_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [full_name, email, hashedPassword, property_id]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET TENANT PROPERTY
router.get('/:email', async (req, res) => {
    try {
        const { email } = req.params;
        
        // Find tenant and their property
        const result = await pool.query(`
            SELECT 
                t.id as tenant_id, t.full_name, t.email, t.created_at,
                p.id as prop_id, p.title, p.location, p.rent, p.status as prop_status
            FROM tenants t
            LEFT JOIN properties p ON t.property_id = p.id
            WHERE t.email = $1
        `, [email]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        const data = result.rows[0];
        
        res.json({
            tenant: {
                id: data.tenant_id,
                full_name: data.full_name,
                email: data.email,
                created_at: data.created_at
            },
            property: data.prop_id ? {
                id: data.prop_id,
                title: data.title,
                location: data.location,
                rent: data.rent,
                status: data.prop_status
            } : null
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

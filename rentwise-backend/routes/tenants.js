const express = require('express');
const router = express.Router();
const tenantsController = require('../controllers/tenants');

// GET all tenants
router.get('/', tenantsController.getAll);

// POST new tenant
router.post('/', tenantsController.create);

// GET tenant property
router.get('/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const pool = require('../db');
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

// PUT update tenant
router.put('/:id', tenantsController.update);

// DELETE tenant
router.delete('/:id', tenantsController.remove);

module.exports = router;

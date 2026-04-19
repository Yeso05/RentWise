const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET properties for logged-in landlord
router.get('/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const result = await pool.query('SELECT * FROM properties WHERE landlord_email = $1 ORDER BY created_at DESC', [email]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ADD property
router.post('/', async (req, res) => {
    try {
        const { title, location, rent, status, landlord_email } = req.body;
        const result = await pool.query(
            'INSERT INTO properties (title, location, rent, status, landlord_email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, location, rent, status, landlord_email]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

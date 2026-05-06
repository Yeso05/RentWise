const express = require('express');
const router = express.Router();
const propertiesController = require('../controllers/properties');

// GET all properties (with optional email filter)
router.get('/', propertiesController.getAll);

// POST new property
router.post('/', propertiesController.create);

// GET property by email (landlord's properties)
router.get('/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const pool = require('../db');
        const result = await pool.query(
            'SELECT * FROM properties WHERE landlord_email = $1 ORDER BY created_at DESC',
            [email]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update property
router.put('/:id', propertiesController.update);

// DELETE property
router.delete('/:id', propertiesController.remove);

module.exports = router;

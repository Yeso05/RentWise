const express = require('express');
const router = express.Router();
const leasesController = require('../controllers/leases');

// Placeholder CRUD Routes
router.get('/', leasesController.getAll);
router.post('/', leasesController.create);
router.get('/:id', leasesController.getOne);
router.put('/:id', leasesController.update);
router.delete('/:id', leasesController.remove);

module.exports = router;

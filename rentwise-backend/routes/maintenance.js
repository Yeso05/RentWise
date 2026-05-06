const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenance');

router.get('/', maintenanceController.getAll);
router.post('/', maintenanceController.create);
router.get('/:id', maintenanceController.getOne);
router.put('/:id', maintenanceController.update);
router.delete('/:id', maintenanceController.remove);

module.exports = router;

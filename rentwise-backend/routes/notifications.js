const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notifications');

// Placeholder CRUD Routes
router.get('/', notificationsController.getAll);
router.post('/', notificationsController.create);
router.get('/:id', notificationsController.getOne);
router.put('/:id', notificationsController.update);
router.delete('/:id', notificationsController.remove);

module.exports = router;

const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/payments');

router.get('/', paymentsController.getAll);
router.post('/', paymentsController.create);
router.get('/:id', paymentsController.getOne);
router.put('/:id', paymentsController.update);
router.delete('/:id', paymentsController.remove);

module.exports = router;

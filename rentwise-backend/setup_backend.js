const fs = require('fs');
const path = require('path');

const resources = ['properties', 'tenants', 'payments', 'maintenance', 'leases', 'notifications', 'auth'];

fs.mkdirSync(path.join(__dirname, 'routes'), { recursive: true });
fs.mkdirSync(path.join(__dirname, 'controllers'), { recursive: true });

resources.forEach(res => {
  // Routes
  const routeContent = `const express = require('express');
const router = express.Router();
const ${res}Controller = require('../controllers/${res}');

// Placeholder CRUD Routes
router.get('/', ${res}Controller.getAll);
router.post('/', ${res}Controller.create);
router.get('/:id', ${res}Controller.getOne);
router.put('/:id', ${res}Controller.update);
router.delete('/:id', ${res}Controller.remove);

module.exports = router;
`;
  fs.writeFileSync(path.join(__dirname, 'routes', `${res}.js`), routeContent);

  // Controllers
  const controllerContent = `const db = require('../db');

exports.getAll = async (req, res) => {
  try {
    // const result = await db.query('SELECT * FROM ${res}');
    // res.json(result.rows);
    res.json({ message: 'Fetch all ${res}' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    res.status(201).json({ message: 'Create new ${res}', data: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    res.json({ message: \`Fetch ${res} with id \${req.params.id}\` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    res.json({ message: \`Update ${res} with id \${req.params.id}\`, data: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    res.json({ message: \`Delete ${res} with id \${req.params.id}\` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
`;
  fs.writeFileSync(path.join(__dirname, 'controllers', `${res}.js`), controllerContent);
});

console.log('Routes and controllers setup complete.');

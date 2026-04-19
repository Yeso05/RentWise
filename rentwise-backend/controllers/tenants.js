const db = require('../db');

exports.getAll = async (req, res) => {
  try {
    // const result = await db.query('SELECT * FROM tenants');
    // res.json(result.rows);
    res.json({ message: 'Fetch all tenants' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    res.status(201).json({ message: 'Create new tenants', data: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    res.json({ message: `Fetch tenants with id ${req.params.id}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    res.json({ message: `Update tenants with id ${req.params.id}`, data: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    res.json({ message: `Delete tenants with id ${req.params.id}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

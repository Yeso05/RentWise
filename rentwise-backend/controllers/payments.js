const db = require('../db');

exports.getAll = async (req, res) => {
  try {
    // const result = await db.query('SELECT * FROM payments');
    // res.json(result.rows);
    res.json({ message: 'Fetch all payments' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    res.status(201).json({ message: 'Create new payments', data: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    res.json({ message: `Fetch payments with id ${req.params.id}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    res.json({ message: `Update payments with id ${req.params.id}`, data: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    res.json({ message: `Delete payments with id ${req.params.id}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const db = require('../db');

exports.getAll = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tenants ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { full_name, email, password, property_id } = req.body;
    if (!full_name || !email || !password || !property_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO tenants (full_name, email, password, property_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, email, property_id, created_at`,
      [full_name, email, hashedPassword, property_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM tenants WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, property_id } = req.body;
    const result = await db.query(
      `UPDATE tenants SET full_name = COALESCE($1, full_name), email = COALESCE($2, email), property_id = COALESCE($3, property_id) WHERE id = $4 RETURNING *`,
      [full_name, email, property_id, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM tenants WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.json({ message: 'Tenant deleted successfully', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
